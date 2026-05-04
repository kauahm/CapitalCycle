import React, { useState, useEffect } from 'react';
import { Plus, ArrowUpCircle, ArrowDownCircle, Trash2, Search, Filter, X } from 'lucide-react';
import { collection, onSnapshot, addDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../../services/firebase';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function Transacoes() {
  const [transacoes, setTransacoes] = useState([]);
  const [contas, setContas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Estados do formulário
  const [formData, setFormData] = useState({
    descricao: '',
    valor: '',
    tipo: 'saida', // entrada ou saida
    categoria: 'Alimentação',
    conta_id: '',
    data: new Date().toISOString().split('T')[0]
  });

  // Categorias predefinidas
  const categorias = {
    entrada: ['Salário', 'Investimento', 'Rendimento', 'Venda', 'Outros'],
    saida: ['Alimentação', 'Moradia', 'Transporte', 'Saúde', 'Lazer', 'Educação', 'Outros']
  };

  useEffect(() => {
    // Buscar Contas (para o select do formulário)
    const unsubContas = onSnapshot(collection(db, 'accounts'), (snapshot) => {
      setContas(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Buscar Transações (ordenadas das mais recentes para as mais antigas)
    const qTransacoes = query(collection(db, 'transactions'), orderBy('data', 'desc'));
    const unsubTransacoes = onSnapshot(qTransacoes, (snapshot) => {
      setTransacoes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => {
      unsubContas();
      unsubTransacoes();
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'transactions'), {
        ...formData,
        valor: parseFloat(formData.valor),
        criadoEm: new Date()
      });
      setIsModalOpen(false);
      setFormData({ ...formData, descricao: '', valor: '' }); // Limpa o form
    } catch (error) {
      console.error("Erro ao adicionar transação: ", error);
      alert("Erro ao salvar transação.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta transação?")) {
      await deleteDoc(doc(db, 'transactions', id));
    }
  };

  const formatarMoeda = (valor) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  const formatarData = (dataStr) => {
    const [ano, mes, dia] = dataStr.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  // Filtro de busca simples
  const transacoesFiltradas = transacoes.filter(t => 
    t.descricao.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="h-[80vh] flex items-center justify-center"><LoadingSpinner size="lg" color="text-indigo-500" /></div>;

  return (
    <div className="space-y-6">
      
      {/* HEADER E BARRA DE BUSCA */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Transações</h1>
          <p className="text-slate-400 text-sm">Gerencie suas entradas e saídas.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Buscar..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#101623] border border-[#1e293b] rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2 whitespace-nowrap shadow-lg shadow-indigo-600/20"
          >
            <Plus size={18} />
            Nova
          </button>
        </div>
      </div>

      {/* LISTA DE TRANSAÇÕES (ESTILO EXTRATO) */}
      <div className="bg-[#101623] border border-[#1e293b] rounded-3xl overflow-hidden">
        {transacoesFiltradas.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            Nenhuma transação encontrada.
          </div>
        ) : (
          <div className="divide-y divide-[#1e293b]">
            {transacoesFiltradas.map((t) => (
              <div key={t.id} className="p-4 md:p-5 flex items-center justify-between hover:bg-[#151d2d] transition-colors group">
                
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${t.tipo === 'entrada' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                    {t.tipo === 'entrada' ? <ArrowUpCircle size={24} /> : <ArrowDownCircle size={24} />}
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{t.descricao}</h4>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                      <span className="bg-[#1e293b] px-2 py-0.5 rounded-md">{t.categoria}</span>
                      <span>•</span>
                      <span>{formatarData(t.data)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className={`font-bold ${t.tipo === 'entrada' ? 'text-emerald-400' : 'text-white'}`}>
                    {t.tipo === 'entrada' ? '+ ' : '- '}{formatarMoeda(t.valor)}
                  </span>
                  <button 
                    onClick={() => handleDelete(t.id)}
                    className="text-slate-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all p-2"
                    title="Excluir"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL DE NOVA TRANSAÇÃO */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#101623] border border-[#1e293b] rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-[#1e293b] flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Nova Transação</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Tipo (Toggle) */}
              <div className="flex p-1 bg-[#070b14] rounded-xl border border-[#1e293b]">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, tipo: 'saida', categoria: categorias.saida[0] })}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${formData.tipo === 'saida' ? 'bg-rose-500 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  Saída
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, tipo: 'entrada', categoria: categorias.entrada[0] })}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${formData.tipo === 'entrada' ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  Entrada
                </button>
              </div>

              {/* Descrição e Valor */}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-400 mb-1">Descrição</label>
                  <input required type="text" value={formData.descricao} onChange={e => setFormData({...formData, descricao: e.target.value})} className="w-full bg-[#070b14] border border-[#1e293b] rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none" placeholder="Ex: Supermercado" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Valor (R$)</label>
                  <input required type="number" step="0.01" min="0" value={formData.valor} onChange={e => setFormData({...formData, valor: e.target.value})} className="w-full bg-[#070b14] border border-[#1e293b] rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none" placeholder="0,00" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Data</label>
                  <input required type="date" value={formData.data} onChange={e => setFormData({...formData, data: e.target.value})} className="w-full bg-[#070b14] border border-[#1e293b] rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none [color-scheme:dark]" />
                </div>
              </div>

              {/* Conta e Categoria */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Categoria</label>
                  <select required value={formData.categoria} onChange={e => setFormData({...formData, categoria: e.target.value})} className="w-full bg-[#070b14] border border-[#1e293b] rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none">
                    {categorias[formData.tipo].map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Conta/Carteira</label>
                  <select required value={formData.conta_id} onChange={e => setFormData({...formData, conta_id: e.target.value})} className="w-full bg-[#070b14] border border-[#1e293b] rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none">
                    <option value="">Selecione...</option>
                    {contas.map(c => <option key={c.id} value={c.id}>{c.nome} ({c.banco})</option>)}
                  </select>
                </div>
              </div>

              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-colors mt-4">
                Salvar Transação
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}