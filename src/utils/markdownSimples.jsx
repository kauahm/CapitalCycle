import React from 'react';

/* ==========================================================================
   markdownSimples — Markdown mínimo do Capital Advisor, renderizado como
   elementos React.

   O modelo responde em Markdown (o próprio system prompt pede bullet
   points), mas o balão do chat imprimia `msg.text` cru dentro de um
   `whitespace-pre-wrap`. O resultado eram os asteriscos na tela:

     **Análise de gastos:**
     **Planejamento de metas:**

   Por que um parser próprio, e não uma biblioteca
   -----------------------------------------------
   Só é preciso o subconjunto que o Advisor realmente emite — parágrafos,
   negrito, listas e quebras de linha — e trazer uma dependência nova para
   isso ampliaria a superfície de um fluxo que roda texto vindo de um
   modelo.

   Por que isto não é vetor de XSS
   -------------------------------
   Nada aqui produz HTML: a saída é uma árvore de elementos React, e todo
   trecho de texto vira filho de um nó, não markup. O React escapa isso por
   construção. Não há `dangerouslySetInnerHTML` em lugar nenhum deste
   arquivo, de propósito — é o que garante que `<img onerror=...>` vindo do
   modelo apareça como texto literal, e não como tag.

   Pelo mesmo motivo links não viram <a>: o destino seria escolhido pelo
   modelo, e um href é exatamente o tipo de coisa que não deve vir de lá.
   A URL continua legível, só não é clicável.
   ========================================================================== */

/* Divide uma linha em texto, **negrito**, *itálico* e `código`.

   Uma regex só, com alternativas, para que a varredura seja da esquerda
   para a direita e um `**a**` nunca seja lido como dois `*a*`: a
   alternativa de negrito vem primeiro e consome os dois asteriscos. */
const INLINE = /(\*\*[^*\n]+\*\*|__[^_\n]+__|`[^`\n]+`|\*[^*\n]+\*|_[^_\n]+_)/g;

function inline(texto, chaveBase) {
  const partes = texto.split(INLINE);
  return partes.map((parte, i) => {
    if (!parte) return null;
    const chave = `${chaveBase}-${i}`;

    if ((parte.startsWith('**') && parte.endsWith('**') && parte.length > 4)
      || (parte.startsWith('__') && parte.endsWith('__') && parte.length > 4)) {
      return <strong key={chave} className="font-semibold text-white">{parte.slice(2, -2)}</strong>;
    }
    if (parte.startsWith('`') && parte.endsWith('`') && parte.length > 2) {
      return (
        <code key={chave} className="px-1 py-0.5 rounded bg-black/30 text-indigo-200 text-[0.9em]">
          {parte.slice(1, -1)}
        </code>
      );
    }
    if ((parte.startsWith('*') && parte.endsWith('*') && parte.length > 2)
      || (parte.startsWith('_') && parte.endsWith('_') && parte.length > 2)) {
      return <em key={chave}>{parte.slice(1, -1)}</em>;
    }
    // Texto comum: vira filho de nó React, então é escapado.
    return <React.Fragment key={chave}>{parte}</React.Fragment>;
  });
}

const ITEM_LISTA = /^\s*[-*+]\s+(.*)$/;
const ITEM_NUMERADO = /^\s*(\d+)[.)]\s+(.*)$/;
const TITULO = /^\s*(#{1,6})\s+(.*)$/;

/**
 * Converte o Markdown do Advisor em elementos React.
 *
 * @param {string} texto
 * @returns {React.ReactNode}
 */
export function renderMarkdown(texto) {
  if (!texto) return null;

  // `\r\n` chega de vez em quando; normalizar aqui evita um `\r` órfão
  // virando espaço no fim de cada linha.
  const linhas = String(texto).replace(/\r\n?/g, '\n').split('\n');

  const blocos = [];
  let paragrafo = [];
  let lista = null; // { ordenada: boolean, itens: string[] }

  const fechaParagrafo = () => {
    if (!paragrafo.length) return;
    const linhasP = paragrafo;
    blocos.push(
      <p key={`p${blocos.length}`} className="whitespace-pre-wrap">
        {linhasP.map((l, i) => (
          <React.Fragment key={i}>
            {i > 0 && <br />}
            {inline(l, `p${blocos.length}-${i}`)}
          </React.Fragment>
        ))}
      </p>,
    );
    paragrafo = [];
  };

  const fechaLista = () => {
    if (!lista) return;
    const { ordenada, itens } = lista;
    const Tag = ordenada ? 'ol' : 'ul';
    blocos.push(
      <Tag
        key={`l${blocos.length}`}
        className={`${ordenada ? 'list-decimal' : 'list-disc'} pl-5 space-y-1`}
      >
        {itens.map((item, i) => (
          <li key={i}>{inline(item, `l${blocos.length}-${i}`)}</li>
        ))}
      </Tag>,
    );
    lista = null;
  };

  for (const linha of linhas) {
    if (!linha.trim()) {
      fechaParagrafo();
      fechaLista();
      continue;
    }

    const titulo = linha.match(TITULO);
    if (titulo) {
      fechaParagrafo();
      fechaLista();
      // Dentro de um balão de chat um <h1> de verdade destoaria da escala
      // do resto; o que importa aqui é a hierarquia, não o corpo.
      blocos.push(
        <p key={`h${blocos.length}`} className="font-semibold text-white">
          {inline(titulo[2], `h${blocos.length}`)}
        </p>,
      );
      continue;
    }

    const numerado = linha.match(ITEM_NUMERADO);
    if (numerado) {
      fechaParagrafo();
      if (lista && !lista.ordenada) fechaLista();
      if (!lista) lista = { ordenada: true, itens: [] };
      lista.itens.push(numerado[2]);
      continue;
    }

    const item = linha.match(ITEM_LISTA);
    if (item) {
      fechaParagrafo();
      if (lista && lista.ordenada) fechaLista();
      if (!lista) lista = { ordenada: false, itens: [] };
      lista.itens.push(item[1]);
      continue;
    }

    // Linha solta depois de uma lista continua a lista? Não: o Advisor
    // separa os blocos com linha em branco, e tratar como continuação
    // grudaria um parágrafo no último item.
    fechaLista();
    paragrafo.push(linha);
  }

  fechaParagrafo();
  fechaLista();

  return <div className="space-y-3">{blocos}</div>;
}
