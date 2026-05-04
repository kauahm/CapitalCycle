import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Bot, User, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';

export default function AnaliseIA() {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      role: 'ai', 
      text: 'Olá! Sou o Capital Advisor, sua inteligência artificial financeira. Analisei seu padrão de gastos recentes. Como posso ajudar você a otimizar seu patrimônio hoje?' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Faz o scroll automático para a última mensagem
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Adiciona a mensagem do usuário
    const userMsg = { id: Date.now(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simula o tempo de resposta da IA (Para a apresentação do TCC)
    setTimeout(() => {
      setIsTyping(false);
      const aiMsg = { 
        id: Date.now() + 1, 
        role: 'ai', 
        text: 'Nesta versão de demonstração, estou simulando uma resposta. Para que eu leia seus dados reais, basta conectar minha API (OpenAI/Gemini) no seu backend! Baseado nos seus últimos registros, recomendo investir 20% do saldo atual no Tesouro Selic para compor sua Reserva de Emergência.' 
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 1500);
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
      </div>

      {/* INSIGHTS RÁPIDOS (Cards Superiores) */}
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
            <p className="text-xs text-slate-400 leading-relaxed">Os gastos com "Alimentação" subiram 18% em relação ao mês passado.</p>
          </div>
        </div>

        <div className="bg-indigo-600 p-5 rounded-2xl flex gap-4 items-start shadow-lg shadow-indigo-600/20 text-white">
          <div className="p-3 bg-white/20 rounded-xl shrink-0"><Lightbulb size={20} /></div>
          <div>
            <h4 className="font-bold text-sm mb-1">Dica do Advisor</h4>
            <p className="text-xs text-indigo-100 leading-relaxed">A meta "Viagem Japão" está atrasada. Tente poupar mais R$ 150/mês.</p>
          </div>
        </div>
      </div>

      {/* ÁREA DO CHAT */}
      <div className="flex-1 bg-[#101623] border border-[#1e293b] rounded-3xl flex flex-col overflow-hidden min-h-[400px]">
        
        {/* Histórico de Mensagens */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              
              {/* Avatar */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-slate-700 text-white' : 'bg-indigo-600 text-white'}`}>
                {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>

              {/* Balão de Mensagem */}
              <div className={`max-w-[75%] rounded-2xl p-4 text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-[#1e293b] text-white rounded-tr-sm' 
                  : 'bg-indigo-500/10 border border-indigo-500/20 text-slate-200 rounded-tl-sm'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          
          {/* Indicador de Digitação */}
          {isTyping && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
                <Bot size={20} className="text-white" />
              </div>
              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl rounded-tl-sm p-4 flex gap-1 items-center">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input de Mensagem */}
        <div className="p-4 border-t border-[#1e293b] bg-[#070b14]">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pergunte sobre seus investimentos, gastos ou metas..."
              className="w-full bg-[#101623] border border-[#1e293b] text-white rounded-2xl pl-5 pr-14 py-4 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <button 
              type="submit"
              disabled={!input.trim() || isTyping}
              className="absolute right-2 p-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl transition-colors"
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