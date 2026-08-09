import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles, Send, Bot, User,
  TrendingUp, AlertTriangle, Lightbulb,
  Key, Eye, EyeOff, Settings
} from 'lucide-react';

// ─────────────────────────────────────────────────────────
// Configure no arquivo .env na raiz do projeto:
//   VITE_GEMINI_API_KEY=sua_chave_aqui
//   VITE_GEMINI_MODEL=gemini-1.5-flash   ← opcional
// ─────────────────────────────────────────────────────────
const ENV_KEY   = import.meta.env.VITE_GEMINI_API_KEY || '';
const ENV_MODEL = import.meta.env.VITE_GEMINI_MODEL   || '';

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
  const [showConfig, setShowConfig] = useState(!ENV_KEY);

  // Campos de configuração — só ativam ao clicar "Salvar"
  const [apiKey, setApiKey]         = useState(ENV_KEY);
  const [model, setModel]           = useState(ENV_MODEL || 'gemini-3.5-flash');
  const [keyDraft, setKeyDraft]     = useState('');
  const [modelDraft, setModelDraft] = useState(ENV_MODEL || 'gemini-3.5-flash');
  const [showKey, setShowKey]       = useState(false);

  const messagesEndRef = useRef(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSaveConfig = () => {
    const key = keyDraft.trim() || apiKey;
    if (!key) return;
    setApiKey(key);
    setModel(modelDraft.trim() || model);
    setShowConfig(false);
    setError(null);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    if (!apiKey) {
      setError('Configure a API Key primeiro.');
      setShowConfig(true);
      return;
    }

    const userMsg = { id: Date.now(), role: 'user', text: input.trim() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput('');
    setIsTyping(true);
    setError(null);

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload(updated))
      });

      // Tenta extrair mensagem de erro da API
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        const msg = errJson?.error?.message || `Erro ${res.status}`;

        if (res.status === 429)
          throw new Error('Cota atingida. Aguarde alguns minutos ou use outra conta Google.');

        if (msg.includes('not found') || msg.includes('not supported'))
          throw new Error(
            `Modelo "${model}" não encontrado nessa chave.\n` +
            `Tente: gemini-pro, gemini-1.5-flash ou gemini-1.5-pro.`
          );

        throw new Error(msg);
      }

      const data = await res.json();
      const aiText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        'Não consegui gerar uma resposta. Tente novamente.';

      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: aiText }]);

    } catch (e) {
      setError(e.message);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-8rem)]">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="text-indigo-400" size={28} /> Capital Advisor
          </h1>
          <p className="text-slate-400 text-sm">Seu assistente financeiro movido a Inteligência Artificial.</p>
        </div>

        <button
          onClick={() => setShowConfig(v => !v)}
          className={`flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl border transition-colors ${
            apiKey
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20'
          }`}
        >
          <Settings size={13} />
          {apiKey ? `Configurado · ${model}` : 'Configurar API'}
        </button>
      </div>

      {/* PAINEL DE CONFIGURAÇÃO */}
      {showConfig && (
        <div className="bg-[#101623] border border-indigo-500/25 rounded-2xl p-5 shrink-0 space-y-4">
          <p className="text-white font-bold text-sm flex items-center gap-2">
            <Key size={14} className="text-indigo-400" /> Configuração da API Gemini
          </p>

          <div className="bg-[#070b14] border border-[#1e293b] rounded-xl px-4 py-3 text-xs font-mono text-emerald-400">
            {'# .env (raiz do projeto — recomendado)\nVITE_GEMINI_API_KEY=sua_chave_aqui\nVITE_GEMINI_MODEL=gemini-1.5-flash'}
          </div>

          <p className="text-slate-400 text-xs">
            Ou preencha abaixo para esta sessão. Gere sua chave em{' '}
            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer"
              className="text-indigo-400 underline">aistudio.google.com
            </a>.
          </p>

          {/* API Key */}
          <div>
            <label className="text-xs text-slate-500 font-semibold mb-1 block">API KEY</label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={keyDraft}
                onChange={e => setKeyDraft(e.target.value)}
                placeholder={apiKey ? '••••••••••••••••••••••' : 'Cole sua API Key aqui...'}
                className="w-full bg-[#070b14] border border-[#1e293b] text-white rounded-xl pl-4 pr-10 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors font-mono"
              />
              <button type="button" onClick={() => setShowKey(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {/* Modelo */}
          <div>
            <label className="text-xs text-slate-500 font-semibold mb-1 block">
              MODELO &nbsp;
              <span className="text-slate-600 font-normal normal-case">
                — sugestões: gemini-1.5-flash · gemini-1.5-pro · gemini-pro
              </span>
            </label>
            <input
              type="text"
              value={modelDraft}
              onChange={e => setModelDraft(e.target.value)}
              placeholder="gemini-1.5-flash"
              className="w-full bg-[#070b14] border border-[#1e293b] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors font-mono"
            />
          </div>

          <button
            onClick={handleSaveConfig}
            disabled={!keyDraft.trim() && !apiKey}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-sm font-bold rounded-xl transition-colors"
          >
            Salvar configuração
          </button>
        </div>
      )}

      {/* INSIGHTS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
        <div className="bg-[#101623] border border-[#1e293b] p-5 rounded-2xl flex gap-4 items-start">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl shrink-0"><TrendingUp size={20} /></div>
          <div>
            <h4 className="text-white font-bold text-sm mb-1">Oportunidade</h4>
            <p className="text-xs text-slate-400 leading-relaxed">Seu fluxo de caixa está positivo. Considere transferir R$ 500 para sua conta de Investimentos.</p>
          </div>
        </div>
        <div className="bg-[#101623] border border-[#1e293b] p-5 rounded-2xl flex gap-4 items-start">
          <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl shrink-0"><AlertTriangle size={20} /></div>
          <div>
            <h4 className="text-white font-bold text-sm mb-1">Alerta de Gasto</h4>
            <p className="text-xs text-slate-400 leading-relaxed">Os gastos com &quot;Alimentação&quot; subiram 18% em relação ao mês passado.</p>
          </div>
        </div>
        <div className="bg-indigo-600 p-5 rounded-2xl flex gap-4 items-start shadow-lg shadow-indigo-600/20">
          <div className="p-3 bg-white/20 rounded-xl shrink-0"><Lightbulb size={20} /></div>
          <div>
            <h4 className="font-bold text-sm mb-1 text-white">Dica do Advisor</h4>
            <p className="text-xs text-indigo-100 leading-relaxed">A meta &quot;Viagem Japão&quot; está atrasada. Tente poupar mais R$ 150/mês.</p>
          </div>
        </div>
      </div>

      {/* CHAT */}
      <div className="flex-1 bg-[#101623] border border-[#1e293b] rounded-3xl flex flex-col overflow-hidden min-h-[400px]">
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
                : 'Configure a API Key para começar...'}
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

    </div>
  );
}
