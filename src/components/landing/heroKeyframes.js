/* ==========================================================================
   Keyframes oficiais do Hero Scroll Storyboard — F1 a F5

   Transcritos de `referencia/designer/Hero Scroll Storyboard.dc.html` e
   conferidos contra `docs/hero/01-keyframes-designer.md` §1.2 e §1.3.
   Esta é a ÚNICA fonte dos números da narrativa: o hook lê daqui e o QA
   compara contra daqui. Não ajuste nada no olho — reabra a prancha.

   Sobre `y` em vez de `top`: o palco fica ancorado em `top: 522px` (o
   estado F1, que a H1 cravou) e a subida vira translateY relativo. O
   `top` visual de cada frame é portanto `522 + y`:

     F1   522 + 0    = 522
     F2   522 − 162  = 360
     F3   522 − 338  = 184
     F4   522 − 468  =  54
     F5   522 − 522  =   0

   Assim o movimento fica no compositor, sem tocar em layout, e o palco
   chega ao próximo ato já preparado para continuar sendo transformado.

   Sobre o glow: `opacity` é a única coisa que muda. A posição é travada
   em `dash.top − 440` por ele morar DENTRO do palco, então ele herda
   translate/scale/rotation de graça. Os valores vêm de `renderVals()` da
   própria prancha, com a prop `glow` no default 1:
   g1 = 1·1, g2 = 0,72·1, g3 = 0,42·1, g4 = 0,14·1 e ausente em F5.

   Sobre os "ausente" de F4/F5: a prancha economiza markup e para de
   redesenhar o subtítulo e os CTAs depois que eles zeram. Conforme a
   marcação [INFERÊNCIA] de §1.3, são o MESMO nó seguindo em opacity 0 —
   por isso aqui o último valor é repetido, nunca reanimado.
   ========================================================================== */

/* `top` estrutural do palco, fixado pela H1. */
export const STAGE_TOP_BASE = 522;

export const HERO_KEYFRAMES = [
  {
    id: 'F1',
    nome: 'HERO INICIAL',
    progresso: 0,
    stage: {
      y: 0,
      scale: 0.86,
      rotationX: 6,
      radius: 19,
      borderColor: 'rgba(255,255,255,0.09)',
      boxShadow: '0px 50px 130px rgba(0,0,0,0.62)',
    },
    glowOpacity: 1,
    navbarOpacity: 1,
    h1: { opacity: 1, y: 0 },
    sub: { opacity: 1, y: 0 },
    ctas: { opacity: 1, y: 0 },
    background: '#07070b',
  },
  {
    id: 'F2',
    nome: 'INÍCIO DA TRANSIÇÃO',
    progresso: 0.25,
    stage: {
      y: -162,
      scale: 0.94,
      rotationX: 3.6,
      radius: 17,
      borderColor: 'rgba(255,255,255,0.09)',
      boxShadow: '0px 46px 120px rgba(0,0,0,0.58)',
    },
    glowOpacity: 0.72,
    navbarOpacity: 0.85,
    h1: { opacity: 0.38, y: -10 },
    sub: { opacity: 0.26, y: -12 },
    ctas: { opacity: 0.18, y: -8 },
    background: '#07070b',
  },
  {
    id: 'F3',
    nome: 'PRODUTO ASSUMINDO A TELA',
    progresso: 0.5,
    stage: {
      y: -338,
      scale: 1.05,
      rotationX: 2.1,
      radius: 14,
      borderColor: 'rgba(255,255,255,0.08)',
      boxShadow: '0px 40px 100px rgba(0,0,0,0.5)',
    },
    glowOpacity: 0.42,
    navbarOpacity: 0.4,
    h1: { opacity: 0.04, y: -22 },
    sub: { opacity: 0, y: -24 },
    ctas: { opacity: 0, y: -16 },
    background: '#07070b',
  },
  {
    id: 'F4',
    nome: 'QUASE FULLSCREEN',
    progresso: 0.75,
    stage: {
      y: -468,
      scale: 1.14,
      rotationX: 0.7,
      radius: 9,
      borderColor: 'rgba(255,255,255,0.06)',
      boxShadow: '0px 28px 70px rgba(0,0,0,0.42)',
    },
    glowOpacity: 0.14,
    navbarOpacity: 0.06,
    h1: { opacity: 0, y: -28 },
    // A prancha para de desenhar subtítulo e CTAs aqui; são o mesmo nó
    // seguindo em opacity 0, com o translateY congelado no último valor.
    sub: { opacity: 0, y: -24 },
    ctas: { opacity: 0, y: -16 },
    background: '#07070b',
  },
  {
    id: 'F5',
    nome: 'DENTRO DO CAPITAL CYCLE',
    progresso: 1,
    stage: {
      y: -522,
      scale: 1.2203,
      rotationX: 0,
      radius: 0,
      // Em F5 a prancha não tem moldura nem sombra. A borda continua com
      // 1px, só que transparente: animar a LARGURA da borda mexeria no
      // box do palco a cada frame. Como o conteúdo de 1180px é que define
      // a largura visível (1180 × 1,2203 = 1439,95 ≈ 1440), a borda
      // transparente some sem deslocar nada.
      borderColor: 'rgba(255,255,255,0)',
      boxShadow: '0px 0px 0px rgba(0,0,0,0)',
    },
    glowOpacity: 0,
    navbarOpacity: 0,
    h1: { opacity: 0, y: -28 },
    sub: { opacity: 0, y: -24 },
    ctas: { opacity: 0, y: -16 },
    // #0b0b11 é exatamente o fundo do CapitalCycleDashboard: a emenda
    // entre página e produto desaparece no clímax.
    background: '#0b0b11',
  },
];

/* Runway do ato da Hero, em vh (K3, fechado empiricamente no GATE 4).

   São 4 segmentos entre os 5 keyframes. Com 300vh, cada transição ganha
   75vh de leitura — a auditoria (R5) mostrou que os 80vh do storytelling
   antigo eram curtos para a narrativa inteira; aqui 80vh seriam ~20vh por
   estado, rápido demais para ler escala, inclinação e raio mudando. */
export const HERO_RUNWAY_VH = 300;

/* Progresso normalizado de cada segmento: 0 → 0,25 → 0,5 → 0,75 → 1,
   exatamente como a prancha rotula (scroll 0% / ~25% / ~50% / ~75% / 100%). */
export const HERO_SEGMENTO = 0.25;
