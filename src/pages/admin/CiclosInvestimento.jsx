import React, { useState, useEffect } from 'react';
import { Plus, Target, Calendar, Trash2, X, PieChart, TrendingUp } from 'lucide-react';
import { collection, onSnapshot, addDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../../services/firebase';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function CiclosInvestimento() {
  const [ciclos, setCiclos] = useState([]);
  const [transacoes, setTransacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    nome: '',
    tipo: 'Orçamento', // Pode ser 'Orçamento' ou 'Meta'
    orcamento: '',
    inicio: '',
    fim: ''
  });

  useEffect(() => {
    // 1. Buscar as Metas e Ciclos
    const qCiclos = query(collection(db, 'ciclos'), orderBy('fim', 'asc'));
    const unsubCiclos = onSnapshot(qCiclos, (snapshot) => {
      setCiclos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // 2. Buscar Transações para calcular as barras de progresso
    const unsubTransacoes = onSnapshot(collection(db, 'transactions'), (snapshot) => {
      setTransacoes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => {
      unsubCiclos();
      unsubTransacoes();
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'ciclos'), {
        ...formData,
        orcamento: parseFloat(formData.orcamento) || 0,
        criadoEm: new Date()
      });
      setIsModalOpen(false);
      setFormData({ nome: '', tipo: 'Orçamento', orcamento: '', inicio: '', fim: '' });
    } catch (error) {
      console.error("Erro ao adicionar ciclo: ", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Deseja realmente excluir esta meta/orçamento?")) {
      await deleteDoc(doc(db, 'ciclos', id));
    }
  };

  const formatarMoeda = (valor) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  const formatarData = (dataStr) => dataStr ? dataStr.split('-').reverse().join('/') : '';

  if (loading) return <div className="h-[80vh] flex items-center justify-center"><LoadingSpinner size="lg" color="text-indigo-500" /></div>;

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Ciclos e Metas</h1>
          <p className="text-slate-400 text-sm">Defina seus orçamentos mensais e acompanhe seus grandes objetivos.</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-lg shadow-indigo-600/20"
        >
          <Plus size={18} /> Novo Objetivo
        </button>
      </div>

      {/* LISTA DE METAS E ORÇAMENTOS */}
      {ciclos.length === 0 ? (
        <div className="bg-[#101623] border border-[#1e293b] rounded-3xl p-12 text-center">
          <Target size={48} className="mx-auto text-slate-600 mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">Nenhum ciclo ativo</h3>
          <p className="text-slate-400">Crie um orçamento para o mês ou uma meta financeira (ex: Reserva de Emergência).</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {ciclos.map((ciclo) => {
            // LÓGICA DO PROGRESSO: Soma as transações que caem dentro do período da meta
            const transacoesFiltradas = transacoes.filter(t => t.data >= ciclo.inicio && t.data <= ciclo.fim);
            
            let valorAtual = 0;
            if (ciclo.tipo === 'Orçamento') {
              // Orçamento: Soma as SAÍDAS
              valorAtual = transacoesFiltradas.filter(t => t.tipo === 'saida').reduce((acc, t) => acc + (parseFloat(t.valor) || 0), 0);
            } else {
              // Meta: Soma as ENTRADAS (ou dinheiro guardado para essa meta - lógica simplificada)
              valorAtual = transacoesFiltradas.filter(t => t.tipo === 'entrada').reduce((acc, t) => acc + (parseFloat(t.valor) || 0), 0);
            }

            const porcentagem = Math.min(100, (valorAtual / ciclo.orcamento) * 100);
            const isEstourado = ciclo.tipo === 'Orçamento' && porcentagem >= 100;

            return (
              <div key={ciclo.id} className="bg-[#101623] border border-[#1e293b] p-6 rounded-3xl relative overflow-hidden group hover:border-indigo-500/30 transition-colors">
                
                <button 
                  onClick={() => handleDelete(ciclo.id)}
                  className="absolute top-4 right-4 text-slate-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity bg-[#070b14] p-2 rounded-lg"
                  title="Excluir"
                >
                  <Trash2 size={16} />
                </button>

                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-3 rounded-xl ${ciclo.tipo === 'Meta' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                    {ciclo.tipo === 'Meta' ? <Target size={20} /> : <PieChart size={20} />}
                  </div>
                  <div>
                    <h3 className="text-white font-bold">{ciclo.nome}</h3>
                    <span className="text-xs text-slate-400">{ciclo.tipo}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 mb-6 font-medium">
                  <Calendar size={14} />
                  {formatarData(ciclo.inicio)} até {formatarData(ciclo.fim)}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-slate-400 text-xs uppercase font-bold tracking-wider">
                      {ciclo.tipo === 'Orçamento' ? 'Gasto' : 'Acumulado'}
                    </span>
                    <span className={`font-bold ${isEstourado ? 'text-rose-400' : 'text-white'}`}>
                      {formatarMoeda(valorAtual)}
                    </span>
                  </div>
                  
                  <div className="w-full bg-[#1e293b] h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${ciclo.tipo === 'Meta' ? 'bg-indigo-500' : isEstourado ? 'bg-rose-500' : 'bg-emerald-400'}`} 
                      style={{width: `${porcentagem}%`}}
                    ></div>
                  </div>
                  
                  <p className="text-xs text-slate-500 text-right">
                    Alvo: {formatarMoeda(ciclo.orcamento)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL NOVO CICLO */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#101623] border border-[#1e293b] rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-[#1e293b] flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Novo Ciclo / Meta</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              
              <div className="flex p-1 bg-[#070b14] rounded-xl border border-[#1e293b]">
                <button type="button" onClick={() => setFormData({ ...formData, tipo: 'Orçamento' })} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${formData.tipo === 'Orçamento' ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-white'}`}>
                  Orçamento Mensal
                </button>
                <button type="button" onClick={() => setFormData({ ...formData, tipo: 'Meta' })} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${formData.tipo === 'Meta' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>
                  Meta / Viagem
                </button>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Nome do Objetivo</label>
                <input required type="text" value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} className="w-full bg-[#070b14] border border-[#1e293b] rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none" placeholder={formData.tipo === 'Meta' ? "Ex: Viagem Japão" : "Ex: Orçamento de Junho"} />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Valor Alvo/Limite (R$)</label>
                <input required type="number" step="0.01" value={formData.orcamento} onChange={e => setFormData({...formData, orcamento: e.target.value})} className="w-full bg-[#070b14] border border-[#1e293b] rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none" placeholder="0,00" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Data de Início</label>
                  <input required type="date" value={formData.inicio} onChange={e => setFormData({...formData, inicio: e.target.value})} className="w-full bg-[#070b14] border border-[#1e293b] rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none [color-scheme:dark]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Data Final</label>
                  <input required type="date" value={formData.fim} onChange={e => setFormData({...formData, fim: e.target.value})} className="w-full bg-[#070b14] border border-[#1e293b] rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none [color-scheme:dark]" />
                </div>
              </div>

              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-colors mt-4">
                Salvar {formData.tipo}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}