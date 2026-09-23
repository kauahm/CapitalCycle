/* ==========================================================================
   Keyframes do Recursos Showcase — S1 a S4

   Transcritos de `referencia/designer/Recursos Showcase.dc.html`, com duas
   decisoes do storyboard REVOGADAS depois de verem a transicao rodando.

   Revogacao 1 — o vaivem tipografico
   ----------------------------------
   As pranchas desenhavam tres corpos para o mesmo titulo: 52px no D5, 88px
   centralizado no S1 e 46px no S2. Animado no scrub, lia como defeito.
   Corpo, entrelinha e tracking nao existem mais nestes keyframes nem no
   hook — quem define tipografia e so o CSS, pelo `clamp()`.

   Revogacao 2 — a coreografia centralizada do lockup
   --------------------------------------------------
   Tirar o corpo da fonte da timeline nao resolveu a percepcao: o titulo
   continuava parecendo crescer, diminuir e travar. A causa era o TRAJETO,
   nao o tamanho. O lockup fazia, em 1440x900:

     D5 .... x 119,6   y 159,7    (esquerda, no alto)
     S1 .... x 402,5   y 288,7    (centro, embaixo)
     S2 .... x 119,6   y 176,4    (esquerda, no alto de novo)

   Ou seja, 283px de ida e volta na horizontal e 129px de descida e subida
   na vertical, dentro de um pin. Um bloco de texto que atravessa a tela e
   volta le como zoom, e a chegada em S2 — onde ele fica parado enquanto o
   trilho corre — le como travamento.

   A direcao agora e outra: o H2 e uma ANCORA VISUAL. Ele aparece ja na
   posicao definitiva, com um assentamento curto de 16,7px, e nao sai mais
   de la. Quem se move sao os cards, o trilho e o indicador.

     D5 .... x 120   y 160     (posicao estrutural do CSS)
     S1 .... x 120   y 176,7   (assentamento de 16,7px — so isto)
     S2 .... x 120   y 176,7   (identico)
     S3 .... x 120   y 176,7   (identico)
     S4 .... x 120   y 176,7   (identico)

   Nao ha mais `xPercent: -50` em peca nenhuma do lockup, nem x grande,
   nem y grande, nem morph de layout. O S1 continua existindo como marco
   de progresso — e o ponto onde a navbar aterrissa —, mas deixou de ser
   uma composicao propria.

   Curso do trilho
   ---------------
   4 paineis de 520 + 3 gaps de 28 = 2164px. O trilho vai de `left:120` a
   `left:-844`, ou seja 964px, que deixa 120px de margem nas duas pontas.
   Aqui isso vira `x` relativo ao repouso: 0 -> -964. Esse curso esta
   intacto; o que saiu foi o mergulho vertical ate 864 que existia so para
   compor o S1 antigo.
   ========================================================================== */

/* Posições estruturais (CSS) de cada peça — o estado D→R F5, que a H3 já
   deixou pronto. Todo `y` daqui para a frente é relativo a estas. */
export const BASE = {
  eyebrowTop: 132,
  tituloTop: 160,
  subTop: 250,
  ctaTop: 569.8, // posicao estrutural do CTA no CSS; ele nao e mais animado
  trilhoTop: 364,
};

/* 4 painéis de 520 + 3 gaps de 28. */
export const LARGURA_TRILHO = 4 * 520 + 3 * 28;

const y = (topAlvo, base) => +(topAlvo - base).toFixed(2);

export const SHOWCASE_KEYFRAMES = [
  {
    id: 'D5',
    nome: 'RECURSOS ESTABELECIDA (fim da H3)',
    progresso: 0,
    /* Posicao estrutural do CSS. O lockup chega aqui carregado pela subida
       do painel no ato 2 — nao ha fade nem entrada propria, porque isso
       seria mais animacao, e o pedido e menos. */
    eyebrow: { x: 0, y: 0 },
    titulo: { x: 0, y: 0 },
    sub: { x: 0, y: 0, opacity: 1 },
    cta: { x: 0, y: 0, opacity: 0 },
    hairline: { opacity: 0, fill: 0 },
    trilho: { x: 0, y: 0 },
  },
  {
    id: 'S1',
    nome: 'LOCKUP ASSENTADO',
    progresso: 0.2,
    /* O unico movimento do lockup na narrativa inteira: 10px no eyebrow e
       16,7px no titulo, para baixo, uma vez. Daqui em diante os dois ficam
       parados. O S1 deixou de ser uma composicao centralizada e virou so
       este assentamento — mas segue sendo o marco de progresso para onde a
       navbar aponta (ver `landingRunways`). */
    eyebrow: { x: 0, y: y(142, BASE.eyebrowTop) },
    titulo: { x: 0, y: y(176.7, BASE.tituloTop) },
    sub: { x: 0, y: 0, opacity: 1 },
    cta: { x: 0, y: 0, opacity: 0 },
    hairline: { opacity: 0, fill: 0 },
    trilho: { x: 0, y: 0 },
  },
  {
    id: 'S2',
    nome: 'PIN ENGATA — TRILHO EM 0%',
    progresso: 0.4,
    /* Titulo e eyebrow repetem o S1 na virgula: o tween e de X para X e
       nada se move. O subtitulo sai por opacidade, sem deslocamento, para
       nao empurrar nada. O trilho sobe os 34px que o encaixam na faixa de
       leitura e o indicador entra. */
    eyebrow: { x: 0, y: y(142, BASE.eyebrowTop) },
    titulo: { x: 0, y: y(176.7, BASE.tituloTop) },
    sub: { x: 0, y: 0, opacity: 0 },
    cta: { x: 0, y: 0, opacity: 0 },
    hairline: { opacity: 1, fill: 0 },
    trilho: { x: 0, y: y(330, BASE.trilhoTop) },
  },
  {
    id: 'S3',
    nome: 'TRILHO EM CURSO',
    progresso: 0.7,
    eyebrow: { x: 0, y: y(142, BASE.eyebrowTop) },
    titulo: { x: 0, y: y(176.7, BASE.tituloTop) },
    sub: { x: 0, y: 0, opacity: 0 },
    cta: { x: 0, y: 0, opacity: 0 },
    // 99 de 180 = 55%, enquanto o trilho está em 50%. Intencional.
    hairline: { opacity: 1, fill: 99 },
    trilho: { x: -482, y: y(330, BASE.trilhoTop) },
  },
  {
    id: 'S4',
    nome: 'CLÍMAX — CAPITAL ADVISOR',
    progresso: 1,
    eyebrow: { x: 0, y: y(142, BASE.eyebrowTop) },
    titulo: { x: 0, y: y(176.7, BASE.tituloTop) },
    sub: { x: 0, y: 0, opacity: 0 },
    cta: { x: 0, y: 0, opacity: 0 },
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
