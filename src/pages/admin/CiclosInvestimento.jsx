import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Target, Calendar, Trash2, Pencil, X, PieChart, TrendingUp, TrendingDown, PiggyBank, Clock } from 'lucide-react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '../../services/firebase';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import CurrencyValue from '../../components/ui/CurrencyValue';
import UpgradeModal from '../../components/ui/UpgradeModal';
import { canAddCiclo, getLimits } from '../../components/ui/plans';
import { useAuth } from '../../hooks/useAuth';
import { useAportesPorMeta } from '../../hooks/useAportesPorMeta';
import { calcularProgressoMeta } from '../../utils/metas';
import { hojeStr } from '../../utils/data';
import { formatarMoeda } from '../../utils/formatters';

export default function CiclosInvestimento() {
  const { currentUser, userProfile } = useAuth();
  const [ciclos, setCiclos] = useState([]);
  const [transacoes, setTransacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  // Modal "Registrar aporte" — separado do modal de criar/editar ciclo
  const [aporteCiclo, setAporteCiclo] = useState(null); // ciclo alvo, ou null se fechado
  const [aporteValor, setAporteValor] = useState('');
  const [aporteData, setAporteData] = useState(hojeStr());
  const [salvandoAporte, setSalvandoAporte] = useState(false);

  // Modal "Excluir aporte" — lista os aportes do ciclo e permite escolher um para apagar
  const [excluirCiclo, setExcluirCiclo] = useState(null); // ciclo alvo, ou null se fechado
  const [excluindoAporte, setExcluindoAporte] = useState(false);

  const [formData, setFormData] = useState({
    nome: '',
    tipo: 'Meta', // Pode ser 'Orçamento' ou 'Meta'
    orcamento: '',
    inicio: '',
    fim: ''
  });

  // Trava por plano: plano Jovem permite até 2 ciclos em andamento
  const planId = userProfile?.plan || 'jovem';
  const hoje = hojeStr();
  const ciclosAtivos = ciclos.filter((c) => !c.fim || c.fim >= hoje).length;
  const limiteCiclos = getLimits(planId).ciclosAtivos;

  // Aportes das metas (subcoleção ciclos/{id}/aportes) — não afeta ciclos do
  // tipo Orçamento, que continuam calculados a partir de transactions.
  const metaIds = ciclos.filter((c) => c.tipo === 'Meta').map((c) => c.id);
  const aportesMap = useAportesPorMeta(metaIds);

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
    setFormData({ nome: '', tipo: 'Meta', orcamento: '', inicio: '', fim: '' });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Deseja realmente excluir esta meta/orçamento?")) {
      await deleteDoc(doc(db, 'ciclos', id));
    }
  };

  const abrirExcluir = (ciclo) => {
    setExcluirCiclo(ciclo);
  };

  const fecharExcluir = () => {
    setExcluirCiclo(null);
  };

  const confirmarExcluirAporte = async (cicloId, aporteId) => {
    if (!window.confirm('Excluir este aporte? Isso diminui o valor acumulado da meta.')) return;
    setExcluindoAporte(true);
    try {
      await deleteDoc(doc(db, 'ciclos', cicloId, 'aportes', aporteId));
    } catch (error) {
      console.error('Erro ao excluir aporte:', error);
      alert('Erro ao excluir aporte: ' + error.message);
    } finally {
      setExcluindoAporte(false);
    }
  };

  const abrirAporte = (ciclo) => {
    setAporteCiclo(ciclo);
    setAporteValor('');
    setAporteData(hojeStr());
  };

  const fecharAporte = () => {
    setAporteCiclo(null);
    setAporteValor('');
  };

  // ── Preview do ritmo, calculado em tempo real no modal de aporte ──
  // Simula o novo aporte somado aos já registrados, sem gravar nada.
  // Reaproveita a mesma função usada no card do ciclo (calcularProgressoMeta).
  const previewAporte = useMemo(() => {
    if (!aporteCiclo || aporteCiclo.tipo !== 'Meta') return null;

    const valorNumerico = parseFloat(aporteValor);
    if (!aporteValor || Number.isNaN(valorNumerico) || valorNumerico <= 0) return null;

    const aportesAtuais = aportesMap[aporteCiclo.id] || [];
    const aportesSimulados = [
      ...aportesAtuais,
      { valor: valorNumerico, data: aporteData || hojeStr() }
    ];

    return calcularProgressoMeta(aporteCiclo, aportesSimulados);
  }, [aporteCiclo, aporteValor, aporteData, aportesMap]);

  const salvarAporte = async (e) => {
    e.preventDefault();
    if (!aporteCiclo) return;

    const valorNumerico = parseFloat(aporteValor);
    if (!aporteValor || Number.isNaN(valorNumerico) || valorNumerico <= 0) {
      alert('Informe um valor maior que zero para registrar o aporte.');
      return;
    }

    setSalvandoAporte(true);
    try {
      // Registro de destinação de dinheiro para a meta — nunca cria
      // transação, nunca mexe em saldo de conta (ver especificação, item 3).
      await addDoc(collection(db, 'ciclos', aporteCiclo.id, 'aportes'), {
        valor: valorNumerico,
        data: aporteData,
        uid: currentUser.uid,
        criadoEm: new Date()
      });
      fecharAporte();
    } catch (error) {
      console.error('Erro ao registrar aporte: ', error);
      alert('Erro ao registrar aporte: ' + error.message);
    } finally {
      setSalvandoAporte(false);
    }
  };

  const formatarData = (dataStr) => dataStr ? dataStr.split('-').reverse().join('/') : '';
  const formatarDataObj = (date) => date ? date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '';

  if (loading) return <div className="h-[80vh] flex items-center justify-center"><LoadingSpinner size="lg" color="text-indigo-500" /></div>;

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <p className="text-sm text-slate-400">Defina seus orçamentos mensais e acompanhe seus grandes objetivos.</p>

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
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2"
          >
            <Plus size={18} /> Novo Objetivo
          </button>
        </div>
      </div>

      {/* LISTA DE METAS E ORÇAMENTOS */}
      {ciclos.length === 0 ? (
        <div className="bg-[#101623] border border-[#1e293b] rounded-2xl p-12 text-center">
          <Target size={48} className="mx-auto text-slate-600 mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">Nenhum ciclo ativo</h3>
          <p className="text-slate-400">Crie um orçamento para o mês ou uma meta financeira (ex: Reserva de Emergência).</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {ciclos.map((ciclo) => {
            if (ciclo.tipo === 'Orçamento') {
              // Orçamento ad-hoc: sem mudança — soma as SAÍDAS no período do ciclo
              const transacoesFiltradas = transacoes.filter(t => t.data >= ciclo.inicio && t.data <= ciclo.fim);
              const valorAtual = transacoesFiltradas.filter(t => t.tipo === 'saida').reduce((acc, t) => acc + (parseFloat(t.valor) || 0), 0);
              const porcentagem = Math.min(100, (valorAtual / ciclo.orcamento) * 100);
              const isEstourado = porcentagem >= 100;

              return (
                <div key={ciclo.id} className="bg-[#101623] border border-[#1e293b] p-6 rounded-2xl relative overflow-hidden group hover:border-indigo-500/30 transition-colors">
                  <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEdit(ciclo)} className="text-slate-600 hover:text-indigo-400 bg-[#070b14] p-2 rounded-lg" title="Editar">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => handleDelete(ciclo.id)} className="text-slate-600 hover:text-rose-400 bg-[#070b14] p-2 rounded-lg" title="Excluir">
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
                      <PieChart size={20} />
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
                      <span className="text-slate-400 text-xs uppercase font-bold tracking-wider whitespace-nowrap">Gasto</span>
                      <CurrencyValue value={valorAtual} size="lg" className={`font-bold min-w-0 ${isEstourado ? 'text-rose-400' : 'text-white'}`} />
                    </div>
                    <div className="w-full bg-[#1e293b] h-2 rounded-full overflow-hidden">
                      <div className={`h-full transition-all duration-1000 ${isEstourado ? 'bg-rose-500' : 'bg-emerald-400'}`} style={{ width: `${porcentagem}%` }}></div>
                    </div>
                    <p className="text-xs text-slate-500 text-right">Alvo: {formatarMoeda(ciclo.orcamento)}</p>
                  </div>
                </div>
              );
            }

            // Meta: progresso vem exclusivamente dos aportes registrados (não de transações)
            const aportes = aportesMap[ciclo.id] || [];
            const p = calcularProgressoMeta(ciclo, aportes);

            return (
              <div key={ciclo.id} className="bg-[#101623] border border-[#1e293b] p-6 rounded-2xl relative overflow-hidden group hover:border-indigo-500/30 transition-colors">
                <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(ciclo)} className="text-slate-600 hover:text-indigo-400 bg-[#070b14] p-2 rounded-lg" title="Editar">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => handleDelete(ciclo.id)} className="text-slate-600 hover:text-rose-400 bg-[#070b14] p-2 rounded-lg" title="Excluir">
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400">
                    <Target size={20} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold">{ciclo.nome}</h3>
                    <span className="text-xs text-slate-400">{ciclo.tipo}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 mb-6 font-medium">
                  <Calendar size={14} />
                  {formatarData(ciclo.inicio)} até {formatarData(ciclo.fim)}
                  {p.prazoEncerrado && <span className="text-rose-400 font-semibold ml-1">· prazo encerrado</span>}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-end gap-3">
                    <span className="text-slate-400 text-xs uppercase font-bold tracking-wider whitespace-nowrap">Acumulado</span>
                    <CurrencyValue value={p.valorAcumulado} size="lg" className="font-bold min-w-0 text-white" />
                  </div>

                  <div className="w-full bg-[#1e293b] h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${p.progressoPct}%` }}></div>
                  </div>

                  <div className="flex justify-between items-baseline">
                    <span className="text-xs font-medium text-slate-400">{p.progressoPct.toFixed(0)}% concluído</span>
                    <p className="text-xs text-slate-500">Alvo: {formatarMoeda(p.valorMeta)}</p>
                  </div>

                  {!p.concluida && (
                    <p className="text-xs text-slate-400 pt-1">
                      Faltam <span className="text-white font-semibold">{formatarMoeda(p.valorRestante)}</span>
                      {p.prazoEncerrado
                        ? ' · prazo encerrado'
                        : p.diasRestantes != null && ` · ${p.diasRestantes} dia(s) restante(s)`}
                    </p>
                  )}

                  {/* Ritmo: só mostra necessário/atual quando faz sentido calcular */}
                  {!p.concluida && !p.prazoEncerrado && p.ritmoNecessario != null && (
                    <div className="pt-2 border-t border-[#1e293b] mt-2 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 flex items-center gap-1"><Clock size={12} /> Ritmo necessário</span>
                        <span className="text-slate-300 font-medium">{formatarMoeda(p.ritmoNecessario)}/dia</span>
                      </div>
                      {p.temAporte ? (
                        p.ritmoAtual > 0 ? (
                          <>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-500 flex items-center gap-1">
                                {p.diferencaPct != null && p.diferencaPct >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                Ritmo atual
                              </span>
                              <span className="text-slate-300 font-medium">{formatarMoeda(p.ritmoAtual)}/dia</span>
                            </div>
                            {p.diferencaPct != null && (
                              <p className={`text-xs font-semibold ${p.diferencaPct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {p.diferencaPct >= 0 ? 'Acima' : 'Abaixo'} do ritmo necessário ({p.diferencaPct >= 0 ? '+' : ''}{p.diferencaPct.toFixed(0)}%)
                              </p>
                            )}
                            {p.dataPrevista && (
                              <p className="text-xs text-slate-500">Previsão de conclusão: {formatarDataObj(p.dataPrevista)}</p>
                            )}
                            {p.atrasoDias != null && (
                              <p className="text-xs text-amber-400">No ritmo atual, ~{Math.ceil(p.atrasoDias)} dia(s) de atraso</p>
                            )}
                          </>
                        ) : (
                          <p className="text-xs text-slate-500">Sem ritmo recente (nenhum aporte nos últimos 30 dias)</p>
                        )
                      ) : (
                        <p className="text-xs text-slate-500">Registre um aporte para ver seu ritmo</p>
                      )}
                    </div>
                  )}

                  {aportes.length > 0 && (
                    <button
                      onClick={() => abrirExcluir(ciclo)}
                      className="w-full mt-2 flex items-center justify-center gap-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold py-2.5 rounded-xl transition-colors"
                    >
                      <Trash2 size={14} /> Excluir aporte
                    </button>
                  )}

                  <button
                    onClick={() => abrirAporte(ciclo)}
                    className="w-full mt-3 flex items-center justify-center gap-2 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold py-2.5 rounded-xl transition-colors"
                  >
                    <PiggyBank size={14} /> Registrar aporte
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL NOVO CICLO */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#101623] border border-[#1e293b] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
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

      {/* MODAL REGISTRAR APORTE */}
      {aporteCiclo && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#101623] border border-[#1e293b] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-[#1e293b] flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-white">Registrar aporte</h2>
                <p className="text-xs text-slate-400 mt-1">{aporteCiclo.nome}</p>
              </div>
              <button onClick={fecharAporte} className="text-slate-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={salvarAporte} className="p-6 space-y-4">
              <p className="text-xs text-slate-500 leading-relaxed">
                Isso registra dinheiro destinado a esta meta. Não cria uma transação nem altera o saldo de nenhuma conta.
              </p>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Valor guardado (R$)</label>
                <input
                  autoFocus
                  required
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={aporteValor}
                  onChange={(e) => setAporteValor(e.target.value)}
                  className="w-full bg-[#070b14] border border-[#1e293b] rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none"
                  placeholder="0,00"
                />
                {previewAporte && previewAporte.ritmoNecessario != null && previewAporte.diferencaPct != null && (
                  <p className={`mt-1.5 text-xs font-semibold ${previewAporte.diferencaPct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    Com este aporte, o ritmo fica {previewAporte.diferencaPct >= 0 ? 'acima' : 'abaixo'} do necessário ({previewAporte.diferencaPct >= 0 ? '+' : ''}{previewAporte.diferencaPct.toFixed(0)}%)
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Data</label>
                <input
                  required
                  type="date"
                  value={aporteData}
                  onChange={(e) => setAporteData(e.target.value)}
                  className="w-full bg-[#070b14] border border-[#1e293b] rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none [color-scheme:dark]"
                />
              </div>

              <button
                type="submit"
                disabled={salvandoAporte}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-colors mt-4"
              >
                {salvandoAporte ? 'Salvando...' : 'Registrar aporte'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EXCLUIR APORTE */}
      {excluirCiclo && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#101623] border border-[#1e293b] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-[#1e293b] flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-white">Excluir aporte</h2>
                <p className="text-xs text-slate-400 mt-1">{excluirCiclo.nome}</p>
              </div>
              <button onClick={fecharExcluir} className="text-slate-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-3">
              <p className="text-xs text-slate-500 leading-relaxed">
                Selecione o aporte que deseja apagar. O valor acumulado da meta diminuirá.
              </p>

              <div className="max-h-72 overflow-y-auto space-y-1.5 pr-1">
                {[...(aportesMap[excluirCiclo.id] || [])]
                  .sort((a, b) => (b.data || '').localeCompare(a.data || ''))
                  .map((a) => (
                    <div
                      key={a.id}
                      className="flex items-center justify-between gap-3 bg-[#070b14] border border-[#1e293b] rounded-lg px-3 py-2.5"
                    >
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm text-slate-200 font-semibold truncate">
                          {formatarMoeda(parseFloat(a.valor) || 0)}
                        </span>
                        <span className="text-xs text-slate-500">
                          {formatarData(a.data)}
                        </span>
                      </div>
                      <button
                        onClick={async () => {
                          await confirmarExcluirAporte(excluirCiclo.id, a.id);
                          // fecha o modal após excluir (snapshot do hook atualiza a lista)
                          setExcluirCiclo(null);
                        }}
                        disabled={excluindoAporte}
                        className="flex items-center gap-1.5 text-rose-300 hover:text-rose-200 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <Trash2 size={14} /> Excluir
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de upgrade */}
      <UpgradeModal feature="ciclos" open={upgradeOpen} onClose={() => setUpgradeOpen(false)} />
    </div>
  );
}