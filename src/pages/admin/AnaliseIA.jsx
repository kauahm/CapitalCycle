import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Sparkles, Send, Bot, User, TrendingUp, AlertTriangle, Lightbulb, Database, Eraser, ShieldCheck,
} from 'lucide-react';
import { collection, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../../services/firebase';
import UpgradeModal from '../../components/ui/UpgradeModal';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { canConsultarIA, getLimits, mesAtualKey } from '../../components/ui/plans';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { renderMarkdown } from '../../utils/markdownSimples';
import { montarContextoFinanceiro } from '../../utils/advisorContexto';

// ─────────────────────────────────────────────────────────
// Configuração interna — vive só no .env da raiz do projeto,
// nunca na interface:
//   VITE_GEMINI_API_KEY=sua_chave_aqui
//   VITE_GEMINI_MODEL=gemini-3.6-flash   ← opcional
// ─────────────────────────────────────────────────────────
const ENV_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const ENV_MODEL = import.meta.env.VITE_GEMINI_MODEL || '';

// Fallback usado quando o .env não define o modelo. Precisa acompanhar o
// valor aprovado no .env.
const MODELO_PADRAO = 'gemini-3.6-flash';

/* Teto de espera de UMA tentativa. Medido contra a API: o tempo total variou
   de 3,4s a 49,4s. 30s corta a cauda longa antes que pareça travamento. */
const TIMEOUT_MS = 30000;
const ESPERA_RETENTATIVA_MS = 1200;

/* Status que valem uma segunda tentativa. O 429 NÃO entra: a chave está no
   nível gratuito e repetir 1,2s depois cai no mesmo balde. */
const STATUS_TRANSITORIO = new Set([500, 502, 503, 504]);

/* `thinkingLevel: 'low'`: para finanças pessoais o raciocínio longo era
   desproporcional (≈83% dos tokens) e dobrava a espera. */
const GENERATION_CONFIG = {
  thinkingConfig: { thinkingLevel: 'low' },
  maxOutputTokens: 1200,
  temperature: 0.7,
};

const SYSTEM_PROMPT = `Você é o Capital Advisor, assistente financeiro pessoal do sistema CapitalCycle.
Ajude o usuário a entender finanças, otimizar gastos e acompanhar metas.
Responda sempre em português do Brasil, de forma concisa e prática.
Use bullet points e valores numéricos quando relevante.
Nunca invente dados que o usuário não mencionou e que não estejam no contexto fornecido.
Quando houver um bloco de contexto financeiro, baseie-se nele e cite os números.
Ao sugerir investimentos, sempre mencione os riscos envolvidos e deixe claro que não é recomendação profissional.`;

const SUGESTOES = [
  'Onde estou gastando mais este mês?',
  'Quanto consigo guardar por mês com a minha renda?',
  'Estou no ritmo para bater minhas metas?',
  'Como montar uma reserva de emergência?',
];

const MENSAGEM_INICIAL = {
  id: 1,
  role: 'ai',
  text: 'Olá! Sou o Capital Advisor. Posso analisar seus gastos, metas e orçamento — ative "usar meus dados" para respostas com os seus números.',
};

// Monta o histórico no formato Gemini (system prompt injetado como 1º par;
// o contexto financeiro, quando ligado, entra logo depois).
function buildPayload(history, contexto) {
  const abertura = [
    { role: 'user', parts: [{ text: `[Instruções do sistema]\n${SYSTEM_PROMPT}` }] },
    { role: 'model', parts: [{ text: 'Entendido. Sou o Capital Advisor, pronto para ajudar.' }] },
  ];
  if (contexto) {
    abertura.push({ role: 'user', parts: [{ text: contexto }] });
    abertura.push({ role: 'model', parts: [{ text: 'Recebi o contexto financeiro e vou usá-lo nas respostas.' }] });
  }
  return {
    generationConfig: GENERATION_CONFIG,
    contents: [
      ...abertura,
      ...history
        .filter((m) => m.id !== 1)
        .map((m) => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.text }] })),
    ],
  };
}

