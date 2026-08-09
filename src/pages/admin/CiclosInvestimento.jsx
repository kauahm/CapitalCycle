import React, { useState, useEffect } from 'react';
import { Plus, Target, Calendar, Trash2, Pencil, X, PieChart, TrendingUp } from 'lucide-react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '../../services/firebase';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import CurrencyValue from '../../components/ui/CurrencyValue';
import UpgradeModal from '../../components/ui/UpgradeModal';
import { canAddCiclo, getLimits } from '../../components/ui/plans';
import { useAuth } from '../../hooks/useAuth';

export default function CiclosInvestimento() {
  const { currentUser, userProfile } = useAuth();
  const [ciclos, setCiclos] = useState([]);
  const [transacoes, setTransacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  const [formData, setFormData] = useState({
    nome: '',
    tipo: 'Orçamento', // Pode ser 'Orçamento' ou 'Meta'
    orcamento: '',
    inicio: '',
    fim: ''
  });

  // Trava por plano: plano Jovem permite até 2 ciclos em andamento
  const planId = userProfile?.plan || 'jovem';
  const hojeStr = (() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  })();
  const ciclosAtivos = ciclos.filter((c) => !c.fim || c.fim >= hojeStr).length;
  const limiteCiclos = getLimits(planId).ciclosAtivos;

  useEffect(() => {
    if (!currentUser) return;

    // 1. Buscar as Metas e Ciclos do usuário logado
    const qCiclos = query(
      collection(db, 'ciclos'),
      where('uid', '==', currentUser.uid)
    );
    const unsubCiclos = onSnapshot(qCiclos, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      docs.sort((a, b) => (a.fim || '').localeCompare(b.fim || ''));
      setCiclos(docs);
    });

    // 2. Buscar Transações do usuário logado para calcular as barras de progresso
    const qTransacoes = query(collection(db, 'transactions'), where('uid', '==', currentUser.uid));
    const unsubTransacoes = onSnapshot(qTransacoes, (snapshot) => {
      setTransacoes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => {
      unsubCiclos();
      unsubTransacoes();
    };
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Trava por plano: não cria ciclo além do limite do plano Jovem
    if (!editingId && !canAddCiclo(planId, ciclosAtivos)) {
      setUpgradeOpen(true);
      return;
    }

    try {
      const dados = {
        ...formData,
        orcamento: parseFloat(formData.orcamento) || 0,
      };

      if (editingId) {
        await updateDoc(doc(db, 'ciclos', editingId), dados);
      } else {
        await addDoc(collection(db, 'ciclos'), {
          ...dados,
          uid: currentUser.uid,
          criadoEm: new Date()
        });
      }
      closeModal();
    } catch (error) {
      console.error("Erro ao salvar ciclo: ", error);
    }
  };

  const handleEdit = (ciclo) => {
    setFormData({
      nome: ciclo.nome || '',
      tipo: ciclo.tipo || 'Orçamento',
      orcamento: String(ciclo.orcamento ?? ''),
      inicio: ciclo.inicio || '',
      fim: ciclo.fim || ''
    });
    setEditingId(ciclo.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ nome: '', tipo: 'Orçamento', orcamento: '', inicio: '', fim: '' });
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

        <div className="flex items-center gap-3">
          {limiteCiclos != null && (
            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap bg-[#101623] border border-[#1e293b] px-3 py-2 rounded-xl">
              {ciclosAtivos}/{limiteCiclos} em andamento
            </span>
          )}
          <button
            onClick={() => {
              if (!canAddCiclo(planId, ciclosAtivos)) { setUpgradeOpen(true); return; }
              setEditingId(null); setIsModalOpen(true);
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-lg shadow-indigo-600/20"
          >
            <Plus size={18} /> Novo Objetivo
          </button>
        </div>
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
                
                <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleEdit(ciclo)}
                    className="text-slate-600 hover:text-indigo-400 bg-[#070b14] p-2 rounded-lg"
                    title="Editar"
                  >
                    <Pencil size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(ciclo.id)}
                    className="text-slate-600 hover:text-rose-400 bg-[#070b14] p-2 rounded-lg"
                    title="Excluir"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

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
                  <div className="flex justify-between items-end gap-3">
                    <span className="text-slate-400 text-xs uppercase font-bold tracking-wider whitespace-nowrap">
                      {ciclo.tipo === 'Orçamento' ? 'Gasto' : 'Acumulado'}
                    </span>
                    <CurrencyValue value={valorAtual} size="lg" className={`font-bold min-w-0 ${isEstourado ? 'text-rose-400' : 'text-white'}`} />
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
              <h2 className="text-xl font-bold text-white">{editingId ? 'Editar Ciclo / Meta' : 'Novo Ciclo / Meta'}</h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-white">
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
                {editingId ? 'Salvar Alterações' : `Salvar ${formData.tipo}`}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal de upgrade */}
      <UpgradeModal feature="ciclos" open={upgradeOpen} onClose={() => setUpgradeOpen(false)} />
    </div>
  );
}