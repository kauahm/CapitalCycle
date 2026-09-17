/* ==========================================================================
   Keyframes oficiais do Recursos Showcase — S1 a S4

   Transcritos de `referencia/designer/Recursos Showcase.dc.html` e medidos
   no próprio arquivo renderizado (as posições do S1 saem de um flex column,
   não de coordenadas escritas à mão na prancha).

   Precedência: nesta fase o SHOWCASE manda. `RecursosPanel.dc.html` e
   `RecursosTrack.dc.html` são componentes subordinados a ele.

   O vaivém tipográfico é intencional
   ----------------------------------
   Confirmado nos arquivos, não inferido:

     D→R F5 (RecursosPanel) ....... 52px, à esquerda
     Showcase S1 .................. 88px, centralizado, em duas linhas
     Showcase S2 .................. 46px, à esquerda

   O crescimento intermediário não é erro e não é suavizado. O eyebrow faz
   o mesmo caminho: 11 → 12 → 11px.

   Curso do trilho
   ---------------
   4 painéis de 520 + 3 gaps de 28 = 2164px. O trilho vai de `left:120` a
   `left:-844`, ou seja 964px, o que deixa margem de 120px no começo e
   120px no fim (1440 − (−844 + 2164) = 120). Aqui isso vira `x` relativo
   ao repouso em 120: 0 → −964.

   Trilho e indicador têm curvas diferentes
   ----------------------------------------
   No S3 o trilho está em −362, exatamente 50% do curso — mas o indicador
   está em 99 de 180, ou seja 55%. Não é arredondamento e não se conserta
   para 90px: são dois tweens separados, cada um com os seus keyframes.

   Centramento sem depender da largura
   -----------------------------------
   Cada peça do lockup mora em `left: 120px`. Para centralizar, em vez de
   medir a largura (que muda junto com o corpo da fonte), usa-se
   `x: 600` + `xPercent: -50`:

     120 + 600 − largura/2 = 720 − largura/2

   que é o centro de 1440 para qualquer largura. Os dois valores
   interpolam juntos, então a ida da esquerda para o centro é contínua e
   fica toda no compositor.
   ========================================================================== */

/* Quanto o `x` precisa valer, junto de `xPercent: -50`, para centralizar
   uma peça ancorada em `left: 120px` numa viewport de 1440. */
export const X_CENTRALIZADO = 600;

/* Posições estruturais (CSS) de cada peça — o estado D→R F5, que a H3 já
   deixou pronto. Todo `y` daqui para a frente é relativo a estas. */
export const BASE = {
  eyebrowTop: 132,
  tituloTop: 160,
  subTop: 250,
  ctaTop: 569.8, // o CTA só existe no S1; a base é a própria posição dele lá
  trilhoTop: 364,
};

/* `max-width` do título. Escolhido por medição, não por gosto: a linha
   inteira mede 1060px em 88px, 629px em 52px e 558px em 46px, e "Gestão
   que evolui" mede 668px em 88px. Qualquer valor entre 668 e 852 quebra
   depois de "evolui" no 88px e mantém linha única nos outros dois. Com
   isso a quebra do S1 aparece sozinha quando o corpo cresce, sem um <br>
   que precisasse ser ligado e desligado no meio da transição. */
export const TITULO_MAX_WIDTH = 760;

/* 4 painéis de 520 + 3 gaps de 28. */
export const LARGURA_TRILHO = 4 * 520 + 3 * 28;

const y = (topAlvo, base) => +(topAlvo - base).toFixed(2);