export default function AnaliseIA() {
  const toast = useToast();
  const [messages, setMessages] = useState([MENSAGEM_INICIAL]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const sendLockRef = useRef(false);
  const [error, setError] = useState(null);
  const [avisoCota, setAvisoCota] = useState(null);

  const apiKey = ENV_KEY;
  const model = ENV_MODEL || MODELO_PADRAO;

  const { userProfile, currentUser, updateUserProfile } = useAuth();
  const planId = userProfile?.plan || 'jovem';
  const limiteIA = getLimits(planId).consultasIAMes;
  const mesKey = mesAtualKey();
  const [usoMes, setUsoMes] = useState(0);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  // ── Contexto financeiro (opt-in) ──────────────────────────────────
  // A preferência fica no perfil para valer entre sessões. Os dados são
  // lidos sob demanda, no envio, e resumidos antes de sair do navegador.
  const usarDados = Boolean(userProfile?.advisorContexto);
  const [salvandoPreferencia, setSalvandoPreferencia] = useState(false);
  const contextoCache = useRef({ em: 0, texto: null, resumo: null });

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isTyping]);

  // Carrega o contador de consultas de IA do mês corrente
  useEffect(() => {
    if (!currentUser) return undefined;
    let active = true;
    getDoc(doc(db, 'usuarios', currentUser.uid))
      .then((snap) => {
        const uso = snap.exists() ? (snap.data().iaUso?.[mesKey] || 0) : 0;
        if (active) setUsoMes(uso);
      })
      .catch((err) => {
        console.error('[Capital Advisor] Falha ao carregar o contador de consultas:', err?.code || err?.message);
      });
    return () => { active = false; };
  }, [currentUser, mesKey]);

  const alternarDados = async () => {
    setSalvandoPreferencia(true);
    try {
      await updateUserProfile({ advisorContexto: !usarDados });
      contextoCache.current = { em: 0, texto: null, resumo: null };
      toast.info(!usarDados
        ? 'O Advisor passa a receber um resumo agregado dos seus dados a cada pergunta.'
        : 'O Advisor volta a responder só com o que você escrever.');
    } catch (err) {
      console.error('[Capital Advisor] Falha ao salvar preferência:', err?.code || err?.message);
      toast.error('Não foi possível salvar a preferência.');
    } finally {
      setSalvandoPreferencia(false);
    }
  };

  /* Lê as coleções uma vez por minuto, no máximo, e devolve o bloco de
     contexto. Uma falha aqui não derruba a pergunta: segue sem contexto. */
  const obterContexto = async () => {
    if (!usarDados || !currentUser) return null;
    const cache = contextoCache.current;
    if (cache.texto && Date.now() - cache.em < 60_000) return cache.texto;
    try {
      const uid = currentUser.uid;
      const porUid = (nome) => getDocs(query(collection(db, nome), where('uid', '==', uid)));
      const [contasSnap, txSnap, ciclosSnap, orcSnap] = await Promise.all([
        porUid('accounts'), porUid('transactions'), porUid('ciclos'),
        getDoc(doc(db, 'orcamentosPorCategoria', uid)),
      ]);
      const ciclos = ciclosSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      const metas = ciclos.filter((c) => c.tipo === 'Meta');
      const aportesPorMeta = await Promise.all(metas.map(async (m) => {
        const s = await getDocs(query(collection(db, 'ciclos', m.id, 'aportes'), where('uid', '==', uid)));
        return [m.id, s.docs.map((d) => d.data())];
      }));
      const { texto, resumo } = montarContextoFinanceiro({
        contas: contasSnap.docs.map((d) => d.data()),
        transacoes: txSnap.docs.map((d) => d.data()),
        ciclos,
        aportesMap: Object.fromEntries(aportesPorMeta),
        limites: orcSnap.exists() ? (orcSnap.data().limites || {}) : {},
        rendaMensal: parseFloat(userProfile?.renda_mensal) || 0,
      });
      contextoCache.current = { em: Date.now(), texto, resumo };
      return texto;
    } catch (err) {
      console.error('[Capital Advisor] Falha ao montar contexto:', err?.code || err?.message);
      toast.warning('Não consegui ler seus dados agora. Respondendo sem o contexto.');
      return null;
    }
  };

  // Debita 1 consulta da cota. Só é chamada depois que a resposta do Advisor
  // já está na tela, então nada aqui pode descartá-la.
  const registrarConsulta = async (novoUso) => {
    setUsoMes(novoUso);
    try {
      await updateDoc(doc(db, 'usuarios', currentUser.uid), { [`iaUso.${mesKey}`]: novoUso });
    } catch (err) {
      console.error('[Capital Advisor] Falha ao sincronizar o contador de consultas:', err?.code || err?.message);
      setAvisoCota('Não foi possível sincronizar o contador de consultas. Tente recarregar a página mais tarde.');
    }
  };

  const tentarConsulta = async (history, contexto) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const ctrl = new AbortController();
    const alarme = setTimeout(() => ctrl.abort(), TIMEOUT_MS);

    let res;
    try {
      res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload(history, contexto)),
        signal: ctrl.signal,
      });
    } catch (err) {
      if (err?.name === 'AbortError') {
        console.error(`[Capital Advisor] Tempo esgotado apos ${TIMEOUT_MS}ms.`);
        const e = new Error('TIMEOUT');
        e.transitorio = false;
        throw e;
      }
      console.error('[Capital Advisor] Falha de rede:', err?.message);
      const e = new Error('REDE');
      e.transitorio = true;
      throw e;
    } finally {
      clearTimeout(alarme);
    }

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      const msgTecnica = errJson?.error?.message || `Erro ${res.status}`;
      console.error(`[Capital Advisor] Falha na consulta (HTTP ${res.status}): ${msgTecnica}`);
      const e = new Error(String(res.status));
      e.status = res.status;
      e.transitorio = STATUS_TRANSITORIO.has(res.status);
      e.naoEncontrado = msgTecnica.includes('not found') || msgTecnica.includes('not supported');
      throw e;
    }

    const data = await res.json();
    const aiText = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).filter(Boolean).join('');
    if (!aiText || !aiText.trim()) {
      const motivo = data?.candidates?.[0]?.finishReason || 'sem finishReason';
      console.error(`[Capital Advisor] Resposta sem texto utilizável no payload (${motivo}).`);
      const e = new Error('VAZIA');
      e.transitorio = true;
      throw e;
    }
    return aiText;
  };

  const consultarAdvisor = async (history, contexto) => {
    for (let tentativa = 1; tentativa <= 2; tentativa++) {
      try {
        return await tentarConsulta(history, contexto);
      } catch (err) {
        const ultima = tentativa === 2;
        if (err?.transitorio && !ultima) {
          console.warn(`[Capital Advisor] Tentativa ${tentativa} falhou (${err.message}); repetindo uma vez.`);
          await new Promise((r) => setTimeout(r, ESPERA_RETENTATIVA_MS));
          continue;
        }
        if (err?.message === 'TIMEOUT') throw new Error('O Capital Advisor está demorando mais que o esperado. Tente novamente em alguns instantes.');
        if (err?.message === 'REDE') throw new Error('Não foi possível conectar. Verifique sua internet e tente novamente.');
        if (err?.status === 429) throw new Error('Muitas consultas em pouco tempo. Aguarde cerca de um minuto e tente novamente.');
        if (err?.status && err.status >= 500) throw new Error('O Capital Advisor está temporariamente indisponível. Tente novamente em alguns instantes.');
        if (err?.naoEncontrado) throw new Error('O Capital Advisor está indisponível no momento. Tente novamente mais tarde.');
        throw new Error('Não foi possível falar com o Capital Advisor agora. Tente novamente em alguns instantes.');
      }
    }
    throw new Error('Não foi possível falar com o Capital Advisor agora. Tente novamente em alguns instantes.');
  };

  const enviar = async (texto) => {
    const pergunta = (texto ?? input).trim();
    if (!pergunta || isTyping) return;

    if (!apiKey) {
      setError('O Capital Advisor está indisponível no momento. Tente novamente mais tarde.');
      return;
    }
    if (!canConsultarIA(planId, usoMes)) {
      setUpgradeOpen(true);
      return;
    }
    if (sendLockRef.current) return;
    sendLockRef.current = true;

    const userMsg = { id: Date.now(), role: 'user', text: pergunta };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput('');
    setIsTyping(true);
    setError(null);
    setAvisoCota(null);

    try {
      const contexto = await obterContexto();
      const aiText = await consultarAdvisor(updated, contexto);
      setMessages((prev) => [...prev, { id: Date.now() + 1, role: 'ai', text: aiText, comContexto: Boolean(contexto) }]);
      if (limiteIA != null) await registrarConsulta(usoMes + 1);
    } catch (e) {
      if (e instanceof TypeError) {
        console.error('[Capital Advisor] Falha de rede:', e.message);
        setError('Não foi possível conectar. Verifique sua internet e tente novamente.');
      } else {
        setError(e.message);
      }
    } finally {
      sendLockRef.current = false;
      setIsTyping(false);
      inputRef.current?.focus();
    }
  };

  const handleSend = (e) => { e.preventDefault(); enviar(); };

  const limparConversa = () => {
    setMessages([MENSAGEM_INICIAL]);
    setError(null);
    setAvisoCota(null);
  };

  const conversaVazia = messages.length <= 1;
  const restantes = limiteIA != null ? Math.max(0, limiteIA - usoMes) : null;
  const resumoContexto = contextoCache.current.resumo;
  const guias = useMemo(() => ([
    { Icon: TrendingUp, cor: 'bg-emerald-500/10 text-emerald-400', titulo: 'Sobre seus gastos', texto: 'Peça uma leitura de qual categoria pesou mais no mês e o que dá para ajustar.' },
    { Icon: AlertTriangle, cor: 'bg-rose-500/10 text-rose-400', titulo: 'Sobre o orçamento', texto: 'Pergunte se os limites por categoria estão realistas para a sua renda.' },
    { Icon: Lightbulb, cor: 'bg-primary/10 text-indigo-300', titulo: 'Sobre suas metas', texto: 'Pergunte se o ritmo atual é suficiente para bater uma meta antes do prazo.' },
  ]), []);

  return (
    <div className="flex flex-col gap-5 h-[calc(100vh-var(--cc-topbar)-var(--cc-gutter)-2.5rem)] min-h-[560px]">

      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <p className="text-sm text-textSecondary max-w-xl">Converse com o assistente sobre seus gastos, metas e orçamento.</p>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {limiteIA != null && (
            <Badge tone={restantes === 0 ? 'danger' : 'neutral'} className="px-3 py-2 text-xs">
              {restantes === 0 ? 'Cota do mês esgotada' : `${restantes} consulta${restantes === 1 ? '' : 's'} restantes`}
            </Badge>
          )}
          <button
            type="button"
            role="switch"
            aria-checked={usarDados}
            onClick={alternarDados}
            disabled={salvandoPreferencia}
            title="Quando ligado, um resumo agregado dos seus dados (sem lançamentos individuais) acompanha cada pergunta."
            className={`inline-flex items-center gap-2 h-9 px-3 rounded-xl border text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              usarDados ? 'bg-primary/15 border-primary/40 text-indigo-200' : 'bg-surface border-hairline text-textSecondary hover:text-textMain'
            } disabled:opacity-60`}
          >
            <Database size={14} aria-hidden="true" />
            Usar meus dados
            <span className={`relative inline-block w-8 h-[18px] rounded-full transition-colors ${usarDados ? 'bg-primary' : 'bg-hairline'}`} aria-hidden="true">
              <span className={`absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white transition-transform ${usarDados ? 'translate-x-[16px]' : 'translate-x-[2px]'}`} />
            </span>
          </button>
          {!conversaVazia && (
            <Button variant="ghost" size="sm" icon={Eraser} onClick={limparConversa} disabled={isTyping}>Limpar</Button>
          )}
        </div>
      </div>

      {/* Guia rápido — some quando a conversa começa, para dar espaço ao chat */}
      {conversaVazia && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[var(--cc-gap-card)] shrink-0">
          {guias.map(({ Icon, cor, titulo, texto }) => (
            <div key={titulo} className="cc-card p-5 flex gap-4 items-start">
              <div className={`p-3 rounded-xl shrink-0 ${cor}`}><Icon size={20} /></div>
              <div>
                <h4 className="text-textMain font-semibold text-sm mb-1">{titulo}</h4>
                <p className="text-xs text-textSecondary leading-relaxed">{texto}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Chat */}
      <div className="flex-1 cc-card flex flex-col overflow-hidden min-h-0">
        <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-6" aria-live="polite">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 md:gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center shrink-0 text-white ${msg.role === 'user' ? 'bg-slate-700' : 'bg-primary'}`} aria-hidden="true">
                {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
              </div>
              <div className="max-w-[85%] md:max-w-[75%] space-y-1.5">
                <div className={`rounded-2xl p-4 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-hairline text-textMain rounded-tr-sm whitespace-pre-wrap'
                    : 'bg-primary/10 border border-primary/20 text-slate-200 rounded-tl-sm'
                }`}>
                  {msg.role === 'user' ? msg.text : renderMarkdown(msg.text)}
                </div>
                {msg.comContexto && (
                  <p className="text-[10px] text-slate-500 flex items-center gap-1 pl-1"><Database size={10} /> Resposta com base nos seus dados</p>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 md:gap-4" role="status" aria-label="Capital Advisor digitando">
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-primary flex items-center justify-center shrink-0"><Bot size={18} className="text-white" /></div>
              <div className="bg-primary/10 border border-primary/20 rounded-2xl rounded-tl-sm p-4 flex gap-1 items-center">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          )}

          {error && (
            <div className="flex gap-3 items-start bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4" role="alert">
              <AlertTriangle size={15} className="text-rose-400 mt-0.5 shrink-0" />
              <p className="text-rose-300 text-xs leading-relaxed">{error}</p>
            </div>
          )}
          {avisoCota && (
            <div className="flex gap-3 items-start bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4">
              <AlertTriangle size={15} className="text-amber-400 mt-0.5 shrink-0" />
              <p className="text-amber-300 text-xs leading-relaxed">{avisoCota}</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Sugestões + input */}
        <div className="p-4 border-t border-hairline bg-app space-y-3">
          {conversaVazia && apiKey && (
            <div className="flex gap-2 overflow-x-auto pb-1 -mb-1 [scrollbar-width:none]">
              {SUGESTOES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => enviar(s)}
                  disabled={isTyping}
                  className="shrink-0 text-xs px-3 py-2 rounded-full border border-hairline bg-surface text-textSecondary hover:text-textMain hover:border-primary/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
          <form onSubmit={handleSend} className="relative flex items-center">
            <label htmlFor="advisor-input" className="sr-only">Pergunta ao Capital Advisor</label>
            <input
              id="advisor-input"
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isTyping || !apiKey}
              autoComplete="off"
              placeholder={apiKey ? 'Pergunte sobre seus gastos, metas ou orçamento…' : 'Capital Advisor indisponível no momento…'}
              className="w-full bg-surface border border-hairline text-textMain rounded-2xl pl-5 pr-14 py-4 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors disabled:opacity-50 placeholder:text-slate-600"
            />
            <button
              type="submit"
              aria-label="Enviar pergunta"
              disabled={!input.trim() || isTyping || !apiKey}
              className="absolute right-2 p-2.5 bg-primary hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Send size={18} />
            </button>
          </form>
          <p className="text-center text-[10px] text-slate-500 font-medium flex items-center justify-center gap-1.5">
            <ShieldCheck size={11} aria-hidden="true" />
            {usarDados
              ? `Com "usar meus dados" ligado, só totais agregados são enviados${resumoContexto ? ` (${resumoContexto.lancamentos} lançamentos do mês resumidos)` : ''}. O Advisor pode cometer erros.`
              : 'O Advisor só recebe o que você escrever. Ele pode cometer erros — confira informações importantes.'}
          </p>
        </div>
      </div>

      <UpgradeModal feature="consultasIA" open={upgradeOpen} onClose={() => setUpgradeOpen(false)} />
    </div>
  );
}
