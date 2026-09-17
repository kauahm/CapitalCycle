import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

import LandingHero from '../components/landing/LandingHero';
import CapitalAdvisorSection from '../components/home/CapitalAdvisorSection';
import PlanosSection from '../components/home/PlanosSection';
import '../styles/landing-hero.css';

/* =========================================================
   HOME — Capital Cycle

   A landing é a narrativa pinada de <LandingHero />, que cobre
   Hero → Dashboard → Recursos → Showcase num único bloco preso,
   e depois as duas seções que já existiam:

     LandingHero  (Hero · Dashboard · Recursos · Showcase)
        ↓ o pin solta
     CapitalAdvisorSection
        ↓
     PlanosSection

   A seção de Recursos antiga que ficava aqui saiu: ela repetia,
   logo abaixo do showcase novo, o mesmo lockup ("Gestão que
   evolui com você", mesmo subtítulo) e os mesmos quatro cards,
   palavra por palavra. Com o showcase implementado, o usuário
   via a seção duas vezes seguidas.

   Com ela saíram o `PAGE_CSS` desta página — que só vestia esses
   blocos — e os hooks que só serviam a eles.
   ========================================================= */

/* Mesma curva padronizada no resto do projeto */
const EASE = [0.16, 1, 0.3, 1];

export default function HomePage() {
  // Chegando pela animação de voltar do Login, a tela já está coberta de
  // preto: aqui ela é revelada com um fade, em vez de a Home aparecer
  // num corte seco.
  const location = useLocation();
  const [revealing, setRevealing] = useState(() => location.state?.from === 'login');

  // A Home precisa abrir no topo: o F1 é o estado inicial da landing, e
  // restaurar o scroll no meio da página faria a primeira dobra nunca ser
  // vista.
  useEffect(() => {
    const anterior = window.history.scrollRestoration;
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
    return () => {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = anterior;
      }
    };
  }, []);

  return (
    <>
      {revealing && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-[60] bg-[#05070e]"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          onAnimationComplete={() => setRevealing(false)}
          aria-hidden="true"
        />
      )}

      <LandingHero />

      <CapitalAdvisorSection />

      <PlanosSection />
    </>
  );
}
