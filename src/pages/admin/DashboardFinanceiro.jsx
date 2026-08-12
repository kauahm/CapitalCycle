import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, AlertTriangle, ArrowRight, Target, Wallet, PiggyBank, Clock, PieChart, RefreshCw } from 'lucide-react';
import { collection, doc, getDoc, updateDoc, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../services/firebase';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import CurrencyValue from '../../components/ui/CurrencyValue';
import { useAuth } from '../../hooks/useAuth';
import { useAportesPorMeta } from '../../hooks/useAportesPorMeta';
import { calcularProgressoMeta } from '../../utils/metas';
import { calcularProgressoCategorias } from '../../utils/orcamentoCategoria';
import { calcularVariacaoPct } from '../../utils/comparativoMensal';
import { hojeStr, mesAnteriorPrefixo } from '../../utils/data';
import { gerarResumoFinanceiro, formatarResumoParaPrompt } from '../../utils/resumoFinanceiro';
import { formatarMoeda } from '../../utils/formatters';
import { canConsultarIA, getLimits, mesAtualKey } from '../../components/ui/plans';

// Mesmo padrão de configuração de API já usado em AnaliseIA.jsx — este card
// só consome a chave/modelo já configurados por lá (.env), sem duplicar UI.
const ENV_KEY   = import.meta.env.VITE_GEMINI_API_KEY || '';
const ENV_MODEL = import.meta.env.VITE_GEMINI_MODEL   || 'gemini-1.5-flash';

export default function DashboardFinanceiro() {
  const { userProfile, currentUser } = useAuth();
  const [loading, setLoading] = useState(true);

  const [contas, setContas] = useState([]);
  const [transacoes, setTransacoes] = useState([]);
  const [ciclos, setCiclos] = useState([]);
  const [limitesCategorias, setLimitesCategorias] = useState({});

  useEffect(() => {
    if (!currentUser) return;

    // 1. Buscar Contas do usuário logado
    const qContas = query(collection(db, 'accounts'), where('uid', '==', currentUser.uid));
    const unsubContas = onSnapshot(qContas, (snapshot) => {
      setContas(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // 2. Buscar Transações do usuário logado
    const qTransacoes = query(
      collection(db, 'transactions'),
      where('uid', '==', currentUser.uid)
    );
    const unsubTransacoes = onSnapshot(qTransacoes, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      docs.sort((a, b) => (b.data || '').localeCompare(a.data || ''));
      setTransacoes(docs);
    });

    // 3. Buscar Ciclos/Metas do usuário logado
    const qCiclos = query(
      collection(db, 'ciclos'),
      where('uid', '==', currentUser.uid)
    );
    const unsubCiclos = onSnapshot(qCiclos, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      docs.sort((a, b) => (a.fim || '').localeCompare(b.fim || ''));
      setCiclos(docs);
      setLoading(false); // Para o loading quando tudo carregar
    });

    // 4. Buscar limites de orçamento por categoria (Fase 1)
    const unsubOrcamento = onSnapshot(doc(db, 'orcamentosPorCategoria', currentUser.uid), (snap) => {
      setLimitesCategorias(snap.exists() ? (snap.data().limites || {}) : {});
    });

    return () => {
      unsubContas();
      unsubTransacoes();
      unsubCiclos();
      unsubOrcamento();
    };
  }, [currentUser]);

  // Aportes das metas — usados para o progresso real das metas (não mais
  // inferido de transações de entrada, ver especificação Fase 1 item 2).
  const metaIds = ciclos.filter((c) => c.tipo === 'Meta').map((c) => c.id);
  const aportesMap = useAportesPorMeta(metaIds);

  // ── Resumo do Capital Advisor (card com IA no topo) ──
  // Reaproveita a mesma agregação usada para os cards do dashboard, via
  // utils/resumoFinanceiro.js, para montar um prompt curto para a IA.
  const resumoFinanceiroObj = useMemo(
    () => gerarResumoFinanceiro({ contas, transacoes, ciclos, aportesMap, limitesCategorias }),
    [contas, transacoes, ciclos, aportesMap, limitesCategorias]
  );
  const resumoParaPrompt = useMemo(() => formatarResumoParaPrompt(resumoFinanceiroObj), [resumoFinanceiroObj]);

  const planId = userProfile?.plan || 'jovem';
  const limiteIA = getLimits(planId).consultasIAMes;
  const mesKeyIA = mesAtualKey();

  const [usoMesIA, setUsoMesIA] = useState(0);
  const [resumoIA, setResumoIA] = useState('');
  const [resumoIALoading, setResumoIALoading] = useState(false);
  const [resumoIAError, setResumoIAError] = useState(null);
  const autoFetchRef = useRef(false);

  // Carrega o contador de consultas de IA do mês corrente (mesma trava usada em AnaliseIA.jsx)
  useEffect(() => {
    if (!currentUser) return;
    let active = true;
    getDoc(doc(db, 'usuarios', currentUser.uid))
      .then((snap) => {
        const uso = snap.exists() ? (snap.data().iaUso?.[mesKeyIA] || 0) : 0;
        if (active) setUsoMesIA(uso);
      })
      .catch(() => {});
    return () => { active = false; };
  }, [currentUser, mesKeyIA]);

  const gerarResumoIA = async () => {
    if (!currentUser || resumoIALoading) return;

    if (!ENV_KEY) {
      setResumoIAError('api-key-ausente');
      return;
    }
    if (!canConsultarIA(planId, usoMesIA)) {
      setResumoIAError('cota-esgotada');
      return;
    }

    setResumoIALoading(true);
    setResumoIAError(null);

    try {
      const prompt = `Escreva de 1 a 2 frases curtas em português do Brasil apontando o único ponto que mais merece atenção agora nestes dados financeiros (gasto, meta ou orçamento). Regras: não invente valores fora dos dados abaixo; não cumprimente, não se apresente, não use markdown, não escreva "resumo" ou qualquer meta-comentário sobre a resposta; vá direto ao ponto como quem manda um recado rápido, tom neutro e factual.\n\nDados:\n${resumoParaPrompt}`;

      const url = `https://generativelanguage.googleapis.com/v1beta/models/${ENV_MODEL}:generateContent?key=${ENV_KEY}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompt }] }] })
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson?.error?.message || `Erro ${res.status}`);
      }

      const data = await res.json();
      const texto = data?.candidates?.[0]?.content?.parts?.[0]?.text
        || 'Não consegui gerar uma resposta. Tente novamente.';
      setResumoIA(texto);

      // Consome 1 consulta da mesma cota mensal usada em AnaliseIA.jsx
      if (limiteIA != null) {
        const novoUso = usoMesIA + 1;
        setUsoMesIA(novoUso);
        updateDoc(doc(db, 'usuarios', currentUser.uid), { [`iaUso.${mesKeyIA}`]: novoUso }).catch(() => {});
      }
    } catch (e) {
      setResumoIAError(e.message);
    } finally {
      setResumoIALoading(false);
    }
  };

  // Gera o resumo uma única vez ao montar (com dados já carregados) — nunca a cada render.
  // Atualizações posteriores só acontecem pelo botão "Atualizar resumo".
  useEffect(() => {
    if (loading || autoFetchRef.current || !currentUser) return;
    autoFetchRef.current = true;
    gerarResumoIA();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, currentUser]);

  // ==========================================
  // CÁLCULOS DINÂMICOS COM OS DADOS REAIS
  // (mesma lógica de antes — apenas a apresentação visual mudou)
  // ==========================================

  // 1. Saldos, gastos por categoria e totais do mês — vêm de gerarResumoFinanceiro
  // (utils/resumoFinanceiro.js), a mesma agregação já usada para o resumo de IA
  // acima, para não duplicar a lógica de negócio em dois lugares.
  const { saldoDisponivel, totalInvestido, totalGastoMes: totalSaidasMes, totalEntradasMes, gastosPorCategoria: gastosPorCategoriaArr } = resumoFinanceiroObj;

  const dataAtual = new Date();
  const mesAtualPrefixo = `${dataAtual.getFullYear()}-${String(dataAtual.getMonth() + 1).padStart(2, '0')}`;

  // Os 3 maiores gastos do mês (gastosPorCategoriaArr já vem ordenado do maior para o menor)
  const maioresGastos = gastosPorCategoriaArr.slice(0, 3);

  const fluxoPositivo = totalEntradasMes >= totalSaidasMes;
  const diferencaMes = totalEntradasMes - totalSaidasMes;

  // ── Renda mensal, economia e % da renda comprometida (Fase 1) ──
  const rendaMensal = parseFloat(userProfile?.renda_mensal) || 0;
  const temRenda = rendaMensal > 0;
  const economiaMes = temRenda ? rendaMensal - totalSaidasMes : null;
  const rendaComprometidaPct = temRenda ? (totalSaidasMes / rendaMensal) * 100 : null;

  // ── Comparação com o mês anterior (Fase 1) ──
  const mesAnteriorPrefixoStr = mesAnteriorPrefixo(mesAtualPrefixo);
  const gastoMesAnterior = transacoes
    .filter(t => t.tipo === 'saida' && t.data && t.data.startsWith(mesAnteriorPrefixoStr))
    .reduce((acc, t) => acc + (parseFloat(t.valor) || 0), 0);
  const houveMesAnterior = transacoes.some(t => t.data && t.data.startsWith(mesAnteriorPrefixoStr));
  const variacaoGastoPct = houveMesAnterior ? calcularVariacaoPct(totalSaidasMes, gastoMesAnterior) : null;

  const economiaMesAnterior = temRenda && houveMesAnterior ? rendaMensal - gastoMesAnterior : null;
  const variacaoEconomiaPct = economiaMesAnterior != null && economiaMes != null
    ? calcularVariacaoPct(economiaMes, economiaMesAnterior)
    : null;

  // ── Meta em destaque: primeira meta com prazo em aberto (ou a mais recente, se todas encerradas) ──
  const metasTipo = ciclos.filter(c => c.tipo === 'Meta');
  const hoje = hojeStr();
  const metaDestaque = metasTipo.find(c => !c.fim || c.fim >= hoje) || metasTipo[0] || null;
  const progressoMetaDestaque = metaDestaque
    ? calcularProgressoMeta(metaDestaque, aportesMap[metaDestaque.id] || [])
    : null;

  // ── Orçamento por categoria (Fase 1) ──
  const progressoCategorias = calcularProgressoCategorias(limitesCategorias, transacoes, mesAtualPrefixo);

  // 3. Evolução dos últimos 6 meses (entradas - saídas) — usa só transações reais,
  //    substitui as barras decorativas que existiam antes.
  const evolucaoMensal = (() => {
    const meses = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(dataAtual.getFullYear(), dataAtual.getMonth() - i, 1);
      const chave = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const doMes = transacoes.filter(t => t.data && t.data.startsWith(chave));
      const entradas = doMes.filter(t => t.tipo === 'entrada').reduce((a, t) => a + (parseFloat(t.valor) || 0), 0);
      const saidas = doMes.filter(t => t.tipo === 'saida').reduce((a, t) => a + (parseFloat(t.valor) || 0), 0);
      meses.push({
        chave,
        label: d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', ''),
        liquido: entradas - saidas,
        atual: i === 0,
      });
    }
    return meses;
  })();
  const maiorMovimentoMes = Math.max(1, ...evolucaoMensal.map(m => Math.abs(m.liquido)));

  if (loading) {
    return <div className="h-[80vh] flex items-center justify-center"><LoadingSpinner size="lg" color="text-indigo-500" /></div>;
  }

  const primeiroNome = userProfile && userProfile.nome ? userProfile.nome.split(' ')[0] : 'Investidor';

  return (
    <div className="space-y-10">

      {/* ── CABEÇALHO: saldo é o dado hero, o resto orbita em escala menor ── */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
        <div>
          <p className="text-sm text-slate-500 mb-1">Olá, {primeiroNome}.</p>

          {/* Leitura rápida da situação atual — mesma agregação de sempre,
              só que narrada. Fica junto da saudação em vez de virar um
              "card de IA" separado. */}
          <div className="flex items-start gap-2 mb-4 max-w-xl">
            <p className="text-sm text-slate-400 leading-relaxed">
              {resumoIAError === 'cota-esgotada'
                ? 'Cota de consultas do mês esgotada — a leitura volta no próximo ciclo.'
                : resumoIA || 'Aqui está o resumo do seu capital.'}
            </p>
            {ENV_KEY && resumoIAError !== 'cota-esgotada' && (
              <button
                onClick={gerarResumoIA}
                disabled={resumoIALoading}
                title="Atualizar leitura"
                className="text-slate-600 hover:text-slate-400 disabled:opacity-40 transition-colors shrink-0 mt-0.5"
              >
                <RefreshCw size={12} className={resumoIALoading ? 'animate-spin' : ''} />
              </button>
            )}
          </div>
          <p className="text-xs uppercase font-semibold tracking-widest text-slate-500 mb-1">Saldo disponível</p>
          <CurrencyValue value={saldoDisponivel} size="6xl" align="left" className="font-bold text-white tracking-tight" />
          <div className={`mt-3 inline-flex items-center gap-1.5 text-sm font-medium ${fluxoPositivo ? 'text-emerald-400' : 'text-rose-400'}`}>
            {fluxoPositivo ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {fluxoPositivo
              ? `Sobrou ${formatarMoeda(Math.abs(diferencaMes))} este mês`
              : `Faltaram ${formatarMoeda(Math.abs(diferencaMes))} este mês`}
          </div>
        </div>

        <div className="flex gap-10 shrink-0">
          <div>
            <p className="text-xs uppercase font-semibold tracking-widest text-slate-500 mb-1">Investido</p>
            <CurrencyValue value={totalInvestido} size="2xl" align="left" className="font-semibold text-emerald-400" />
          </div>
          <div>
            <p className="text-xs uppercase font-semibold tracking-widest text-slate-500 mb-1">Contas ativas</p>
            <p className="text-2xl font-semibold text-white tabular-nums">{contas.length}</p>
          </div>
        </div>
      </div>

      <div className="h-px bg-[#1e293b]" />

      {/* ── EVOLUÇÃO MENSAL + METAS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* Evolução: fluxo líquido dos últimos 6 meses, com dado real */}
        <div className="lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-300 mb-6">Fluxo líquido — últimos 6 meses</h3>
          <div className="flex items-end gap-4 h-32">
            {evolucaoMensal.map((m) => {
              const alturaPct = Math.max(4, (Math.abs(m.liquido) / maiorMovimentoMes) * 100);
              const positivo = m.liquido >= 0;
              return (
                <div key={m.chave} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <div
                    title={formatarMoeda(m.liquido)}
                    className={`w-full rounded-sm transition-all duration-500 ${
                      positivo ? 'bg-emerald-500/70' : 'bg-rose-500/70'
                    } ${m.atual ? 'ring-1 ring-offset-2 ring-offset-[#070b14] ring-slate-500' : ''}`}
                    style={{ height: `${alturaPct}%` }}
                  />
                  <span className={`text-xs capitalize ${m.atual ? 'text-slate-300 font-semibold' : 'text-slate-600'}`}>
                    {m.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Metas em andamento */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
              <Target size={16} className="text-slate-500" /> Metas em andamento
            </h3>
            {ciclos.length > 0 && (
              <Link to="/capital/ciclos" className="text-xs text-slate-500 hover:text-indigo-400 transition-colors flex items-center gap-1">
                Ver todas <ArrowRight size={12} />
              </Link>
            )}
          </div>

          {ciclos.length === 0 ? (
            <div className="border border-dashed border-[#1e293b] rounded-xl p-6 text-center">
              <p className="text-slate-500 text-sm mb-3">Nenhuma meta cadastrada ainda.</p>
              <Link to="/capital/ciclos" className="text-sm text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center gap-1">
                Criar minha primeira meta <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {ciclos.slice(0, 2).map((ciclo) => {
                if (ciclo.tipo === 'Meta') {
                  // Progresso vem dos aportes registrados, não de transações (Fase 1)
                  const p = calcularProgressoMeta(ciclo, aportesMap[ciclo.id] || []);
                  return (
                    <div key={ciclo.id} className="bg-[#101623] border border-[#1e293b] rounded-xl p-5">
                      <div className="flex justify-between items-baseline mb-3">
                        <h4 className="font-medium text-white text-sm">{ciclo.nome}</h4>
                        <span className="text-xs text-slate-500 tabular-nums">Alvo: {formatarMoeda(p.valorMeta)}</span>
                      </div>
                      <div className="w-full bg-[#1e293b] h-1.5 rounded-full overflow-hidden mb-2">
                        <div className="h-full rounded-full bg-indigo-500 transition-all duration-700" style={{ width: `${p.progressoPct}%` }} />
                      </div>
                      <div className="flex justify-between items-baseline">
                        <span className="text-xs font-medium text-slate-400">{p.progressoPct.toFixed(0)}% concluído</span>
                        <span className="text-sm font-semibold text-white tabular-nums">{formatarMoeda(p.valorAcumulado)}</span>
                      </div>
                    </div>
                  );
                }

                // Orçamento ad-hoc: sem mudança — soma as saídas no período
                const gasto = transacoes
                  .filter(t => t.tipo === 'saida' && t.data >= ciclo.inicio && t.data <= ciclo.fim)
                  .reduce((acc, t) => acc + (parseFloat(t.valor) || 0), 0);
                const porcentagem = Math.min(100, (gasto / ciclo.orcamento) * 100);
                const estourado = porcentagem >= 100;

                return (
                  <div key={ciclo.id} className="bg-[#101623] border border-[#1e293b] rounded-xl p-5">
                    <div className="flex justify-between items-baseline mb-3">
                      <h4 className="font-medium text-white text-sm">{ciclo.nome}</h4>
                      <span className="text-xs text-slate-500 tabular-nums">Teto: {formatarMoeda(ciclo.orcamento)}</span>
                    </div>
                    <div className="w-full bg-[#1e293b] h-1.5 rounded-full overflow-hidden mb-2">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${estourado ? 'bg-rose-500' : 'bg-indigo-500'}`}
                        style={{ width: `${porcentagem}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-baseline">
                      <span className={`text-xs font-medium ${estourado ? 'text-rose-400' : 'text-slate-400'}`}>
                        {porcentagem.toFixed(0)}% utilizado
                      </span>
                      <span className="text-sm font-semibold text-white tabular-nums">{formatarMoeda(gasto)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="h-px bg-[#1e293b]" />

      {/* ── RENDA MENSAL: ECONOMIA E % COMPROMETIDA (Fase 1) ── */}
      {temRenda ? (
        <div>
          <h3 className="text-sm font-semibold text-slate-300 mb-6 flex items-center gap-2">
            <Wallet size={16} className="text-slate-500" /> Renda do mês
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div>
              <p className="text-xs uppercase font-semibold tracking-widest text-slate-500 mb-1">Renda mensal</p>
              <CurrencyValue value={rendaMensal} size="2xl" align="left" className="font-bold text-white" />
            </div>
            <div>
              <p className="text-xs uppercase font-semibold tracking-widest text-slate-500 mb-1">Economia do mês</p>
              <CurrencyValue value={economiaMes} size="2xl" align="left" className={`font-bold ${economiaMes >= 0 ? 'text-emerald-400' : 'text-rose-400'}`} />
              {variacaoEconomiaPct != null && (
                <p className={`text-xs mt-1 flex items-center gap-1 ${variacaoEconomiaPct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {variacaoEconomiaPct >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {variacaoEconomiaPct >= 0 ? '+' : ''}{variacaoEconomiaPct.toFixed(0)}% vs. mês anterior
                </p>
              )}
            </div>
            <div>
              <p className="text-xs uppercase font-semibold tracking-widest text-slate-500 mb-1">Renda comprometida</p>
              <p className={`text-2xl font-bold tabular-nums ${rendaComprometidaPct > 100 ? 'text-rose-400' : rendaComprometidaPct >= 80 ? 'text-amber-400' : 'text-white'}`}>
                {rendaComprometidaPct.toFixed(0)}%
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="border border-dashed border-[#1e293b] rounded-xl p-6 text-center">
          <Wallet size={20} className="text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 text-sm mb-3">Defina sua renda mensal para acompanhar economia e % da renda comprometida.</p>
          <Link to="/capital/perfil" className="text-sm text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center gap-1">
            Definir renda mensal <ArrowRight size={14} />
          </Link>
        </div>
      )}

      <div className="h-px bg-[#1e293b]" />

      {/* ── META EM DESTAQUE: RITMO E PREVISÃO (Fase 1) ── */}
      {metaDestaque && progressoMetaDestaque && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
              <Target size={16} className="text-slate-500" /> Meta em destaque
            </h3>
            <Link to="/capital/ciclos" className="text-xs text-slate-500 hover:text-indigo-400 transition-colors flex items-center gap-1">
              Ver todas <ArrowRight size={12} />
            </Link>
          </div>

          <div className="bg-[#101623] border border-[#1e293b] rounded-2xl p-6">
            <div className="flex justify-between items-baseline mb-4">
              <h4 className="font-bold text-white">{metaDestaque.nome}</h4>
              {progressoMetaDestaque.prazoEncerrado && <span className="text-xs text-rose-400 font-semibold">Prazo encerrado</span>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex justify-between items-baseline mb-1.5">
                  <span className="text-xs text-slate-400">{progressoMetaDestaque.progressoPct.toFixed(0)}% concluído</span>
                  <CurrencyValue value={progressoMetaDestaque.valorAcumulado} size="lg" className="font-bold min-w-0 text-white" />
                </div>
                <div className="w-full bg-[#1e293b] h-2 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${progressoMetaDestaque.progressoPct}%` }} />
                </div>
                <p className="text-xs text-slate-500">
                  Faltam {formatarMoeda(progressoMetaDestaque.valorRestante)} de {formatarMoeda(progressoMetaDestaque.valorMeta)}
                  {progressoMetaDestaque.diasRestantes != null && !progressoMetaDestaque.prazoEncerrado && ` · ${progressoMetaDestaque.diasRestantes} dia(s) restante(s)`}
                </p>
              </div>

              <div className="space-y-1.5">
                {progressoMetaDestaque.ritmoNecessario != null && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 flex items-center gap-1"><Clock size={12} /> Ritmo necessário</span>
                    <span className="text-slate-300 font-medium">{formatarMoeda(progressoMetaDestaque.ritmoNecessario)}/dia</span>
                  </div>
                )}
                {progressoMetaDestaque.ritmoAtual != null && progressoMetaDestaque.ritmoAtual > 0 ? (
                  <>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 flex items-center gap-1"><PiggyBank size={12} /> Ritmo atual</span>
                      <span className="text-slate-300 font-medium">{formatarMoeda(progressoMetaDestaque.ritmoAtual)}/dia</span>
                    </div>
                    {progressoMetaDestaque.diferencaPct != null && (
                      <p className={`text-xs font-semibold ${progressoMetaDestaque.diferencaPct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {progressoMetaDestaque.diferencaPct >= 0 ? 'Acima' : 'Abaixo'} do ritmo necessário ({progressoMetaDestaque.diferencaPct >= 0 ? '+' : ''}{progressoMetaDestaque.diferencaPct.toFixed(0)}%)
                      </p>
                    )}
                    {progressoMetaDestaque.dataPrevista && (
                      <p className="text-xs text-slate-500">
                        Previsão: {progressoMetaDestaque.dataPrevista.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-xs text-slate-500">
                    {progressoMetaDestaque.temAporte ? 'Sem ritmo recente (nenhum aporte nos últimos 30 dias)' : 'Registre um aporte para ver seu ritmo'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="h-px bg-[#1e293b]" />

      {/* ── ORÇAMENTO POR CATEGORIA (Fase 1) ── */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
            <PieChart size={16} className="text-slate-500" /> Orçamento por categoria
          </h3>
          <Link to="/capital/orcamento" className="text-xs text-slate-500 hover:text-indigo-400 transition-colors flex items-center gap-1">
            Ver todas <ArrowRight size={12} />
          </Link>
        </div>

        {progressoCategorias.length === 0 ? (
          <div className="border border-dashed border-[#1e293b] rounded-xl p-6 text-center">
            <p className="text-slate-500 text-sm mb-3">Nenhum limite por categoria definido ainda.</p>
            <Link to="/capital/orcamento" className="text-sm text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center gap-1">
              Definir limites por categoria <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {progressoCategorias.slice(0, 3).map((c) => (
              <div key={c.categoria} className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-slate-400 text-sm">{c.categoria}</span>
                  <span className="font-semibold text-white tabular-nums">{formatarMoeda(c.gasto)}</span>
                </div>
                <div className="w-full bg-[#1e293b] h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-700 ${c.estado === 'estourado' ? 'bg-rose-500' : c.estado === 'alerta' ? 'bg-amber-500' : 'bg-emerald-400'}`}
                    style={{ width: `${Math.min(100, c.pct)}%` }}
                  />
                </div>
                <p className={`text-xs ${c.estado === 'estourado' ? 'text-rose-400' : c.estado === 'alerta' ? 'text-amber-400' : 'text-slate-500'}`}>
                  {c.pct.toFixed(0)}% de {formatarMoeda(c.limite)}
                  {c.estado === 'estourado' && ' · ultrapassou o limite'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="h-px bg-[#1e293b]" />

      {/* ── COMPARAÇÃO COM O MÊS ANTERIOR (Fase 1) ── */}
      <div>
        <h3 className="text-sm font-semibold text-slate-300 mb-6">Comparação com o mês anterior</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div>
            <p className="text-xs uppercase font-semibold tracking-widest text-slate-500 mb-1">Gasto total</p>
            {variacaoGastoPct != null ? (
              <p className={`text-sm font-medium flex items-center gap-1.5 ${variacaoGastoPct <= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {variacaoGastoPct <= 0 ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
                {variacaoGastoPct >= 0 ? '+' : ''}{variacaoGastoPct.toFixed(0)}% vs. {formatarMoeda(gastoMesAnterior)} no mês anterior
              </p>
            ) : (
              <p className="text-sm text-slate-500">Sem dado do mês anterior</p>
            )}
          </div>
          <div>
            <p className="text-xs uppercase font-semibold tracking-widest text-slate-500 mb-1">Economia</p>
            {variacaoEconomiaPct != null ? (
              <p className={`text-sm font-medium flex items-center gap-1.5 ${variacaoEconomiaPct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {variacaoEconomiaPct >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {variacaoEconomiaPct >= 0 ? '+' : ''}{variacaoEconomiaPct.toFixed(0)}% vs. mês anterior
              </p>
            ) : (
              <p className="text-sm text-slate-500">Sem dado do mês anterior</p>
            )}
          </div>
        </div>
      </div>

      <div className="h-px bg-[#1e293b]" />

      {/* ── MAIORES DESPESAS DO MÊS ── */}
      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
          <h3 className="text-sm font-semibold text-slate-300">Maiores despesas no mês</h3>
          {maioresGastos.length > 0 && maioresGastos[0].valor > totalEntradasMes * 0.5 && (
            <div className="flex items-center gap-1.5 text-rose-400 text-xs font-medium">
              <AlertTriangle size={13} /> Gasto elevado em {maioresGastos[0].categoria}
            </div>
          )}
        </div>

        {maioresGastos.length === 0 ? (
          <div className="border border-dashed border-[#1e293b] rounded-xl p-6 text-center">
            <p className="text-slate-500 text-sm mb-3">Nenhuma despesa registrada neste mês.</p>
            <Link to="/capital/transacoes" className="text-sm text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center gap-1">
              Lançar uma transação <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {maioresGastos.map((gasto, index) => {
              const limiteEstimado = Math.max(gasto.valor * 1.2, 1000);
              const cores = ['bg-rose-500', 'bg-amber-500', 'bg-indigo-400'];
              return (
                <LimitCard
                  key={gasto.categoria}
                  label={gasto.categoria}
                  atual={gasto.valor}
                  limite={limiteEstimado}
                  color={cores[index % 3]}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Estado especial: usuário sem nenhuma conta cadastrada ainda */}
      {contas.length === 0 && (
        <div className="border border-dashed border-[#1e293b] rounded-xl p-8 text-center">
          <Wallet size={22} className="text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 text-sm mb-3">Cadastre sua primeira conta para começar a ver seu saldo aqui.</p>
          <Link to="/capital/contas" className="text-sm text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center gap-1">
            Cadastrar conta <ArrowRight size={14} />
          </Link>
        </div>
      )}
    </div>
  );
}

function LimitCard({ label, atual, limite, color }) {
  const porcentagem = (atual / limite) * 100;

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-baseline">
        <span className="text-slate-400 text-sm">{label}</span>
        <span className="font-semibold text-white tabular-nums">{formatarMoeda(atual)}</span>
      </div>
      <div className="w-full bg-[#1e293b] h-1.5 rounded-full overflow-hidden">
        <div className={`h-full ${color} transition-all duration-700`} style={{ width: `${porcentagem > 100 ? 100 : porcentagem}%` }} />
      </div>
    </div>
  );
}