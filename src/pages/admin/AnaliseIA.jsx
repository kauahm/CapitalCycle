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
import { renderMarkdown } from '../../utils/markdownSimples';

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

/* Teto de espera de UMA tentativa.

   Medido contra a API antes de escolher, com o prompt "Quanto gastei este
   mes?": o tempo total variou de 3,4s a 49,4s, com casos de nao responder
   dentro de 50s. A variacao e do servico, nao do payload — o mesmo pedido
   curto ora volta em 3s, ora em 42s.

   Sem teto, a requisicao que nunca volta deixa o chat girando para sempre:
   e exatamente o sintoma de "as vezes nao responde".

   30s e um compromisso deliberado para a apresentacao: corta a cauda longa
   antes que ela pareca travamento, e ainda cobre a maioria das respostas
   observadas. */
const TIMEOUT_MS = 30000;

/* Espera curta antes da unica retentativa. */
const ESPERA_RETENTATIVA_MS = 1200;

/* Status que valem uma segunda tentativa: indisponibilidade momentanea do
   servico. Falham rapido, entao repetir custa pouco.

   O 429 NAO entra, apesar de ser transitorio. A chave esta no nivel
   gratuito, cujo limite medido e de 20 requisicoes por minuto neste
   modelo, e a propria API responde "please retry in 10-15s". Repetir 1,2s
   depois cai no mesmo balde e so dobra a espera antes da mesma mensagem —
   melhor avisar a pessoa na hora.

   Um 400 ou 403 tambem nao entra: repetir pedido malformado ou sem
   permissao da o mesmo erro. */
const STATUS_TRANSITORIO = new Set([500, 502, 503, 504]);

/* Configuracao de geracao.

   `thinkingLevel: 'low'` e a correcao central da lentidao. O modelo
   raciocina por padrao, e para as perguntas desta tela isso e desproporcional:
   na medicao, o pensamento respondia por cerca de 83% dos tokens gerados.
   Com o nivel baixo a mediana medida caiu de ~23s para ~12s, sem perda de
   qualidade percebida nas respostas de financas pessoais.

   `maxOutputTokens` limita a cauda: sem teto, uma resposta longa demais e
   outro caminho para a espera crescer. */
const GENERATION_CONFIG = {
  thinkingConfig: { thinkingLevel: 'low' },
  maxOutputTokens: 1200,
  temperature: 0.7,
};

const SYSTEM_PROMPT = `Você é o Capital Advisor, assistente financeiro pessoal do sistema CapitalCycle.
Ajude o usuário a entender finanças, otimizar gastos e acompanhar metas.
Responda sempre em português do Brasil, de forma concisa e prática.
Use bullet points e valores numéricos quando relevante.
Nunca invente dados que o usuário não mencionou.
Ao sugerir investimentos, sempre mencione os riscos envolvidos.`;

