/* ==========================================================================
   Keyframes oficiais do Recursos Showcase — S1 a S4

   Transcritos de `referencia/designer/Recursos Showcase.dc.html` e medidos
   no próprio arquivo renderizado (as posições do S1 saem de um flex column,
   não de coordenadas escritas à mão na prancha).

   Precedência: nesta fase o SHOWCASE manda. `RecursosPanel.dc.html` e
   `RecursosTrack.dc.html` são componentes subordinados a ele.

   Tipografia FORA da narrativa — o vaivém foi REVOGADO
   ----------------------------------------------------
   As pranchas desenhavam três corpos para o mesmo título:

     D→R F5 (RecursosPanel) ....... 52px, à esquerda
     Showcase S1 .................. 88px, centralizado, em duas linhas
     Showcase S2 .................. 46px, à esquerda

   Animado no scrub, isso lia como defeito: o título começava menor,
   crescia demais, voltava a diminuir e parecia travar antes dos cards.
   A decisão está revogada.

   A primeira correção igualou os três corpos em 52px, mas manteve o corpo
   da fonte DENTRO dos keyframes — o tween continuava existindo, só que de
   52 para 52. Funcionava, e ainda assim era frágil: bastava alguém editar
   um número para o vaivém voltar, e a tipografia ficava descrita em dois
   lugares (aqui e no CSS).

   Agora a garantia é estrutural. Corpo, entrelinha e tracking NÃO EXISTEM
   mais nestes keyframes, e a timeline não tem como tocá-los. Quem define
   tipografia é só o CSS — `.cc-recursos__titulo` já traz
   `clamp(30px, 3.611vw, 52px)`, que dá 52px em 1440 e acompanha a largura
   sozinho.

   O que a narrativa transforma é POSIÇÃO e OPACIDADE, e nada mais:
   x / xPercent / y / opacity. Não há scale em peça nenhuma do lockup, nem
   wrapper escalando, nem largura animada.

   Como o título de 52px ocupa uma linha só (629px) em toda a sequência, o
   S1 foi recomposto para não deixar o vão que a caixa menor abriria.

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

/* `max-width` do título. Com o corpo fixo em 52px a linha inteira mede
   629px e cabe folgada aqui, em linha única, do D5 ao S4 — que é
   justamente o ponto da tipografia estável: a caixa não muda de altura
   no meio do scrub. O valor é mantido em 760 por ser o teto já aprovado
   e por continuar segurando a linha caso a copy cresça. */
export const TITULO_MAX_WIDTH = 760;

/* 4 painéis de 520 + 3 gaps de 28. */
export const LARGURA_TRILHO = 4 * 520 + 3 * 28;

const y = (topAlvo, base) => +(topAlvo - base).toFixed(2);

export const SHOWCASE_KEYFRAMES = [
  {
    id: 'D5',
    nome: 'RECURSOS ESTABELECIDA (fim da H3)',
    progresso: 0,
    eyebrow: { x: 0, xPercent: 0, y: 0 },
    titulo: { x: 0, xPercent: 0, y: 0 },
    sub: { x: 0, xPercent: 0, y: 0, opacity: 1 },
    cta: { x: X_CENTRALIZADO, xPercent: -50, y: 0, opacity: 0 },
    hairline: { opacity: 0, fill: 0 },
    trilho: { x: 0, y: 0 },
  },
  {
    id: 'S1',
    nome: 'INTRODUÇÃO',
    progresso: 0.2,
    /* Recomposto para o título de uma linha. O de 88px ocupava duas e
       empurrava o subtítulo para 467,5; com 56px de caixa aquele valor
       deixaria um vão de mais de 100px no meio do lockup. Agora as quatro
       peças se distribuem a partir de 206 com respiros declarados:
       eyebrow → 70 → título → 50 → subtítulo → CTA. */
    eyebrow: { x: X_CENTRALIZADO, xPercent: -50, y: y(206, BASE.eyebrowTop) },
    titulo: { x: X_CENTRALIZADO, xPercent: -50, y: y(289, BASE.tituloTop) },
    sub: { x: X_CENTRALIZADO, xPercent: -50, y: y(395.2, BASE.subTop), opacity: 1 },
    /* O CTA sobe junto: preso nos 569,8 do CSS ele ficaria 116px abaixo do
       subtítulo, isolado do lockup que acabou de encolher. */
    cta: { x: X_CENTRALIZADO, xPercent: -50, y: -60, opacity: 1 },
    hairline: { opacity: 0, fill: 0 },
    // O trilho desce para o rodapé: no S1 ele só assoma 36px (900 − 864).
    trilho: { x: 0, y: y(864, BASE.trilhoTop) },
  },
  {
    id: 'S2',
    nome: 'PIN ENGATA — TRILHO EM 0%',
    progresso: 0.4,
    eyebrow: { x: 0, xPercent: 0, y: y(142, BASE.eyebrowTop) },
    titulo: { x: 0, xPercent: 0, y: y(176.7, BASE.tituloTop) },
    sub: { x: X_CENTRALIZADO, xPercent: -50, y: y(467.5, BASE.subTop), opacity: 0 },
    cta: { x: X_CENTRALIZADO, xPercent: -50, y: -60, opacity: 0 },
    hairline: { opacity: 1, fill: 0 },
    trilho: { x: 0, y: y(330, BASE.trilhoTop) },
  },
  {
    id: 'S3',
    nome: 'TRILHO EM CURSO',
    progresso: 0.7,
    eyebrow: { x: 0, xPercent: 0, y: y(142, BASE.eyebrowTop) },
    titulo: { x: 0, xPercent: 0, y: y(176.7, BASE.tituloTop) },
    sub: { x: X_CENTRALIZADO, xPercent: -50, y: y(467.5, BASE.subTop), opacity: 0 },
    cta: { x: X_CENTRALIZADO, xPercent: -50, y: -60, opacity: 0 },
    // 99 de 180 = 55%, enquanto o trilho está em 50%. Intencional.
    hairline: { opacity: 1, fill: 99 },
    trilho: { x: -482, y: y(330, BASE.trilhoTop) },
  },
  {
    id: 'S4',
    nome: 'CLÍMAX — CAPITAL ADVISOR',
    progresso: 1,
    eyebrow: { x: 0, xPercent: 0, y: y(142, BASE.eyebrowTop) },
    titulo: { x: 0, xPercent: 0, y: y(176.7, BASE.tituloTop) },
    sub: { x: X_CENTRALIZADO, xPercent: -50, y: y(467.5, BASE.subTop), opacity: 0 },
    cta: { x: X_CENTRALIZADO, xPercent: -50, y: -60, opacity: 0 },
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
