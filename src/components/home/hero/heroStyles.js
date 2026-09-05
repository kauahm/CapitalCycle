/* =========================================================
   CSS da Hero.

   Segue o padrão já usado na landing (string injetada via <style>),
   para não introduzir um segundo jeito de estilizar a mesma página.
   Só o que é novo mora aqui — os tokens compartilhados (título, lead,
   botões, navbar) continuam no PAGE_CSS do HomePage.
   ========================================================= */

const HERO_CSS = `
  /* ---------- Palco 3D ----------
     Fundo escuro, não cinza médio. As referências são unânimes: o que
     dá drama é faixa tonal, e cinza médio não tem nenhuma — não tem
     preto para o objeto se destacar nem branco para o especular
     brilhar. WatchUltra.png e apple-macbook-pro.webp partem do preto.

     Não é preto puro: um gradiente radial levanta discretamente a
     região onde o ciclo vive, para o objeto parecer estar num
     ambiente iluminado e não recortado sobre o vazio. */
  .cchero-stage {
    position: absolute; inset: 0; z-index: 0;
    pointer-events: none;
    background:
      radial-gradient(58% 60% at 64% 48%, #12142a 0%, #080914 52%, #050609 100%),
      #050609;
  }

  /* Brilho difuso atrás do canvas — a mesma ideia do sangramento de luz
     do MacBook Pro, mas em CSS, cobrindo a área inteira. Empurra o
     objeto para dentro de um espaço em vez de deixá-lo colado na tela. */
  .cchero-stage::before {
    content: ''; position: absolute; inset: 0;
    background:
      radial-gradient(26% 30% at 64% 50%, rgba(99,102,241,0.22) 0%, rgba(99,102,241,0) 72%);
  }

  .cchero-canvas, .cchero-fallback {
    position: absolute; inset: 0;
  }

  /* O canvas cobre o fallback SVG com um fade quando o chunk do
     three.js termina de carregar. Sem transição a troca vira um
     "pisca" no meio da headline. */
  .cchero-canvas {
    opacity: 0;
    transition: opacity 0.7s cubic-bezier(0.16,1,0.3,1);
  }
  .cchero-canvas.is-ready { opacity: 1; }

  /* O canvas é transparente: sem esta saída, o SVG continuaria
     aparecendo por baixo e o usuário veria dois ciclos sobrepostos. */
  .cchero-fallback {
    opacity: 1;
    transition: opacity 0.5s cubic-bezier(0.16,1,0.3,1);
  }
  .cchero-stage.is-ready .cchero-fallback { opacity: 0; }

  /* O SVG ocupa a mesma zona que o anel 3D ocupa no desktop: à direita
     da headline, mas antes da coluna de fases. Encostado na borda ele
     passava por cima dos rótulos. */
  .cchero-fallback {
    display: flex; align-items: center; justify-content: flex-end;
    padding-right: 17vw;
  }
  .cchero-fallback svg {
    width: min(44vw, 560px);
    height: auto;
    max-height: 78%;
    opacity: 0.92;
  }

  /* ---------- Scrim ----------
     Escurece as bordas o suficiente para a headline preta e o menu
     branco terem contraste, mantendo o miolo limpo para o ciclo. */
  .cchero-scrim {
    position: absolute; inset: 0; pointer-events: none;
    background:
      linear-gradient(
        92deg,
        rgba(5,6,9,0.92) 0%,
        rgba(5,6,9,0.70) 26%,
        rgba(5,6,9,0.12) 46%,
        rgba(5,6,9,0.00) 64%,
        rgba(5,6,9,0.18) 88%,
        rgba(5,6,9,0.45) 100%
      ),
      /* vinheta: fecha as bordas e concentra o olho no objeto,
         como em WatchUltra.png */
      radial-gradient(120% 100% at 62% 46%, rgba(5,6,9,0) 40%, rgba(5,6,9,0.72) 100%);
  }
  .cchero-scrim::after {
    content: ''; position: absolute; inset: -20%;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E");
    opacity: 0.10; mix-blend-mode: soft-light;
  }

  /* A classe .cch pinta o cinza claro herdado do design antigo e vale
     para as duas camadas da história. A Hero é escura agora. */
  .cch-hero-layer { background-color: #050609; }

  /* A Hero deixa de ser um grid de duas colunas. O texto ocupa a
     esquerda e o lado direito inteiro fica livre para o objeto ser
     protagonista — como em WatchUltra.png, onde nada disputa espaço
     com o produto. */
  .cch-hero-layer .cch-inner {
    grid-template-columns: minmax(0, 1fr);
  }
  .cch-hero-layer .cch-left { max-width: 46rem; }

  /* ---------- Texto da Hero sobre fundo escuro ----------
     Os tokens de tipografia continuam vindo do PAGE_CSS (a Hero não
     inventa uma segunda escala); aqui só invertem as cores, e só dentro
     da camada da Hero — os Recursos seguem claros. */
  .cch-hero-layer .cch-title { color: #ffffff; }
  .cch-hero-layer .cch-title .cch-accent { color: #a5a0ff; }
  .cch-hero-layer .cch-lead { color: rgba(255,255,255,0.68); }

  .cch-hero-layer .cch-btn-primary {
    box-shadow: 0 12px 34px rgba(99,102,241,0.42);
  }
  .cch-hero-layer .cch-btn-primary:hover {
    box-shadow: 0 18px 44px rgba(99,102,241,0.55);
  }
  /* O ghost era preto translúcido sobre fundo claro; no escuro ele
     precisa ser o contrário para continuar existindo. */
  .cch-hero-layer .cch-btn-ghost {
    background: rgba(255,255,255,0.10);
    border: 1px solid rgba(255,255,255,0.16);
    color: #ffffff;
  }
  .cch-hero-layer .cch-btn-ghost:hover {
    background: rgba(255,255,255,0.17);
  }

  /* ---------- Leitura das fases do ciclo ----------
     A "revelação de dados" da narrativa, em HTML acessível: a fase
     acesa aqui é a mesma que está acesa na fita 3D. */
  /* ---------- Régua de etapas ----------
     Era uma coluna de quatro linhas encostada à direita, no mesmo lado
     do objeto: dois centros de leitura disputando a mesma metade da
     tela. Nenhuma das referências faz isso — em 8.png e 9.png o
     indicador de etapa é um bloco horizontal discreto, fora do caminho
     do objeto. Aqui ele desce para o rodapé da coluna de texto. */
  .cchero-phases {
    display: block;
    width: 100%;
    max-width: 44rem;
    margin: 3.2rem 0 0;
  }
  .cchero-phases-title {
    margin: 0 0 1rem;
    font-size: 0.72rem; font-weight: 700;
    letter-spacing: 0.16em; text-transform: uppercase;
    color: rgba(255,255,255,0.66);
    text-align: left;
  }
  .cchero-phases-row {
    display: grid; grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
  }

  /* A hierarquia entre a fase ativa e as demais NÃO é feita por
     opacity. Escurecer o bloco inteiro multiplicava a opacidade sobre
     cores já translúcidas e derrubava o contraste dos rótulos para
     1.87:1 — abaixo do mínimo legível, num texto que carrega dado real
     (o valor de cada fase).

     A distinção fica por conta da barra acesa, do rótulo mais claro e
     da nota, que só existe na fase ativa. Todas as quatro continuam
     legíveis o tempo todo. */
  .cchero-phase {
    display: block;
    padding-top: 0.85rem;
    text-align: left;
  }

  /* A barra no topo de cada etapa é o indicador de progresso: apagada
     nas etapas que ainda não chegaram, acesa na atual. */
  .cchero-phase-dot {
    display: block;
    width: 100%; height: 2px; border-radius: 2px;
    background: rgba(255,255,255,0.16);
    transition: background 0.45s ease, box-shadow 0.45s ease;
  }
  .cchero-phase.is-on .cchero-phase-dot {
    background: #8b7cf6;
    box-shadow: 0 0 12px 1px rgba(139,124,246,0.65);
  }

  .cchero-phase-head {
    display: flex; flex-direction: column; gap: 0.3rem;
    margin-top: 0.8rem;
  }
  .cchero-phase-label {
    font-size: 0.7rem; font-weight: 700;
    letter-spacing: 0.13em; text-transform: uppercase;
    color: rgba(255,255,255,0.68); white-space: nowrap;
    transition: color 0.45s ease;
  }
  .cchero-phase.is-on .cchero-phase-label { color: rgba(255,255,255,0.95); }
  .cchero-phase-value {
    font-size: 1.12rem; font-weight: 800;
    letter-spacing: -0.02em; color: rgba(255,255,255,0.80);
    white-space: nowrap;
    transition: color 0.45s ease;
  }
  .cchero-phase.is-on .cchero-phase-value { color: #ffffff; }

  /* A nota só existe para a fase ativa — quatro descrições visíveis ao
     mesmo tempo viram parágrafo, e a coluna deixa de ser um indicador. */
  .cchero-phase-note {
    margin: 0;
    font-size: 0.82rem; line-height: 1.4; color: rgba(255,255,255,0.62);
    max-height: 0; opacity: 0; overflow: hidden;
    transition: max-height 0.45s cubic-bezier(0.16,1,0.3,1), opacity 0.35s ease, margin 0.45s ease;
  }
  .cchero-phase.is-on .cchero-phase-note {
    max-height: 3.2rem; opacity: 1; margin-top: 0.45rem;
  }

  /* ---------- Apagão da transição ----------
     A Hero é preta e os Recursos são quase brancos. Fundir os dois
     diretamente passa por 50% de cada = cinza-lama, com o anel fantasma
     e o texto da próxima seção visíveis ao mesmo tempo.

     Em dois tempos o corte fica limpo, que é como as páginas da Apple
     encadeiam uma seção escura numa clara: o ciclo se apaga no preto
     primeiro, e só então o claro nasce do preto. */
  .cchero-blackout {
    position: absolute; inset: 0; z-index: 5;
    pointer-events: none;
    background: #050609;
  }

  /* ---------- Dica de rolagem ---------- */
  .cchero-scroll {
    position: absolute; left: 50%; bottom: 1rem; transform: translateX(-50%);
    z-index: 15;
    display: flex; flex-direction: column; align-items: center; gap: 0.6rem;
    color: rgba(255,255,255,0.55); text-align: center;
    font-size: 0.9rem; line-height: 1.3;
  }
  .cchero-mouse { animation: cchero-float 2.4s ease-in-out infinite; }
  @keyframes cchero-float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(5px); }
  }

  /* ---------- Responsivo ---------- */
  @media (max-width: 980px) {
    /* Em coluna única o ciclo vira atmosfera: sobe para trás do texto,
       perde saturação e deixa de disputar a leitura. A narrativa das
       fases continua, agora na lista abaixo do CTA. */
    .cchero-fallback {
      justify-content: center; align-items: flex-start;
      padding: 2rem 0 0;
    }
    .cchero-fallback svg { width: 88vw; max-height: 38%; opacity: 0.42; }
    .cchero-canvas { opacity: 0; }
    /* Em 1.png (Jeton) a headline branca fica DIRETO sobre o 3D e
       funciona, porque a tipografia é enorme e o scrim protege a zona
       do texto. A 0.5 o ciclo virava um fantasma e o mobile perdia o
       conceito inteiro. */
    .cchero-canvas.is-ready { opacity: 0.85; }
    /* Sobrou do tema claro e lavava o fundo escuro até cinza, deixando
       o texto branco ilegível.

       Direcional, e não uniforme: escurece a faixa esquerda (headline,
       subtítulo, CTAs) e o rodapé (a régua de etapas), e deixa o canto
       superior direito quase limpo, que é onde o ciclo vive. Um scrim
       uniforme forte protege o texto mas apaga o objeto junto. */
    .cchero-scrim {
      background:
        linear-gradient(
          180deg,
          rgba(5,6,9,0.06) 0%,
          rgba(5,6,9,0.48) 52%,
          rgba(5,6,9,0.90) 100%
        ),
        linear-gradient(
          90deg,
          rgba(5,6,9,0.74) 0%,
          rgba(5,6,9,0.30) 58%,
          rgba(5,6,9,0.00) 100%
        );
    }
    .cchero-scrim::after { opacity: 0.12; }

    .cchero-scroll {
      position: relative; left: auto; bottom: auto; transform: none;
      margin: 2rem auto 0; width: max-content;
    }
    .cchero-phases { max-width: none; margin-top: 2.4rem; }
    .cchero-phases-row { grid-template-columns: repeat(2, 1fr); gap: 1.1rem 1.25rem; }
  }

  @media (max-width: 560px) {
    .cchero-phase-value { font-size: 1rem; }
    .cchero-phase-label { font-size: 0.64rem; letter-spacing: 0.1em; }
  }

  @media (prefers-reduced-motion: reduce) {
    .cchero-canvas, .cchero-phase, .cchero-phase-dot, .cchero-phase-note {
      transition: none !important;
    }
    .cchero-mouse { animation: none; }
    /* Sem movimento não há playhead: as quatro fases são mostradas de
       uma vez, todas legíveis. */
    .cchero-phase { opacity: 1; }
    .cchero-phase-note { max-height: 3.2rem; opacity: 1; margin-top: 0.35rem; }
  }
`;

export default HERO_CSS;
