import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Plus, Target, Calendar, Trash2, Pencil, PieChart, TrendingUp, TrendingDown, PiggyBank, Clock, CheckCircle2,
} from 'lucide-react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { useAportesPorMeta } from '../../hooks/useAportesPorMeta';
import { canAddCiclo, getLimits } from '../../components/ui/plans';
import { calcularProgressoMeta } from '../../utils/metas';
import { hojeStr, formatarDataCurta } from '../../utils/data';
import { formatarMoeda, formatarDataBR, parseValor } from '../../utils/moeda';
import CurrencyValue from '../../components/ui/CurrencyValue';
import UpgradeModal from '../../components/ui/UpgradeModal';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Dialog from '../../components/ui/Dialog';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import EmptyState from '../../components/ui/EmptyState';
import PageHeader from '../../components/ui/PageHeader';
import ProgressBar from '../../components/ui/ProgressBar';
import { Field, Input, Segmented } from '../../components/ui/Field';
import { SkeletonCard } from '../../components/ui/Skeleton';

const formVazio = () => ({ nome: '', tipo: 'Meta', orcamento: '', inicio: hojeStr(), fim: '' });

export default function CiclosInvestimento() {
  const { currentUser, userProfile } = useAuth();
  const toast = useToast();
  const [ciclos, setCiclos] = useState([]);
  const [transacoes, setTransacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [excluindo, setExcluindo] = useState(null);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [filtro, setFiltro] = useState('andamento'); // 'andamento' | 'encerrados' | 'todos'
  const [formData, setFormData] = useState(formVazio);
  const [erros, setErros] = useState({});

  const submitLockRef = useRef(false);
  const [salvando, setSalvando] = useState(false);

  // Modal "Registrar aporte" — separado do modal de criar/editar ciclo
  const [aporteCiclo, setAporteCiclo] = useState(null);
  const [aporteValor, setAporteValor] = useState('');
  const [aporteData, setAporteData] = useState(hojeStr());
  const [aporteErro, setAporteErro] = useState(null);
  const [salvandoAporte, setSalvandoAporte] = useState(false);
  const aporteLockRef = useRef(false);

  const planId = userProfile?.plan || 'jovem';
  const hoje = hojeStr();
  const ciclosAtivos = ciclos.filter((c) => !c.fim || c.fim >= hoje).length;
  const limiteCiclos = getLimits(planId).ciclosAtivos;

  const metaIds = useMemo(() => ciclos.filter((c) => c.tipo === 'Meta').map((c) => c.id), [ciclos]);
  const aportesMap = useAportesPorMeta(metaIds, currentUser?.uid);

  useEffect(() => {
    if (!currentUser) return undefined;
    const onErro = (erro) => {
      console.error('[Ciclos] Falha ao ler dados:', erro?.code || erro?.message);
      setLoading(false);
    };
    const unsubCiclos = onSnapshot(
      query(collection(db, 'ciclos'), where('uid', '==', currentUser.uid)),
      (snapshot) => {
        const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        docs.sort((a, b) => (a.fim || '9999').localeCompare(b.fim || '9999'));
        setCiclos(docs);
        setLoading(false);
      },
      onErro,
    );
    const unsubTransacoes = onSnapshot(
      query(collection(db, 'transactions'), where('uid', '==', currentUser.uid)),
      (snapshot) => setTransacoes(snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))),
      onErro,
    );
    return () => { unsubCiclos(); unsubTransacoes(); };
  }, [currentUser]);

  const visiveis = useMemo(() => ciclos.filter((c) => {
    const encerrado = Boolean(c.fim) && c.fim < hoje;
    if (filtro === 'andamento') return !encerrado;
    if (filtro === 'encerrados') return encerrado;
    return true;
  }), [ciclos, filtro, hoje]);

  // ── Criar / editar ──────────────────────────────────────────────────
  const abrirNovo = () => {
    if (!canAddCiclo(planId, ciclosAtivos)) { setUpgradeOpen(true); return; }
    setEditandoId(null);
    setFormData(formVazio());
    setErros({});
    setModalAberto(true);
  };

  const abrirEdicao = (ciclo) => {
    setFormData({
      nome: ciclo.nome || '',
      tipo: ciclo.tipo || 'Orçamento',
      orcamento: String(ciclo.orcamento ?? '').replace('.', ','),
      inicio: ciclo.inicio || '',
      fim: ciclo.fim || '',
    });
    setEditandoId(ciclo.id);
    setErros({});
    setModalAberto(true);
  };

  const fecharModal = () => {
    if (salvando) return;
    setModalAberto(false);
    setEditandoId(null);
  };

  const validar = () => {
    const e = {};
    const valor = parseValor(formData.orcamento);
    if (!formData.nome.trim()) e.nome = 'Dê um nome ao objetivo.';
    if (Number.isNaN(valor) || valor <= 0) e.orcamento = 'Informe um valor maior que zero.';
    if (!formData.inicio) e.inicio = 'Informe a data de início.';
    if (!formData.fim) e.fim = 'Informe a data final.';
    // Um período que termina antes de começar não tem dias restantes válidos
    // e tornaria todo o cálculo de ritmo sem sentido.
    if (formData.inicio && formData.fim && formData.fim < formData.inicio) e.fim = 'A data final não pode ser anterior ao início.';
    setErros(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!editandoId && !canAddCiclo(planId, ciclosAtivos)) { setUpgradeOpen(true); return; }
    if (!validar()) return;
    if (submitLockRef.current) return;
    submitLockRef.current = true;
    setSalvando(true);
    try {
      const dados = {
        nome: formData.nome.trim(),
        tipo: formData.tipo,
        orcamento: Math.round(parseValor(formData.orcamento) * 100) / 100,
        inicio: formData.inicio,
        fim: formData.fim,
      };
      if (editandoId) {
        await updateDoc(doc(db, 'ciclos', editandoId), dados);
        toast.success('Objetivo atualizado.');
      } else {
        await addDoc(collection(db, 'ciclos'), { ...dados, uid: currentUser.uid, criadoEm: new Date() });
        toast.success(formData.tipo === 'Meta' ? 'Meta criada. Registre aportes para acompanhar o ritmo.' : 'Orçamento criado.');
      }
      setModalAberto(false);
      setEditandoId(null);
    } catch (error) {
      console.error('[Ciclos] Erro ao salvar:', error);
      toast.error('Não foi possível salvar o objetivo.');
    } finally {
      submitLockRef.current = false;
      setSalvando(false);
    }
  };

  const confirmarExclusao = async () => {
    if (!excluindo) return;
    try {
      await deleteDoc(doc(db, 'ciclos', excluindo.id));
      toast.success('Objetivo excluído.');
    } catch (error) {
      console.error('[Ciclos] Erro ao excluir:', error);
      toast.error('Não foi possível excluir.');
      throw error;
    }
  };

  // ── Aporte ──────────────────────────────────────────────────────────
  const abrirAporte = (ciclo) => {
    setAporteCiclo(ciclo);
    setAporteValor('');
    setAporteData(hojeStr());
    setAporteErro(null);
  };

  const fecharAporte = () => {
    if (salvandoAporte) return;
    setAporteCiclo(null);
  };

  const salvarAporte = async (e) => {
    e.preventDefault();
    if (!aporteCiclo) return;
    const valorNumerico = parseValor(aporteValor);
    if (Number.isNaN(valorNumerico) || valorNumerico <= 0) { setAporteErro('Informe um valor maior que zero.'); return; }
    if (!aporteData || aporteData > hojeStr()) { setAporteErro('A data do aporte não pode estar no futuro.'); return; }
    if (aporteLockRef.current) return;
    aporteLockRef.current = true;
    setSalvandoAporte(true);
    try {
      // Registro de destinação de dinheiro para a meta — nunca cria
      // transação, nunca mexe em saldo de conta.
      await addDoc(collection(db, 'ciclos', aporteCiclo.id, 'aportes'), {
        valor: Math.round(valorNumerico * 100) / 100,
        data: aporteData,
        uid: currentUser.uid,
        criadoEm: new Date(),
      });
      toast.success(`Aporte de ${formatarMoeda(valorNumerico)} registrado em ${aporteCiclo.nome}.`);
      setAporteCiclo(null);
    } catch (error) {
      console.error('[Ciclos] Erro ao registrar aporte:', error);
      setAporteErro('Não foi possível registrar o aporte. Tente novamente.');
    } finally {
      aporteLockRef.current = false;
      setSalvandoAporte(false);
    }
  };

  const acoesCard = (ciclo) => (
    <div className="relative z-10 mt-5 flex items-center justify-end gap-1 md:mt-0 md:absolute md:top-4 md:right-4 md:opacity-0 md:transition-opacity md:group-hover:opacity-100 md:group-focus-within:opacity-100">
      <Button variant="ghost" size="icon" onClick={() => abrirEdicao(ciclo)} aria-label={`Editar ${ciclo.nome}`} title="Editar" className="bg-app hover:!text-indigo-300">
        <Pencil size={15} />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => setExcluindo(ciclo)} aria-label={`Excluir ${ciclo.nome}`} title="Excluir" className="bg-app hover:!text-rose-400">
        <Trash2 size={15} />
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        actions={(
          <>
            {limiteCiclos != null && !loading && (
              <Badge tone={ciclosAtivos >= limiteCiclos ? 'warning' : 'neutral'} className="px-3 py-2 text-xs">
                {ciclosAtivos}/{limiteCiclos} em andamento
              </Badge>
            )}
            <Button icon={Plus} onClick={abrirNovo} disabled={loading}>Novo objetivo</Button>
          </>
        )}
      >
        Metas de poupança com ritmo calculado e orçamentos por período.
      </PageHeader>

      {!loading && ciclos.length > 0 && (
        <div className="w-full sm:max-w-sm">
          <Segmented
            ariaLabel="Filtrar objetivos"
            value={filtro}
            onChange={setFiltro}
            options={[
              { value: 'andamento', label: 'Em andamento', activeClass: 'bg-surfaceLight !text-textMain' },
              { value: 'encerrados', label: 'Encerrados', activeClass: 'bg-surfaceLight !text-textMain' },
              { value: 'todos', label: 'Todos', activeClass: 'bg-surfaceLight !text-textMain' },
            ]}
          />
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[var(--cc-gap-card)]">
          <SkeletonCard linhas={4} /><SkeletonCard linhas={4} /><SkeletonCard linhas={4} />
        </div>
      ) : ciclos.length === 0 ? (
        <EmptyState
          icon={Target}
          title="Nenhum objetivo ainda"
          description="Crie uma meta (ex.: reserva de emergência) para acompanhar quanto guardar por dia, semana e mês — ou um orçamento para um período específico."
          actionLabel="Criar primeiro objetivo"
          onAction={abrirNovo}
        />
      ) : visiveis.length === 0 ? (
        <EmptyState compact icon={Target} title="Nada neste filtro" description="Troque o filtro acima para ver os demais objetivos." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[var(--cc-gap-card)]">
          {visiveis.map((ciclo) => {
            if (ciclo.tipo === 'Orçamento') {
              const valorAtual = transacoes
                .filter((t) => t.tipo === 'saida' && t.data >= ciclo.inicio && t.data <= ciclo.fim)
                .reduce((acc, t) => acc + (parseFloat(t.valor) || 0), 0);
              const teto = parseFloat(ciclo.orcamento) || 0;
              const porcentagem = teto > 0 ? Math.min(100, (valorAtual / teto) * 100) : 0;
              const estourado = teto > 0 && valorAtual >= teto;
              const encerrado = Boolean(ciclo.fim) && ciclo.fim < hoje;

              return (
                <div key={ciclo.id} className="cc-card p-6 relative overflow-hidden group hover:border-primary/30 transition-colors">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400" aria-hidden="true"><PieChart size={20} /></div>
                    <div className="min-w-0">
                      <h3 className="text-textMain font-bold truncate">{ciclo.nome}</h3>
                      <span className="text-xs text-textSecondary">Orçamento {encerrado && '· encerrado'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-6 font-medium">
                    <Calendar size={14} aria-hidden="true" />
                    {formatarDataBR(ciclo.inicio)} até {formatarDataBR(ciclo.fim)}
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-end gap-3">
                      <span className="cc-label">Gasto</span>
                      <CurrencyValue value={valorAtual} size="lg" className={`font-bold min-w-0 ${estourado ? 'text-rose-400' : 'text-textMain'}`} />
                    </div>
                    <ProgressBar value={porcentagem} tone={estourado ? 'danger' : porcentagem >= 90 ? 'warning' : 'success'} height="h-2" label={`Uso de ${ciclo.nome}`} />
                    <div className="flex justify-between items-baseline text-xs">
                      <span className={estourado ? 'text-rose-400 font-semibold' : 'text-textSecondary'}>
                        {porcentagem.toFixed(0)}% utilizado{estourado && ' · teto ultrapassado'}
                      </span>
                      <span className="text-slate-500">Teto: {formatarMoeda(teto)}</span>
                    </div>
                  </div>

                  {acoesCard(ciclo)}
                </div>
              );
            }

            // Meta: progresso vem exclusivamente dos aportes registrados.
            const aportes = aportesMap[ciclo.id] || [];
            const p = calcularProgressoMeta(ciclo, aportes);
            const equivalentes = p.equivalentes
              ? [['Por semana', p.equivalentes.porSemana], ['Por mês', p.equivalentes.porMes], ['Por ano', p.equivalentes.porAno]].filter(([, v]) => v != null)
              : [];

            return (
              <div key={ciclo.id} className={`cc-card p-6 relative overflow-hidden group transition-colors ${p.concluida ? 'border-emerald-500/30' : 'hover:border-primary/30'}`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-3 rounded-xl ${p.concluida ? 'bg-emerald-500/10 text-emerald-400' : 'bg-primary/10 text-indigo-300'}`} aria-hidden="true">
                    {p.concluida ? <CheckCircle2 size={20} /> : <Target size={20} />}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-textMain font-bold truncate">{ciclo.nome}</h3>
                    <span className="text-xs text-textSecondary">Meta{p.concluida && ' · concluída'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 mb-6 font-medium flex-wrap">
                  <Calendar size={14} aria-hidden="true" />
                  {formatarDataBR(ciclo.inicio)} até {formatarDataBR(ciclo.fim)}
                  {p.prazoEncerrado && !p.concluida && <Badge tone="danger">prazo encerrado</Badge>}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-end gap-3">
                    <span className="cc-label">Acumulado</span>
                    <CurrencyValue value={p.valorAcumulado} size="lg" className="font-bold min-w-0 text-textMain" />
                  </div>
                  <ProgressBar value={p.progressoPct} tone={p.concluida ? 'success' : 'primary'} height="h-2" label={`Progresso de ${ciclo.nome}`} />
                  <div className="flex justify-between items-baseline text-xs">
                    <span className="font-medium text-textSecondary">{p.progressoPct.toFixed(0)}% concluído</span>
                    <span className="text-slate-500">Alvo: {formatarMoeda(p.valorMeta)}</span>
                  </div>

                  {!p.concluida && (
                    <p className="text-xs text-textSecondary pt-1">
                      Faltam <span className="text-textMain font-semibold">{formatarMoeda(p.valorRestante)}</span>
                      {p.prazoEncerrado ? ' · prazo encerrado' : p.diasRestantes != null ? ` · ${p.diasRestantes} dia(s) restante(s)` : ' · sem prazo definido'}
                    </p>
                  )}

                  {!p.concluida && !p.prazoEncerrado && p.equivalentes && (
                    <div className="pt-2 border-t border-hairline mt-2 space-y-1">
                      {p.equivalentes.hoje != null ? (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500 flex items-center gap-1"><Clock size={12} /> Guardar hoje</span>
                          <span className="text-amber-400 font-semibold">{formatarMoeda(p.equivalentes.hoje)}</span>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-500 flex items-center gap-1"><Clock size={12} /> Ritmo necessário</span>
                            <span className="text-slate-300 font-medium">{formatarMoeda(p.equivalentes.porDia)}/dia</span>
                          </div>
                          {equivalentes.length > 0 && (
                            <div className="flex flex-wrap gap-x-4 gap-y-1">
                              {equivalentes.map(([rotulo, valor]) => (
                                <span key={rotulo} className="text-xs text-slate-500">
                                  {rotulo} <span className="text-slate-300 font-medium">{formatarMoeda(valor)}</span>
                                </span>
                              ))}
                            </div>
                          )}
                          {p.equivalentes.horizonte === 'menos-de-uma-semana' && (
                            <p className="text-xs text-slate-600">Menos de 1 semana restante</p>
                          )}
                        </>
                      )}
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
                              <p className="text-xs text-slate-500">Previsão de conclusão: {formatarDataCurta(p.dataPrevista)}</p>
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

                  {!p.concluida && (
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={PiggyBank}
                      onClick={() => abrirAporte(ciclo)}
                      className="w-full mt-3 !border-primary/30 !text-indigo-300 hover:!bg-primary/10"
                    >
                      Registrar aporte
                    </Button>
                  )}
                </div>

                {acoesCard(ciclo)}
              </div>
            );
          })}
        </div>
      )}

      {/* Novo / editar */}
      <Dialog
        open={modalAberto}
        onClose={fecharModal}
        bloqueado={salvando}
        title={editandoId ? 'Editar objetivo' : 'Novo objetivo'}
        footer={(
          <>
            <Button variant="secondary" onClick={fecharModal} disabled={salvando}>Cancelar</Button>
            <Button type="submit" form="form-ciclo" loading={salvando}>
              {editandoId ? 'Salvar alterações' : `Criar ${formData.tipo === 'Meta' ? 'meta' : 'orçamento'}`}
            </Button>
          </>
        )}
      >
        <form id="form-ciclo" onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Segmented
            ariaLabel="Tipo de objetivo"
            value={formData.tipo}
            onChange={(tipo) => setFormData({ ...formData, tipo })}
            options={[
              { value: 'Meta', label: 'Meta de poupança', activeClass: 'bg-primary' },
              { value: 'Orçamento', label: 'Orçamento do período', activeClass: 'bg-emerald-500' },
            ]}
          />
          <p className="text-xs text-textSecondary leading-relaxed">
            {formData.tipo === 'Meta'
              ? 'Você registra aportes e o CapitalCycle calcula quanto guardar por dia, semana e mês para chegar lá no prazo.'
              : 'Um teto de gastos para o período: as saídas lançadas entre as datas contam automaticamente.'}
          </p>

          <Field label="Nome" error={erros.nome}>
            <Input data-autofocus type="text" value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} placeholder={formData.tipo === 'Meta' ? 'Ex.: Reserva de emergência' : 'Ex.: Orçamento de dezembro'} maxLength={60} />
          </Field>

          <Field label={formData.tipo === 'Meta' ? 'Valor da meta (R$)' : 'Teto de gastos (R$)'} error={erros.orcamento}>
            <Input type="text" inputMode="decimal" value={formData.orcamento} onChange={(e) => setFormData({ ...formData, orcamento: e.target.value })} placeholder="0,00" />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Início" error={erros.inicio}>
              <Input type="date" value={formData.inicio} onChange={(e) => setFormData({ ...formData, inicio: e.target.value })} />
            </Field>
            <Field label="Fim" error={erros.fim}>
              <Input type="date" min={formData.inicio || undefined} value={formData.fim} onChange={(e) => setFormData({ ...formData, fim: e.target.value })} />
            </Field>
          </div>
        </form>
      </Dialog>

      {/* Aporte */}
      <Dialog
        open={Boolean(aporteCiclo)}
        onClose={fecharAporte}
        bloqueado={salvandoAporte}
        title="Registrar aporte"
        description={aporteCiclo?.nome}
        size="sm"
        footer={(
          <>
            <Button variant="secondary" onClick={fecharAporte} disabled={salvandoAporte}>Cancelar</Button>
            <Button type="submit" form="form-aporte" loading={salvandoAporte} icon={PiggyBank}>Registrar</Button>
          </>
        )}
      >
        <form id="form-aporte" onSubmit={salvarAporte} className="space-y-4" noValidate>
          <p className="text-xs text-textSecondary leading-relaxed">
            Registra dinheiro destinado a esta meta. Não cria uma transação nem altera o saldo de nenhuma conta.
          </p>
          <Field label="Valor guardado (R$)" error={aporteErro}>
            <Input data-autofocus type="text" inputMode="decimal" value={aporteValor} onChange={(e) => { setAporteValor(e.target.value); setAporteErro(null); }} placeholder="0,00" />
          </Field>
          <Field label="Data">
            <Input type="date" value={aporteData} max={hojeStr()} onChange={(e) => setAporteData(e.target.value)} />
          </Field>
        </form>
      </Dialog>

      <ConfirmDialog
        open={Boolean(excluindo)}
        onClose={() => setExcluindo(null)}
        onConfirm={confirmarExclusao}
        title={`Excluir ${excluindo?.tipo === 'Meta' ? 'meta' : 'orçamento'}`}
        confirmLabel="Excluir"
        message={excluindo ? `"${excluindo.nome}" será removido${excluindo.tipo === 'Meta' ? ' junto com o histórico de aportes' : ''}. Esta ação não pode ser desfeita.` : ''}
      />

      <UpgradeModal feature="ciclos" open={upgradeOpen} onClose={() => setUpgradeOpen(false)} />
    </div>
  );
}
