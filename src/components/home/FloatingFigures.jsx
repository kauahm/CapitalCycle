import { memo } from 'react';

/* =========================================================
   FloatingFigures — valores financeiros flutuando ao fundo.

   Três figuras por seção, no máximo (na prática costuma haver
   uma ou duas visíveis, já que cada ciclo passa boa parte do
   tempo em opacidade zero). Ficam em z-index 0, inertes ao
   mouse, sempre atrás do conteúdo — que vive em z-10.

   As posições ficam nas faixas externas de cada seção, longe
   do texto e dos CTAs; por isso o layout é escolhido por
   `variant`, já que cada seção alinha o conteúdo de um jeito:

     right — conteúdo alinhado à esquerda (Capital Advisor):
             sobra a metade direita inteira.
     sides — conteúdo centralizado (Recursos, Planos):
             sobram as margens dos dois lados.

   Só aparecem a partir de xl (1280px). Abaixo disso o conteúdo
   ocupa quase toda a largura e não haveria como manter a
   distância de segurança do texto.

   Estilos e keyframes em src/index.css (.cc-figs / .cc-fig).
   ========================================================= */

const LAYOUTS = {
  right: [
    { label: '+R$ 250', style: { top: '16%', right: '9%', fontSize: '2.1rem' } },
    { label: '↑ 12,4%', style: { top: '50%', right: '20%', fontSize: '1.6rem' } },
    { label: 'PIX', style: { top: '78%', right: '7%', fontSize: '2.6rem' } },
  ],
  sides: [
    { label: 'R$ 1.240', style: { top: '20%', left: '4%', fontSize: '2.2rem' } },
    { label: '↑ 12,4%', style: { top: '66%', right: '5%', fontSize: '1.7rem' } },
    { label: '+R$ 250', style: { top: '86%', left: '7%', fontSize: '1.9rem' } },
  ],
};

function FloatingFigures({ variant = 'sides' }) {
  const figures = LAYOUTS[variant] || LAYOUTS.sides;

  return (
    <div className="cc-figs hidden xl:block" aria-hidden="true">
      {figures.map(({ label, style }) => (
        <span key={label} className="cc-fig" style={style}>
          {label}
        </span>
      ))}
    </div>
  );
}

export default memo(FloatingFigures);
