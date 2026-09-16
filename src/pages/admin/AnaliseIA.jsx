import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles, Send, Bot, User,
  TrendingUp, AlertTriangle, Lightbulb
} from 'lucide-react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import UpgradeModal from '../../components/ui/UpgradeModal';
import { canConsultarIA, getLimits, mesAtualKey } from '../../components/ui/plans';
import { useAuth } from '../../hooks/useAuth';

// ─────────────────────────────────────────────────────────
// Configuração interna — vive só no .env da raiz do projeto,
// nunca na interface:
//   VITE_GEMINI_API_KEY=sua_chave_aqui
//   VITE_GEMINI_MODEL=gemini-3.6-flash   ← opcional
// ─────────────────────────────────────────────────────────
const ENV_KEY   = import.meta.env.VITE_GEMINI_API_KEY || '';
const ENV_MODEL = import.meta.env.VITE_GEMINI_MODEL   || '';

// Fallback usado quando o .env não define o modelo. Precisa acompanhar o
// valor aprovado no .env — as duas pontas apontando para modelos diferentes
// foi o que deixou a tela quebrada quando o modelo antigo ficou indisponível.
const MODELO_PADRAO = 'gemini-3.6-flash';

const SYSTEM_PROMPT = `Você é o Capital Advisor, assistente financeiro pessoal do sistema CapitalCycle.
Ajude o usuário a entender finanças, otimizar gastos e acompanhar metas.
Responda sempre em português do Brasil, de forma concisa e prática.
Use bullet points e valores numéricos quando relevante.
Nunca invente dados que o usuário não mencionou.
Ao sugerir investimentos, sempre mencione os riscos envolvidos.`;

// Monta o histórico no formato Gemini (system prompt injetado como 1º par)
function buildPayload(history) {
  return {
    contents: [
      { role: 'user',  parts: [{ text: `[Instruções do sistema]\n${SYSTEM_PROMPT}` }] },
      { role: 'model', parts: [{ text: 'Entendido. Sou o Capital Advisor, pronto para ajudar.' }] },
      ...history
        .filter(m => m.id !== 1)
        .map(m => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }]
        }))
    ]
  };
}

