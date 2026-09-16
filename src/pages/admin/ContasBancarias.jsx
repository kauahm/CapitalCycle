import React, { useState, useEffect, useRef } from 'react';
import { Plus, Landmark, Wallet, TrendingUp, Trash2, Pencil, X, Building2 } from 'lucide-react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '../../services/firebase';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import CurrencyValue from '../../components/ui/CurrencyValue';
import UpgradeModal from '../../components/ui/UpgradeModal';
import { canAddConta, getLimits } from '../../components/ui/plans';
import { useAuth } from '../../hooks/useAuth';

export default function ContasBancarias() {
  const { currentUser, userProfile } = useAuth();
  const [contas, setContas] = useState([]);
  // { [conta_id]: quantidade } — usado para proteger o histórico na exclusão.
  const [lancamentosPorConta, setLancamentosPorConta] = useState({});
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  // Trava de submissão: o ref é o lock lógico (síncrono, fecha a janela entre
  // dois cliques antes de qualquer re-render); o state é só o retorno visual.
  const submitLockRef = useRef(false);
  const [salvando, setSalvando] = useState(false);

  const [formData, setFormData] = useState({
    nome: '',
    banco: '',
    tipo: 'Corrente',
    saldo: ''
  });

  // Uma conta representa ONDE o patrimônio está. O valor gravado no Firestore
  // é preservado como está — inclusive 'Carteira Física', que só ganhou rótulo
  // novo — para não precisar migrar nenhum documento existente.
  const tiposConta = [
    { valor: 'Corrente',         rotulo: 'Conta corrente' },
    { valor: 'Poupança',         rotulo: 'Poupança' },
    { valor: 'Carteira Digital', rotulo: 'Carteira digital' },
    { valor: 'Carteira Física',  rotulo: 'Dinheiro' },
    { valor: 'Investimentos',    rotulo: 'Investimentos' },
  ];

  // Tipos gravados antes desta mudança que não estejam na lista continuam
  // aparecendo com o próprio valor, em vez de sumir da tela.
  const rotuloTipo = (valor) => tiposConta.find((t) => t.valor === valor)?.rotulo || valor;

  const planId = userProfile?.plan || 'jovem';
  const limiteContas = getLimits(planId).contas;

  useEffect(() => {
    if (!currentUser) return;
    const q = query(collection(db, 'accounts'), where('uid', '==', currentUser.uid));
    const unsub = onSnapshot(q, (snapshot) => {
      setContas(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    // Transações do usuário, só para saber quantas estão vinculadas a cada
    // conta. Filtro por uid apenas — a mesma forma de query já usada nas
    // outras páginas, que não exige índice composto. A contagem por conta é
    // feita no cliente.
    const qTransacoes = query(collection(db, 'transactions'), where('uid', '==', currentUser.uid));
    const unsubTransacoes = onSnapshot(qTransacoes, (snapshot) => {
      const porConta = {};
      snapshot.docs.forEach((d) => {
        const contaId = d.data().conta_id;
        if (contaId) porConta[contaId] = (porConta[contaId] || 0) + 1;
      });
      setLancamentosPorConta(porConta);
    });

    return () => {
      unsub();
      unsubTransacoes();
    };
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Trava por plano: usuário do plano Jovem tem limite de contas
    if (!editingId && !canAddConta(planId, contas.length)) {
      setUpgradeOpen(true);
      return;
    }

    // Lock adquirido aqui de propósito: depois da saída antecipada do plano
    // (que não inicia operação nenhuma) e imediatamente antes do try. Como não
    // há instrução entre a aquisição e o try, todo caminho a partir daqui passa
    // pelo finally e libera a trava.
    if (submitLockRef.current) return;
    submitLockRef.current = true;
    setSalvando(true);

    try {
      const dados = {
        ...formData,
        saldo: parseFloat(formData.saldo) || 0,
      };

      if (editingId) {
        await updateDoc(doc(db, 'accounts', editingId), dados);
      } else {
        await addDoc(collection(db, 'accounts'), {
          ...dados,
          uid: currentUser.uid,
          criadoEm: new Date()
        });
      }
      closeModal();
    } catch (error) {
      console.error("Erro ao salvar conta: ", error);
    } finally {
      submitLockRef.current = false;
      setSalvando(false);
    }
  };

  const handleEdit = (conta) => {
    setFormData({
      nome: conta.nome || '',
      banco: conta.banco || '',
      tipo: conta.tipo || 'Corrente',
      saldo: String(conta.saldo ?? '')
    });
    setEditingId(conta.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ nome: '', banco: '', tipo: 'Corrente', saldo: '' });
  };

  const handleDelete = async (id) => {
    // Conta com histórico não é excluída: apagar as transações destruiria o
    // histórico financeiro, e deixá-las para trás as tornaria órfãs. Editar a
    // conta existente é o caminho para trocar instituição, nome ou tipo.
    const vinculados = lancamentosPorConta[id] || 0;
    if (vinculados > 0) {
      window.alert(
        `Esta conta possui ${vinculados} ${vinculados === 1 ? 'lançamento vinculado' : 'lançamentos vinculados'} ` +
        `e não pode ser excluída, para preservar seu histórico.\n\n` +
        `Se precisar alterar a instituição ou o tipo, edite a conta existente.`
      );
      return;
    }

    if (window.confirm('Deseja realmente excluir esta conta?')) {
      await deleteDoc(doc(db, 'accounts', id));
    }
  };

  // Função para escolher o ícone e a cor baseada no tipo de conta
  const getEstiloConta = (tipo) => {
    switch(tipo) {
      case 'Investimentos': return { icon: TrendingUp, cor: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'hover:border-indigo-500/50' };
      case 'Carteira Digital': return { icon: Wallet, cor: 'text-sky-400', bg: 'bg-sky-500/10', border: 'hover:border-sky-500/50' };
      // 'Carteira Física' é o valor gravado para o que hoje se chama Dinheiro.
      case 'Carteira Física': return { icon: Wallet, cor: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'hover:border-emerald-500/50' };
      case 'Poupança': return { icon: Building2, cor: 'text-amber-400', bg: 'bg-amber-500/10', border: 'hover:border-amber-500/50' };
      default: return { icon: Landmark, cor: 'text-slate-200', bg: 'bg-slate-700/30', border: 'hover:border-slate-500/50' };
    }
  };

  if (loading) return <div className="h-[80vh] flex items-center justify-center"><LoadingSpinner size="lg" color="text-indigo-500" /></div>;

  const totalGeral = contas.reduce((acc, c) => acc + (parseFloat(c.saldo) || 0), 0);

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <p className="text-sm text-slate-400">Cadastre onde o seu dinheiro está: conta, poupança, carteira digital, dinheiro ou investimentos.</p>
        
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block mr-4">
            <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Patrimônio Total</p>
            <CurrencyValue value={totalGeral} size="xl" className="font-black text-emerald-400" />
          </div>
          {limiteContas != null && (
            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap bg-[#101623] border border-[#1e293b] px-3 py-2 rounded-xl">
              {contas.length}/{limiteContas} contas
            </span>
          )}
          <button
            onClick={() => {
              if (!canAddConta(planId, contas.length)) { setUpgradeOpen(true); return; }
              setEditingId(null); setFormData({ nome: '', banco: '', tipo: 'Corrente', saldo: '' }); setIsModalOpen(true);
            }}
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
            const vinculados = lancamentosPorConta[conta.id] || 0;
            const temHistorico = vinculados > 0;

            return (
              <div key={conta.id} className={`bg-[#101623] border border-[#1e293b] p-6 rounded-3xl relative overflow-hidden group transition-all duration-300 ${Estilo.border}`}>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className={`p-4 rounded-2xl ${Estilo.bg} ${Estilo.cor}`}>
                    <Icone size={28} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{conta.nome}</h3>
                    <p className="text-sm text-slate-400">
                      {[conta.banco, rotuloTipo(conta.tipo)].filter(Boolean).join(' • ')}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Saldo Atual</p>
                  <CurrencyValue value={conta.saldo} size="3xl" className={`font-black ${Estilo.cor}`} />
                  {temHistorico && (
                    <p className="text-xs text-slate-500 mt-2">
                      {vinculados} {vinculados === 1 ? 'lançamento' : 'lançamentos'}
                    </p>
                  )}
                </div>

                {/* Ações. No mobile ficam no rodapé, em fluxo normal: como o
                    card é estreito, mantê-las flutuando no topo direito as
                    faria cobrir o nome da conta. A partir de md voltam para
                    o canto superior direito, discretas até o hover ou o foco
                    por teclado — exatamente a composição anterior. */}
                <div className="relative z-10 mt-5 flex items-center justify-end gap-2 md:mt-0 md:absolute md:top-4 md:right-4 md:opacity-0 md:transition-opacity md:group-hover:opacity-100 md:group-focus-within:opacity-100">
                  <button
                    onClick={() => handleEdit(conta)}
                    className="text-slate-600 hover:text-indigo-400 bg-[#070b14] p-2 rounded-lg"
                    title="Editar Conta"
                  >
                    <Pencil size={16} />
                  </button>
                  {/* Continua clicável quando há histórico: o clique explica o
                      bloqueio, em vez de não fazer nada. */}
                  <button
                    onClick={() => handleDelete(conta.id)}
                    className={`bg-[#070b14] p-2 rounded-lg ${temHistorico ? 'text-slate-700 cursor-not-allowed' : 'text-slate-600 hover:text-rose-400'}`}
                    title={temHistorico
                      ? `Não é possível excluir: ${vinculados} ${vinculados === 1 ? 'lançamento vinculado' : 'lançamentos vinculados'}`
                      : 'Excluir Conta'}
                  >
                    <Trash2 size={16} />
                  </button>
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
              <h2 className="text-xl font-bold text-white">{editingId ? 'Editar Conta' : 'Adicionar Conta'}</h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-white">
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
                  {/* Opcional: dinheiro em espécie não tem instituição. */}
                  <label className="block text-xs font-medium text-slate-400 mb-1">Instituição</label>
                  <input type="text" value={formData.banco} onChange={e => setFormData({...formData, banco: e.target.value})} className="w-full bg-[#070b14] border border-[#1e293b] rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none" placeholder="Opcional" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Tipo de Conta</label>
                  <select required value={formData.tipo} onChange={e => setFormData({...formData, tipo: e.target.value})} className="w-full bg-[#070b14] border border-[#1e293b] rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none">
                    {tiposConta.map(({ valor, rotulo }) => <option key={valor} value={valor}>{rotulo}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Saldo Inicial (R$)</label>
                <input required type="number" step="0.01" value={formData.saldo} onChange={e => setFormData({...formData, saldo: e.target.value})} className="w-full bg-[#070b14] border border-[#1e293b] rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none" placeholder="0,00" />
              </div>

              <button
                type="submit"
                disabled={salvando}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-colors mt-4"
              >
                {salvando ? 'Salvando...' : (editingId ? 'Salvar Alterações' : 'Salvar Conta')}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal de upgrade */}
      <UpgradeModal feature="contas" open={upgradeOpen} onClose={() => setUpgradeOpen(false)} />
    </div>
  );
}