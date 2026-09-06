/* =========================================================
   CSS do Hero — vídeo sincronizado ao scroll + zoom digital.

   A seção é alta (280vh) e o conteúdo fica preso com `sticky`
   dentro dela. Essa altura extra é a "pista" de rolagem, dividida
   em três trechos que nunca se sobrepõem:

     0 → 74%    o vídeo avança (currentTime preso ao scroll)
     74% → 93%  o vídeo já parou no último quadro; um zoom digital
                em CSS continua o mesmo movimento até a área de
                vidro da tela preencher a viewport inteira
     93% → 100% o texto entra em crossfade

   Como os trechos são um depois do outro, nunca há dois
   movimentos somados — é o que faz a passagem de "zoom do vídeo"
   para "zoom de CSS" não ter costura visível.

   Quando a pista acaba, o sticky solta sozinho e a página segue o
   fluxo normal. Não há handoff a escrever: é o comportamento
   nativo do sticky.

   O vídeo vive dentro de .cchero-quadro, uma caixa 16:9
   dimensionada por JS exatamente como um `object-fit: cover`
   faria. É esse quadro que recebe o transform do zoom. O texto
   fica FORA dele, numa camada de tela cheia — se estivesse
   dentro, seria ampliado junto e sairia borrado.
   ========================================================= */

