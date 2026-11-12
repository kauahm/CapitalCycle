import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { renderMarkdown } from './markdownSimples';

const html = (md) => renderToStaticMarkup(renderMarkdown(md));

describe('renderMarkdown', () => {
  it('renderiza negrito, itálico, código e listas', () => {
    const saida = html('**Resumo**\n\n- item *um*\n- item `dois`\n\n1. primeiro\n2. segundo');
    expect(saida).toContain('<strong');
    expect(saida).toContain('Resumo</strong>');
    expect(saida).toContain('<ul');
    expect(saida).toContain('<em>um</em>');
    expect(saida).toContain('<code');
    expect(saida).toContain('<ol');
  });

  it('nunca injeta HTML vindo do modelo', () => {
    const saida = html('Olá <img src=x onerror="alert(1)"> **x**');
    expect(saida).not.toContain('<img');
    expect(saida).toContain('&lt;img');
  });

  it('títulos viram parágrafos em destaque e links não viram <a>', () => {
    const saida = html('## Plano\nVeja https://exemplo.com');
    expect(saida).not.toContain('<h2');
    expect(saida).toContain('Plano');
    expect(saida).not.toContain('<a ');
    expect(saida).toContain('https://exemplo.com');
  });

  it('texto vazio devolve null', () => {
    expect(renderMarkdown('')).toBeNull();
  });
});