export const SHOWCASE_KEYFRAMES = [
  {
    id: 'D5',
    nome: 'RECURSOS ESTABELECIDA (fim da H3)',
    progresso: 0,
    eyebrow: { x: 0, xPercent: 0, y: 0, fontSize: 11 },
    titulo: { x: 0, xPercent: 0, y: 0, fontSize: 52, lineHeight: 1.08, letterSpacing: '-0.026em' },
    sub: { x: 0, xPercent: 0, y: 0, fontSize: 17, opacity: 1 },
    cta: { x: X_CENTRALIZADO, xPercent: -50, opacity: 0 },
    hairline: { opacity: 0, fill: 0 },
    trilho: { x: 0, y: 0 },
  },
  {
    id: 'S1',
    nome: 'INTRODUÇÃO',
    progresso: 0.2,
    eyebrow: { x: X_CENTRALIZADO, xPercent: -50, y: y(206, BASE.eyebrowTop), fontSize: 12 },
    titulo: {
      x: X_CENTRALIZADO, xPercent: -50, y: y(255.3, BASE.tituloTop),
      fontSize: 88, lineHeight: 0.99, letterSpacing: '-0.028em',
    },
    sub: { x: X_CENTRALIZADO, xPercent: -50, y: y(467.5, BASE.subTop), fontSize: 18, opacity: 1 },
    cta: { x: X_CENTRALIZADO, xPercent: -50, opacity: 1 },
    hairline: { opacity: 0, fill: 0 },
    // O trilho desce para o rodapé: no S1 ele só assoma 36px (900 − 864).
    trilho: { x: 0, y: y(864, BASE.trilhoTop) },
  },
  {
    id: 'S2',
    nome: 'PIN ENGATA — TRILHO EM 0%',
    progresso: 0.4,
    eyebrow: { x: 0, xPercent: 0, y: y(142, BASE.eyebrowTop), fontSize: 11 },
    titulo: {
      x: 0, xPercent: 0, y: y(176.7, BASE.tituloTop),
      fontSize: 46, lineHeight: 1.06, letterSpacing: '-0.025em',
    },
    sub: { x: X_CENTRALIZADO, xPercent: -50, y: y(467.5, BASE.subTop), fontSize: 18, opacity: 0 },
    cta: { x: X_CENTRALIZADO, xPercent: -50, opacity: 0 },
    hairline: { opacity: 1, fill: 0 },
    trilho: { x: 0, y: y(330, BASE.trilhoTop) },
  },
  {
    id: 'S3',
    nome: 'TRILHO EM CURSO',
    progresso: 0.7,
    eyebrow: { x: 0, xPercent: 0, y: y(142, BASE.eyebrowTop), fontSize: 11 },
    titulo: {
      x: 0, xPercent: 0, y: y(176.7, BASE.tituloTop),
      fontSize: 46, lineHeight: 1.06, letterSpacing: '-0.025em',
    },
    sub: { x: X_CENTRALIZADO, xPercent: -50, y: y(467.5, BASE.subTop), fontSize: 18, opacity: 0 },
    cta: { x: X_CENTRALIZADO, xPercent: -50, opacity: 0 },
    // 99 de 180 = 55%, enquanto o trilho está em 50%. Intencional.
    hairline: { opacity: 1, fill: 99 },
    trilho: { x: -482, y: y(330, BASE.trilhoTop) },
  },
  {
    id: 'S4',
    nome: 'CLÍMAX — CAPITAL ADVISOR',
    progresso: 1,
    eyebrow: { x: 0, xPercent: 0, y: y(142, BASE.eyebrowTop), fontSize: 11 },
    titulo: {
      x: 0, xPercent: 0, y: y(176.7, BASE.tituloTop),
      fontSize: 46, lineHeight: 1.06, letterSpacing: '-0.025em',
    },
    sub: { x: X_CENTRALIZADO, xPercent: -50, y: y(467.5, BASE.subTop), fontSize: 18, opacity: 0 },
    cta: { x: X_CENTRALIZADO, xPercent: -50, opacity: 0 },
    hairline: { opacity: 1, fill: 180 },
    trilho: { x: -964, y: y(330, BASE.trilhoTop) },
  },
];

/* Runway do terceiro ato, em vh.

   O trecho do trilho (S2 → S4) ocupa 60% do runway e percorre 964px. Com
   250vh, isso dá 1350px de rolagem para 964px de deslocamento, perto o
   bastante de 1:1 para a faixa acompanhar a mão. Os dois trechos de
   transformação do lockup ficam com 450px cada. */
export const SHOWCASE_RUNWAY_VH = 250;
