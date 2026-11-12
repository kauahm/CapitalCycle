import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Plus, Landmark, CreditCard, PiggyBank, RefreshCw, Unplug, ShieldCheck, AlertTriangle, Wallet,
} from 'lucide-react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { PluggyConnect } from 'react-pluggy-connect';
import { db } from '../../services/firebase';
import {
  PLUGGY_SANDBOX, atualizarItem, criarConnectToken, pluggyConfigurado,
} from '../../services/pluggy';
import { ORIGEM_OPEN_FINANCE, desconectarItem, sincronizarItem } from '../../utils/openFinance';
import { formatarMoeda } from '../../utils/moeda';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { canAddConta, getLimits } from '../../components/ui/plans';
import CurrencyValue from '../../components/ui/CurrencyValue';
import UpgradeModal from '../../components/ui/UpgradeModal';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import EmptyState from '../../components/ui/EmptyState';
import PageHeader from '../../components/ui/PageHeader';
import { SkeletonCard } from '../../components/ui/Skeleton';

/* ==========================================================================
   Open Finance — substitui a antiga aba "Contas".

   As contas deixam de ser cadastradas à mão: a pessoa conecta o banco pelo
   widget do Pluggy e o app importa contas, saldos e lançamentos.

   Fluxo
     1. "Conectar banco" → gera connect token → abre o Pluggy Connect
     2. onSuccess({ item }) → sincronizarItem() grava contas e transações
     3. Cada banco tem "Atualizar" (pede dados novos ao banco e sincroniza)
        e "Desconectar" (revoga e apaga o que foi importado dele)

   Limite do plano: no Jovem, `limits.contas` conta BANCOS conectados (um
   banco pode trazer conta corrente + cartão).
   ========================================================================== */

const ICONE_TIPO = {
  'Cartão de crédito': { icon: CreditCard, cor: 'text-rose-300' },
  'Poupança': { icon: PiggyBank, cor: 'text-amber-300' },
};

function formatarSincronizacao(valor) {
  const data = valor?.toDate ? valor.toDate() : valor ? new Date(valor) : null;
  if (!data || Number.isNaN(data.getTime())) return '';
  return data.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
}

