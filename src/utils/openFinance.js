// ─────────────────────────────────────────────────────────────────────────────
//  Sincronização Open Finance (Pluggy) → Firestore.
//
//  Cada banco conectado é um "item" do Pluggy. Um item traz uma ou mais
//  contas (corrente, poupança, cartão), e cada conta traz suas transações.
//
//  Mapeamento para o modelo que o resto do app já usa:
//    conta Pluggy      → accounts/of_<accountId>      (origem: 'openfinance')
//    transação Pluggy  → transactions/of_<txId>       (origem: 'openfinance',
//                                                     identificador_externo)
//
//  Ids determinísticos: sincronizar de novo nunca duplica nada.
//
//  Saldo: o saldo da conta vem do banco e é sobrescrito a cada sincronização.
//  As transações importadas NÃO mexem no saldo (ele já as inclui).
//
//  Transações já importadas não são reescritas: se a pessoa trocou a
//  categoria de um gasto, a próxima sincronização preserva a escolha
//  (só o tipo entrada/saída e o "Outros" automático são corrigidos).
// ─────────────────────────────────────────────────────────────────────────────

import {
  collection, doc, getDocs, query, where, writeBatch,
} from 'firebase/firestore';
import { db } from '../services/firebase';
import {
  categoriaApp, dataLocal, saldoConta, tipoConta, tipoTransacao,
} from './openFinanceMapeamento';
import {
  aguardarItemPronto, excluirItem, listarContas, listarTransacoes,
} from '../services/pluggy';

export const ORIGEM_OPEN_FINANCE = 'openfinance';

// Janela de histórico trazida a cada sincronização.
const DIAS_HISTORICO = 90;

// Limite de operações por lote do Firestore.
const LOTE_MAX = 450;

const idConta = (pluggyAccountId) => `of_${pluggyAccountId}`;
const idTransacao = (pluggyTxId) => `of_${pluggyTxId}`;

function diasAtras(dias) {
  const d = new Date();
  d.setDate(d.getDate() - dias);
  return dataLocal(d.toISOString());
}

async function gravarEmLotes(operacoes) {
  for (let i = 0; i < operacoes.length; i += LOTE_MAX) {
    const lote = writeBatch(db);
    operacoes.slice(i, i + LOTE_MAX).forEach((op) => op(lote));
    await lote.commit();
  }
}

/**
 * Traz contas e transações de um banco conectado para o Firestore.
 * Devolve { contas, novas } para o retorno visual.
 */
export async function sincronizarItem(uid, itemId) {
  const item = await aguardarItemPronto(itemId);
  if (item.status === 'LOGIN_ERROR' || item.status === 'OUTDATED') {
    throw new Error(item.error?.message || `O banco respondeu com status ${item.status}. Reconecte a conta.`);
  }

  const contasPluggy = await listarContas(itemId);

  // O que já existe no Firestore: contas (para não sobrescrever criadoEm) e
  // transações importadas (para não duplicar nem desfazer edições).
  const [contasSnap, txSnap] = await Promise.all([
    getDocs(query(collection(db, 'accounts'), where('uid', '==', uid), where('origem', '==', ORIGEM_OPEN_FINANCE))),
    getDocs(query(collection(db, 'transactions'), where('uid', '==', uid), where('origem', '==', ORIGEM_OPEN_FINANCE))),
  ]);
  const contasExistentes = new Set(contasSnap.docs.map((d) => d.id));
  const txExistentes = new Map(txSnap.docs.map((d) => [d.id, d.data()]));

  const agora = new Date();
  const desde = diasAtras(DIAS_HISTORICO);
  const operacoes = [];
  let novas = 0;

  for (const conta of contasPluggy) {
    const contaRef = doc(db, 'accounts', idConta(conta.id));
    const dadosConta = {
      uid,
      nome: conta.marketingName || conta.name || 'Conta',
      banco: item.connector?.name || '',
      tipo: tipoConta(conta),
      saldo: saldoConta(conta),
      numero: conta.number || '',
      origem: ORIGEM_OPEN_FINANCE,
      pluggyItemId: itemId,
      pluggyAccountId: conta.id,
      bancoLogo: item.connector?.imageUrl || '',
      bancoCor: item.connector?.primaryColor ? `#${item.connector.primaryColor}` : '',
      sincronizadoEm: agora,
    };
    if (!contasExistentes.has(contaRef.id)) dadosConta.criadoEm = agora;
    operacoes.push((lote) => lote.set(contaRef, dadosConta, { merge: true }));

    const transacoes = await listarTransacoes(conta.id, { dateFrom: desde });
    for (const tx of transacoes) {
      // Pendentes podem mudar de id quando o banco as confirma.
      if (tx.status === 'PENDING') continue;
      const txRef = doc(db, 'transactions', idTransacao(tx.id));
      const tipo = tipoTransacao(tx);
      const categoria = categoriaApp(tx, tipo);

      const existente = txExistentes.get(txRef.id);
      if (existente) {
        // Já importada. O tipo vem do banco e é sempre corrigido; a
        // categoria só é trocada se continua no "Outros" automático —
        // uma escolha feita pela pessoa é preservada.
        const correcao = {};
        if (existente.tipo !== tipo) correcao.tipo = tipo;
        if (existente.categoria === 'Outros' && categoria !== 'Outros') correcao.categoria = categoria;
        if (existente.tipo !== tipo && !correcao.categoria) correcao.categoria = categoria;
        if (Object.keys(correcao).length) operacoes.push((lote) => lote.update(txRef, correcao));
        continue;
      }

      operacoes.push((lote) => lote.set(txRef, {
        uid,
        descricao: tx.description || tx.descriptionRaw || 'Lançamento',
        valor: Math.abs(Number(tx.amount) || 0),
        tipo,
        categoria,
        categoriaBanco: tx.category || '',
        conta_id: contaRef.id,
        data: dataLocal(tx.date),
        origem: ORIGEM_OPEN_FINANCE,
        identificador_externo: tx.id,
        criadoEm: agora,
      }));
      novas++;
    }
  }

  await gravarEmLotes(operacoes);
  return { contas: contasPluggy.length, novas };
}

/**
 * Desconecta um banco: revoga no Pluggy e apaga do Firestore as contas e as
 * transações importadas dele.
 */
export async function desconectarItem(uid, itemId) {
  try {
    await excluirItem(itemId);
  } catch (erro) {
    // Item que já não existe no Pluggy (ex.: sandbox expirado) não impede
    // a limpeza local.
    if (erro.status !== 404) throw erro;
  }

  const contasSnap = await getDocs(query(
    collection(db, 'accounts'),
    where('uid', '==', uid),
    where('pluggyItemId', '==', itemId),
  ));
  const idsContas = new Set(contasSnap.docs.map((d) => d.id));

  const txSnap = await getDocs(query(
    collection(db, 'transactions'),
    where('uid', '==', uid),
    where('origem', '==', ORIGEM_OPEN_FINANCE),
  ));

  const operacoes = [
    ...txSnap.docs.filter((d) => idsContas.has(d.data().conta_id)).map((d) => (lote) => lote.delete(d.ref)),
    ...contasSnap.docs.map((d) => (lote) => lote.delete(d.ref)),
  ];
  await gravarEmLotes(operacoes);
}
