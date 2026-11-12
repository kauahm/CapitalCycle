import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp, TrendingDown, AlertTriangle, ArrowRight, Target, Wallet, PiggyBank, Clock, PieChart,
  CreditCard, Receipt, Landmark, Sparkles, CheckCircle2, Circle,
} from 'lucide-react';
import { collection, doc, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../services/firebase';
import CurrencyValue from '../../components/ui/CurrencyValue';
import ProgressBar from '../../components/ui/ProgressBar';
import { PageSkeleton } from '../../components/ui/Skeleton';
import { useAuth } from '../../hooks/useAuth';
import { useAportesPorMeta } from '../../hooks/useAportesPorMeta';
import { calcularProgressoMeta } from '../../utils/metas';
import { calcularProgressoCategorias, tomDoEstado } from '../../utils/orcamentoCategoria';
import { calcularVariacaoPct } from '../../utils/comparativoMensal';
import { hojeStr, mesAnteriorPrefixo } from '../../utils/data';
import { formatarMoeda, formatarPct } from '../../utils/moeda';

/* ==========================================================================
   Dashboard

   Todos os números saem das coleções reais da conta. A estrutura segue a
   referência visual do painel (três KPIs, fluxo + metas, blocos de largura
   cheia); o que mudou nesta revisão foi o CONTEÚDO dos indicadores:

     - "Saldo disponível" exclui cartões de crédito: a fatura é dívida, não
       dinheiro em caixa. Ela aparece à parte, quando existe.
     - "Investido" saiu: dependia de um tipo de conta ("Investimentos") que
       deixou de existir com o Open Finance e ficava sempre em R$ 0,00.
       No lugar entram entradas e saídas do mês, que respondem a pergunta
       mais frequente ("quanto entrou e quanto saiu?").
     - "Maiores despesas" mostra a fatia de cada categoria no total gasto,
       em vez de uma barra contra um limite inventado (valor × 1,2).
   ========================================================================== */

const LinkVerTodas = ({ to, children = 'Ver todas' }) => (
  <Link to={to} className="text-xs text-textSecondary hover:text-primary transition-colors inline-flex items-center gap-1">
    {children} <ArrowRight size={12} />
  </Link>
);

function Tendencia({ pct, inverter = false, sufixo = 'vs. mês anterior' }) {
  if (pct == null) return <p className="text-xs text-slate-500">Sem base de comparação</p>;
  const bom = inverter ? pct <= 0 : pct >= 0;
  return (
    <p className={`text-xs flex items-center gap-1 ${bom ? 'text-emerald-400' : 'text-rose-400'}`}>
      {pct >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
      {formatarPct(pct)} {sufixo}
    </p>
  );
}

export default function DashboardFinanceiro() {
  const { userProfile, currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  const [contas, setContas] = useState([]);
  const [transacoes, setTransacoes] = useState([]);
  const [ciclos, setCiclos] = useState([]);
  const [limitesCategorias, setLimitesCategorias] = useState({});

  useEffect(() => {
    if (!currentUser) return undefined;
    // O loading só termina quando as três coleções principais responderam
    // (antes dependia só de `ciclos`, e um erro deixava o spinner eterno).
    const prontos = new Set();
    const marcar = (nome) => { prontos.add(nome); if (prontos.size >= 3) setLoading(false); };
    const onErro = (nome) => (e) => {
      console.error(`[Dashboard] Falha ao ler ${nome}:`, e?.code || e?.message);
      setErro('Não foi possível carregar parte dos dados. Recarregue a página.');
      marcar(nome);
    };

    const unsubContas = onSnapshot(
      query(collection(db, 'accounts'), where('uid', '==', currentUser.uid)),
      (snap) => { setContas(snap.docs.map((d) => ({ id: d.id, ...d.data() }))); marcar('contas'); },
      onErro('contas'),
    );
    const unsubTransacoes = onSnapshot(
      query(collection(db, 'transactions'), where('uid', '==', currentUser.uid)),
      (snap) => {
        const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        docs.sort((a, b) => (b.data || '').localeCompare(a.data || ''));
        setTransacoes(docs);
        marcar('transacoes');
      },
      onErro('transacoes'),
    );
    const unsubCiclos = onSnapshot(
      query(collection(db, 'ciclos'), where('uid', '==', currentUser.uid)),
      (snap) => {
        const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        docs.sort((a, b) => (a.fim || '').localeCompare(b.fim || ''));
        setCiclos(docs);
        marcar('ciclos');
      },
      onErro('ciclos'),
    );
    const unsubOrcamento = onSnapshot(
      doc(db, 'orcamentosPorCategoria', currentUser.uid),
      (snap) => setLimitesCategorias(snap.exists() ? (snap.data().limites || {}) : {}),
      (e) => console.error('[Dashboard] Falha ao ler orçamento:', e?.code || e?.message),
    );

    return () => { unsubContas(); unsubTransacoes(); unsubCiclos(); unsubOrcamento(); };
  }, [currentUser]);

  const metaIds = useMemo(() => ciclos.filter((c) => c.tipo === 'Meta').map((c) => c.id), [ciclos]);
  const aportesMap = useAportesPorMeta(metaIds, currentUser?.uid);

  // ── Cálculos ────────────────────────────────────────────────────────
  const dados = useMemo(() => {
    const hoje = hojeStr();
    const mesAtual = hoje.slice(0, 7);
    const mesAnterior = mesAnteriorPrefixo(mesAtual);
    const soma = (lista) => lista.reduce((acc, t) => acc + (parseFloat(t.valor) || 0), 0);

    const saldoDisponivel = contas.filter((c) => c.tipo !== 'Cartão de crédito').reduce((acc, c) => acc + (parseFloat(c.saldo) || 0), 0);
    const fatura = Math.abs(contas.filter((c) => c.tipo === 'Cartão de crédito').reduce((acc, c) => acc + (parseFloat(c.saldo) || 0), 0));
    const temCartao = contas.some((c) => c.tipo === 'Cartão de crédito');

    const doMes = transacoes.filter((t) => t.data && t.data.startsWith(mesAtual));
    const doMesAnterior = transacoes.filter((t) => t.data && t.data.startsWith(mesAnterior));

    const entradasMes = soma(doMes.filter((t) => t.tipo === 'entrada'));
    const saidasMes = soma(doMes.filter((t) => t.tipo === 'saida'));
    const entradasMesAnterior = soma(doMesAnterior.filter((t) => t.tipo === 'entrada'));
    const saidasMesAnterior = soma(doMesAnterior.filter((t) => t.tipo === 'saida'));
    const houveMesAnterior = doMesAnterior.length > 0;

    const gastosPorCategoria = doMes.filter((t) => t.tipo === 'saida').reduce((acc, t) => {
      acc[t.categoria || 'Outros'] = (acc[t.categoria || 'Outros'] || 0) + (parseFloat(t.valor) || 0);
      return acc;
    }, {});
    const maioresGastos = Object.entries(gastosPorCategoria)
      .map(([categoria, valor]) => ({ categoria, valor, fatia: saidasMes > 0 ? (valor / saidasMes) * 100 : 0 }))
      .sort((a, b) => b.valor - a.valor)
      .slice(0, 3);

    const rendaMensal = parseFloat(userProfile?.renda_mensal) || 0;
    const temRenda = rendaMensal > 0;
    const economiaMes = temRenda ? rendaMensal - saidasMes : null;
    const rendaComprometidaPct = temRenda ? (saidasMes / rendaMensal) * 100 : null;
    const economiaMesAnterior = temRenda && houveMesAnterior ? rendaMensal - saidasMesAnterior : null;

    const variacaoGastoPct = houveMesAnterior ? calcularVariacaoPct(saidasMes, saidasMesAnterior) : null;
    const variacaoEntradaPct = houveMesAnterior ? calcularVariacaoPct(entradasMes, entradasMesAnterior) : null;
    const variacaoEconomiaPct = economiaMesAnterior != null && economiaMes != null ? calcularVariacaoPct(economiaMes, economiaMesAnterior) : null;

    const metasTipo = ciclos.filter((c) => c.tipo === 'Meta');
    const metaDestaque = metasTipo.find((c) => !c.fim || c.fim >= hoje) || metasTipo[0] || null;
    const progressoMetaDestaque = metaDestaque ? calcularProgressoMeta(metaDestaque, aportesMap[metaDestaque.id] || []) : null;

    const progressoCategorias = calcularProgressoCategorias(limitesCategorias, transacoes, mesAtual);

    const agora = new Date();
    const evolucaoMensal = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(agora.getFullYear(), agora.getMonth() - i, 1);
      const chave = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const lista = transacoes.filter((t) => t.data && t.data.startsWith(chave));
      const entradas = soma(lista.filter((t) => t.tipo === 'entrada'));
      const saidas = soma(lista.filter((t) => t.tipo === 'saida'));
      evolucaoMensal.push({
        chave,
        label: d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', ''),
        entradas,
        saidas,
        liquido: entradas - saidas,
        atual: i === 0,
      });
    }
    const maiorMovimentoMes = Math.max(1, ...evolucaoMensal.map((m) => Math.abs(m.liquido)));

    const ultimas = transacoes.slice(0, 5);

    return {
      hoje, mesAtual, saldoDisponivel, fatura, temCartao, entradasMes, saidasMes, houveMesAnterior,
      saidasMesAnterior, maioresGastos, rendaMensal, temRenda, economiaMes, rendaComprometidaPct,
      variacaoGastoPct, variacaoEntradaPct, variacaoEconomiaPct, metaDestaque, progressoMetaDestaque,
      progressoCategorias, evolucaoMensal, maiorMovimentoMes, ultimas,
    };
  }, [contas, transacoes, ciclos, limitesCategorias, aportesMap, userProfile]);

  if (loading) return <PageSkeleton />;

  const d = dados;
  const primeiroNome = userProfile?.nome ? userProfile.nome.split(' ')[0] : 'Investidor';
  const saudacao = (() => {
    const h = new Date().getHours();
    if (h < 6) return 'Boa madrugada';
    if (h < 12) return 'Bom dia';
    if (h < 18) return 'Boa tarde';
    return 'Boa noite';
  })();
  const dataBruta = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  const dataLonga = dataBruta.charAt(0).toUpperCase() + dataBruta.slice(1);

  // Primeiros passos: só aparece enquanto faltar algo essencial.
  const passos = [
    { feito: transacoes.length > 0, rotulo: 'Fazer o primeiro lançamento', to: '/capital/transacoes', icon: Receipt },
    { feito: contas.some((c) => c.origem === 'openfinance'), rotulo: 'Conectar um banco pelo Open Finance', to: '/capital/open-finance', icon: Landmark, opcional: true },
    { feito: d.temRenda, rotulo: 'Definir sua renda mensal', to: '/capital/perfil', icon: Wallet },
    { feito: ciclos.length > 0, rotulo: 'Criar uma meta ou orçamento', to: '/capital/ciclos', icon: Target },
    { feito: Object.keys(limitesCategorias).length > 0, rotulo: 'Definir limites por categoria', to: '/capital/orcamento', icon: PieChart },
  ];
  const pendentes = passos.filter((p) => !p.feito && !p.opcional).length;
  const mostrarPassos = pendentes > 0;

  return (
    <div className="space-y-[var(--cc-gap)]">

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <p className="text-sm text-textSecondary">
          {saudacao}, <span className="text-textMain font-medium">{primeiroNome}</span>. Aqui está o resumo do seu capital.
        </p>
        <p className="text-xs text-slate-500">{dataLonga}</p>
      </div>

      {erro && <div className="cc-card p-4 border-rose-500/30 text-sm text-rose-300" role="alert">{erro}</div>}

      {/* ── KPIs ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[1.478fr_1fr_1fr] gap-[var(--cc-gap-card)]">
        <div className="cc-card-p min-w-0 md:col-span-2 xl:col-span-1">
          <p className="cc-label mb-3">Saldo disponível</p>
          <CurrencyValue value={d.saldoDisponivel} size="5xl" align="left" className="font-bold text-textMain tracking-tight" />
          <div className={`mt-4 inline-flex items-center gap-1.5 text-sm font-medium ${d.entradasMes - d.saidasMes >= 0 ? 'text-success' : 'text-rose-400'}`}>
            {d.entradasMes - d.saidasMes >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {d.entradasMes - d.saidasMes >= 0
              ? `Sobrou ${formatarMoeda(d.entradasMes - d.saidasMes)} este mês`
              : `Faltaram ${formatarMoeda(Math.abs(d.entradasMes - d.saidasMes))} este mês`}
          </div>
          <p className="mt-1.5 text-sm text-textSecondary">
            {contas.length === 0
              ? 'Nenhuma conta ainda — o saldo acompanha seus lançamentos.'
              : d.temCartao
                ? `Fatura de cartão em aberto: ${formatarMoeda(d.fatura)}`
                : `${contas.length} ${contas.length === 1 ? 'conta' : 'contas'} somada${contas.length === 1 ? '' : 's'}, sem cartões.`}
          </p>
        </div>

        <div className="cc-card-p min-w-0 flex flex-col justify-center">
          <p className="cc-label mb-3">Entradas do mês</p>
          <CurrencyValue value={d.entradasMes} size="3xl" align="left" className="font-bold text-success" />
          <div className="mt-2"><Tendencia pct={d.variacaoEntradaPct} /></div>
        </div>

        <div className="cc-card-p min-w-0 flex flex-col justify-center">
          <p className="cc-label mb-3">Saídas do mês</p>
          <CurrencyValue value={d.saidasMes} size="3xl" align="left" className="font-bold text-textMain" />
          <div className="mt-2"><Tendencia pct={d.variacaoGastoPct} inverter /></div>
        </div>
      </div>

      {/* ── Primeiros passos ── */}
      {mostrarPassos && (
        <div className="cc-card-p border-primary/25">
          <div className="flex items-center justify-between gap-3 mb-5">
            <h3 className="cc-card-title flex items-center gap-2.5"><Sparkles size={16} className="text-indigo-300" /> Primeiros passos</h3>
            <span className="text-xs text-textSecondary">{passos.filter((p) => p.feito).length}/{passos.length} concluídos</span>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
            {passos.map((p) => (
              <li key={p.rotulo}>
                <Link
                  to={p.to}
                  className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors ${p.feito ? 'border-emerald-500/20 text-slate-500 line-through' : 'border-hairline text-textMain hover:border-primary/50 hover:bg-surfaceLight'}`}
                >
                  {p.feito ? <CheckCircle2 size={16} className="text-emerald-400 shrink-0" /> : <Circle size={16} className="text-slate-600 shrink-0" />}
                  <span className="flex-1">{p.rotulo}{p.opcional && !p.feito && <span className="text-slate-500"> (opcional)</span>}</span>
                  {!p.feito && <ArrowRight size={14} className="text-slate-500" />}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Fluxo + Metas ── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.389fr_1fr] gap-[var(--cc-gap-card)]">
        <div className="cc-card-p min-w-0">
          <div className="flex items-center justify-between mb-7 gap-3">
            <h3 className="cc-card-title">Fluxo líquido — últimos 6 meses</h3>
            <span className="text-xs text-textSecondary hidden sm:inline">entradas − saídas</span>
          </div>
          {transacoes.length === 0 ? (
            <div className="cc-empty p-10">
              <p className="text-textSecondary text-sm mb-3">O gráfico aparece a partir do primeiro lançamento.</p>
              <LinkVerTodas to="/capital/transacoes">Lançar agora</LinkVerTodas>
            </div>
          ) : (
            <div className="flex items-end gap-3 sm:gap-4 h-36" role="img" aria-label={`Fluxo líquido mensal: ${d.evolucaoMensal.map((m) => `${m.label} ${formatarMoeda(m.liquido)}`).join(', ')}`}>
              {d.evolucaoMensal.map((m) => {
                const alturaPct = Math.max(4, (Math.abs(m.liquido) / d.maiorMovimentoMes) * 100);
                const positivo = m.liquido >= 0;
                return (
                  <div key={m.chave} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group/bar">
                    <span className="text-[10px] text-textSecondary tabular-nums opacity-0 group-hover/bar:opacity-100 transition-opacity">
                      {formatarMoeda(m.liquido)}
                    </span>
                    <div
                      title={`${m.label}: ${formatarMoeda(m.liquido)} (entradas ${formatarMoeda(m.entradas)}, saídas ${formatarMoeda(m.saidas)})`}
                      className={`w-full rounded-lg transition-all duration-500 ${positivo ? (m.atual ? 'bg-success' : 'bg-emerald-800') : (m.atual ? 'bg-rose-500' : 'bg-rose-500/60')}`}
                      style={{ height: `${alturaPct}%` }}
                    />
                    <span className={`text-xs capitalize ${m.atual ? 'text-textMain font-semibold' : 'text-textSecondary'}`}>{m.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="cc-card-p">
          <div className="flex items-center justify-between mb-7">
            <h3 className="cc-card-title flex items-center gap-2.5"><Target size={18} className="text-textSecondary" /> Metas em andamento</h3>
            {ciclos.length > 0 && <LinkVerTodas to="/capital/ciclos" />}
          </div>

          {ciclos.length === 0 ? (
            <div className="cc-empty p-10">
              <p className="text-textSecondary text-sm mb-3">Nenhuma meta cadastrada ainda.</p>
              <LinkVerTodas to="/capital/ciclos">Criar minha primeira meta</LinkVerTodas>
            </div>
          ) : (
            <div className="space-y-4">
              {ciclos.filter((c) => !c.fim || c.fim >= d.hoje).slice(0, 2).map((ciclo) => {
                if (ciclo.tipo === 'Meta') {
                  const p = calcularProgressoMeta(ciclo, aportesMap[ciclo.id] || []);
                  return (
                    <div key={ciclo.id} className="bg-app border border-hairline rounded-xl p-5">
                      <div className="flex justify-between items-baseline mb-3 gap-3">
                        <h4 className="font-medium text-textMain text-sm truncate">{ciclo.nome}</h4>
                        <span className="text-xs text-slate-500 tabular-nums whitespace-nowrap">Alvo: {formatarMoeda(p.valorMeta)}</span>
                      </div>
                      <ProgressBar value={p.progressoPct} tone={p.concluida ? 'success' : 'primary'} className="mb-2" label={`Progresso de ${ciclo.nome}`} />
                      <div className="flex justify-between items-baseline">
                        <span className="text-xs font-medium text-slate-400">{p.progressoPct.toFixed(0)}% concluído</span>
                        <span className="text-sm font-semibold text-textMain tabular-nums">{formatarMoeda(p.valorAcumulado)}</span>
                      </div>
                    </div>
                  );
                }
                const gasto = transacoes.filter((t) => t.tipo === 'saida' && t.data >= ciclo.inicio && t.data <= ciclo.fim).reduce((acc, t) => acc + (parseFloat(t.valor) || 0), 0);
                const teto = parseFloat(ciclo.orcamento) || 0;
                const pct = teto > 0 ? Math.min(100, (gasto / teto) * 100) : 0;
                const estourado = teto > 0 && gasto >= teto;
                return (
                  <div key={ciclo.id} className="bg-app border border-hairline rounded-xl p-5">
                    <div className="flex justify-between items-baseline mb-3 gap-3">
                      <h4 className="font-medium text-textMain text-sm truncate">{ciclo.nome}</h4>
                      <span className="text-xs text-slate-500 tabular-nums whitespace-nowrap">Teto: {formatarMoeda(teto)}</span>
                    </div>
                    <ProgressBar value={pct} tone={estourado ? 'danger' : 'primary'} className="mb-2" label={`Uso de ${ciclo.nome}`} />
                    <div className="flex justify-between items-baseline">
                      <span className={`text-xs font-medium ${estourado ? 'text-rose-400' : 'text-slate-400'}`}>{pct.toFixed(0)}% utilizado</span>
                      <span className="text-sm font-semibold text-textMain tabular-nums">{formatarMoeda(gasto)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Renda ── */}
      {d.temRenda ? (
        <div className="cc-card-p">
          <h3 className="cc-card-title mb-7 flex items-center gap-2.5"><Wallet size={18} className="text-textSecondary" /> Renda do mês</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div>
              <p className="cc-label mb-2">Renda mensal</p>
              <CurrencyValue value={d.rendaMensal} size="2xl" align="left" className="font-bold text-textMain" />
            </div>
            <div>
              <p className="cc-label mb-2">Economia do mês</p>
              <CurrencyValue value={d.economiaMes} size="2xl" align="left" className={`font-bold ${d.economiaMes >= 0 ? 'text-success' : 'text-rose-400'}`} />
              <div className="mt-1"><Tendencia pct={d.variacaoEconomiaPct} /></div>
            </div>
            <div>
              <p className="cc-label mb-2">Renda comprometida</p>
              <p className={`text-2xl font-bold tabular-nums ${d.rendaComprometidaPct > 100 ? 'text-rose-400' : d.rendaComprometidaPct >= 80 ? 'text-amber-400' : 'text-textMain'}`}>
                {d.rendaComprometidaPct.toFixed(0)}%
              </p>
              <ProgressBar value={d.rendaComprometidaPct} tone={d.rendaComprometidaPct > 100 ? 'danger' : d.rendaComprometidaPct >= 80 ? 'warning' : 'success'} className="mt-2 max-w-[12rem]" label="Renda comprometida" />
            </div>
          </div>
        </div>
      ) : (
        <div className="cc-card-p text-center py-14">
          <Wallet size={22} className="text-textSecondary mx-auto mb-4" />
          <p className="text-textSecondary text-sm mb-3">Defina sua renda mensal para acompanhar economia e % da renda comprometida.</p>
          <LinkVerTodas to="/capital/perfil">Definir renda mensal</LinkVerTodas>
        </div>
      )}

      {/* ── Meta em destaque ── */}
      {d.metaDestaque && d.progressoMetaDestaque && (
        <div className="cc-card-p">
          <div className="flex items-center justify-between mb-6">
            <h3 className="cc-card-title flex items-center gap-2.5"><Target size={16} className="text-slate-500" /> Meta em destaque</h3>
            <LinkVerTodas to="/capital/ciclos" />
          </div>

          <div className="bg-app border border-hairline rounded-2xl p-6">
            <div className="flex justify-between items-baseline mb-4 gap-3">
              <h4 className="font-bold text-textMain truncate">{d.metaDestaque.nome}</h4>
              {d.progressoMetaDestaque.prazoEncerrado && <span className="text-xs text-rose-400 font-semibold whitespace-nowrap">Prazo encerrado</span>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex justify-between items-baseline mb-1.5">
                  <span className="text-xs text-slate-400">{d.progressoMetaDestaque.progressoPct.toFixed(0)}% concluído</span>
                  <CurrencyValue value={d.progressoMetaDestaque.valorAcumulado} size="lg" className="font-bold min-w-0 text-textMain" />
                </div>
                <ProgressBar value={d.progressoMetaDestaque.progressoPct} height="h-2" className="mb-2" label="Progresso da meta em destaque" />
                <p className="text-xs text-slate-500">
                  Faltam {formatarMoeda(d.progressoMetaDestaque.valorRestante)} de {formatarMoeda(d.progressoMetaDestaque.valorMeta)}
                  {d.progressoMetaDestaque.diasRestantes != null && !d.progressoMetaDestaque.prazoEncerrado && ` · ${d.progressoMetaDestaque.diasRestantes} dia(s) restante(s)`}
                </p>
              </div>

              <div className="space-y-1.5">
                {d.progressoMetaDestaque.ritmoNecessario != null && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 flex items-center gap-1"><Clock size={12} /> Ritmo necessário</span>
                    <span className="text-slate-300 font-medium">{formatarMoeda(d.progressoMetaDestaque.ritmoNecessario)}/dia</span>
                  </div>
                )}
                {d.progressoMetaDestaque.ritmoAtual != null && d.progressoMetaDestaque.ritmoAtual > 0 ? (
                  <>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 flex items-center gap-1"><PiggyBank size={12} /> Ritmo atual</span>
                      <span className="text-slate-300 font-medium">{formatarMoeda(d.progressoMetaDestaque.ritmoAtual)}/dia</span>
                    </div>
                    {d.progressoMetaDestaque.diferencaPct != null && (
                      <p className={`text-xs font-semibold ${d.progressoMetaDestaque.diferencaPct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {d.progressoMetaDestaque.diferencaPct >= 0 ? 'Acima' : 'Abaixo'} do ritmo necessário ({formatarPct(d.progressoMetaDestaque.diferencaPct)})
                      </p>
                    )}
                    {d.progressoMetaDestaque.dataPrevista && (
                      <p className="text-xs text-slate-500">
                        Previsão: {d.progressoMetaDestaque.dataPrevista.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-xs text-slate-500">
                    {d.progressoMetaDestaque.temAporte ? 'Sem ritmo recente (nenhum aporte nos últimos 30 dias)' : 'Registre um aporte para ver seu ritmo'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Orçamento por categoria ── */}
      <div className="cc-card-p">
        <div className="flex items-center justify-between mb-6">
          <h3 className="cc-card-title flex items-center gap-2.5"><PieChart size={16} className="text-slate-500" /> Orçamento por categoria</h3>
          <LinkVerTodas to="/capital/orcamento" />
        </div>

        {d.progressoCategorias.length === 0 ? (
          <div className="cc-empty p-8">
            <p className="text-slate-500 text-sm mb-3">Nenhum limite por categoria definido ainda.</p>
            <LinkVerTodas to="/capital/orcamento">Definir limites por categoria</LinkVerTodas>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {d.progressoCategorias.slice(0, 3).map((c) => (
              <div key={c.categoria} className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-slate-400 text-sm">{c.categoria}</span>
                  <span className="font-semibold text-textMain tabular-nums">{formatarMoeda(c.gasto)}</span>
                </div>
                <ProgressBar value={c.pct} tone={tomDoEstado(c.estado)} label={`Uso de ${c.categoria}`} />
                <p className={`text-xs ${c.estado === 'estourado' ? 'text-rose-400' : c.estado === 'alerta' ? 'text-amber-400' : 'text-slate-500'}`}>
                  {c.pct.toFixed(0)}% de {formatarMoeda(c.limite)}
                  {c.estado === 'estourado' && ' · ultrapassou o limite'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Maiores despesas + Últimos lançamentos ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[var(--cc-gap-card)]">
        <div className="cc-card-p">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
            <h3 className="cc-card-title">Maiores despesas no mês</h3>
            {d.maioresGastos.length > 0 && d.maioresGastos[0].fatia >= 50 && (
              <div className="flex items-center gap-1.5 text-amber-400 text-xs font-medium">
                <AlertTriangle size={13} /> {d.maioresGastos[0].categoria} concentra {d.maioresGastos[0].fatia.toFixed(0)}% dos gastos
              </div>
            )}
          </div>

          {d.maioresGastos.length === 0 ? (
            <div className="cc-empty p-8">
              <p className="text-slate-500 text-sm mb-3">Nenhuma despesa registrada neste mês.</p>
              <LinkVerTodas to="/capital/transacoes">Lançar uma transação</LinkVerTodas>
            </div>
          ) : (
            <div className="space-y-5">
              {d.maioresGastos.map((gasto, index) => {
                const tons = ['danger', 'warning', 'primary'];
                return (
                  <div key={gasto.categoria} className="space-y-2">
                    <div className="flex justify-between items-baseline">
                      <span className="text-slate-400 text-sm">{gasto.categoria}</span>
                      <span className="font-semibold text-textMain tabular-nums">
                        {formatarMoeda(gasto.valor)} <span className="text-xs text-slate-500 font-normal">· {gasto.fatia.toFixed(0)}%</span>
                      </span>
                    </div>
                    <ProgressBar value={gasto.fatia} tone={tons[index % 3]} label={`${gasto.categoria}: ${gasto.fatia.toFixed(0)}% das saídas`} />
                  </div>
                );
              })}
              <p className="text-xs text-slate-500 pt-1">Percentual sobre o total de saídas do mês ({formatarMoeda(d.saidasMes)}).</p>
            </div>
          )}
        </div>

        <div className="cc-card-p">
          <div className="flex items-center justify-between mb-6">
            <h3 className="cc-card-title">Últimos lançamentos</h3>
            {transacoes.length > 0 && <LinkVerTodas to="/capital/transacoes" />}
          </div>
          {d.ultimas.length === 0 ? (
            <div className="cc-empty p-8">
              <p className="text-slate-500 text-sm">Seus lançamentos mais recentes aparecem aqui.</p>
            </div>
          ) : (
            <ul className="divide-y divide-hairline -my-3">
              {d.ultimas.map((t) => (
                <li key={t.id} className="py-3 flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${t.tipo === 'entrada' ? 'bg-emerald-400' : 'bg-rose-400'}`} aria-hidden="true" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-textMain truncate">{t.descricao}</p>
                    <p className="text-xs text-slate-500">{t.categoria} · {t.data?.split('-').reverse().join('/')}</p>
                  </div>
                  <span className={`text-sm font-semibold tabular-nums whitespace-nowrap ${t.tipo === 'entrada' ? 'text-emerald-400' : 'text-textMain'}`}>
                    {t.tipo === 'entrada' ? '+ ' : '− '}{formatarMoeda(t.valor)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Atalho para o Open Finance enquanto não há banco conectado */}
      {!contas.some((c) => c.origem === 'openfinance') && (
        <div className="cc-empty p-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-surfaceLight flex items-center justify-center text-textSecondary shrink-0"><CreditCard size={20} /></div>
            <div>
              <p className="text-sm font-semibold text-textMain">Conecte seu banco pelo Open Finance</p>
              <p className="text-xs text-textSecondary mt-0.5">Saldos e lançamentos dos últimos 90 dias entram automaticamente, sem digitar nada.</p>
            </div>
          </div>
          <LinkVerTodas to="/capital/open-finance">Conectar banco</LinkVerTodas>
        </div>
      )}
    </div>
  );
}