export default function AnaliseIA() {
  const [messages, setMessages] = useState([{
    id: 1, role: 'ai',
    text: 'Olá! Sou o Capital Advisor. Como posso ajudar a otimizar seu patrimônio hoje?'
  }]);

  const [input, setInput]         = useState('');
  const [isTyping, setIsTyping]   = useState(false);
  const [error, setError]         = useState(null);
  // Aviso de sincronização da cota — separado de `error` de propósito: a
  // resposta do Advisor foi entregue, só a gravação do contador falhou.
  const [avisoCota, setAvisoCota] = useState(null);

  // Configuração de infraestrutura: só o .env decide, e nada disso aparece
  // para o usuário final.
  const apiKey = ENV_KEY;
  const model  = ENV_MODEL || MODELO_PADRAO;

  // Trava por plano: cota mensal de consultas de IA (plano Jovem)
  const { userProfile, currentUser } = useAuth();
  const planId = userProfile?.plan || 'jovem';
  const limiteIA = getLimits(planId).consultasIAMes;
  const mesKey = mesAtualKey();
  const [usoMes, setUsoMes] = useState(0);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  const messagesEndRef = useRef(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Carrega o contador de consultas de IA do mês corrente
  useEffect(() => {
    if (!currentUser) return;
    let active = true;
    getDoc(doc(db, 'usuarios', currentUser.uid))
      .then((snap) => {
        const uso = snap.exists() ? (snap.data().iaUso?.[mesKey] || 0) : 0;
        if (active) setUsoMes(uso);
      })
      .catch((err) => {
        // Falhar aqui deixa o contador em zero e pode liberar consultas além
        // da cota — não pode passar despercebido, mesmo sem afetar a tela.
        console.error('[Capital Advisor] Falha ao carregar o contador de consultas:', err?.code || err?.message);
      });
    return () => { active = false; };
  }, [currentUser, mesKey]);

  // Debita 1 consulta da cota. Só é chamada depois que a resposta do Advisor
  // já está na tela, então nada aqui pode descartá-la: a falha de gravação é
  // tratada aqui dentro e nunca escapa para o catch que trata a IA.
  const registrarConsulta = async (novoUso) => {
    setUsoMes(novoUso);
    try {
      await updateDoc(doc(db, 'usuarios', currentUser.uid), { [`iaUso.${mesKey}`]: novoUso });
    } catch (err) {
      console.error('[Capital Advisor] Falha ao sincronizar o contador de consultas:', err?.code || err?.message);
      setAvisoCota('Não foi possível sincronizar o contador de consultas. Tente recarregar a página mais tarde.');
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    if (!apiKey) {
      setError('O Capital Advisor está indisponível no momento. Tente novamente mais tarde.');
      return;
    }

    // Trava por plano: cota mensal de consultas do plano Jovem
    if (!canConsultarIA(planId, usoMes)) {
      setUpgradeOpen(true);
      return;
    }

    const userMsg = { id: Date.now(), role: 'user', text: input.trim() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput('');
    setIsTyping(true);
    setError(null);
    setAvisoCota(null);

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload(updated))
      });

      // O detalhe técnico fica no console para diagnóstico; o usuário recebe
      // sempre uma mensagem de produto, nunca o retorno cru da API.
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        const msgTecnica = errJson?.error?.message || `Erro ${res.status}`;
        console.error(`[Capital Advisor] Falha na consulta (HTTP ${res.status}): ${msgTecnica}`);

        if (res.status === 503 || res.status === 500 || res.status === 502 || res.status === 504)
          throw new Error('O Capital Advisor está temporariamente indisponível. Tente novamente em alguns instantes.');

        if (res.status === 429)
          throw new Error('Muitas consultas em pouco tempo. Aguarde alguns minutos e tente novamente.');

        if (msgTecnica.includes('not found') || msgTecnica.includes('not supported'))
          throw new Error('O Capital Advisor está indisponível no momento. Tente novamente mais tarde.');

        throw new Error('Não foi possível falar com o Capital Advisor agora. Tente novamente em alguns instantes.');
      }

      const data = await res.json();
      const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      // HTTP 200 não basta: sem texto utilizável não houve consulta respondida,
      // então isso é falha e não pode debitar cota.
      if (!aiText || !aiText.trim()) {
        console.error('[Capital Advisor] Resposta sem texto utilizável no payload.');
        throw new Error('Não foi possível falar com o Capital Advisor agora. Tente novamente em alguns instantes.');
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: aiText }]);

      // Daqui em diante a resposta já está entregue. Só agora a consulta é
      // contabilizada — e só quando o plano tem limite (Adulto é ilimitado e
      // não precisa de contador persistido).
      if (limiteIA != null) {
        await registrarConsulta(usoMes + 1);
      }

    } catch (e) {
      // Os throws acima já trazem texto de produto. O que sobra aqui é falha
      // de rede ou resposta malformada, cuja mensagem nativa é técnica —
      // essa fica só no console.
      if (e instanceof TypeError) {
        console.error('[Capital Advisor] Falha de rede:', e.message);
        setError('Não foi possível conectar. Verifique sua internet e tente novamente.');
      } else {
        setError(e.message);
      }
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-8rem)]">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <p className="text-sm text-slate-400">Converse com o assistente sobre seus gastos, investimentos e metas.</p>

        <div className="flex items-center gap-3 shrink-0">
          {limiteIA != null && (
            <span className={`text-xs font-semibold px-3 py-2 rounded-xl border whitespace-nowrap ${
              usoMes >= limiteIA
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                : 'bg-[#101623] border-[#1e293b] text-slate-400'
            }`}>
              {usoMes >= limiteIA
                ? 'Cota do mês esgotada'
                : `${limiteIA - usoMes} consulta${limiteIA - usoMes === 1 ? '' : 's'} restantes`}
            </span>
          )}
        </div>
      </div>

      {/* GUIA RÁPIDO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
        <div className="bg-[#101623] border border-[#1e293b] p-5 rounded-2xl flex gap-4 items-start">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl shrink-0"><TrendingUp size={20} /></div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-1">Sobre investimentos</h4>
            <p className="text-xs text-slate-400 leading-relaxed">Pergunte se faz sentido mover parte do seu saldo disponível para investimentos, com base no que você já tem cadastrado.</p>
          </div>
        </div>
        <div className="bg-[#101623] border border-[#1e293b] p-5 rounded-2xl flex gap-4 items-start">
          <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl shrink-0"><AlertTriangle size={20} /></div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-1">Sobre seus gastos</h4>
            <p className="text-xs text-slate-400 leading-relaxed">Peça uma leitura de qual categoria pesou mais no mês e o que dá pra ajustar.</p>
          </div>
        </div>
        <div className="bg-[#101623] border border-[#1e293b] p-5 rounded-2xl flex gap-4 items-start">
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl shrink-0"><Lightbulb size={20} /></div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-1">Sobre suas metas</h4>
            <p className="text-xs text-slate-400 leading-relaxed">Pergunte se o ritmo atual é suficiente para bater uma meta antes do prazo.</p>
          </div>
        </div>
      </div>

      {/* CHAT */}
      <div className="flex-1 bg-[#101623] border border-[#1e293b] rounded-2xl flex flex-col overflow-hidden min-h-[400px]">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {messages.map(msg => (
            <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white ${msg.role === 'user' ? 'bg-slate-700' : 'bg-indigo-600'}`}>
                {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div className={`max-w-[75%] rounded-2xl p-4 text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-[#1e293b] text-white rounded-tr-sm'
                  : 'bg-indigo-500/10 border border-indigo-500/20 text-slate-200 rounded-tl-sm'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
                <Bot size={20} className="text-white" />
              </div>
              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl rounded-tl-sm p-4 flex gap-1 items-center">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          )}

          {error && (
            <div className="flex gap-3 items-start bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4">
              <AlertTriangle size={15} className="text-rose-400 mt-0.5 shrink-0" />
              <p className="text-rose-300 text-xs leading-relaxed">{error}</p>
            </div>
          )}

          {/* Aviso próprio: a resposta acima continua válida, só o contador
              não foi sincronizado. Tom âmbar para não se confundir com falha
              do Advisor. */}
          {avisoCota && (
            <div className="flex gap-3 items-start bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4">
              <AlertTriangle size={15} className="text-amber-400 mt-0.5 shrink-0" />
              <p className="text-amber-300 text-xs leading-relaxed">{avisoCota}</p>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-[#1e293b] bg-[#070b14]">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={isTyping}
              placeholder={apiKey
                ? 'Pergunte sobre seus investimentos, gastos ou metas...'
                : 'Capital Advisor indisponível no momento...'}
              className="w-full bg-[#101623] border border-[#1e293b] text-white rounded-2xl pl-5 pr-14 py-4 focus:outline-none focus:border-indigo-500 transition-colors disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping || !apiKey}
              className="absolute right-2 p-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl transition-colors"
            >
              <Send size={18} />
            </button>
          </form>
          <p className="text-center text-[10px] text-slate-500 mt-3 font-medium">
            O Capital Advisor pode cometer erros. Considere verificar informações importantes.
          </p>
        </div>
      </div>

      {/* Modal de upgrade */}
      <UpgradeModal feature="consultasIA" open={upgradeOpen} onClose={() => setUpgradeOpen(false)} />

    </div>
  );
}