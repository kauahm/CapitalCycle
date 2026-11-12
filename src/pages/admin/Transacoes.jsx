import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Plus, ArrowUpCircle, ArrowDownCircle, Trash2, Pencil, Search, Download, Landmark, Receipt, Lock,
} from 'lucide-react';
import { collection, onSnapshot, deleteDoc, doc, query, where, runTransaction, setDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { canAddTransacao, mesAtualKey } from '../../components/ui/plans';
import { CATEGORIAS_ENTRADA, CATEGORIAS_SAIDA } from '../../utils/categorias';
import { formatarMoeda, formatarDataBR, parseValor } from '../../utils/moeda';
import { hojeStr } from '../../utils/data';
import { gerarCsvTransacoes, baixarArquivo } from '../../utils/csv';
import {
  dadosCarteiraManual, idCarteiraManual, rotuloConta, saldoGeridoPeloApp,
} from '../../utils/contaManual';
import UpgradeModal from '../../components/ui/UpgradeModal';
import Button from '../../components/ui/Button';
import Dialog from '../../components/ui/Dialog';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import PageHeader from '../../components/ui/PageHeader';
import { Field, Input, Select, Segmented } from '../../components/ui/Field';
import { SkeletonLista } from '../../components/ui/Skeleton';

/* ==========================================================================
   Transações

   Lançamentos manuais e importados do Open Finance na mesma lista.

   Regras de saldo
   ---------------
   Só contas geridas pelo app (a carteira manual) têm saldo recalculado a
   cada lançamento. Nas contas importadas o saldo vem do banco e é
   sobrescrito pela sincronização — mexer nele aqui faria o número divergir
   do extrato real até a próxima sincronização.

   Lançamentos importados só aceitam edição de descrição e categoria: valor,
   data, tipo e conta são fatos do banco.
   ========================================================================== */

const CATEGORIAS = { entrada: CATEGORIAS_ENTRADA, saida: CATEGORIAS_SAIDA };
const OPCAO_CARTEIRA = '__carteira__';
const PAGINA = 60;

const formVazio = () => ({
  descricao: '',
  valor: '',
  tipo: 'saida',
  categoria: CATEGORIAS_SAIDA[0],
  conta_id: '',
  data: hojeStr(),
});

function rotuloMes(chave) {
  const [ano, mes] = chave.split('-').map(Number);
  const nome = new Date(ano, mes - 1, 1).toLocaleDateString('pt-BR', { month: 'long' });
  return `${nome.charAt(0).toUpperCase()}${nome.slice(1)} de ${ano}`;
}

export default function Transacoes() {
  const { currentUser, userProfile } = useAuth();
  const toast = useToast();

  const [transacoes, setTransacoes] = useState([]);
  const [contas, setContas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erroCarga, setErroCarga] = useState(null);

  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState(null); // transação em edição ou null
  const [excluindo, setExcluindo] = useState(null); // transação a excluir ou null
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [formData, setFormData] = useState(formVazio);
  const [erros, setErros] = useState({});

  const [busca, setBusca] = useState('');
  const [filtroMes, setFiltroMes] = useState('todos');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [limite, setLimite] = useState(PAGINA);

  // Trava de submissão: o ref é o lock lógico (síncrono); o state é só visual.
  const submitLockRef = useRef(false);
  const [salvando, setSalvando] = useState(false);

  const planId = userProfile?.plan || 'jovem';
  const lancamentosNoMes = transacoes.filter((t) => t.data && t.data.startsWith(mesAtualKey())).length;
  const podeLancar = canAddTransacao(planId, lancamentosNoMes);

  useEffect(() => {
    if (!currentUser) return undefined;
    const onErro = (erro) => {
      console.error('[Transações] Falha ao ler dados:', erro?.code || erro?.message);
      setErroCarga('Não foi possível carregar seus lançamentos. Recarregue a página.');
      setLoading(false);
    };

    const unsubContas = onSnapshot(
      query(collection(db, 'accounts'), where('uid', '==', currentUser.uid)),
      (snap) => setContas(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
      onErro,
    );
    const unsubTx = onSnapshot(
      query(collection(db, 'transactions'), where('uid', '==', currentUser.uid)),
      (snap) => {
        const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        docs.sort((a, b) => (b.data || '').localeCompare(a.data || '') || String(b.id).localeCompare(String(a.id)));
        setTransacoes(docs);
        setLoading(false);
      },
      onErro,
    );
    return () => { unsubContas(); unsubTx(); };
  }, [currentUser]);

  const contasPorId = useMemo(() => Object.fromEntries(contas.map((c) => [c.id, c])), [contas]);

  const mesesDisponiveis = useMemo(() => {
    const set = new Set(transacoes.map((t) => (t.data || '').slice(0, 7)).filter(Boolean));
    return [...set].sort().reverse();
  }, [transacoes]);

  const filtradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return transacoes.filter((t) => {
      if (filtroMes !== 'todos' && !(t.data || '').startsWith(filtroMes)) return false;
      if (filtroTipo !== 'todos' && t.tipo !== filtroTipo) return false;
      if (!termo) return true;
      return (t.descricao || '').toLowerCase().includes(termo) || (t.categoria || '').toLowerCase().includes(termo);
    });
  }, [transacoes, busca, filtroMes, filtroTipo]);

  const totais = useMemo(() => {
    const entradas = filtradas.filter((t) => t.tipo === 'entrada').reduce((a, t) => a + (parseFloat(t.valor) || 0), 0);
    const saidas = filtradas.filter((t) => t.tipo === 'saida').reduce((a, t) => a + (parseFloat(t.valor) || 0), 0);
    return { entradas, saidas, liquido: entradas - saidas };
  }, [filtradas]);

  useEffect(() => { setLimite(PAGINA); }, [busca, filtroMes, filtroTipo]);

  // ── Formulário ──────────────────────────────────────────────────────
  const abrirNovo = () => {
    if (!podeLancar) { setUpgradeOpen(true); return; }
    setEditando(null);
    setFormData({ ...formVazio(), conta_id: contas[0]?.id || OPCAO_CARTEIRA });
    setErros({});
    setModalAberto(true);
  };

  const abrirEdicao = (t) => {
    setEditando(t);
    setFormData({
      descricao: t.descricao || '',
      valor: String(t.valor ?? ''),
      tipo: t.tipo || 'saida',
      categoria: t.categoria || CATEGORIAS[t.tipo || 'saida'][0],
      conta_id: t.conta_id || OPCAO_CARTEIRA,
      data: t.data || hojeStr(),
    });
    setErros({});
    setModalAberto(true);
  };

  const fecharModal = () => {
    if (salvando) return;
    setModalAberto(false);
    setEditando(null);
    setErros({});
  };

  const importada = editando?.origem === 'openfinance';

  const validar = () => {
    const e = {};
    const valor = parseValor(formData.valor);
    if (!formData.descricao.trim()) e.descricao = 'Dê um nome ao lançamento.';
    if (Number.isNaN(valor) || valor <= 0) e.valor = 'Informe um valor maior que zero.';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.data)) e.data = 'Informe uma data válida.';
    else if (formData.data > hojeStr()) e.data = 'A data não pode estar no futuro.';
    if (!formData.conta_id) e.conta_id = 'Escolha a conta.';
    setErros(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!editando && !podeLancar) { setUpgradeOpen(true); return; }
    if (!validar()) return;

    if (submitLockRef.current) return;
    submitLockRef.current = true;
    setSalvando(true);

    const valorNumerico = Math.round(parseValor(formData.valor) * 100) / 100;
    const usaCarteira = formData.conta_id === OPCAO_CARTEIRA;
    const contaId = usaCarteira ? idCarteiraManual(currentUser.uid) : formData.conta_id;
    const contaRef = doc(db, 'accounts', contaId);

    try {
      // A carteira manual nasce aqui, fora da transação: as regras do
      // Firestore não deixam ler um documento que ainda não existe dentro
      // dela (não há `resource.data.uid` para comparar). O id é
      // determinístico, então criar duas vezes nunca duplica.
      if (usaCarteira && !temCarteira) {
        await setDoc(contaRef, dadosCarteiraManual(currentUser.uid));
      }

      await runTransaction(db, async (tx) => {
        // Lê tudo primeiro (exigência do Firestore: leituras antes das escritas).
        const contaSnap = await tx.get(contaRef);
        const contaAntigaId = editando?.conta_id && editando.conta_id !== contaId ? editando.conta_id : null;
        const contaAntigaSnap = contaAntigaId ? await tx.get(doc(db, 'accounts', contaAntigaId)) : null;

        if (!contaSnap.exists()) throw new Error('A conta selecionada não existe mais.');
        const contaDados = contaSnap.data();

        if (editando) {
          if (importada) {
            // Fatos do banco não mudam; só o que é da pessoa.
            tx.update(doc(db, 'transactions', editando.id), {
              descricao: formData.descricao.trim(),
              categoria: formData.categoria,
            });
            return;
          }

          const valorAntigo = parseFloat(editando.valor) || 0;
          const reversao = editando.tipo === 'entrada' ? -valorAntigo : valorAntigo;
          const aplicacao = formData.tipo === 'entrada' ? valorNumerico : -valorNumerico;

          if (contaAntigaSnap) {
            if (contaAntigaSnap.exists() && saldoGeridoPeloApp(contaAntigaSnap.data())) {
              tx.update(contaAntigaSnap.ref, { saldo: (parseFloat(contaAntigaSnap.data().saldo) || 0) + reversao });
            }
            if (saldoGeridoPeloApp(contaDados)) {
              tx.update(contaRef, { saldo: (parseFloat(contaDados.saldo) || 0) + aplicacao });
            }
          } else if (saldoGeridoPeloApp(contaDados)) {
            tx.update(contaRef, { saldo: (parseFloat(contaDados.saldo) || 0) + reversao + aplicacao });
          }

          tx.update(doc(db, 'transactions', editando.id), {
            descricao: formData.descricao.trim(),
            valor: valorNumerico,
            tipo: formData.tipo,
            categoria: formData.categoria,
            conta_id: contaId,
            data: formData.data,
          });
          return;
        }

        // Criação
        const novaRef = doc(collection(db, 'transactions'));
        tx.set(novaRef, {
          descricao: formData.descricao.trim(),
          valor: valorNumerico,
          tipo: formData.tipo,
          categoria: formData.categoria,
          conta_id: contaId,
          data: formData.data,
          uid: currentUser.uid,
          origem: 'manual',
          identificador_externo: null,
          criadoEm: new Date(),
        });
        if (saldoGeridoPeloApp(contaDados)) {
          const delta = formData.tipo === 'entrada' ? valorNumerico : -valorNumerico;
          tx.update(contaRef, { saldo: (parseFloat(contaDados.saldo) || 0) + delta });
        }
      });

      toast.success(editando ? 'Lançamento atualizado.' : 'Lançamento salvo.');
      setModalAberto(false);
      setEditando(null);
    } catch (error) {
      console.error('[Transações] Erro ao salvar:', error);
      toast.error(`Não foi possível salvar: ${error.message}`);
    } finally {
      submitLockRef.current = false;
      setSalvando(false);
    }
  };

  const confirmarExclusao = async () => {
    const t = excluindo;
    if (!t) return;
    const txRef = doc(db, 'transactions', t.id);
    try {
      const conta = contasPorId[t.conta_id];
      if (t.conta_id && saldoGeridoPeloApp(conta)) {
        const contaRef = doc(db, 'accounts', t.conta_id);
        await runTransaction(db, async (tx) => {
          const snap = await tx.get(contaRef);
          if (snap.exists()) {
            const valor = parseFloat(t.valor) || 0;
            const delta = t.tipo === 'entrada' ? -valor : valor;
            tx.update(contaRef, { saldo: (parseFloat(snap.data().saldo) || 0) + delta });
          }
          tx.delete(txRef);
        });
      } else {
        await deleteDoc(txRef);
      }
      toast.success('Lançamento excluído.');
    } catch (error) {
      console.error('[Transações] Erro ao excluir:', error);
      toast.error(`Não foi possível excluir: ${error.message}`);
      throw error;
    }
  };

  const exportarCsv = () => {
    if (!filtradas.length) { toast.warning('Nada para exportar com os filtros atuais.'); return; }
    const sufixo = filtroMes !== 'todos' ? filtroMes : hojeStr();
    baixarArquivo(`capitalcycle-lancamentos-${sufixo}.csv`, gerarCsvTransacoes(filtradas, contasPorId));
    toast.success(`${filtradas.length} lançamento${filtradas.length === 1 ? '' : 's'} exportado${filtradas.length === 1 ? '' : 's'}.`);
  };

  // ── Render ──────────────────────────────────────────────────────────
  const visiveis = filtradas.slice(0, limite);
  const temFiltro = busca || filtroMes !== 'todos' || filtroTipo !== 'todos';
  const temCarteira = contas.some((c) => c.id === idCarteiraManual(currentUser?.uid));

  return (
    <div className="space-y-6">
      <PageHeader
        actions={(
          <>
            <Button variant="secondary" icon={Download} onClick={exportarCsv} disabled={loading || !transacoes.length}>
              Exportar CSV
            </Button>
            <Button icon={Plus} onClick={abrirNovo} disabled={loading}>
              Novo lançamento
            </Button>
          </>
        )}
      >
        Entradas e saídas, manuais ou importadas pelo Open Finance.
      </PageHeader>

      {/* Filtros */}
      <div className="cc-card p-3 flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={17} aria-hidden="true" />
          <Input
            type="search"
            aria-label="Buscar por descrição ou categoria"
            placeholder="Buscar por descrição ou categoria…"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="grid grid-cols-2 gap-3 lg:w-[26rem]">
          <Select aria-label="Filtrar por mês" value={filtroMes} onChange={(e) => setFiltroMes(e.target.value)}>
            <option value="todos">Todos os meses</option>
            {mesesDisponiveis.map((m) => <option key={m} value={m}>{rotuloMes(m)}</option>)}
          </Select>
          <Select aria-label="Filtrar por tipo" value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
            <option value="todos">Entradas e saídas</option>
            <option value="entrada">Só entradas</option>
            <option value="saida">Só saídas</option>
          </Select>
        </div>
      </div>

      {/* Totais do recorte */}
      {!loading && transacoes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-[var(--cc-gap-card)]">
          <div className="cc-card px-6 py-5">
            <p className="cc-label mb-1.5">Entradas</p>
            <p className="text-xl font-bold text-success tabular-nums">{formatarMoeda(totais.entradas)}</p>
          </div>
          <div className="cc-card px-6 py-5">
            <p className="cc-label mb-1.5">Saídas</p>
            <p className="text-xl font-bold text-rose-400 tabular-nums">{formatarMoeda(totais.saidas)}</p>
          </div>
          <div className="cc-card px-6 py-5">
            <p className="cc-label mb-1.5">Resultado {temFiltro ? 'do recorte' : 'geral'}</p>
            <p className={`text-xl font-bold tabular-nums ${totais.liquido >= 0 ? 'text-textMain' : 'text-rose-400'}`}>
              {formatarMoeda(totais.liquido)}
            </p>
          </div>
        </div>
      )}

      {erroCarga && (
        <div className="cc-card p-5 border-rose-500/30 text-sm text-rose-300">{erroCarga}</div>
      )}

      {/* Lista */}
      {loading ? (
        <SkeletonLista itens={6} />
      ) : transacoes.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="Nenhum lançamento ainda"
          description="Registre sua primeira entrada ou saída. Se preferir, conecte um banco pelo Open Finance e os lançamentos entram sozinhos."
          actionLabel="Fazer o primeiro lançamento"
          onAction={abrirNovo}
        />
      ) : filtradas.length === 0 ? (
        <EmptyState
          compact
          icon={Search}
          title="Nada encontrado"
          description="Nenhum lançamento corresponde à busca e aos filtros escolhidos."
        />
      ) : (
        <div className="cc-card overflow-hidden">
          <ul className="divide-y divide-hairline">
            {visiveis.map((t) => {
              const entrada = t.tipo === 'entrada';
              const conta = contasPorId[t.conta_id];
              const ehOF = t.origem === 'openfinance';
              return (
                <li key={t.id} className="p-4 md:px-6 md:py-4 flex flex-wrap md:flex-nowrap items-center gap-3 md:gap-4 hover:bg-surfaceLight/60 transition-colors group">
                  <div className={`p-2.5 rounded-xl shrink-0 ${entrada ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`} aria-hidden="true">
                    {entrada ? <ArrowUpCircle size={22} /> : <ArrowDownCircle size={22} />}
                  </div>

                  <div className="min-w-0 basis-[calc(100%-3.5rem)] md:basis-0 md:flex-1">
                    <p className="text-textMain font-medium truncate">{t.descricao}</p>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-textSecondary mt-1">
                      <Badge>{t.categoria}</Badge>
                      <span>{formatarDataBR(t.data)}</span>
                      {conta && <span className="hidden sm:inline">· {rotuloConta(conta)}</span>}
                      {ehOF && <Badge tone="info" icon={Landmark} title="Importado pelo Open Finance">Open Finance</Badge>}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 ml-auto">
                    <span className={`font-bold tabular-nums whitespace-nowrap mr-2 ${entrada ? 'text-emerald-400' : 'text-textMain'}`}>
                      {entrada ? '+ ' : '− '}{formatarMoeda(t.valor)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Editar ${t.descricao}`}
                      title="Editar"
                      onClick={() => abrirEdicao(t)}
                      className="md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100 hover:!text-indigo-300"
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Excluir ${t.descricao}`}
                      title="Excluir"
                      onClick={() => setExcluindo(t)}
                      className="md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100 hover:!text-rose-400"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
          {filtradas.length > visiveis.length && (
            <div className="p-4 border-t border-hairline flex items-center justify-between gap-4 text-xs text-textSecondary">
              <span>Mostrando {visiveis.length} de {filtradas.length}</span>
              <Button variant="secondary" size="sm" onClick={() => setLimite((l) => l + PAGINA)}>
                Mostrar mais
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Formulário */}
      <Dialog
        open={modalAberto}
        onClose={fecharModal}
        bloqueado={salvando}
        title={editando ? 'Editar lançamento' : 'Novo lançamento'}
        description={importada ? 'Lançamento importado do banco: valor, data e conta não podem ser alterados aqui.' : undefined}
        footer={(
          <>
            <Button variant="secondary" onClick={fecharModal} disabled={salvando}>Cancelar</Button>
            <Button type="submit" form="form-transacao" loading={salvando}>
              {editando ? 'Salvar alterações' : 'Salvar lançamento'}
            </Button>
          </>
        )}
      >
        <form id="form-transacao" onSubmit={handleSubmit} className="space-y-4" noValidate>
          {!importada && (
            <Segmented
              ariaLabel="Tipo do lançamento"
              value={formData.tipo}
              onChange={(tipo) => setFormData({ ...formData, tipo, categoria: CATEGORIAS[tipo][0] })}
              options={[
                { value: 'saida', label: 'Saída', activeClass: 'bg-rose-500' },
                { value: 'entrada', label: 'Entrada', activeClass: 'bg-emerald-500' },
              ]}
            />
          )}

          <Field label="Descrição" error={erros.descricao}>
            <Input
              data-autofocus
              type="text"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              placeholder="Ex.: Supermercado"
              maxLength={80}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Valor (R$)" error={erros.valor}>
              <Input
                type="text"
                inputMode="decimal"
                value={formData.valor}
                onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                placeholder="0,00"
                disabled={importada}
              />
            </Field>
            <Field label="Data" error={erros.data}>
              <Input
                type="date"
                value={formData.data}
                max={hojeStr()}
                onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                disabled={importada}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Categoria">
              <Select value={formData.categoria} onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}>
                {CATEGORIAS[formData.tipo].map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </Select>
            </Field>
            <Field
              label="Conta"
              error={erros.conta_id}
              hint={!temCarteira && formData.conta_id === OPCAO_CARTEIRA ? 'A carteira manual é criada no primeiro lançamento.' : undefined}
            >
              <Select value={formData.conta_id} onChange={(e) => setFormData({ ...formData, conta_id: e.target.value })} disabled={importada}>
                {!temCarteira && <option value={OPCAO_CARTEIRA}>Carteira (manual)</option>}
                {contas.map((c) => <option key={c.id} value={c.id}>{rotuloConta(c)}</option>)}
              </Select>
            </Field>
          </div>

          {importada && (
            <p className="flex items-start gap-2 text-xs text-textSecondary leading-relaxed">
              <Lock size={13} className="mt-0.5 shrink-0" aria-hidden="true" />
              A categoria que você escolher é preservada nas próximas sincronizações.
            </p>
          )}
        </form>
      </Dialog>

      <ConfirmDialog
        open={Boolean(excluindo)}
        onClose={() => setExcluindo(null)}
        onConfirm={confirmarExclusao}
        title="Excluir lançamento"
        confirmLabel="Excluir"
        message={excluindo ? `"${excluindo.descricao}" (${formatarMoeda(excluindo.valor)}) será removido${excluindo.origem === 'openfinance' ? '. Como veio do banco, pode voltar na próxima sincronização' : ' e o saldo da conta será ajustado'}.` : ''}
      />

      <UpgradeModal feature="transacoes" open={upgradeOpen} onClose={() => setUpgradeOpen(false)} />
    </div>
  );
}