export default function OpenFinance() {
  const { currentUser, userProfile } = useAuth();
  const toast = useToast();
  const [contas, setContas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connectToken, setConnectToken] = useState(null);
  const [abrindoWidget, setAbrindoWidget] = useState(false);
  // itemId → 'sincronizando' | 'desconectando'
  const [ocupados, setOcupados] = useState({});
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [bancoParaDesconectar, setBancoParaDesconectar] = useState(null);

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
      console.error('[Open Finance] Erro ao ler contas:', erro);
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

  const saldoDisponivel = contas.filter((c) => c.tipo !== 'Cartão de crédito').reduce((acc, c) => acc + (Number(c.saldo) || 0), 0);
  const faturas = Math.abs(contas.filter((c) => c.tipo === 'Cartão de crédito').reduce((acc, c) => acc + (Number(c.saldo) || 0), 0));

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
      toast.success(
        `${qtdContas} ${qtdContas === 1 ? 'conta sincronizada' : 'contas sincronizadas'} · ${novas} ${novas === 1 ? 'lançamento novo' : 'lançamentos novos'}.`
        + (pedidoAceito ? '' : ' O banco só pode ser consultado de novo daqui a até 1 hora.'),
      );
    } catch (erro) {
      console.error('[Open Finance] Erro ao sincronizar:', erro);
      toast.error(`Não foi possível sincronizar: ${erro.message}`);
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
      console.error('[Open Finance] Erro ao abrir o Pluggy Connect:', erro);
      toast.error(erro.message);
    } finally {
      setAbrindoWidget(false);
    }
  };

  const desconectar = async () => {
    const banco = bancoParaDesconectar;
    if (!banco) return;
    marcar(banco.itemId, 'desconectando');
    try {
      await desconectarItem(currentUser.uid, banco.itemId);
      toast.success(`${banco.nome} desconectado.`);
    } catch (erro) {
      console.error('[Open Finance] Erro ao desconectar:', erro);
      toast.error(`Não foi possível desconectar: ${erro.message}`);
      throw erro;
    } finally {
      marcar(banco.itemId, null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        actions={(
          <>
            {limiteBancos != null && !loading && (
              <Badge tone={bancos.length >= limiteBancos ? 'warning' : 'neutral'} className="px-3 py-2 text-xs">
                {bancos.length}/{limiteBancos} {limiteBancos === 1 ? 'banco' : 'bancos'}
              </Badge>
            )}
            <Button icon={Plus} onClick={conectarBanco} disabled={!configurado} loading={abrindoWidget}>
              Conectar banco
            </Button>
          </>
        )}
      >
        Conecte seus bancos pelo Open Finance e seus saldos e lançamentos entram no CapitalCycle automaticamente.
      </PageHeader>

      {!configurado && (
        <div className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/30 text-amber-200 rounded-2xl p-4 text-sm" role="alert">
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

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--cc-gap-card)]">
          <SkeletonCard /><SkeletonCard />
        </div>
      ) : bancos.length === 0 ? (
        <EmptyState
          icon={Landmark}
          title="Nenhum banco conectado"
          description="Conecte seu primeiro banco para importar saldos e os lançamentos dos últimos 90 dias. A conexão é autorizada por você no ambiente do próprio banco."
          actionLabel={configurado ? 'Conectar banco' : undefined}
          onAction={configurado ? conectarBanco : undefined}
        >
        </EmptyState>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[var(--cc-gap-card)]">
            <div className="cc-card-p">
              <p className="cc-label mb-3 flex items-center gap-2"><Wallet size={13} /> Saldo disponível</p>
              <CurrencyValue value={saldoDisponivel} size="3xl" align="left" className="font-bold text-success" />
              <p className="mt-2 text-xs text-textSecondary">Soma das contas correntes e poupanças conectadas.</p>
            </div>
            <div className="cc-card-p">
              <p className="cc-label mb-3 flex items-center gap-2"><CreditCard size={13} /> Faturas em aberto</p>
              <CurrencyValue value={faturas} size="3xl" align="left" className="font-bold text-textMain" />
              <p className="mt-2 text-xs text-textSecondary">{faturas > 0 ? 'Total devido nos cartões conectados.' : 'Nenhum cartão com fatura em aberto.'}</p>
            </div>
          </div>

          <div className="space-y-[var(--cc-gap-card)]">
            {bancos.map((banco) => {
              const estado = ocupados[banco.itemId];
              return (
                <section key={banco.itemId} className="cc-card p-6" aria-label={banco.nome}>
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
                        <h3 className="text-lg font-bold text-textMain">{banco.nome}</h3>
                        <p className="text-xs text-textSecondary">
                          {estado === 'sincronizando'
                            ? 'Sincronizando…'
                            : `Atualizado em ${formatarSincronizacao(banco.sincronizadoEm)}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => sincronizar(banco.itemId, { pedirAoBanco: true })}
                        disabled={Boolean(estado)}
                        loading={estado === 'sincronizando'}
                        icon={RefreshCw}
                      >
                        Atualizar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setBancoParaDesconectar(banco)}
                        disabled={Boolean(estado)}
                        loading={estado === 'desconectando'}
                        icon={Unplug}
                        className="hover:!text-rose-400"
                      >
                        Desconectar
                      </Button>
                    </div>
                  </header>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {banco.contas.map((conta) => {
                      const { icon: Icone, cor } = ICONE_TIPO[conta.tipo] || { icon: Landmark, cor: 'text-slate-200' };
                      const cartao = conta.tipo === 'Cartão de crédito';
                      return (
                        <div key={conta.id} className="bg-app border border-hairline rounded-2xl p-5">
                          <div className="flex items-center gap-3 mb-4">
                            <Icone size={20} className={cor} aria-hidden="true" />
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-textMain truncate">{conta.nome}</p>
                              <p className="text-xs text-textSecondary">
                                {[conta.tipo, conta.numero].filter(Boolean).join(' • ')}
                              </p>
                            </div>
                          </div>
                          <p className="cc-label mb-1">{cartao ? 'Fatura atual' : 'Saldo'}</p>
                          <CurrencyValue
                            value={cartao ? Math.abs(conta.saldo) : conta.saldo}
                            size="2xl"
                            align="left"
                            className={`font-bold ${cor}`}
                          />
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        </>
      )}

      <p className="text-xs text-slate-500 inline-flex items-center gap-1.5">
        <ShieldCheck size={14} aria-hidden="true" /> Conexão via Open Finance Brasil, autorizada por você no app do banco. Suas credenciais nunca passam pelo CapitalCycle.
      </p>

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
            toast.error(erro?.message || 'Não foi possível conectar o banco.');
          }}
          onClose={() => setConnectToken(null)}
        />
      )}

      <ConfirmDialog
        open={Boolean(bancoParaDesconectar)}
        onClose={() => setBancoParaDesconectar(null)}
        onConfirm={desconectar}
        title={`Desconectar ${bancoParaDesconectar?.nome || 'banco'}?`}
        confirmLabel="Desconectar"
        message={`As contas e os lançamentos importados deste banco (${bancoParaDesconectar ? formatarMoeda(bancoParaDesconectar.contas.reduce((a, c) => a + Math.abs(Number(c.saldo) || 0), 0)) : ''} em saldos) serão removidos do CapitalCycle. Seus dados no banco não são afetados.`}
      />
      <UpgradeModal feature="contas" open={upgradeOpen} onClose={() => setUpgradeOpen(false)} />
    </div>
  );
}
