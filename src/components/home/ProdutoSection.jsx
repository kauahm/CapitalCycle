import { memo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Target, TrendingUp } from 'lucide-react';

import DEMO from './demoAccount';
import { formatarMoeda } from '../../utils/formatters';

/* =========================================================
   PRODUTO — a tela real do CapitalCycle, logo abaixo do hero.

   O hero termina com a câmera dentro da tela do notebook e a
   promessa da marca escrita nela. Esta seção é a resposta: a tela
   de verdade, com os rótulos, as cores e o layout do Dashboard
   Financeiro real. Ela não tem headline própria de propósito — o
   hero acabou de dar uma, e duas seguidas competiriam. A
   frase-ponte que apresentava esta tela também vive no hero agora,
   como último elemento dele — repeti-la aqui seria dizer a mesma
   coisa duas vezes seguidas.

   Os valores vêm todos de demoAccount.js, para o saldo do
   cabeçalho e a soma das partes nunca se contradizerem.
   ========================================================= */

const EASE = [0.16, 1, 0.3, 1];

/* Atenção: aqui dentro valem os tokens do APP (`primary` #6366f1,
   `emerald`, `background` #070b14), não os da landing. É de propósito
   — esta caixa é uma reprodução da tela real, e alinhá-la à paleta da
   landing faria o mockup mentir sobre o produto. Fora desta função, a
   landing usa só #5358EE. */
function TelaDashboard() {
  const { nome, saldoDisponivel, totalInvestido, contasAtivas, sobraDoMes, fluxo, meta } = DEMO;

  const maiorFluxo = Math.max(...fluxo.map((m) => Math.abs(m.liquido)));
  const progressoMeta = Math.round((meta.atual / meta.alvo) * 100);

  return (
    /* Sombra em camadas + um fio de luz na borda de cima. Sobre
       fundo escuro uma sombra sozinha não se vê; o que dá relevo é
       a aresta iluminada, como nas telas das referências. */
    <div className="overflow-hidden rounded-[1.5rem] bg-background shadow-[0_1px_0_0_rgba(255,255,255,0.07)_inset,0_0_0_1px_rgba(255,255,255,0.06),0_2px_8px_rgba(0,0,0,0.4),0_18px_40px_rgba(0,0,0,0.45),0_50px_110px_rgba(0,0,0,0.5)]">
      {/* Barra da janela — o mínimo para ler como "uma tela", não
          como mais um card da landing. */}
      <div className="flex items-center gap-2 border-b border-border bg-surface px-5 py-3.5">
        <span className="h-2.5 w-2.5 rounded-full bg-surfaceLight" />
        <span className="h-2.5 w-2.5 rounded-full bg-surfaceLight" />
        <span className="h-2.5 w-2.5 rounded-full bg-surfaceLight" />
        <span className="ml-auto text-[0.7rem] font-semibold tracking-wide text-textSecondary">
          CapitalCycle · Dashboard Financeiro
        </span>
      </div>

      <div className="space-y-8 p-6 sm:p-9">
        {/* ── Cabeçalho: o saldo é o dado hero, o resto orbita ── */}
        <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-4 text-sm text-slate-500">
              Olá, {nome}. Aqui está o resumo do seu capital.
            </p>
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-500">
              Saldo disponível
            </p>
            <p className="text-[clamp(2rem,5vw,3.1rem)] font-bold leading-none tracking-tight text-white tabular-nums">
              {formatarMoeda(saldoDisponivel)}
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-400">
              <TrendingUp size={16} aria-hidden="true" />
              Sobrou {formatarMoeda(sobraDoMes)} este mês
            </div>
          </div>

          <div className="flex shrink-0 gap-10">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-500">
                Investido
              </p>
              <p className="text-2xl font-semibold text-emerald-400 tabular-nums">
                {formatarMoeda(totalInvestido)}
              </p>
            </div>
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-500">
                Contas ativas
              </p>
              <p className="text-2xl font-semibold text-white tabular-nums">{contasAtivas}</p>
            </div>
          </div>
        </div>

        <div className="h-px bg-border" />

        {/* ── Fluxo líquido + meta em andamento ── */}
        <div className="grid grid-cols-1 gap-9 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h3 className="mb-6 text-sm font-semibold text-slate-300">
              Fluxo líquido — últimos 6 meses
            </h3>
            <div className="flex h-32 items-end gap-4">
              {fluxo.map((m) => (
                <div key={m.label} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                  {/* Barras finas, topo arredondado e um degradê que
                      escurece na base — blocos verdes chapados de
                      largura total liam como "gráfico genérico". O mês
                      corrente se destaca pela saturação, não por um
                      anel em volta. */}
                  <div
                    className={`w-full max-w-[2.75rem] rounded-t-[4px] ${
                      m.atual
                        ? 'bg-gradient-to-t from-emerald-600/60 to-emerald-400'
                        : 'bg-gradient-to-t from-emerald-700/30 to-emerald-500/55'
                    }`}
                    style={{ height: `${Math.max(4, (Math.abs(m.liquido) / maiorFluxo) * 100)}%` }}
                  />
                  <span
                    className={`text-xs capitalize ${
                      m.atual ? 'font-semibold text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    {m.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-6 flex items-center gap-2 text-sm font-semibold text-slate-300">
              <Target size={16} className="text-slate-500" aria-hidden="true" />
              Metas em andamento
            </h3>
            <div className="rounded-xl border border-border p-5">
              <p className="text-sm font-medium text-slate-200">{meta.nome}</p>
              <p className="mt-1 text-xs text-slate-500 tabular-nums">
                {formatarMoeda(meta.atual)} de {formatarMoeda(meta.alvo)}
              </p>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-surfaceLight">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${progressoMeta}%` }}
                />
              </div>
              <p className="mt-2 text-xs font-semibold text-slate-400 tabular-nums">
                {progressoMeta}% concluído
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* A abertura do escuro para o claro.

   Antes esta seção era #f4f5f7 e o hero terminava em #050608: dava
   um corte de preto para branco numa única linha de pixels, e 50px
   depois voltava ao escuro do painel do dashboard — preto, branco,
   preto. A seção agora nasce no mesmo preto do hero (emenda
   invisível) e só abre para o claro no rodapé dela, uma vez só.

   As paradas não são igualmente espaçadas de propósito: uma rampa
   linear de #050608 até #f4f5f7 passa metade do caminho num cinza
   sujo. Concentrando a maior parte da distância no escuro e
   abrindo rápido no fim, a passagem lê como amanhecer em vez de
   mancha. */
const ABERTURA = `linear-gradient(180deg,
  rgba(5, 6, 8, 0) 0%,
  #050608 12%,
  #0a0c12 38%,
  #1b1f2b 58%,
  #6b7080 78%,
  #c9ccd4 91%,
  #f4f5f7 100%)`;

function ProdutoSection() {
  const semMovimento = useReducedMotion();

  const reveal = semMovimento
    ? {}
    : {
        initial: { opacity: 0, y: 40 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.15 },
        transition: { duration: 0.8, ease: EASE },
      };

  return (
    <section
      id="produto"
      className="relative bg-[#050608] px-6 pb-[24rem] pt-24 sm:px-10 sm:pt-28 lg:px-16"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[30rem]"
        style={{ background: ABERTURA }}
      />

      <motion.div {...reveal} className="relative z-10 mx-auto w-full max-w-[64rem]">
        <TelaDashboard />
      </motion.div>
    </section>
  );
}

export default memo(ProdutoSection);
