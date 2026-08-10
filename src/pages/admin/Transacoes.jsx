import React, { useState, useEffect } from 'react';
import { Plus, ArrowUpCircle, ArrowDownCircle, Trash2, Pencil, Search, Filter, X } from 'lucide-react';
import { collection, onSnapshot, deleteDoc, doc, query, where, runTransaction } from 'firebase/firestore';
import { db } from '../../services/firebase';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import UpgradeModal from '../../components/ui/UpgradeModal';
import { canAddTransacao, mesAtualKey } from '../../components/ui/plans';
import { useAuth } from '../../hooks/useAuth';
import { CATEGORIAS_ENTRADA, CATEGORIAS_SAIDA } from '../../utils/categorias';

export default function Transacoes() {
  const { currentUser, userProfile } = useAuth();
  const [transacoes, setTransacoes] = useState([]);
  const [contas, setContas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  // Estados do formulário
  const [formData, setFormData] = useState({
    descricao: '',
    valor: '',
    tipo: 'saida', // entrada ou saida
    categoria: 'Alimentação',
    conta_id: '',
    data: new Date().toISOString().split('T')[0]
  });

  // Categorias predefinidas (fonte única em utils/categorias.js — também
  // usada em Orçamento por Categoria)
  const categorias = {
    entrada: CATEGORIAS_ENTRADA,
    saida: CATEGORIAS_SAIDA
  };

  // Trava por plano: cota mensal de lançamentos do plano Jovem
  const planId = userProfile?.plan || 'jovem';
  const mesKey = mesAtualKey();
  const lancamentosNoMes = transacoes.filter((t) => t.data && t.data.startsWith(mesKey)).length;

  useEffect(() => {
    if (!currentUser) return;

    // Buscar Contas (para o select do formulário) — apenas as do usuário logado
    const qContas = query(collection(db, 'accounts'), where('uid', '==', currentUser.uid));
    const unsubContas = onSnapshot(qContas, (snapshot) => {
      setContas(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Buscar Transações do usuário logado (ordenadas das mais recentes para as mais antigas)
    const qTransacoes = query(
      collection(db, 'transactions'),
      where('uid', '==', currentUser.uid)
    );
    const unsubTransacoes = onSnapshot(qTransacoes, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      docs.sort((a, b) => (b.data || '').localeCompare(a.data || ''));
      setTransacoes(docs);
      setLoading(false);
    });

    return () => {
      unsubContas();
      unsubTransacoes();
    };
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Trava por plano: não cria lançamento além da cota mensal do plano Jovem
    if (!editingId && !canAddTransacao(planId, lancamentosNoMes)) {
      setUpgradeOpen(true);
      return;
    }

    const valorNumerico = parseFloat(formData.valor);
    const novaContaRef = doc(db, 'accounts', formData.conta_id);

    try {
      if (editingId) {
        // EDIÇÃO: precisa reverter o efeito antigo no saldo e aplicar o novo,
        // inclusive se o usuário trocou a transação de conta.
        const original = transacoes.find(t => t.id === editingId);
        const transacaoRef = doc(db, 'transactions', editingId);

        await runTransaction(db, async (transaction) => {
          const mesmaConta = original && original.conta_id === formData.conta_id;

          if (mesmaConta) {
            const contaSnap = await transaction.get(novaContaRef);
            if (!contaSnap.exists()) throw new Error('Conta selecionada não existe mais.');

            const saldoAtual = parseFloat(contaSnap.data().saldo) || 0;
            const deltaReversao = original.tipo === 'entrada' ? -(parseFloat(original.valor) || 0) : (parseFloat(original.valor) || 0);
            const deltaNovo = formData.tipo === 'entrada' ? valorNumerico : -valorNumerico;

            transaction.update(novaContaRef, { saldo: saldoAtual + deltaReversao + deltaNovo });
          } else {
            const contaAntigaRef = original && original.conta_id ? doc(db, 'accounts', original.conta_id) : null;
            const contaAntigaSnap = contaAntigaRef ? await transaction.get(contaAntigaRef) : null;
            const contaNovaSnap = await transaction.get(novaContaRef);

            if (!contaNovaSnap.exists()) throw new Error('Conta selecionada não existe mais.');

            if (contaAntigaSnap && contaAntigaSnap.exists()) {
              const saldoAntigo = parseFloat(contaAntigaSnap.data().saldo) || 0;
              const deltaReversao = original.tipo === 'entrada' ? -(parseFloat(original.valor) || 0) : (parseFloat(original.valor) || 0);
              transaction.update(contaAntigaRef, { saldo: saldoAntigo + deltaReversao });
            }

            const saldoNovo = parseFloat(contaNovaSnap.data().saldo) || 0;
            const deltaAplicacao = formData.tipo === 'entrada' ? valorNumerico : -valorNumerico;
            transaction.update(novaContaRef, { saldo: saldoNovo + deltaAplicacao });
          }

          transaction.update(transacaoRef, {
            descricao: formData.descricao,
            valor: valorNumerico,
            tipo: formData.tipo,
            categoria: formData.categoria,
            conta_id: formData.conta_id,
            data: formData.data,
          });
        });
      } else {
        // CRIAÇÃO
        const novaTransacaoRef = doc(collection(db, 'transactions'));
        await runTransaction(db, async (transaction) => {
          const contaSnap = await transaction.get(novaContaRef);
          if (!contaSnap.exists()) {
            throw new Error('Conta selecionada não existe mais.');
          }

          const saldoAtual = parseFloat(contaSnap.data().saldo) || 0;
          // Entrada soma ao saldo da conta, saída subtrai
          const delta = formData.tipo === 'entrada' ? valorNumerico : -valorNumerico;
          const novoSaldo = saldoAtual + delta;

          transaction.set(novaTransacaoRef, {
            ...formData,
            valor: valorNumerico,
            uid: currentUser.uid,
            origem: 'manual',
            identificador_externo: null,
            criadoEm: new Date()
          });
          transaction.update(novaContaRef, { saldo: novoSaldo });
        });
      }

      closeModal();
    } catch (error) {
      console.error("Erro ao salvar transação: ", error);
      alert("Erro ao salvar transação: " + error.message);
    }
  };

  const handleEdit = (t) => {
    setFormData({
      descricao: t.descricao || '',
      valor: String(t.valor ?? ''),
      tipo: t.tipo || 'saida',
      categoria: t.categoria || categorias[t.tipo || 'saida'][0],
      conta_id: t.conta_id || '',
      data: t.data || new Date().toISOString().split('T')[0]
    });
    setEditingId(t.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({
      descricao: '',
      valor: '',
      tipo: 'saida',
      categoria: 'Alimentação',
      conta_id: '',
      data: new Date().toISOString().split('T')[0]
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir esta transação?")) return;

    const transacao = transacoes.find(t => t.id === id);
    const transacaoRef = doc(db, 'transactions', id);

    try {
      if (transacao && transacao.conta_id) {
        // Reverte o efeito da transação no saldo da conta antes de excluir
        const contaRef = doc(db, 'accounts', transacao.conta_id);
        await runTransaction(db, async (transaction) => {
          const contaSnap = await transaction.get(contaRef);
          if (contaSnap.exists()) {
            const saldoAtual = parseFloat(contaSnap.data().saldo) || 0;
            const valor = parseFloat(transacao.valor) || 0;
            const delta = transacao.tipo === 'entrada' ? -valor : valor;
            transaction.update(contaRef, { saldo: saldoAtual + delta });
          }
          transaction.delete(transacaoRef);
        });
      } else {
        await deleteDoc(transacaoRef);
      }
    } catch (error) {
      console.error("Erro ao excluir transação: ", error);
      alert("Erro ao excluir transação: " + error.message);
    }
  };

  const formatarMoeda = (valor) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  const formatarData = (dataStr) => {
    const [ano, mes, dia] = dataStr.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  // Filtro de busca simples
  const transacoesFiltradas = transacoes.filter(t => 
    (t.descricao || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (t.categoria || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="h-[80vh] flex items-center justify-center"><LoadingSpinner size="lg" color="text-indigo-500" /></div>;

  return (
    <div className="space-y-6">
      
      {/* HEADER E BARRA DE BUSCA */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <p className="text-sm text-slate-400">Gerencie suas entradas e saídas.</p>
        
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
            onClick={() => {
              if (!canAddTransacao(planId, lancamentosNoMes)) { setUpgradeOpen(true); return; }
              setEditingId(null); setIsModalOpen(true);
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <Plus size={18} />
            Nova
          </button>
        </div>
      </div>

      {/* LISTA DE TRANSAÇÕES (ESTILO EXTRATO) */}
      <div className="bg-[#101623] border border-[#1e293b] rounded-2xl overflow-hidden">
        {transacoesFiltradas.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-slate-500 text-sm">
              {searchTerm ? 'Nenhuma transação encontrada para essa busca.' : 'Nenhuma transação lançada ainda.'}
            </p>
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
                  <span className={`font-bold whitespace-nowrap ${t.tipo === 'entrada' ? 'text-emerald-400' : 'text-white'}`}>
                    {t.tipo === 'entrada' ? '+ ' : '- '}{formatarMoeda(t.valor)}
                  </span>
                  <button 
                    onClick={() => handleEdit(t)}
                    className="text-slate-600 hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-all p-2"
                    title="Editar"
                  >
                    <Pencil size={18} />
                  </button>
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
          <div className="bg-[#101623] border border-[#1e293b] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-[#1e293b] flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">{editingId ? 'Editar Transação' : 'Nova Transação'}</h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-white">
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
                {editingId ? 'Salvar Alterações' : 'Salvar Transação'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal de upgrade */}
      <UpgradeModal feature="transacoes" open={upgradeOpen} onClose={() => setUpgradeOpen(false)} />
    </div>
  );
}