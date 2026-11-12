import React from 'react';

/* Tela de abertura enquanto o Firebase resolve a sessão. Antes o app
   renderizava uma página em branco até o `onAuthStateChanged` responder. */
export default function Splash() {
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center gap-5 bg-[#07070b] text-white"
      role="status"
      aria-live="polite"
    >
      <div className="text-center text-lg font-extrabold leading-[1.15] tracking-[0.08em]">
        CAPITAL
        <br />
        CYCLE
      </div>
      <div className="h-1 w-40 overflow-hidden rounded-full bg-white/10" aria-hidden="true">
        <div className="cc-splash-bar h-full w-1/2 rounded-full bg-primary" />
      </div>
      <span className="sr-only">Carregando CapitalCycle…</span>
    </div>
  );
}
