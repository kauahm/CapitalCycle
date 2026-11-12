import React, { useState, useEffect, useMemo } from 'react';
import { PieChart, AlertTriangle, Save } from 'lucide-react';
import { doc, onSnapshot, setDoc, serverTimestamp, collection, query, where } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { CATEGORIAS_SAIDA } from '../../utils/categorias';
import { mesAtualPrefixo } from '../../utils/data';
import { calcularProgressoCategorias, tomDoEstado } from '../../utils/orcamentoCategoria';
import { formatarMoeda, parseValor } from '../../utils/moeda';
import CurrencyValue from '../../components/ui/CurrencyValue';
import Button from '../../components/ui/Button';
import PageHeader from '../../components/ui/PageHeader';
import ProgressBar from '../../components/ui/ProgressBar';
import { Input } from '../../components/ui/Field';
import { SkeletonLista } from '../../components/ui/Skeleton';

export default function OrcamentoCategoria() {
  const { currentUser } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [limites, setLimites] = useState({});
  const [transacoes, setTransacoes] = useState([]);
  const [inputs, setInputs] = useState({});
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!currentUser) return undefined;

    const unsubOrcamento = onSnapshot(doc(db, 'orcamentosPorCategoria', currentUser.uid), (snap) => {
      const dados = snap.exists() ? (snap.data().limites || {}) : {};
      setLimites(dados);
      // Só inicializa os inputs a partir do que veio do servidor na primeira carga —
      // depois disso o usuário controla os campos localmente até salvar.
      setInputs((prev) => (Object.keys(prev).length ? prev : Object.fromEntries(
        CATEGORIAS_SAIDA.map((cat) => [cat, dados[cat] != null ? String(dados[cat]).replace('.', ',') : '']),
      )));
      setLoading(false);
    }, (erro) => {
      console.error('[Orçamento] Falha ao ler limites:', erro?.code || erro?.message);
      setLoading(false);
    });

    const unsubTransacoes = onSnapshot(
      query(collection(db, 'transactions'), where('uid', '==', currentUser.uid)),
      (snapshot) => setTransacoes(snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))),
    );

    return () => { unsubOrcamento(); unsubTransacoes(); };
  }, [currentUser]);

  const mesPrefixo = mesAtualPrefixo();
  const progresso = useMemo(() => calcularProgressoCategorias(limites, transacoes, mesPrefixo), [limites, transacoes, mesPrefixo]);
  const progressoPorCategoria = Object.fromEntries(progresso.map((p) => [p.categoria, p]));

  const totalLimites = progresso.reduce((a, p) => a + p.limite, 0);
  const totalGasto = progresso.reduce((a, p) => a + p.gasto, 0);

  // Há algo diferente do que está salvo?
  const alterado = CATEGORIAS_SAIDA.some((cat) => {
    const salvo = limites[cat] != null ? Number(limites[cat]) : null;
    const digitado = parseValor(inputs[cat] ?? '');
    const novo = Number.isNaN(digitado) || digitado <= 0 ? null : digitado;
    return salvo !== novo;
  });

  const handleSalvar = async (e) => {
    e.preventDefault();
    setSalvando(true);
    try {
      const novosLimites = {};
      CATEGORIAS_SAIDA.forEach((cat) => {
        const valor = parseValor(inputs[cat] ?? '');
        if (!Number.isNaN(valor) && valor > 0) novosLimites[cat] = Math.round(valor * 100) / 100;
      });

      await setDoc(doc(db, 'orcamentosPorCategoria', currentUser.uid), {
        limites: novosLimites,
        atualizadoEm: serverTimestamp(),
      });
      toast.success('Limites por categoria salvos.');
    } catch (error) {
      console.error('[Orçamento] Erro ao salvar:', error);
      toast.error('Não foi possível salvar os limites.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader>
        Defina um teto mensal por categoria de gasto e acompanhe o quanto já usou neste mês.
      </PageHeader>

      {!loading && progresso.length > 0 && (
        <div className="cc-card-p">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-4">
            <div>
              <p className="cc-label mb-1.5">Total orçado no mês</p>
              <p className="text-2xl font-bold text-textMain tabular-nums">{formatarMoeda(totalLimites)}</p>
            </div>
            <p className="text-sm text-textSecondary">
              Gasto nas categorias com limite: <span className="font-semibold text-textMain">{formatarMoeda(totalGasto)}</span>
              {' '}({totalLimites > 0 ? ((totalGasto / totalLimites) * 100).toFixed(0) : 0}%)
            </p>
          </div>
          <ProgressBar
            value={totalLimites > 0 ? (totalGasto / totalLimites) * 100 : 0}
            tone={totalGasto >= totalLimites ? 'danger' : totalGasto >= totalLimites * 0.9 ? 'warning' : 'success'}
            height="h-2"
            label="Uso total do orçamento"
          />
        </div>
      )}

      {loading ? (
        <SkeletonLista itens={7} />
      ) : (
        <form onSubmit={handleSalvar} className="space-y-4">
          <div className="cc-card divide-y divide-hairline overflow-hidden">
            {CATEGORIAS_SAIDA.map((categoria) => {
              const p = progressoPorCategoria[categoria];
              const temLimite = p != null;
              const inputId = `limite-${categoria}`;

              return (
                <div key={categoria} className="p-5 flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex items-center gap-3 md:w-48 shrink-0">
                    <div className="p-2.5 rounded-xl bg-primary/10 text-indigo-300" aria-hidden="true">
                      <PieChart size={16} />
                    </div>
                    <label htmlFor={inputId} className="text-textMain font-medium text-sm">{categoria}</label>
                  </div>

                  <div className="flex-1 min-w-0">
                    {temLimite ? (
                      <>
                        <div className="flex justify-between items-baseline mb-1.5 gap-3">
                          <span className={`text-xs font-medium ${p.estado === 'estourado' ? 'text-rose-400' : p.estado === 'alerta' ? 'text-amber-400' : 'text-textSecondary'}`}>
                            {p.pct.toFixed(0)}% utilizado
                            {p.estado === 'estourado' && <span className="inline-flex items-center gap-1 ml-2"><AlertTriangle size={11} /> Ultrapassou o limite</span>}
                            {p.estado === 'alerta' && <span className="ml-2">· perto do limite</span>}
                          </span>
                          <CurrencyValue value={p.gasto} size="lg" className="font-semibold min-w-0 text-textMain" />
                        </div>
                        <ProgressBar value={p.pct} tone={tomDoEstado(p.estado)} label={`Uso de ${categoria}`} />
                      </>
                    ) : (
                      <p className="text-xs text-slate-500">Sem limite definido para esta categoria.</p>
                    )}
                  </div>

                  <div className="w-full md:w-44 shrink-0">
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-500 pointer-events-none">R$</span>
                      <Input
                        id={inputId}
                        type="text"
                        inputMode="decimal"
                        value={inputs[categoria] ?? ''}
                        onChange={(e) => setInputs((prev) => ({ ...prev, [categoria]: e.target.value }))}
                        placeholder="Sem limite"
                        className="pl-10 py-2.5"
                        aria-label={`Limite mensal de ${categoria}`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between gap-4">
            <p className="text-xs text-textSecondary">Deixe em branco para remover o limite de uma categoria.</p>
            <Button type="submit" icon={Save} loading={salvando} disabled={!alterado}>
              Salvar limites
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
