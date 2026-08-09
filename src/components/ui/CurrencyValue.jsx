import React from 'react';

/**
 * Exibe um valor monetário que nunca "some": ao invés de estourar o card e ser
 * cortado pelo overflow-hidden, o texto fica ancorado à direita (ou à esquerda,
 * se align="left") e encolhe suavemente a fonte conforme o número fica mais
 * comprido — crescendo até o limite do espaço disponível, e diminuindo o
 * tamanho da fonte apenas se realmente não couber.
 *
 * size: '6xl' | '5xl' | '4xl' | '3xl' | '2xl' | 'xl' | 'lg'
 */
const SIZE_MAP_PX = { '6xl': 56, '5xl': 46, '4xl': 36, '3xl': 30, '2xl': 24, xl: 20, lg: 18 };
const BASE_LENGTH = 11; // tamanho aproximado de "R$ 1.234,56"

export default function CurrencyValue({ value, size = '3xl', className = '', align = 'right' }) {
  const formatted = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value || 0);

  const maxPx = SIZE_MAP_PX[size] || 30;
  const minPx = Math.max(14, maxPx * 0.5);
  const extraChars = Math.max(0, formatted.length - BASE_LENGTH);
  const fontSize = Math.max(minPx, maxPx - extraChars * (maxPx * 0.08));

  return (
    <span
      className={`${className} block ${align === 'left' ? 'text-left' : 'text-right'} whitespace-nowrap tabular-nums`}
      style={{ fontSize: `${fontSize}px`, lineHeight: 1.15 }}
      title={formatted}
    >
      {formatted}
    </span>
  );
}