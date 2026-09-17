import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import logoPreta from '../../assets/logo-black.png';

/**
 * Moldura compartilhada pelas páginas públicas de Termos e Privacidade.
 *
 * Usa a mesma linguagem das telas de acesso — fundo branco, IBM Plex Sans —
 * e limita a largura do texto para manter a linha em torno de 70 caracteres,
 * que é o que torna um documento longo confortável de ler.
 */
export default function LegalLayout({ titulo, atualizadoEm, children }) {
  return (
    <div className="font-plex min-h-screen bg-white">
      <div className="mx-auto w-full max-w-3xl px-6 py-10 sm:px-10">

        <div className="mb-8 flex items-center gap-4">
          <Link
            to="/login"
            aria-label="Voltar para o acesso"
            className="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:border-slate-300 hover:text-slate-900"
          >
            <ArrowLeft size={18} />
          </Link>
          <img src={logoPreta} alt="Capital Cycle" className="h-9 w-auto object-contain" />
        </div>

        <header className="border-b border-slate-200 pb-6">
          <h1 className="text-[2rem] font-bold leading-tight tracking-tight text-slate-950">
            {titulo}
          </h1>
          <p className="mt-2 text-sm text-slate-500">Última atualização: {atualizadoEm}</p>
          <p className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-[0.85rem] leading-relaxed text-slate-600">
            O Capital Cycle é um projeto acadêmico, desenvolvido como Trabalho de
            Conclusão de Curso. Este documento descreve, em linguagem simples, como o
            sistema funciona na prática. Ele não passou por revisão de profissional
            do direito.
          </p>
        </header>

        <div className="pb-16">{children}</div>

        <footer className="border-t border-slate-200 py-8 text-sm text-slate-500">
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link to="/termos" className="text-primary hover:underline">Termos de Uso</Link>
            <Link to="/privacidade" className="text-primary hover:underline">Política de Privacidade</Link>
            <Link to="/login" className="hover:underline">Voltar para o acesso</Link>
          </div>
        </footer>

      </div>
    </div>
  );
}

/** Seção numerada do documento. */
export function Secao({ numero, titulo, children }) {
  return (
    <section className="mt-10">
      <h2 className="text-[1.05rem] font-semibold tracking-tight text-slate-950">
        {numero}. {titulo}
      </h2>
      <div className="mt-3 space-y-3 text-[0.95rem] leading-relaxed text-slate-600">
        {children}
      </div>
    </section>
  );
}
