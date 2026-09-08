/* =========================================================
   CSS da zona de retorno — fechamento do circuito.

   Não é um footer e não é uma seção de conteúdo: é o trecho em
   que a linha desce dos Planos, atravessa a faixa da direita para
   a esquerda e sobe um pouco em E0. Não há texto, logo, card,
   fundo próprio nem qualquer elemento além do traço.

   Três coisas impedem que isso leia como borda do site:

   1. a horizontal corre de E0 a E6 dentro da faixa, então nunca
      encosta nas laterais da viewport;
   2. existe folga de 5R abaixo dela até o fim da página;
   3. as duas pontas do desenho estão abertas — a linha entra pelo
      topo e termina no ar, o que uma borda nunca faz.
   ========================================================= */

const RETORNO_CSS = `
  .ccret {
    position: relative;
    background: #f4f5f7;
  }

  /* A altura é a própria composição do retorno: não há conteúdo
     dentro, então ela é declarada aqui e a geometria deriva dela a
     posição da horizontal, da curva e da subida.

     Encolhida de 288px para ~187px no desktop: com a descida longa
     demais, a primeira leitura do conjunto era um "U" enorme
     emoldurando o rodapé, e não a linha fazendo o caminho de volta.
     A topologia não mudou — mudou a proporção. */
  .ccret-faixa {
    position: relative;
    width: var(--cc-faixa);
    margin-inline: auto;
    height: clamp(170px, 13vw, 200px);
  }

  .ccret-faixa > svg {
    position: absolute;
    top: 0; left: 0;
    display: block;
    pointer-events: none;
  }

  .ccret-traco {
    fill: none;
    stroke: var(--cch-muted);
    stroke-width: 1.25;
    stroke-linecap: butt;
    stroke-linejoin: round;
  }

  /* ---------- Mobile ----------
     Mesma topologia: desce em E6, atravessa, sobe em E0. Só a
     altura encolhe, e a folga inferior e a subida acompanham o
     raio menor da faixa estreita. */
  @media (max-width: 767px) {
    .ccret-faixa { height: 160px; }
  }
`;

export default RETORNO_CSS;
