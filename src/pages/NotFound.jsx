import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

/* Antes qualquer rota desconhecida redirecionava para a home em silêncio:
   quem digitava um endereço errado não sabia o que tinha acontecido. */
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#07070b] text-white p-6">
      <div className="max-w-md w-full text-center">
        <p className="text-[5rem] font-black leading-none tracking-tight text-primary/80">404</p>
        <h1 className="mt-4 text-2xl font-bold">Página não encontrada</h1>
        <p className="mt-3 text-sm text-slate-400 leading-relaxed">
          O endereço que você abriu não existe ou foi movido.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-primary hover:bg-indigo-500 text-sm font-semibold transition-colors"
          >
            <ArrowLeft size={16} /> Voltar para o início
          </Link>
          <Link
            to="/capital/dashboard"
            className="inline-flex items-center justify-center h-11 px-5 rounded-xl border border-white/15 hover:bg-white/5 text-sm font-semibold transition-colors"
          >
            Ir para o painel
          </Link>
        </div>
      </div>
    </div>
  );
}
