import { HERO_RUNWAY_VH } from './heroKeyframes';
import { RECURSOS_RUNWAY_VH } from './recursosKeyframes';
import { SHOWCASE_KEYFRAMES, SHOWCASE_RUNWAY_VH } from './showcaseKeyframes';

/* ==========================================================================
   Runways da narrativa pinada

   Os três atos vivem dentro de um pin só, então a "posição" de cada
   momento da landing não é a posição de um elemento no documento: é um
   deslocamento de rolagem dentro do runway. Quem precisa navegar até um
   ponto da narrativa — a navbar, por exemplo — calcula por aqui, e não
   por `getBoundingClientRect` de um nó que está preso na viewport.

   É também o motivo de a conta morar num módulo só: o hook que monta as
   timelines e a navbar que aponta para elas precisam concordar sobre onde
   cada ato começa.
   ========================================================================== */

export const runwayHero = () => window.innerHeight * (HERO_RUNWAY_VH / 100);
export const runwayRecursos = () => window.innerHeight * (RECURSOS_RUNWAY_VH / 100);
export const runwayShowcase = () => window.innerHeight * (SHOWCASE_RUNWAY_VH / 100);

/* Respiro no fim, depois que o S4 é atingido.

   Sem ele o clímax não existe como momento: o trilho encosta em −844 no
   mesmo pixel de rolagem em que o pin solta, e o quarto painel começa a
   subir para fora da tela no instante em que termina de chegar. Estes
   50vh são só leitura — nenhuma timeline roda aqui, a composição do S4
   fica parada e intacta, e só então o documento volta a rolar. */
export const HOLD_FINAL_VH = 50;

export const holdFinal = () => window.innerHeight * (HOLD_FINAL_VH / 100);

/* Quanto a narrativa anima. */
export const runwayTotal = () => runwayHero() + runwayRecursos() + runwayShowcase();

/* Quanto a Hero fica presa: a narrativa mais o respiro do fim. */
export const duracaoDoPin = () => runwayTotal() + holdFinal();

/* O "Recursos" da navbar desembarca na INTRODUÇÃO do showcase (S1): é o
   frame editorial em que a seção se apresenta, com o lockup grande e o
   CTA. Mandar para o D5 cairia no rabo do ato anterior, e mandar para o
   meio do trilho deixaria o usuário no meio de um movimento que ele não
   começou. */
const PROGRESSO_ANCORA_RECURSOS = SHOWCASE_KEYFRAMES[1].progresso;

/* Rolagem absoluta em que a seção de Recursos se apresenta. `story` é o
   invólucro não pinado da narrativa — a régua que os ScrollTriggers usam. */
export function scrollDaSecaoRecursos(story) {
  if (!story) return 0;
  const topo = story.getBoundingClientRect().top + window.scrollY;
  return Math.round(
    topo + runwayHero() + runwayRecursos() + PROGRESSO_ANCORA_RECURSOS * runwayShowcase(),
  );
}