const HERO_CSS = `
  .cchero {
    position: relative;
    /* Mesmo preto do fundo do clipe: qualquer folga de
       arredondamento some em vez de virar uma faixa. */
    background: #050608;
    height: 280vh;
  }

  .cchero-pin {
    position: sticky;
    top: 0;
    height: 100vh;
    /* svh não encolhe/cresce com a barra do navegador no mobile,
       então o pin não treme quando ela aparece e some. */
    height: 100svh;
    overflow: hidden;
  }

  .cchero-palco {
    position: absolute;
    inset: 0;
    /* Recorta o que o zoom empurra para fora da viewport. */
    overflow: hidden;
    z-index: 1;
  }

  /* Caixa 16:9 do tamanho de um "cover". As medidas e o transform
     vêm do JS: só ele sabe a largura real do palco (já descontada
     a barra de rolagem) e o fator de zoom que faz o vidro da tela
     cobrir a viewport. */
  .cchero-quadro {
    position: absolute;
    top: 50%;
    left: 50%;
    width: var(--cc-quadro-l, 100%);
    height: var(--cc-quadro-a, 100%);
    transform: translate(-50%, -50%);
    /* A origem é o centro da área de vidro, não o centro do
       quadro: é ela que tem de ficar parada enquanto tudo ao redor
       cresce e sai de cena. Definida pelo JS. */
    transform-origin: var(--cc-vidro-cx, 50%) var(--cc-vidro-cy, 50%);
  }
  /* will-change promove uma camada de composição e a mantém viva
     enquanto a regra existir. Aplicado direto no CSS, o quadro do
     vídeo ficava promovido durante a página inteira; a classe só é
     posta quando o hero está de fato na tela. */
  .cchero-palco.is-ativo .cchero-quadro { will-change: transform; }

  .cchero-video,
  .cchero-poster {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: fill;
    pointer-events: none;
  }

  /* Marcação de conferência do retângulo do vidro (?debug-tela na
     URL). Vive dentro do quadro, então acompanha o zoom: no fim da
     pista ela tem de coincidir com as bordas da viewport. */
  .cchero-vidro-debug {
    position: absolute;
    left: var(--cc-vidro-x, 16.4%);
    top: var(--cc-vidro-y, 4.3%);
    width: var(--cc-vidro-l, 70.4%);
    height: var(--cc-vidro-a, 85.7%);
    outline: 2px dashed #5358ee;
    outline-offset: -1px;
    background: rgba(83, 88, 238, 0.10);
    pointer-events: none;
  }

  /* Grão. O quadro final é um H.264 quase preto ampliado ~1,3x —
     o caso exato em que aparecem degraus de cor (banding) numa
     área grande e escura. Um ruído de 2-3% quebra os degraus e, de
     quebra, é o que separa "gradiente gerado" de "luz filmada". */
  .cchero-grao {
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    opacity: 0.14;
    /* soft-light e não overlay: overlay estava criando uma faixa
       visível na altura da navbar fixa, por blendar com um contexto
       de empilhamento diferente. soft-light dá a mesma textura sem
       o artefato. */
    mix-blend-mode: soft-light;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='r'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23r)'/%3E%3C/svg%3E");
  }

  /* ---------- Camada de texto ----------
     Tela cheia, fora do quadro: depois do zoom a "tela" ocupa a
     viewport inteira, então o texto não precisa mais caber dentro
     de um recorte com moldura. E, por estar fora, não é ampliado
     junto com o vídeo — continua nítido.

     A opacidade vem do scroll; esta transição curta só alisa os
     degraus entre um frame de rolagem e outro. É o que dá ao
     crossfade a sensação de ~180ms sem soltá-lo do scroll. */
  .cchero-camada {
    position: absolute;
    inset: 0;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    /* Enquanto está invisível, não pode capturar clique do CTA. */
    pointer-events: none;
    /* Nem receber foco: opacity 0 sozinho deixa o CTA na ordem de
       tabulação, e quem navega por teclado caía num link invisível
       antes de a tela do notebook sequer acender. A propriedade
       visibility tira o elemento da sequência de foco; a classe volta a
       ligá-la assim que o crossfade começa. */
    visibility: hidden;
    transition: opacity 180ms cubic-bezier(0.16, 1, 0.3, 1);
  }
  .cchero-camada.is-visivel { visibility: visible; }
  .cchero-camada.is-ligada { pointer-events: auto; }

  .cchero-camada a:focus-visible {
    outline: 2px solid #ffffff;
    outline-offset: 3px;
    border-radius: 999px;
  }

  /* A tela "acordando": um véu discreto que levanta o preto só o
     suficiente para o texto ter chão. Entra junto com o conteúdo,
     então é parte do mesmo crossfade. */
  .cchero-brilho {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(105% 85% at 50% 42%,
        rgba(44, 48, 96, 0.52) 0%,
        rgba(14, 16, 30, 0.40) 55%,
        rgba(6, 7, 12, 0.26) 100%);
    pointer-events: none;
  }

  .cchero-conteudo {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    max-width: min(48rem, 88vw);
    padding: 0 1rem;
  }

  /* ---------- Tipografia ----------
     Branco e índigo se invertem aqui: o fundo é a tela escura, não
     o #f4f5f7 do resto do site. */
  .cchero-eyebrow {
    display: inline-flex; align-items: center; gap: 0.5rem;
    font-size: clamp(0.72rem, 1vw, 0.85rem);
    font-weight: 700; letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #8f93f5;
  }
  .cchero-eyebrow-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: currentColor; flex: none;
  }

  /* Tracking em zero, não negativo: caixa alta não tem ascendentes
     e descendentes para criar ritmo, então apertar as letras fecha
     os contraformas do O, D e C e cola o L no espaço seguinte.
     Espaçamento negativo é para caixa de sentença. */
  .cchero-title {
    margin: clamp(0.9rem, 1.8vw, 1.5rem) 0 0;
    font-size: clamp(2.1rem, 5.2vw, 5rem);
    line-height: 1.04;
    font-weight: 900;
    letter-spacing: 0;
    text-transform: uppercase;
    text-wrap: balance;
    color: #ffffff;
  }
  .cchero-title span { display: block; }
  .cchero-title .cchero-accent { color: #5358ee; }

  .cchero-lead {
    margin: clamp(1.1rem, 2.2vw, 1.8rem) 0 0;
    max-width: 36rem;
    font-size: clamp(0.92rem, 1.25vw, 1.1rem);
    line-height: 1.55;
    text-wrap: pretty;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.72);
  }

  /* Pílula índigo, não preta: aqui o fundo já é escuro. */
  .cchero-cta {
    display: inline-flex; align-items: center; gap: 0.6rem;
    margin-top: clamp(1.4rem, 2.6vw, 2.2rem);
    padding: 0.95rem 1.8rem 0.95rem 2.1rem;
    background: #5358ee; color: #fff;
    font-family: inherit;
    font-size: clamp(0.88rem, 1vw, 0.98rem);
    font-weight: 700;
    border-radius: 999px; text-decoration: none; white-space: nowrap;
    transition: transform 0.32s cubic-bezier(0.16, 1, 0.3, 1),
                background 0.32s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .cchero-cta:hover {
    background: #4348e0; transform: translateY(-2px);
    transition-duration: 0.18s;
  }
  /* Um botão sem :active parece morto no clique. */
  .cchero-cta:active { transform: translateY(0) scale(0.985); }
  .cchero-cta svg {
    width: 17px; height: 17px; flex: none;
    transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  }
  /* O que se move é a seta, não a pílula inteira: é o gesto que as
     referências usam e diz para onde o clique leva. */
  .cchero-cta:hover svg { transform: translateX(4px); }

  /* Frase-ponte para a seção seguinte. */
  .cchero-ponte {
    margin: clamp(2.2rem, 4.5vw, 3.6rem) 0 0;
    max-width: 32rem;
    font-size: clamp(0.78rem, 0.95vw, 0.88rem);
    line-height: 1.5;
    /* 0.42 deixava o contraste em ~4,3:1 sobre o véu — abaixo dos
       4,5:1 que texto pequeno pede. */
    color: rgba(255, 255, 255, 0.54);
  }

  /* ---------- Sem movimento / sem scroll-scrubbing ----------
     A seção deixa de ser uma pista de rolagem e vira uma seção
     comum: último quadro parado, já com o zoom aplicado (é o
     estado final), e o texto visível desde o primeiro paint. */
  .cchero--estatico { height: auto; }
  .cchero--estatico .cchero-pin {
    position: static;
    height: auto;
    min-height: 100vh;
    min-height: 100svh;
  }

  @media (max-width: 560px) {
    .cchero-cta { padding: 0.85rem 1.5rem 0.85rem 1.8rem; }
  }

  @media (prefers-reduced-motion: reduce) {
    .cchero-camada { transition: none !important; }
    .cchero-cta { transition: none !important; }
  }
`;

export default HERO_CSS;
