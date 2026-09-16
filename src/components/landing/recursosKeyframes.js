import { STAGE_TOP_BASE } from './heroKeyframes';

/* ==========================================================================
   Keyframes oficiais de Dashboard → Recursos — D1 a D5

   Transcritos de `referencia/designer/Dashboard to Recursos.dc.html` e
   conferidos contra `docs/hero/01-keyframes-designer.md` §2.

   A descoberta central da auditoria, reconfirmada aqui frame a frame:

     panel.top = dash.top + 903   nos CINCO frames, sem exceção

   Não são duas animações sincronizadas. É UMA translação vertical de um
   bloco rígido de dois planos empilhados. A borda de baixo da Dashboard e
   a de cima de Recursos são a mesma linha o tempo todo.

   Como o bloco rígido é garantido aqui
   ------------------------------------
   A Dashboard renderiza com `scale(1.2203)` sobre 740px, ou seja
   740 × 1,2203 = 903,022px de altura. Se o painel descansar exatamente em
   `522 + 903,022` (o topo estrutural do palco mais a altura renderizada),
   então o `y` do painel e o `y` da perspectiva da Dashboard passam a ser
   LITERALMENTE O MESMO NÚMERO em qualquer progresso:

     dash.top  = 522        + y
     panel.top = 522 + 903,022 + y

   A diferença é 903,022 por construção, não por duas contas que precisam
   bater. É isso que responde §5 do briefing — não existe fórmula
   independente que possa produzir subpixel diferente, porque não existe
   segunda fórmula: os dois entram no mesmo tween, com o mesmo valor.

   Por isso `y` aqui é derivado de `dashTop`, e não digitado duas vezes.

   Sobre o −903,022 do D5
   ----------------------
   O storyboard escreve −903 (arredondado para autoria). Usar a altura real
   faz o painel aterrissar em 0,000 em vez de 0,022 — mesma leitura visual,
   sem sobra de fundo no topo. Os frames intermediários ficam com os valores
   do storyboard, que é quem manda na composição.
   ========================================================================== */

/* 740 × 1,2203 — a mesma escala que o F5 da Hero aplica. */
export const ALTURA_DASH_F5 = 740 * 1.2203;

/* Onde o painel descansa antes de qualquer translação. */
export const RECURSOS_TOP_BASE = STAGE_TOP_BASE + ALTURA_DASH_F5;

const y = (dashTop) => dashTop - STAGE_TOP_BASE;

export const RECURSOS_KEYFRAMES = [
  {
    id: 'D1',
    nome: 'DASHBOARD FULLSCREEN',
    progresso: 0,
    dashTop: 0,
    y: y(0),
    // A sombra existe já no D1, mas é projetada 21px abaixo de uma borda que
    // está em 903 — fora dos 900px de viewport. Invisível aqui, é o que
    // permite o handoff sem salto: o F5 da Hero não tem sombra nenhuma.
    boxShadow: '0px 21px 44px rgba(0,0,0,0.32)',
    navClaraOpacity: 0,
  },
  {
    id: 'D2',
    nome: 'INÍCIO DA SAÍDA',
    progresso: 0.14,
    dashTop: -113,
    y: y(-113),
    boxShadow: '0px 21px 44px rgba(0,0,0,0.32)',
    navClaraOpacity: 0,
  },
  {
    id: 'D3',
    nome: 'RECURSOS NASCENDO DO PRODUTO',
    progresso: 0.38,
    dashTop: -343,
    y: y(-343),
    boxShadow: '0px 21px 44px rgba(0,0,0,0.32)',
    navClaraOpacity: 0,
  },
  {
    id: 'D4',
    nome: 'A TRILHA ENTRA',
    progresso: 0.67,
    dashTop: -603,
    y: y(-603),
    boxShadow: '0px 21px 44px rgba(0,0,0,0.32)',
    navClaraOpacity: 0,
  },
  {
    id: 'D5',
    nome: 'RECURSOS ESTABELECIDA',
    progresso: 1,
    dashTop: -ALTURA_DASH_F5,
    y: y(-ALTURA_DASH_F5),
    // Some quando a Dashboard já saiu inteira: mantê-la deixaria uma
    // mancha escura no topo de Recursos.
    boxShadow: '0px 0px 0px rgba(0,0,0,0)',
    navClaraOpacity: 1,
  },
];

/* Fundo do frame nos cinco frames da prancha. Nunca chega a aparecer — a
   Dashboard e o painel cobrem a viewport inteira em qualquer progresso —
   mas fica como superfície de segurança, para que um eventual arredondamento
   na emenda mostre off-white, e não o preto que a Hero deixou. */
export const RECURSOS_FUNDO = '#f3f2f0';

/* Runway do segundo ato, em vh. O bloco percorre 903px; 200vh dão 1800px de
   rolagem, pouco menos de 2px de scroll por px de movimento — perto do 1:1,
   que é o que faz a passagem ler como um plano saindo e outro ocupando, e
   não como um corte. */
export const RECURSOS_RUNWAY_VH = 200;
