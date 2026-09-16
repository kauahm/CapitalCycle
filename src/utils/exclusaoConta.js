// Remoção dos dados do usuário — Fase 5B.
//
// Esta rotina roda no cliente, com as permissões do próprio usuário, então ela
// só consegue apagar aquilo que as regras do Firestore já permitiam a ele.
// Não há transação atômica atravessando coleções diferentes: se uma etapa
// falhar, as seguintes não acontecem e o que já saiu continua fora. Por isso
// cada etapa é idempotente — uma segunda tentativa apaga o que restou sem
// quebrar por causa do que já sumiu.
//
// `pagamentos` NÃO entra aqui: são o registro técnico da operação de pagamento
// simulada, e as regras do Firestore inclusive negam `delete` nessa coleção.

import {
  collection, doc, deleteDoc, getDocs, query, where, writeBatch,
} from 'firebase/firestore';
import { db } from '../services/firebase';

// Um commit de batch aceita até 500 operações. 400 deixa folga e evita a
// ida e volta de um delete por documento quando há muita coisa.
const TAMANHO_LOTE = 400;

/**
 * Ligações com o Firestore em um objeto só. Existe para que a ordem das
 * etapas possa ser verificada em teste sem tocar em um banco real — o código
 * de produção sempre usa o padrão.
 */
export const firestorePadrao = {
  db, collection, doc, deleteDoc, getDocs, query, where, writeBatch,
};

/** Marca a etapa no erro, para o chamador saber onde parou sem adivinhar. */
function comEtapa(erro, etapa) {
  const e = erro instanceof Error ? erro : new Error(String(erro));
  e.etapa = etapa;
  return e;
}

/** Apaga as referências recebidas em lotes. Zero referências: não faz nada. */
async function apagarRefs(fs, refs) {
  for (let i = 0; i < refs.length; i += TAMANHO_LOTE) {
    const lote = fs.writeBatch(fs.db);
    refs.slice(i, i + TAMANHO_LOTE).forEach((ref) => lote.delete(ref));
    await lote.commit();
  }
}

/** Documentos de uma coleção de topo que têm o uid do dono. */
async function refsDoUsuario(fs, nomeColecao, uid) {
  const snap = await fs.getDocs(
    fs.query(fs.collection(fs.db, nomeColecao), fs.where('uid', '==', uid)),
  );
  return snap.docs.map((d) => d.ref);
}

/**
 * Apaga tudo o que pertence ao usuário, na ordem em que é seguro apagar.
 *
 * Aportes vêm antes dos ciclos porque apagar o documento do ciclo não apaga a
 * subcoleção: o ciclo sumiria e os aportes ficariam órfãos, sem nenhum caminho
 * na interface para alcançá-los depois. Transações vêm antes das contas pelo
 * mesmo motivo — a conta é o que dá sentido à transação.
 *
 * A regra D-5, que impede apagar uma conta com transações vinculadas, é sobre
 * remover uma conta isoladamente. Aqui tudo sai junto, então ela não se aplica
 * e os handlers da tela de Contas não são reaproveitados.
 *
 * @param {string} uid
 * @param {object} [fs] - ligações do Firestore (só o teste substitui)
 * @throws {Error} com `etapa` indicando onde parou
 */
export async function limparDadosDoUsuario(uid, fs = firestorePadrao) {
  if (!uid) throw new Error('UID_AUSENTE');

  // 1 e 2 — aportes de cada ciclo, depois os próprios ciclos.
  let ciclos;
  try {
    ciclos = await refsDoUsuario(fs, 'ciclos', uid);
  } catch (erro) {
    throw comEtapa(erro, 'ciclos');
  }

  for (const cicloRef of ciclos) {
    try {
      const snap = await fs.getDocs(
        fs.query(
          fs.collection(fs.db, 'ciclos', cicloRef.id, 'aportes'),
          fs.where('uid', '==', uid),
        ),
      );
      await apagarRefs(fs, snap.docs.map((d) => d.ref));
    } catch (erro) {
      throw comEtapa(erro, 'aportes');
    }
  }

  try {
    await apagarRefs(fs, ciclos);
  } catch (erro) {
    throw comEtapa(erro, 'ciclos');
  }

  // 3 e 4 — transações e depois contas.
  for (const nome of ['transactions', 'accounts']) {
    try {
      await apagarRefs(fs, await refsDoUsuario(fs, nome, uid));
    } catch (erro) {
      throw comEtapa(erro, nome);
    }
  }

  // 5 — orçamento por categoria: um documento por usuário, com o uid como id.
  // deleteDoc em documento inexistente não é erro, então o retry passa reto.
  try {
    await fs.deleteDoc(fs.doc(fs.db, 'orcamentosPorCategoria', uid));
  } catch (erro) {
    throw comEtapa(erro, 'orcamentosPorCategoria');
  }

  // 6 — o perfil por último no Firestore. Vai inteiro, levando junto foto,
  // renda, uso da IA e aceite dos termos, sem apagar campo por campo.
  try {
    await fs.deleteDoc(fs.doc(fs.db, 'usuarios', uid));
  } catch (erro) {
    throw comEtapa(erro, 'usuarios');
  }
}

/** Mensagem de produto para uma falha no meio da limpeza. */
export function mensagemFalhaExclusao() {
  return 'Não foi possível concluir a exclusão. Sua conta continua ativa — tente novamente.';
}
