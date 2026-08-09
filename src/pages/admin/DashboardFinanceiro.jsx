import React, { useState, useEffect } from 'react';
import { TrendingUp, Activity, Wallet, Target, AlertTriangle } from 'lucide-react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../services/firebase';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
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

  if (loading) {
    return <div className="h-[80vh] flex items-center justify-center"><LoadingSpinner size="lg" color="text-indigo-500" /></div>;
  }

  return (
    <div className="space-y-6">
      {/* HEADER: Boas-vindas e Saldo Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <div className="lg:col-span-2 flex flex-col justify-center">
    
    {/* Substitua o h1 por este aqui: */}
    <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
  Olá, {userProfile && userProfile.nome ? userProfile.nome.split(' ')[0] : 'Investidor'}
</h1>
    
    <p className="text-slate-400">Acompanhe a evolução real do seu capital.</p>
  </div>
        {/* Card Saldo Disponível */}
        <div className="bg-[#101623] p-6 rounded-2xl border border-[#1e293b] shadow-lg flex flex-col justify-center relative overflow-hidden group hover:border-indigo-500/50 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity group-hover:scale-110 duration-500"><Wallet size={80} /></div>
          <p className="text-slate-400 text-xs uppercase font-bold tracking-widest mb-1">Saldo Disponível</p>
          <h2 className="text-4xl font-black text-indigo-400">{formatarMoeda(saldoDisponivel)}</h2>
          <div className={`mt-2 text-xs font-medium flex items-center gap-1 ${fluxoPositivo ? 'text-emerald-400' : 'text-rose-400'}`}>
            <TrendingUp size={14} className={!fluxoPositivo ? "rotate-180" : ""} /> 
            {fluxoPositivo ? 'Fluxo positivo este mês' : 'Fluxo negativo este mês'}
          </div>
        </div>
      </div>

      {/* SESSÃO 2: Investimentos e Metas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Gráfico de Investimentos */}
        <div className="lg:col-span-2 bg-[#101623] p-6 rounded-2xl border border-[#1e293b] relative overflow-hidden">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-slate-400 text-sm font-medium mb-1">Total Investido</p>
              <h3 className="text-3xl font-bold text-emerald-400">{formatarMoeda(totalInvestido)}</h3>
            </div>
            <div className="bg-emerald-500/10 text-emerald-400 p-3 rounded-xl">
              <TrendingUp size={24} />
            </div>
          </div>
          
          {/* Barras Decorativas (A IA gerará gráficos reais no futuro) */}
          <div className="h-32 border-b border-[#1e293b] flex items-end gap-3 px-2">
             {[30, 50, 40, 70, 60, 85, Math.max(10, Math.min(100, (totalInvestido/10000)*100))].map((h, i) => (
               <div key={i} className="flex-1 bg-indigo-500/20 hover:bg-indigo-500 transition-colors rounded-t-md cursor-pointer" style={{height: `${h}%`}}></div>
             ))}
          </div>
        </div>

        {/* Suas Metas (Ciclos) */}
        <div className="space-y-6">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Target size={16} /> Suas Metas
          </h3>
          
          {ciclos.length === 0 ? (
            <div className="bg-[#101623] p-6 rounded-2xl border border-[#1e293b] text-center text-slate-500 text-sm">
              Nenhuma meta ou ciclo cadastrado.
            </div>
          ) : (
            ciclos.slice(0, 2).map((ciclo, index) => {
              // Calcular gasto atual do ciclo (simplificado para o card)
              const gasto = transacoes
                .filter(t => t.tipo === 'saida' && t.data >= ciclo.inicio && t.data <= ciclo.fim)
                .reduce((acc, t) => acc + (parseFloat(t.valor) || 0), 0);
              const porcentagem = Math.min(100, (gasto / ciclo.orcamento) * 100);
              const isPrimeiro = index === 0;

              return (
                <div key={ciclo.id} className={`${isPrimeiro ? 'bg-indigo-600 shadow-indigo-900/50 shadow-lg text-white' : 'bg-[#101623] border border-[#1e293b] text-slate-200'} p-6 rounded-2xl`}>
                  <div className="flex justify-between items-start mb-4">
                    <h4 className={`font-bold ${isPrimeiro ? 'text-white' : 'text-slate-200'} text-sm`}>{ciclo.nome}</h4>
                    <span className={`text-xs ${isPrimeiro ? 'text-indigo-200' : 'text-slate-400'}`}>Teto: {formatarMoeda(ciclo.orcamento)}</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className={`text-xl font-bold ${isPrimeiro ? 'text-white' : 'text-white'}`}>Utilizado: {formatarMoeda(gasto)}</span>
                  </div>
                  <div className={`w-full ${isPrimeiro ? 'bg-indigo-950/30' : 'bg-[#1e293b]'} h-2 rounded-full mt-3 overflow-hidden`}>
                    <div className={`${isPrimeiro ? 'bg-white' : 'bg-indigo-400'} h-full rounded-full transition-all`} style={{width: `${porcentagem}%`}}></div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* SESSÃO 3: Maiores Gastos do Mês */}
      <div className="bg-[#101623] p-6 rounded-2xl border border-[#1e293b]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Activity size={20} className="text-indigo-400" /> Maiores Despesas no Mês
          </h3>
          {maioresGastos.length > 0 && maioresGastos[0].valor > totalEntradasMes * 0.5 && (
            <div className="flex items-center gap-2 text-rose-400 bg-rose-400/10 px-3 py-1.5 rounded-lg text-xs font-bold w-fit">
              <AlertTriangle size={14} /> Alerta: Gasto elevado em {maioresGastos[0].categoria}
            </div>
          )}
        </div>
        
        {maioresGastos.length === 0 ? (
          <div className="text-center text-slate-500 py-4">Nenhuma despesa registrada neste mês.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {maioresGastos.map((gasto, index) => {
              // Assumindo um limite fixo para as barras apenas para ter o efeito visual.
              // O ideal é vincular ao limite do ciclo, mas aqui usamos uma média visual.
              const limiteEstimado = Math.max(gasto.valor * 1.2, 1000); 
              const cores = ['bg-rose-500', 'bg-warning', 'bg-indigo-400'];
              
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

    </div>
  );
}

function LimitCard({ label, atual, limite, color }) {
  const porcentagem = (atual / limite) * 100;
  const format = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
  
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end">
        <span className="text-slate-400 text-sm font-medium">{label}</span>
        <span className="font-bold text-white">{format(atual)}</span>
      </div>
      <div className="w-full bg-[#1e293b] h-2 rounded-full overflow-hidden">
        <div className={`h-full ${color} transition-all duration-1000`} style={{width: `${porcentagem > 100 ? 100 : porcentagem}%`}}></div>
      </div>
      {/* Removemos a exibição do texto do limite estimado, focando apenas no gasto visual */}
    </div>
  );
}