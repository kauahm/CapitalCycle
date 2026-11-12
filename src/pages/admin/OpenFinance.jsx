import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Plus, Landmark, CreditCard, PiggyBank, RefreshCw, Unplug, ShieldCheck, AlertTriangle,
} from 'lucide-react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { PluggyConnect } from 'react-pluggy-connect';
import { db } from '../../services/firebase';
import {
  PLUGGY_SANDBOX, atualizarItem, criarConnectToken, pluggyConfigurado,
} from '../../services/pluggy';
import { ORIGEM_OPEN_FINANCE, desconectarItem, sincronizarItem } from '../../utils/openFinance';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import CurrencyValue from '../../components/ui/CurrencyValue';
import UpgradeModal from '../../components/ui/UpgradeModal';
import Toast from '../../components/ui/Toast';
import { canAddConta, getLimits } from '../../components/ui/plans';
import { useAuth } from '../../hooks/useAuth';

/* ==========================================================================
   Open Finance — substitui a antiga aba "Contas".

   As contas deixam de ser cadastradas à mão: a pessoa conecta o banco pelo
   widget do Pluggy e o app importa contas, saldos e lançamentos.

   Fluxo
     1. "Conectar banco" → gera connect token → abre o Pluggy Connect
     2. onSuccess({ item }) → sincronizarItem() grava contas e transações
     3. Cada banco tem "Atualizar" (pede dados novos ao banco e sincroniza)
        e "Desconectar" (revoga e apaga o que foi importado dele)

   Limite do plano: no Jovem, `limits.contas` passa a contar BANCOS
   conectados (um banco pode trazer conta corrente + cartão).
   ========================================================================== */

const ICONE_TIPO = {
  'Cartão de crédito': { icon: CreditCard, cor: 'text-rose-300' },
  'Poupança': { icon: PiggyBank, cor: 'text-amber-300' },
};

function formatarSincronizacao(valor) {
  const data = valor?.toDate ? valor.toDate() : valor ? new Date(valor) : null;
  if (!data) return '';
  return data.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
}

