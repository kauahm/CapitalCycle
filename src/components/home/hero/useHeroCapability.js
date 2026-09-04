import { useEffect, useState } from 'react';

/* =========================================================
   Em que nível a Hero 3D pode rodar neste aparelho.

     full   — desktop com WebGL: cena completa, dirigida pelo scroll
     lite   — toque / tela pequena / GPU fraca: cena reduzida com
              linha do tempo própria (o scroll pinado não existe aqui)
     static — sem WebGL, ou o usuário pediu menos movimento:
              não monta canvas nenhum, cai no fallback

   A checagem de WebGL é feita uma vez, num canvas descartado. Vale a
   pena: um `new Canvas` do R3F que falha depois de montado deixa um
   buraco na Hero, e não há como voltar atrás elegantemente.
   ========================================================= */

function hasWebGL() {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) return false;
    // Alguns ambientes expõem o contexto mas sem renderer de verdade
    // (VMs, navegadores com aceleração desligada). Aí o 3D roda em
    // software a 3 fps, que é pior do que não ter 3D.
    const lose = gl.getExtension('WEBGL_lose_context');
    if (lose) lose.loseContext();
    return true;
  } catch {
    return false;
  }
}

function isLowPower() {
  const cores = navigator.hardwareConcurrency;
  const mem = navigator.deviceMemory;
  if (typeof cores === 'number' && cores > 0 && cores <= 4) return true;
  if (typeof mem === 'number' && mem > 0 && mem <= 4) return true;
  return false;
}

export default function useHeroCapability() {
  // Começa em 'static': o primeiro paint nunca espera por WebGL, e a
  // headline aparece imediatamente (requisito do Estado 1).
  const [tier, setTier] = useState('static');

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const coarse = window.matchMedia('(hover: none), (max-width: 980px)');

    const sync = () => {
      if (reduced.matches || !hasWebGL()) {
        setTier('static');
        return;
      }
      setTier(coarse.matches || isLowPower() ? 'lite' : 'full');
    };

    sync();
    reduced.addEventListener('change', sync);
    coarse.addEventListener('change', sync);
    return () => {
      reduced.removeEventListener('change', sync);
      coarse.removeEventListener('change', sync);
    };
  }, []);

  return tier;
}
