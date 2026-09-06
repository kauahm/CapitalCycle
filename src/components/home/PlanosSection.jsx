import { memo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { PLAN_LIST } from '../ui/plans';

/* =========================================================
   PLANOS — seção de preços da Home
   Mesma linguagem visual das outras seções (#f4f5f7, título
   preto/roxo em caixa alta, cards claro + escuro).
   Os preços e recursos vêm de src/components/ui/plans.js
   (fonte única de verdade dos planos).
   ========================================================= */

const EASE = [0.16, 1, 0.3, 1];

const reveal = {
  hidden: { opacity: 0, y: 40 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE, delay: i * 0.11 },
  }),
};


function PlanCard({ plan, index }) {
  const dark = plan.featured;

  return (
    <motion.article
      custom={index}
      variants={reveal}
      className={`relative flex flex-col rounded-[1.75rem] p-8 sm:p-9 ${
        dark
          ? 'bg-[#0f1216] shadow-[0_30px_64px_rgba(15,15,20,0.22)]'
          : 'bg-gradient-to-b from-white to-[#efeff1] shadow-[0_24px_48px_rgba(19,19,22,0.06)]'
      }`}
    >
      {plan.badge && (
        <span className="absolute -top-3.5 right-7 rounded-full bg-[#5358ee] px-3.5 py-1.5 text-[0.7rem] font-bold text-white shadow-lg shadow-[#5358ee]/30">
          {plan.badge}
        </span>
      )}

      <h3
        className={`text-2xl font-black tracking-tight ${
          dark ? 'text-white' : 'text-[#131316]'
        }`}
      >
        {plan.name}
      </h3>

      <div className="mt-7 flex items-baseline gap-1.5">
        <span
          className={`text-base font-semibold ${
            dark ? 'text-white/55' : 'text-[#6d6d72]'
          }`}
        >
          R$
        </span>
        <span
          className={`text-[3.1rem] font-black leading-none tracking-tight ${
            dark ? 'text-white' : 'text-[#131316]'
          }`}
        >
          {plan.price}
        </span>
        <span
          className={`text-sm font-medium ${
            dark ? 'text-white/55' : 'text-[#6d6d72]'
          }`}
        >
          {plan.period}
        </span>
      </div>

      <p
        className={`mt-6 text-sm leading-relaxed ${
          dark ? 'text-white/60' : 'text-[#6d6d72]'
        }`}
      >
        {plan.desc}
      </p>

      {/* Leva o plano escolhido no state da rota: o Register lê
          location.state.plan e já abre no passo "Seus dados", sem
          perguntar de novo qual plano a pessoa quer. */}
      <Link
        to="/cadastro"
        state={{ plan: plan.id }}
        className={`mt-7 inline-flex items-center justify-center rounded-xl px-6 py-3.5 text-sm font-bold transition-colors active:scale-[0.985] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#5358ee] ${
          dark
            ? 'bg-[#5358ee] text-white hover:bg-[#4348e0]'
            : 'bg-[#5358ee]/10 text-[#4348e0] hover:bg-[#5358ee]/[0.16]'
        }`}
      >
        Começar com o {plan.name}
      </Link>

      <ul className="mt-8 flex flex-col gap-3.5">
        {plan.feats.map((feat) => (
          <li key={feat} className="flex items-start gap-3">
            <span
              className="mt-0.5 flex h-[1.15rem] w-[1.15rem] flex-none items-center justify-center rounded-full bg-[#5358ee] text-white"
              aria-hidden="true"
            >
              <Check size={11} strokeWidth={3.5} />
            </span>
            <span
              className={`text-sm leading-snug ${
                dark ? 'text-white/85' : 'text-[#3c3c40]'
              }`}
            >
              {feat}
            </span>
          </li>
        ))}
      </ul>
    </motion.article>
  );
}

function PlanosSection() {
  // Sem esta trava a seção continuava animando com movimento
  // reduzido ligado: o `whileInView` do framer-motion não olha a
  // preferência sozinho.
  const semMovimento = useReducedMotion();

  // `initial: false` faz o framer pintar direto no estado final, sem
  // animar — e os filhos herdam isso, então nada fica invisível.
  const orquestra = semMovimento
    ? { initial: false, animate: 'show' }
    : { initial: 'hidden', whileInView: 'show', viewport: { once: true, amount: 0.15 } };

  return (
    <section
      id="planos"
      className="relative bg-[#f4f5f7] px-6 pb-24 pt-12 sm:px-10 sm:pb-28 sm:pt-16 lg:px-16"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.95),rgba(244,245,247,1)_60%)]" />

      <motion.div
        {...orquestra}
        className="relative z-10 mx-auto flex w-full max-w-[58rem] flex-col items-center text-center"
      >
        <motion.span
          variants={reveal}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#5358ee]"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#5358ee]" aria-hidden="true" />
          Planos
        </motion.span>

        <motion.h2
          variants={reveal}
          custom={1}
          className="mt-6 text-[clamp(2.4rem,5.4vw,4.6rem)] font-black uppercase leading-[1.04] tracking-tight text-[#131316]"
        >
          <span className="block">Escolha seu</span>
          <span className="block text-[#5358ee]">Ritmo financeiro</span>
        </motion.h2>

        <motion.p
          variants={reveal}
          custom={2}
          className="mt-7 max-w-xl text-base leading-relaxed text-[#3c3c40] [text-wrap:pretty]"
        >
          Do controle prático ao avançado com IA — dois planos para cada etapa da
          sua jornada de capital.
        </motion.p>

        <div className="mt-16 grid w-full grid-cols-1 items-start gap-8 text-left md:grid-cols-2">
          {PLAN_LIST.map((plan, i) => (
            <PlanCard key={plan.id} plan={plan} index={i} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}

export default memo(PlanosSection);
