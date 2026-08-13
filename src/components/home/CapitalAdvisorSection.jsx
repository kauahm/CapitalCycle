import { useRef, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

const EASE = [0.16, 1, 0.3, 1];

const SUGGESTIONS = [
  'Analise meu fluxo de caixa',
  'Como está meu portfólio?',
  'Planeje meu próximo aporte',
  'Otimize meu IR',
];

export default function CapitalAdvisorSection() {
  const sectionRef = useRef(null);
  const [focused, setFocused] = useState(false);

  // Progresso 0 → 1 enquanto a seção atravessa o runway de scroll
  // (altura da section menos a altura da viewport, já que o conteúdo
  // fica "grudado" com sticky). Suavizado com mola para o efeito de
  // expansão do input parecer fluido, e não um "tick" direto do scroll.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 20, mass: 0.4 });

  // ---- Sensibilidade do scroll ----
  // Cada par [inicio, fim] abaixo é uma fração do progresso da seção
  // (0 a 1). Diminuir o intervalo (ex.: [0, 0.25]) faz o efeito
  // concluir mais rápido/cedo no scroll; aumentar ([0, 0.6]) estica o
  // efeito por mais tempo. HERO_RANGE controla o fade+subida do texto,
  // BAR_RANGE controla a expansão da barra flutuante.
  const HERO_RANGE = [0, 0.4];
  const BAR_RANGE = [0.15, 0.65];

  const heroOpacity = useTransform(progress, HERO_RANGE, [1, 0]);
  const heroY = useTransform(progress, HERO_RANGE, [0, -56]);

  const barWidth = useTransform(progress, BAR_RANGE, ['48%', '100%']);
  const barHeight = useTransform(progress, BAR_RANGE, ['3.25rem', '4.5rem']);
  const barRadius = useTransform(progress, BAR_RANGE, ['999px', '28px']);
  const barBg = useTransform(progress, BAR_RANGE, ['rgba(255,255,255,0.55)', 'rgba(255,255,255,0.72)']);
  const barBorder = useTransform(progress, BAR_RANGE, ['rgba(255,255,255,0.35)', 'rgba(255,255,255,0.65)']);
  const barShadow = useTransform(
    progress,
    BAR_RANGE,
    ['0 8px 20px rgba(15,15,20,0.05)', '0 28px 64px rgba(15,15,20,0.16)']
  );

  return (
    <section ref={sectionRef} className="relative h-[220vh] bg-[#e7e8ec]">
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(255,255,255,0.95),rgba(231,232,236,1)_62%)]" />

        <div className="relative z-10 mx-auto w-full max-w-[1980px] flex-1 px-6 pt-24 sm:px-10 sm:pt-28 lg:px-16">
          <motion.div style={{ opacity: heroOpacity, y: heroY }} className="max-w-3xl">
            <div className="mb-8 flex flex-col gap-2">
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-neutral-900">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
                Capital Advisor
              </span>
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-neutral-500">
                <span className="h-1.5 w-1.5 rounded-full bg-primary/60" aria-hidden="true" />
                Sessão ativa
              </span>
            </div>

            <h2 className="text-[clamp(2.6rem,7vw,5.7rem)] font-black uppercase leading-[0.95] tracking-tight text-neutral-950">
              <span className="block">Pergunte.</span>
              <span className="block">Analise.</span>
              <span className="block text-primary">Decida.</span>
            </h2>

            <p className="mt-8 max-w-xl text-base leading-relaxed text-neutral-600 sm:text-lg">
              Converse com o Capital Advisor sobre seus investimentos, fluxo de caixa
              e planejamento — respostas com inteligência artificial integrada ao seu capital.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {SUGGESTIONS.map((s) => (
                <motion.button
                  key={s}
                  type="button"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ duration: 0.25, ease: EASE }}
                  className="rounded-full border border-black/5 bg-white/80 px-5 py-3 text-sm font-semibold text-neutral-800 shadow-sm transition-colors hover:bg-white"
                >
                  {s}
                </motion.button>
              ))}
            </div>

            <span className="mt-10 flex items-center gap-2 text-xs font-medium text-neutral-400">
              <motion.span
                className="h-1.5 w-1.5 rounded-full bg-red-500"
                animate={{ opacity: [1, 0.35, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                aria-hidden="true"
              />
              Analisando seus dados em tempo real
            </span>
          </motion.div>
        </div>

        <div className="relative z-10 px-6 pb-8 sm:px-10 sm:pb-10 lg:px-16">
          <motion.form
            onSubmit={(e) => e.preventDefault()}
            style={{
              width: barWidth,
              height: barHeight,
              borderRadius: barRadius,
              background: barBg,
              borderColor: barBorder,
              boxShadow: barShadow,
            }}
            className="mx-auto flex max-w-3xl items-center gap-3 border px-5 backdrop-blur-md sm:px-7"
          >
            <label htmlFor="capital-advisor-input" className="sr-only">
              Pergunte ao Capital Advisor
            </label>
            <input
              id="capital-advisor-input"
              type="text"
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Pergunte sobre seus investimentos, fluxo de caixa ou metas..."
              className="flex-1 bg-transparent text-sm text-neutral-800 outline-none placeholder:text-neutral-400 sm:text-base"
            />
            <motion.button
              type="submit"
              aria-label="Enviar pergunta"
              animate={focused ? { rotate: [0, -10, 8, 0], scale: [1, 1.1, 1] } : { rotate: 0, scale: 1 }}
              transition={
                focused
                  ? { duration: 1.2, repeat: Infinity, ease: EASE }
                  : { duration: 0.4, ease: EASE }
              }
              whileTap={{ scale: 0.9 }}
              className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30 sm:h-11 sm:w-11"
            >
              <ArrowUp size={18} strokeWidth={2.4} />
            </motion.button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
