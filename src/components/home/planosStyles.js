/* =========================================================
   CSS da seção Planos — estação 07, ESCOLHER.

   Mesma linguagem das seções anteriores: fundo #f4f5f7, traço
   grafite de 1,25px, rótulo de estação em 11px tabular. A seção é
   onde o circuito chega, não um bloco de preços colado no fim da
   página.

   Os dois planos são apresentados como comparação, não como um
   destaque e um coadjuvante: mesma borda, mesmo fundo, mesmo raio,
   mesma tipografia, mesma altura de CTA. A diferença entre eles
   está no conteúdo das listas, que vem de plans.js.

   Não há índigo nesta seção. A regra da página é um elemento
   saturado por viewport, e aqui existem duas ações equivalentes —
   pintar as duas quebraria a regra e pintar uma criaria a
   hierarquia artificial que o briefing manda remover.
   ========================================================= */

const PLANOS_CSS = `
  .ccpla {
    position: relative;
    background: #f4f5f7;
  }

  /* Todo o respiro mora aqui, não na seção: a altura medida é a da
     seção inteira e o eixo desce de borda a borda, encontrando a
     Passagem acima. */
  .ccpla-faixa {
    position: relative;
    width: var(--cc-faixa);
    margin-inline: auto;
    padding-top: clamp(56px, 6.2vw, 92px);
    padding-bottom: clamp(88px, 10vw, 148px);
  }

  .ccpla-faixa > svg {
    position: absolute;
    top: 0; left: 0;
    display: block;
    pointer-events: none;
  }

  .ccpla-traco {
    fill: none;
    stroke: var(--cch-muted);
    stroke-width: 1.25;
    stroke-linecap: butt;
    stroke-linejoin: round;
  }

  /* A largura vem da geometria e termina a 2R do eixo: o conteúdo
     nunca encosta no traço nem passa por trás dele. */
  .ccpla-conteudo { position: relative; z-index: 1; }

  /* ---------- Cabeçalho da etapa ----------
     Tipografia inteira do átomo .cc-most. A nota em prosa que ficava
     aqui ("O próximo estágio do ciclo") saiu: no lugar dela está o
     que a etapa mede, que é quantos planos existem. */

  .ccpla-titulo {
    margin: clamp(28px, 3vw, 44px) 0 0;
    max-width: 20ch;
    font-size: clamp(28px, 3.4vw, 46px);
    line-height: 1.14;
    font-weight: 600;
    letter-spacing: -0.02em;
    color: var(--cch-ink);
  }

  .ccpla-lead {
    margin: 20px 0 0;
    max-width: 46ch;
    font-size: 15px;
    line-height: 1.6;
    font-weight: 400;
    color: var(--cch-body);
    text-wrap: pretty;
  }

  /* ---------- Comparação ----------
     Duas colunas iguais. Nenhuma escala, elevação ou cor separa
     uma da outra. */
  .ccpla-grade {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-top: clamp(48px, 5.5vw, 76px);
    /* stretch: os dois cards ficam com a mesma altura e os CTAs
       alinham na base mesmo se as listas tiverem tamanhos
       diferentes. */
    align-items: stretch;
  }

  .ccpla-plano {
    display: flex;
    flex-direction: column;
    padding: clamp(24px, 2.6vw, 34px);
    border: 1px solid rgba(19, 19, 22, 0.10);
    border-radius: 12px;
    background: #ffffff;
  }

  .ccpla-nome {
    margin: 0;
    font-size: 17px;
    font-weight: 600;
    letter-spacing: -0.01em;
    color: var(--cch-ink);
  }

  /* Os limites do plano em uma linha. Mesmo nível tipográfico das
     unidades das estações — porque é o que ela é: a unidade em que
     este plano é medido. Nenhuma cor, borda ou fundo separa um
     card do outro; o que os diferencia é o que está escrito. */
  .ccpla-limites {
    margin: 10px 0 0;
    font-size: 10px;
    font-weight: 500;
    line-height: 1.4;
    letter-spacing: 0.10em;
    text-transform: uppercase;
    color: var(--cch-muted);
  }

  /* Preço com presença, sem virar protagonista: o nome vem antes e
     a descrição continua legível logo abaixo. */
  .ccpla-preco {
    display: flex;
    align-items: baseline;
    gap: 5px;
    margin: 18px 0 0;
    font-variant-numeric: tabular-nums;
  }
  .ccpla-moeda {
    font-size: 15px;
    font-weight: 500;
    color: var(--cch-body);
  }
  .ccpla-valor {
    font-size: clamp(30px, 3vw, 38px);
    font-weight: 600;
    line-height: 1;
    letter-spacing: -0.02em;
    color: var(--cch-ink);
  }
  .ccpla-periodo {
    font-size: 14px;
    font-weight: 500;
    color: var(--cch-body);
  }

  .ccpla-desc {
    margin: 16px 0 0;
    font-size: 14px;
    line-height: 1.55;
    color: var(--cch-body);
    text-wrap: pretty;
  }

  /* ---------- Lista ----------
     O marcador é um fio de 6px na cor do circuito, não um ícone.
     Mesma linguagem das graduações do instrumento. */
  .ccpla-lista {
    margin: 26px 0 30px;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 11px;
  }
  .ccpla-lista li {
    position: relative;
    padding-left: 18px;
    font-size: 13.5px;
    line-height: 1.5;
    color: var(--cch-body);
  }
  .ccpla-lista li::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0.62em;
    width: 6px;
    height: 1px;
    background: var(--cch-muted);
  }

  /* ---------- CTA ----------
     Contorno e não preenchimento: a ação principal da página é o
     CTA índigo do Hero, e este não pode competir com ele. Sem
     seta, sem gradiente, sem sombra, sem pílula. */
  .ccpla-cta {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    /* auto: encosta na base do card, então os dois CTAs ficam na
       mesma linha mesmo com listas de tamanhos diferentes. */
    margin-top: auto;
    height: 46px;
    border: 1px solid var(--cch-ink);
    border-radius: 10px;
    background: transparent;
    font-family: inherit;
    font-size: 14px;
    font-weight: 600;
    color: var(--cch-ink);
    text-decoration: none;
    white-space: nowrap;
    transition: background-color 0.18s ease, color 0.18s ease;
  }
  .ccpla-cta:hover {
    background: var(--cch-ink);
    color: #ffffff;
  }

  /* ---------- Tablet ---------- */
  @media (max-width: 1119px) {
    .ccpla-grade { gap: 16px; }
    .ccpla-lista li { font-size: 13px; }
  }

  /* ---------- Mobile ----------
     Empilhado, sem carrossel e sem accordion. A seção cresce em
     altura em vez de comprimir os cards. */
  @media (max-width: 767px) {
    .ccpla-faixa {
      padding-top: 64px;
      padding-bottom: 80px;
    }
    .ccpla-grade {
      grid-template-columns: 1fr;
      gap: 16px;
      margin-top: 40px;
    }
    .ccpla-titulo { max-width: none; }
    .ccpla-valor { font-size: 32px; }
    .ccpla-cta { height: 48px; font-size: 15px; }
  }

  @media (prefers-reduced-motion: reduce) {
    .ccpla-cta { transition: none; }
  }
`;

export default PLANOS_CSS;
