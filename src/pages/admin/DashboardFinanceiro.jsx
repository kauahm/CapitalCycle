import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, AlertTriangle, ArrowRight, Target, Wallet } from 'lucide-react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../services/firebase';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import CurrencyValue from '../../components/ui/CurrencyValue';
import { useAuth } from '../../hooks/useAuth';

export default function DashboardFinanceiro() {
  const { userProfile, currentUser } = useAuth();
  const [loading, setLoading] = useState(true);

  const [contas, setContas] = useState([]);
  const [transacoes, setTransacoes] = useState([]);
  const [ciclos, setCiclos] = useState([]);

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

    return () => {
      unsubContas();
      unsubTransacoes();
      unsubCiclos();
    };
  }, [currentUser]);

  // Formatador de Moeda
  const formatarMoeda = (valor) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor || 0);

  // ==========================================
  // CÁLCULOS DINÂMICOS COM OS DADOS REAIS
  // (mesma lógica de antes — apenas a apresentação visual mudou)
  // ==========================================

  // 1. Saldos
  const saldoDisponivel = contas
    .filter(c => c.tipo !== 'Investimentos')
    .reduce((acc, c) => acc + (parseFloat(c.saldo) || 0), 0);

  const totalInvestido = contas
    .filter(c => c.tipo === 'Investimentos')
    .reduce((acc, c) => acc + (parseFloat(c.saldo) || 0), 0);

  // 2. Gastos do Mês Atual por Categoria
  const dataAtual = new Date();
  const mesAtualPrefixo = `${dataAtual.getFullYear()}-${String(dataAtual.getMonth() + 1).padStart(2, '0')}`;

  const gastosPorCategoria = transacoes
    .filter(t => t.tipo === 'saida' && t.data && t.data.startsWith(mesAtualPrefixo))
    .reduce((acc, t) => {
      acc[t.categoria] = (acc[t.categoria] || 0) + (parseFloat(t.valor) || 0);
      return acc;
    }, {});

  // Transformar o objeto em um array ordenado pelos maiores gastos
  const maioresGastos = Object.entries(gastosPorCategoria)
    .map(([categoria, valor]) => ({ categoria, valor }))
    .sort((a, b) => b.valor - a.valor)
    .slice(0, 3); // Pegar os 3 maiores

  // Calcular o total de entradas e saídas do mês para a porcentagem (Exemplo de Fluxo)
  const totalEntradasMes = transacoes
    .filter(t => t.tipo === 'entrada' && t.data && t.data.startsWith(mesAtualPrefixo))
    .reduce((acc, t) => acc + (parseFloat(t.valor) || 0), 0);

  const totalSaidasMes = Object.values(gastosPorCategoria).reduce((a, b) => a + b, 0);
  const fluxoPositivo = totalEntradasMes >= totalSaidasMes;
  const diferencaMes = totalEntradasMes - totalSaidasMes;

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
          <p className="text-sm text-slate-500 mb-4">Olá, {primeiroNome}. Aqui está o resumo do seu capital.</p>
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
  const format = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-baseline">
        <span className="text-slate-400 text-sm">{label}</span>
        <span className="font-semibold text-white tabular-nums">{format(atual)}</span>
      </div>
      <div className="w-full bg-[#1e293b] h-1.5 rounded-full overflow-hidden">
        <div className={`h-full ${color} transition-all duration-700`} style={{ width: `${porcentagem > 100 ? 100 : porcentagem}%` }} />
      </div>
    </div>
  );
}