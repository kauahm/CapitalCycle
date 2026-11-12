import React from 'react';
import { RefreshCw } from 'lucide-react';

/* Última linha de defesa: um erro de renderização em qualquer tela deixava a
   aplicação inteira em branco, sem mensagem. Aqui ele vira uma tela com
   caminho de volta, e o detalhe técnico fica no console. */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { erro: null };
  }

  static getDerivedStateFromError(erro) {
    return { erro };
  }

  componentDidCatch(erro, info) {
    console.error('[CapitalCycle] Erro de renderização:', erro, info?.componentStack);
  }

  render() {
    if (!this.state.erro) return this.props.children;

    return (
      <div className="min-h-screen flex items-center justify-center bg-[#07070b] text-white p-6">
        <div className="max-w-md w-full text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4">CapitalCycle</p>
          <h1 className="text-2xl font-bold mb-3">Algo saiu do lugar</h1>
          <p className="text-sm text-slate-400 leading-relaxed mb-8">
            Esta tela encontrou um erro inesperado. Seus dados estão seguros — recarregue a
            página para continuar de onde parou.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-primary hover:bg-indigo-500 text-sm font-semibold transition-colors"
          >
            <RefreshCw size={16} /> Recarregar
          </button>
        </div>
      </div>
    );
  }
}