export default function OpenFinance() {
  const { currentUser, userProfile } = useAuth();
  const [contas, setContas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connectToken, setConnectToken] = useState(null);
  const [abrindoWidget, setAbrindoWidget] = useState(false);
  // itemId → 'sincronizando' | 'desconectando'
  const [ocupados, setOcupados] = useState({});
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const fecharToast = useCallback(() => setToast(null), []);

  // O onSuccess do widget pode disparar mais de uma vez para o mesmo item.
  const itensEmSincronizacao = useRef(new Set());

  const planId = userProfile?.plan || 'jovem';
  const limiteBancos = getLimits(planId).contas;
  const configurado = pluggyConfigurado();

  useEffect(() => {
    if (!currentUser) return undefined;
    const q = query(
      collection(db, 'accounts'),
      where('uid', '==', currentUser.uid),
      where('origem', '==', ORIGEM_OPEN_FINANCE),
    );
    return onSnapshot(q, (snap) => {
      setContas(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, (erro) => {
      console.error('Erro ao ler contas Open Finance:', erro);
      setLoading(false);
    });
  }, [currentUser]);

  // Agrupa as contas por banco conectado (item do Pluggy).
  const bancos = useMemo(() => {
    const porItem = new Map();
    contas.forEach((c) => {
      if (!porItem.has(c.pluggyItemId)) {
        porItem.set(c.pluggyItemId, {
          itemId: c.pluggyItemId,
          nome: c.banco || 'Banco',
          logo: c.bancoLogo,
          cor: c.bancoCor,
          sincronizadoEm: c.sincronizadoEm,
          contas: [],
        });
      }
      porItem.get(c.pluggyItemId).contas.push(c);
    });
    return [...porItem.values()];
  }, [contas]);

  const patrimonio = contas.reduce((acc, c) => acc + (Number(c.saldo) || 0), 0);

  const marcar = (itemId, estado) => setOcupados((o) => {
    const novo = { ...o };
    if (estado) novo[itemId] = estado; else delete novo[itemId];
    return novo;
  });

  const sincronizar = async (itemId, { pedirAoBanco = false } = {}) => {
    if (itensEmSincronizacao.current.has(itemId)) return;
    itensEmSincronizacao.current.add(itemId);
    marcar(itemId, 'sincronizando');
    try {
      const pedidoAceito = pedirAoBanco ? await atualizarItem(itemId) : true;
      const { contas: qtdContas, novas } = await sincronizarItem(currentUser.uid, itemId);
      setToast({
        type: 'success',
        message: `${qtdContas} ${qtdContas === 1 ? 'conta sincronizada' : 'contas sincronizadas'} · ${novas} ${novas === 1 ? 'lançamento novo' : 'lançamentos novos'}.`
          + (pedidoAceito ? '' : ' O banco só pode ser consultado de novo daqui a até 1 hora.'),
      });
    } catch (erro) {
      console.error('Erro ao sincronizar Open Finance:', erro);
      setToast({ type: 'error', message: `Não foi possível sincronizar: ${erro.message}` });
    } finally {
      itensEmSincronizacao.current.delete(itemId);
      marcar(itemId, null);
    }
  };

  const conectarBanco = async () => {
    if (!canAddConta(planId, bancos.length)) {
      setUpgradeOpen(true);
      return;
    }
    setAbrindoWidget(true);
    try {
      setConnectToken(await criarConnectToken({ clientUserId: currentUser.uid }));
    } catch (erro) {
      console.error('Erro ao abrir o Pluggy Connect:', erro);
      setToast({ type: 'error', message: erro.message });
    } finally {
      setAbrindoWidget(false);
    }
  };

  const desconectar = async (banco) => {
    const ok = window.confirm(
      `Desconectar ${banco.nome}?\n\n` +
      'As contas e os lançamentos importados deste banco serão removidos do CapitalCycle. ' +
      'Seus dados no banco não são afetados.',
    );
    if (!ok) return;
    marcar(banco.itemId, 'desconectando');
    try {
      await desconectarItem(currentUser.uid, banco.itemId);
      setToast({ type: 'success', message: `${banco.nome} desconectado.` });
    } catch (erro) {
      console.error('Erro ao desconectar banco:', erro);
      setToast({ type: 'error', message: `Não foi possível desconectar: ${erro.message}` });
    } finally {
      marcar(banco.itemId, null);
    }
  };

  if (loading) {
    return <div className="h-[80vh] flex items-center justify-center"><LoadingSpinner size="lg" color="text-indigo-500" /></div>;
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <p className="text-sm text-slate-400 max-w-xl">
          Conecte seus bancos pelo Open Finance e seus saldos e gastos entram no CapitalCycle automaticamente.
        </p>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block mr-4">
            <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Patrimônio Total</p>
            <CurrencyValue value={patrimonio} size="xl" className="font-black text-emerald-400" />
          </div>
          {limiteBancos != null && (
            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap bg-surface border border-hairline px-3 py-2 rounded-xl">
              {bancos.length}/{limiteBancos} {limiteBancos === 1 ? 'banco' : 'bancos'}
            </span>
          )}
          <button
            onClick={conectarBanco}
            disabled={!configurado || abrindoWidget}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-lg shadow-indigo-600/20"
          >
            {abrindoWidget ? <RefreshCw size={18} className="animate-spin" /> : <Plus size={18} />}
            Conectar banco
          </button>
        </div>
      </div>

      {!configurado && (
        <div className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/30 text-amber-200 rounded-2xl p-4 text-sm">
          <AlertTriangle size={18} className="shrink-0 mt-0.5" />
          <p>
            Open Finance ainda não configurado. Defina <code>VITE_PLUGGY_CLIENT_ID</code> e{' '}
            <code>VITE_PLUGGY_CLIENT_SECRET</code> no <code>.env</code> e reinicie o servidor.
          </p>
        </div>
      )}

      {PLUGGY_SANDBOX && configurado && (
        <p className="text-xs text-slate-500">
          Modo de testes ativo: escolha <strong className="text-slate-300">Pluggy Bank</strong> no widget
          (usuário <code>user-ok</code>, senha <code>password-ok</code>).
        </p>
      )}

      {/* BANCOS CONECTADOS */}
      {bancos.length === 0 ? (
        <div className="bg-surface border border-hairline rounded-3xl p-12 text-center">
          <Landmark size={48} className="mx-auto text-slate-600 mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">Nenhum banco conectado</h3>
          <p className="text-slate-400 max-w-md mx-auto">
            Conecte seu primeiro banco para importar saldos e lançamentos dos últimos 90 dias.
          </p>
          <p className="text-xs text-slate-500 mt-4 inline-flex items-center gap-1.5">
            <ShieldCheck size={14} /> Conexão via Open Finance Brasil, autorizada por você no app do banco.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {bancos.map((banco) => {
            const estado = ocupados[banco.itemId];
            return (
              <section key={banco.itemId} className="bg-surface border border-hairline rounded-3xl p-6">
                <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center overflow-hidden bg-white/5"
                      style={banco.cor ? { backgroundColor: `${banco.cor}22` } : undefined}
                    >
                      {banco.logo
                        ? <img src={banco.logo} alt="" className="w-8 h-8 object-contain" />
                        : <Landmark size={22} className="text-slate-300" />}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{banco.nome}</h3>
                      <p className="text-xs text-slate-500">
                        {estado === 'sincronizando'
                          ? 'Sincronizando…'
                          : `Atualizado em ${formatarSincronizacao(banco.sincronizadoEm)}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => sincronizar(banco.itemId, { pedirAoBanco: true })}
                      disabled={Boolean(estado)}
                      className="text-sm text-slate-300 hover:text-white bg-app border border-hairline px-3 py-2 rounded-xl flex items-center gap-2 disabled:opacity-50"
                    >
                      <RefreshCw size={15} className={estado === 'sincronizando' ? 'animate-spin' : ''} />
                      Atualizar
                    </button>
                    <button
                      onClick={() => desconectar(banco)}
                      disabled={Boolean(estado)}
                      className="text-sm text-slate-400 hover:text-rose-400 bg-app border border-hairline px-3 py-2 rounded-xl flex items-center gap-2 disabled:opacity-50"
                    >
                      <Unplug size={15} />
                      {estado === 'desconectando' ? 'Desconectando…' : 'Desconectar'}
                    </button>
                  </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {banco.contas.map((conta) => {
                    const { icon: Icone, cor } = ICONE_TIPO[conta.tipo] || { icon: Landmark, cor: 'text-slate-200' };
                    return (
                      <div key={conta.id} className="bg-app border border-hairline rounded-2xl p-5">
                        <div className="flex items-center gap-3 mb-4">
                          <Icone size={20} className={cor} />
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{conta.nome}</p>
                            <p className="text-xs text-slate-500">
                              {[conta.tipo, conta.numero].filter(Boolean).join(' • ')}
                            </p>
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">
                          {conta.tipo === 'Cartão de crédito' ? 'Fatura atual' : 'Saldo'}
                        </p>
                        <CurrencyValue
                          value={conta.tipo === 'Cartão de crédito' ? Math.abs(conta.saldo) : conta.saldo}
                          size="2xl"
                          align="left"
                          className={`font-black ${cor}`}
                        />
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {connectToken && (
        <PluggyConnect
          connectToken={connectToken}
          includeSandbox={PLUGGY_SANDBOX}
          language="pt"
          theme="dark"
          onSuccess={({ item }) => {
            setConnectToken(null);
            sincronizar(item.id);
          }}
          onError={(erro) => {
            console.error('Pluggy Connect:', erro);
            setToast({ type: 'error', message: erro?.message || 'Não foi possível conectar o banco.' });
          }}
          onClose={() => setConnectToken(null)}
        />
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={fecharToast} />}
      <UpgradeModal feature="contas" open={upgradeOpen} onClose={() => setUpgradeOpen(false)} />
    </div>
  );
}
