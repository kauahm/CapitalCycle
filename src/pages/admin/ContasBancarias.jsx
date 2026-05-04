import React, { useState, useEffect } from 'react';
import { Plus, Landmark, Wallet, TrendingUp, Trash2, X, Building2 } from 'lucide-react';
import { collection, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function ContasBancarias() {
  const [contas, setContas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    nome: '',
    banco: '',
    tipo: 'Corrente',
    saldo: ''
  });

  const tiposConta = ['Corrente', 'Poupança', 'Investimentos', 'Carteira Física'];

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'accounts'), (snapshot) => {
      setContas(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'accounts'), {
        ...formData,
        saldo: parseFloat(formData.saldo) || 0,
        criadoEm: new Date()
      });
      setIsModalOpen(false);
      setFormData({ nome: '', banco: '', tipo: 'Corrente', saldo: '' });
    } catch (error) {
      console.error("Erro ao adicionar conta: ", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Atenção: Excluir esta conta NÃO exclui as transações vinculadas a ela. Deseja continuar?")) {
      await deleteDoc(doc(db, 'accounts', id));
    }
  };

  const formatarMoeda = (valor) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);

  // Função para escolher o ícone e a cor baseada no tipo de conta
  const getEstiloConta = (tipo) => {
    switch(tipo) {
      case 'Investimentos': return { icon: TrendingUp, cor: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'hover:border-indigo-500/50' };
      case 'Carteira Física': return { icon: Wallet, cor: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'hover:border-emerald-500/50' };
      case 'Poupança': return { icon: Building2, cor: 'text-blue-400', bg: 'bg-blue-500/10', border: 'hover:border-blue-500/50' };
      default: return { icon: Landmark, cor: 'text-slate-200', bg: 'bg-slate-700/30', border: 'hover:border-slate-500/50' };
    }
  };

  if (loading) return <div className="h-[80vh] flex items-center justify-center"><LoadingSpinner size="lg" color="text-indigo-500" /></div>;

  const totalGeral = contas.reduce((acc, c) => acc + (parseFloat(c.saldo) || 0), 0);

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Contas e Caixas</h1>
          <p className="text-slate-400 text-sm">Gerencie de onde o dinheiro sai e para onde vai.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block mr-4">
            <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Patrimônio Total</p>
            <p className="text-xl font-black text-emerald-400">{formatarMoeda(totalGeral)}</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-lg shadow-indigo-600/20"
          >
            <Plus size={18} /> Nova Conta
          </button>
        </div>
      </div>

      {/* GRID DE CARTÕES DE CONTA */}
      {contas.length === 0 ? (
        <div className="bg-[#101623] border border-[#1e293b] rounded-3xl p-12 text-center">
          <Landmark size={48} className="mx-auto text-slate-600 mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">Nenhuma conta cadastrada</h3>
          <p className="text-slate-400">Adicione sua primeira conta bancária ou carteira para começar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {contas.map((conta) => {
            const Estilo = getEstiloConta(conta.tipo);
            const Icone = Estilo.icon;

            return (
              <div key={conta.id} className={`bg-[#101623] border border-[#1e293b] p-6 rounded-3xl relative overflow-hidden group transition-all duration-300 ${Estilo.border}`}>
                
                {/* Botão Excluir (Aparece no Hover) */}
                <button 
                  onClick={() => handleDelete(conta.id)}
                  className="absolute top-4 right-4 text-slate-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity bg-[#070b14] p-2 rounded-lg"
                  title="Excluir Conta"
                >
                  <Trash2 size={16} />
                </button>

                <div className="flex items-center gap-4 mb-6">
                  <div className={`p-4 rounded-2xl ${Estilo.bg} ${Estilo.cor}`}>
                    <Icone size={28} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{conta.nome}</h3>
                    <p className="text-sm text-slate-400">{conta.banco} • {conta.tipo}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Saldo Atual</p>
                  <h2 className={`text-3xl font-black ${Estilo.cor}`}>{formatarMoeda(conta.saldo)}</h2>
                </div>
                
                {/* Efeito visual decorativo no fundo do card */}
                <div className="absolute -bottom-6 -right-6 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-500">
                  <Icone size={120} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL DE NOVA CONTA */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#101623] border border-[#1e293b] rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-[#1e293b] flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Adicionar Conta</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Nome (Apelido)</label>
                <input required type="text" value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} className="w-full bg-[#070b14] border border-[#1e293b] rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none" placeholder="Ex: Reserva Nu" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Instituição/Banco</label>
                  <input required type="text" value={formData.banco} onChange={e => setFormData({...formData, banco: e.target.value})} className="w-full bg-[#070b14] border border-[#1e293b] rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none" placeholder="Ex: Nubank" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Tipo de Conta</label>
                  <select required value={formData.tipo} onChange={e => setFormData({...formData, tipo: e.target.value})} className="w-full bg-[#070b14] border border-[#1e293b] rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none">
                    {tiposConta.map(tipo => <option key={tipo} value={tipo}>{tipo}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Saldo Inicial (R$)</label>
                <input required type="number" step="0.01" value={formData.saldo} onChange={e => setFormData({...formData, saldo: e.target.value})} className="w-full bg-[#070b14] border border-[#1e293b] rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none" placeholder="0,00" />
              </div>

              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-colors mt-4">
                Salvar Conta
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}