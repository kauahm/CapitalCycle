import React, { useState, useEffect } from 'react';
import { PieChart, AlertTriangle, Save } from 'lucide-react';
import { doc, onSnapshot, setDoc, serverTimestamp, collection, query, where } from 'firebase/firestore';
import { db } from '../../services/firebase';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import CurrencyValue from '../../components/ui/CurrencyValue';
import Toast from '../../components/ui/Toast';
import { useAuth } from '../../hooks/useAuth';
import { CATEGORIAS_SAIDA } from '../../utils/categorias';
import { mesAtualPrefixo } from '../../utils/data';
import { calcularProgressoCategorias } from '../../utils/orcamentoCategoria';

export default function OrcamentoCategoria() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [limites, setLimites] = useState({});
  const [transacoes, setTransacoes] = useState([]);
  const [inputs, setInputs] = useState({});
  const [salvando, setSalvando] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    if (!currentUser) return;

    const unsubOrcamento = onSnapshot(doc(db, 'orcamentosPorCategoria', currentUser.uid), (snap) => {
      const dados = snap.exists() ? (snap.data().limites || {}) : {};
      setLimites(dados);
      // Só inicializa os inputs a partir do que veio do servidor na primeira carga —
      // depois disso o usuário controla os campos localmente até salvar.
      setInputs((prev) => (Object.keys(prev).length ? prev : Object.fromEntries(
        CATEGORIAS_SAIDA.map((cat) => [cat, dados[cat] != null ? String(dados[cat]) : ''])
      )));
      setLoading(false);
    });

    const qTransacoes = query(collection(db, 'transactions'), where('uid', '==', currentUser.uid));
    const unsubTransacoes = onSnapshot(qTransacoes, (snapshot) => {
      setTransacoes(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => {
      unsubOrcamento();
      unsubTransacoes();
    };
  }, [currentUser]);

  const mesPrefixo = mesAtualPrefixo();
  const progresso = calcularProgressoCategorias(limites, transacoes, mesPrefixo);
  const progressoPorCategoria = Object.fromEntries(progresso.map((p) => [p.categoria, p]));

  const handleSalvar = async (e) => {
    e.preventDefault();
    setSalvando(true);
    try {
      const novosLimites = {};
      CATEGORIAS_SAIDA.forEach((cat) => {
        const valor = parseFloat(String(inputs[cat] ?? '').replace(',', '.'));
        if (!Number.isNaN(valor) && valor > 0) {
          novosLimites[cat] = valor;
        }
      });

      await setDoc(doc(db, 'orcamentosPorCategoria', currentUser.uid), {
        limites: novosLimites,
        atualizadoEm: serverTimestamp(),
      });

      setToast({ show: true, message: 'Limites por categoria salvos.', type: 'success' });
    } catch (error) {
      console.error('Erro ao salvar orçamento por categoria: ', error);
      setToast({ show: true, message: 'Não foi possível salvar os limites.', type: 'error' });
    } finally {
      setSalvando(false);
    }
  };

  if (loading) return <div className="h-[80vh] flex items-center justify-center"><LoadingSpinner size="lg" color="text-indigo-500" /></div>;

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <p className="text-sm text-slate-400">Defina um teto mensal por categoria de gasto e acompanhe o quanto já usou.</p>
      </div>

      <form onSubmit={handleSalvar} className="space-y-4">
        <div className="bg-[#101623] border border-[#1e293b] rounded-2xl divide-y divide-[#1e293b] overflow-hidden">
          {CATEGORIAS_SAIDA.map((categoria) => {
            const p = progressoPorCategoria[categoria];
            const temLimite = p != null;
            const corBarra = !temLimite ? 'bg-slate-600' : p.estado === 'estourado' ? 'bg-rose-500' : p.estado === 'alerta' ? 'bg-amber-500' : 'bg-emerald-400';

            return (
              <div key={categoria} className="p-5 flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex items-center gap-3 md:w-48 shrink-0">
                  <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
                    <PieChart size={16} />
                  </div>
                  <span className="text-white font-medium text-sm">{categoria}</span>
                </div>

                <div className="flex-1 min-w-0">
                  {temLimite ? (
                    <>
                      <div className="flex justify-between items-baseline mb-1.5 gap-3">
                        <span className={`text-xs font-medium ${p.estado === 'estourado' ? 'text-rose-400' : p.estado === 'alerta' ? 'text-amber-400' : 'text-slate-400'}`}>
                          {p.pct.toFixed(0)}% utilizado
                          {p.estado === 'estourado' && <span className="inline-flex items-center gap-1 ml-2"><AlertTriangle size={11} /> Ultrapassou o limite</span>}
                          {p.estado === 'alerta' && <span className="ml-2">· perto do limite</span>}
                        </span>
                        <CurrencyValue value={p.gasto} size="lg" className="font-semibold min-w-0 text-white" />
                      </div>
                      <div className="w-full bg-[#1e293b] h-1.5 rounded-full overflow-hidden">
                        <div className={`h-full ${corBarra} transition-all duration-700`} style={{ width: `${Math.min(100, p.pct)}%` }} />
                      </div>
                    </>
                  ) : (
                    <p className="text-xs text-slate-500">Sem limite definido para esta categoria.</p>
                  )}
                </div>

                <div className="w-full md:w-40 shrink-0">
                  <label className="block text-xs font-medium text-slate-400 mb-1 md:hidden">Limite mensal (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={inputs[categoria] ?? ''}
                    onChange={(e) => setInputs((prev) => ({ ...prev, [categoria]: e.target.value }))}
                    placeholder="Sem limite"
                    className="w-full bg-[#070b14] border border-[#1e293b] rounded-xl px-3 py-2.5 text-white text-sm focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>
            );
          })}
        </div>

        <button
          type="submit"
          disabled={salvando}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-5 py-3 rounded-xl font-medium transition-colors"
        >
          <Save size={16} /> {salvando ? 'Salvando...' : 'Salvar limites'}
        </button>
      </form>

      {toast.show && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />
      )}
    </div>
  );
}