// Monta o histórico no formato Gemini (system prompt injetado como 1º par)
function buildPayload(history) {
  return {
    generationConfig: GENERATION_CONFIG,
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
  // Lock lógico do envio: `isTyping` é estado do React e só fecha a porta
  // depois do re-render, deixando passar um segundo clique disparado antes
  // disso — o que geraria duas consultas e duas cotas.
  const sendLockRef = useRef(false);
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

  /* Uma tentativa de consulta, com teto de espera.

     O `AbortController` e o que impede a UI de esperar para sempre: sem
     ele, uma conexao que nunca responde deixa o `await fetch` pendurado e
     o spinner girando indefinidamente. O `clearTimeout` no finally evita
     que o aborto dispare depois de a resposta ja ter chegado.

     Distingue as falhas que valem retentativa (`transitorio: true`) das
     que nao valem, para que quem chama decida — e nunca vaza o retorno
     cru da API nem a chave para a tela. */
  const tentarConsulta = async (history) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const ctrl = new AbortController();
    const alarme = setTimeout(() => ctrl.abort(), TIMEOUT_MS);

    let res;
    try {
      res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload(history)),
        signal: ctrl.signal,
      });
    } catch (err) {
      // `AbortError` e o nosso proprio teto batendo; `TypeError` e rede.
      // Os dois sao transitorios — vale uma segunda tentativa.
      /* Estourar o teto NAO e motivo para repetir: a pessoa ja esperou os
         30s, e uma segunda tentativa a faria esperar 60s para ver a mesma
         mensagem. Falha direto, com texto claro. */
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

    // O detalhe técnico fica no console para diagnóstico; o usuário recebe
    // sempre uma mensagem de produto, nunca o retorno cru da API.
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
    const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    /* HTTP 200 não basta: sem texto utilizável não houve consulta
       respondida, então isso é falha e não pode debitar cota.

       Tambem cai aqui a resposta cortada por `maxOutputTokens` antes de
       produzir texto — por isso conta como transitoria: repetir costuma
       resolver. */
    if (!aiText || !aiText.trim()) {
      const motivo = data?.candidates?.[0]?.finishReason || 'sem finishReason';
      console.error(`[Capital Advisor] Resposta sem texto utilizável no payload (${motivo}).`);
      const e = new Error('VAZIA');
      e.transitorio = true;
      throw e;
    }

    return aiText;
  };

  /* A consulta como a tela a enxerga: no maximo duas tentativas, e sempre
     terminando ou com texto util ou com uma mensagem de produto.

     A retentativa nao duplica nada: a mensagem do usuario ja esta no chat
     desde antes da primeira tentativa, e a cota so e debitada depois que
     esta funcao retorna texto. Uma consulta que falha nas duas tentativas
     nao consome cota — e a regra que ja existia, preservada. */
  const consultarAdvisor = async (history) => {
    for (let tentativa = 1; tentativa <= 2; tentativa++) {
      try {
        return await tentarConsulta(history);
      } catch (err) {
        const ultima = tentativa === 2;

        if (err?.transitorio && !ultima) {
          console.warn(`[Capital Advisor] Tentativa ${tentativa} falhou (${err.message}); repetindo uma vez.`);
          await new Promise((r) => setTimeout(r, ESPERA_RETENTATIVA_MS));
          continue;
        }

        // Acabou o que dava para tentar: vira mensagem de produto.
        if (err?.message === 'TIMEOUT') {
          throw new Error('O Capital Advisor está demorando mais que o esperado. Tente novamente em alguns instantes.');
        }
        if (err?.message === 'REDE') {
          throw new Error('Não foi possível conectar. Verifique sua internet e tente novamente.');
        }
        if (err?.status === 429) {
          throw new Error('Muitas consultas em pouco tempo. Aguarde cerca de um minuto e tente novamente.');
        }
        if (err?.status && err.status >= 500) {
          throw new Error('O Capital Advisor está temporariamente indisponível. Tente novamente em alguns instantes.');
        }
        if (err?.naoEncontrado) {
          throw new Error('O Capital Advisor está indisponível no momento. Tente novamente mais tarde.');
        }
        throw new Error('Não foi possível falar com o Capital Advisor agora. Tente novamente em alguns instantes.');
      }
    }
    // Inalcancavel: o laco ou retorna ou lanca. Fica pelo contrato explicito.
    throw new Error('Não foi possível falar com o Capital Advisor agora. Tente novamente em alguns instantes.');
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

    // Lock adquirido aqui: depois das saídas antecipadas, que não iniciam
    // consulta nenhuma, e antes da primeira mudança de estado do envio — se
    // viesse só antes do try, o segundo clique já teria inserido a mensagem
    // do usuário no chat duas vezes. Daqui até o fim, todo caminho passa
    // pelo finally.
    if (sendLockRef.current) return;
    sendLockRef.current = true;

    const userMsg = { id: Date.now(), role: 'user', text: input.trim() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput('');
    setIsTyping(true);
    setError(null);
    setAvisoCota(null);

    try {
      const aiText = await consultarAdvisor(updated);

      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: aiText }]);

      // Daqui em diante a resposta já está entregue. Só agora a consulta é
      // contabilizada — e só quando o plano tem limite (Adulto é ilimitado e
      // não precisa de contador persistido).
      if (limiteIA != null) {
        await registrarConsulta(usoMes + 1);
      }

    } catch (e) {
      // Os throws de `consultarAdvisor` já trazem texto de produto. O que
      // sobra aqui é falha de rede ou resposta malformada, cuja mensagem
      // nativa é técnica — essa fica só no console.
      if (e instanceof TypeError) {
        console.error('[Capital Advisor] Falha de rede:', e.message);
        setError('Não foi possível conectar. Verifique sua internet e tente novamente.');
      } else {
        setError(e.message);
      }
    } finally {
      sendLockRef.current = false;
      setIsTyping(false);
    }
  };

  return (
    /* A altura desconta a topbar e os recuos do main pelas MESMAS variaveis
       que os definem. Antes era `100vh-8rem` fixo, herdado da topbar de
       64px; com a topbar da referencia (88px em 1440, 117px em 1901) a
       conta ficava curta e o topo da tela — incluindo o contador de
       consultas — era cortado. */
    <div className="space-y-6 flex flex-col h-[calc(100vh-var(--cc-topbar)-var(--cc-gutter)-2.5rem)]">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <p className="text-sm text-slate-400">Converse com o assistente sobre seus gastos, investimentos e metas.</p>

        <div className="flex items-center gap-3 shrink-0">
          {limiteIA != null && (
            <span className={`text-xs font-semibold px-3 py-2 rounded-xl border whitespace-nowrap ${
              usoMes >= limiteIA
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                : 'bg-surface border-hairline text-slate-400'
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
        <div className="bg-surface border border-hairline p-5 rounded-2xl flex gap-4 items-start">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl shrink-0"><TrendingUp size={20} /></div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-1">Sobre investimentos</h4>
            <p className="text-xs text-slate-400 leading-relaxed">Pergunte se faz sentido mover parte do seu saldo disponível para investimentos, com base no que você já tem cadastrado.</p>
          </div>
        </div>
        <div className="bg-surface border border-hairline p-5 rounded-2xl flex gap-4 items-start">
          <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl shrink-0"><AlertTriangle size={20} /></div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-1">Sobre seus gastos</h4>
            <p className="text-xs text-slate-400 leading-relaxed">Peça uma leitura de qual categoria pesou mais no mês e o que dá pra ajustar.</p>
          </div>
        </div>
        <div className="bg-surface border border-hairline p-5 rounded-2xl flex gap-4 items-start">
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl shrink-0"><Lightbulb size={20} /></div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-1">Sobre suas metas</h4>
            <p className="text-xs text-slate-400 leading-relaxed">Pergunte se o ritmo atual é suficiente para bater uma meta antes do prazo.</p>
          </div>
        </div>
      </div>

      {/* CHAT */}
      <div className="flex-1 bg-surface border border-hairline rounded-2xl flex flex-col overflow-hidden min-h-[400px]">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {messages.map(msg => (
            <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white ${msg.role === 'user' ? 'bg-slate-700' : 'bg-indigo-600'}`}>
                {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              {/* A resposta do Advisor vem em Markdown e era impressa crua,
                  entao os `**negritos**` apareciam com os asteriscos na
                  tela. Agora passa pelo parser, que devolve elementos
                  React — nunca HTML, entao nao ha como o modelo injetar
                  markup. A mensagem do usuario continua texto puro: ela
                  nao e Markdown e interpretar asterisco que a pessoa
                  digitou seria errado. */}
              <div className={`max-w-[75%] rounded-2xl p-4 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-hairline text-white rounded-tr-sm whitespace-pre-wrap'
                  : 'bg-indigo-500/10 border border-indigo-500/20 text-slate-200 rounded-tl-sm'
              }`}>
                {msg.role === 'user' ? msg.text : renderMarkdown(msg.text)}
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
        <div className="p-4 border-t border-hairline bg-app">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={isTyping}
              placeholder={apiKey
                ? 'Pergunte sobre seus investimentos, gastos ou metas...'
                : 'Capital Advisor indisponível no momento...'}
              className="w-full bg-surface border border-hairline text-white rounded-2xl pl-5 pr-14 py-4 focus:outline-none focus:border-indigo-500 transition-colors disabled:opacity-50"
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