import { memo, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ArrowUp, Sparkles } from 'lucide-react';
import useTypewriter from '../../hooks/useTypewriter';

const EASE = [0.16, 1, 0.3, 1];

// Perguntas que rodam como placeholder animado da barra — cada uma
// demonstra uma capacidade diferente do Capital Advisor (resumo,
// economia, meta, fluxo de caixa).
const PROMPTS = [
  'Faça um resumo do meu mês financeiro.',
  'Quanto eu economizei este mês?',
  'Como posso juntar R$ 20 mil em 6 meses?',
  'Onde estou gastando mais do que deveria?',
];

function CapitalAdvisorSection() {
  const sectionRef = useRef(null);
  const [focused, setFocused] = useState(false);
  const [query, setQuery] = useState('');
  const reduceMotion = useReducedMotion();

  // O placeholder animado some assim que o campo entra em uso — o input
  // continua sendo um campo real, a animação nunca bloqueia a digitação.
  const showPlaceholder = !focused && query.length === 0;
  const typed = useTypewriter(PROMPTS, showPlaceholder && !reduceMotion);
  const placeholder = reduceMotion ? PROMPTS[0] : typed;

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
  // Com a seção em 150vh (runway de 50vh), o efeito termina em ~0.9 do
  // progresso: restam ~5vh de respiro antes dos Planos, em vez do vão
  // vazio que existia quando a seção media 280vh.
  const HERO_RANGE = [0.25, 0.85];
  const BAR_RANGE = [0.5, 0.9];

  /* Com movimento reduzido nada disso pode andar. `useTransform`
     roda de qualquer jeito — a preferência só era respeitada no
     placeholder que digita sozinho, então a seção inteira continuava
     se mexendo no scroll para quem tinha pedido para não se mexer.
     As faixas viram constantes: o hook continua sendo chamado na
     mesma ordem, mas o valor não varia. */
  const faixa = (de, para) => (reduceMotion ? [para, para] : [de, para]);

  const heroOpacity = useTransform(progress, HERO_RANGE, faixa(1, 1));
  const heroY = useTransform(progress, HERO_RANGE, faixa(0, 0));

  // A barra já nasce solida e legivel (nada de comecar "sumida"); o
  // scroll so intensifica largura/altura/sombra por cima dessa base.
  const barWidth = useTransform(progress, BAR_RANGE, faixa('86%', '100%'));
  const barHeight = useTransform(progress, BAR_RANGE, faixa('3.75rem', '4.5rem'));
  const barBg = useTransform(progress, BAR_RANGE, faixa('rgba(255,255,255,0.82)', 'rgba(255,255,255,0.94)'));
  const barBorder = useTransform(progress, BAR_RANGE, faixa('rgba(255,255,255,0.7)', 'rgba(255,255,255,0.95)'));
  const barShadow = useTransform(
    progress,
    BAR_RANGE,
    faixa('0 12px 28px rgba(15,15,20,0.08)', '0 30px 64px rgba(15,15,20,0.18)')
  );

  return (
    /* Os 150vh são a pista de rolagem do efeito. Com movimento
       reduzido não há efeito nenhum, e sobrariam 50vh de rolagem
       morta — a seção encolhe para a altura do conteúdo. */
    <section
      id="capital-advisor"
      ref={sectionRef}
      className={`relative bg-[#f4f5f7] ${reduceMotion ? 'h-auto' : 'h-[150vh]'}`}
    >
      <div className={`flex flex-col justify-center overflow-hidden ${reduceMotion ? "py-28" : "sticky top-0 h-screen"}`}>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(255,255,255,0.95),rgba(244,245,247,1)_62%)]" />

        <div className="relative z-10 mx-auto w-full max-w-[1980px] px-6 sm:px-10 lg:px-16">
          <motion.div style={{ opacity: heroOpacity, y: heroY }} className="max-w-3xl">
            <div className="mb-8 flex flex-col gap-2">
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-neutral-900">
                <span className="h-1.5 w-1.5 rounded-full bg-[#5358ee]" aria-hidden="true" />
                Capital Advisor
              </span>
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-neutral-500">
                <span className="h-1.5 w-1.5 rounded-full bg-[#5358ee]/60" aria-hidden="true" />
                Sessão ativa
              </span>
            </div>

            <h2 className="text-[clamp(2.6rem,7vw,5.7rem)] font-black uppercase leading-[0.95] tracking-tight text-neutral-950">
              <span className="block">Pergunte.</span>
              <span className="block">Analise.</span>
              <span className="block text-[#5358ee]">Decida.</span>
            </h2>
          </motion.div>

          {/* Barra de interação com a IA — o placeholder digita sozinho,
              mas o campo continua totalmente utilizável. */}
          <div className="mt-10 w-full max-w-3xl">
            <motion.form
              onSubmit={(e) => e.preventDefault()}
              style={{
                width: barWidth,
                height: barHeight,
                background: barBg,
                borderColor: barBorder,
                boxShadow: barShadow,
              }}
              className="flex items-center gap-3 rounded-full border px-5 backdrop-blur-md sm:gap-4 sm:px-7"
            >
              <Sparkles
                size={17}
                strokeWidth={2.2}
                className="hidden flex-none text-[#5358ee] sm:block"
                aria-hidden="true"
              />

              <label htmlFor="capital-advisor-input" className="sr-only">
                Pergunte ao Capital Advisor
              </label>

              <div className="relative flex h-full min-w-0 flex-1 items-center">
                <input
                  id="capital-advisor-input"
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  autoComplete="off"
                  className="w-full bg-transparent text-sm text-neutral-800 caret-[#5358ee] outline-none focus-visible:outline-none sm:text-base"
                />

                {showPlaceholder && (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center overflow-hidden whitespace-nowrap text-sm text-neutral-400 sm:text-base"
                  >
                    {placeholder}
                    {!reduceMotion && (
                      <motion.span
                        className="ml-[3px] inline-block h-[1.05em] w-[1.5px] flex-none bg-neutral-400"
                        animate={{ opacity: [1, 1, 0, 0] }}
                        transition={{
                          duration: 1.05,
                          times: [0, 0.5, 0.5, 1],
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                      />
                    )}
                  </span>
                )}
              </div>

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
                className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-[#5358ee] text-white shadow-lg shadow-[#5358ee]/30 sm:h-11 sm:w-11"
              >
                <ArrowUp size={18} strokeWidth={2.4} />
              </motion.button>
            </motion.form>
          </div>

          <motion.span
            style={{ opacity: heroOpacity }}
            className="mt-6 flex items-center gap-2 text-xs font-medium text-neutral-400"
          >
            <motion.span
              className="h-1.5 w-1.5 rounded-full bg-red-500"
              animate={{ opacity: [1, 0.35, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              aria-hidden="true"
            />
            Analisando seus dados em tempo real
          </motion.span>
        </div>
      </div>
    </section>
  );
}

export default memo(CapitalAdvisorSection);
