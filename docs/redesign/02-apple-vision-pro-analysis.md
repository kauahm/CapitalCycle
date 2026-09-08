# 02 — Análise da referência: apple.com/apple-vision-pro

Análise feita **na página ao vivo**, em 2026-09-08, com medição do DOM e dos
estilos computados a 1440×900. Os números abaixo são medidos, não estimados.

O objetivo não é copiar. É extrair os mecanismos e depois decidir, um por um,
quais fazem sentido para um SaaS financeiro brasileiro de R$ 64,90/ano.

---

## 1. Arquitetura narrativa da página

A página tem **35,3 viewports de altura**, 28 vídeos e 73 imagens. Ela se divide
em blocos com papéis distintos:

| Bloco | Papel | Altura |
|---|---|---|
| Hero | Nome, uma linha de novidade, dois CTAs (Book a demo / Buy) | ~0,9 vp |
| Manifesto | 3 frases curtas centradas, sem mídia. "The era of spatial computing is here." | ~1,5 vp |
| **Design** ("Take a closer look") | O objeto físico examinado peça por peça | 2,8 vp |
| **7 capítulos de capacidade** | Entertainment, Productivity, Photos and Videos, Connection, Apps, visionOS, Technology | 3,4–3,6 vp **cada** |
| Values | Posicionamento institucional (privacidade, acessibilidade, ambiente) | — |
| Fechamento | Comprar, comparar, especificações | — |

**A observação estrutural mais importante:** os capítulos de capacidade têm
**todos quase exatamente a mesma altura** — entre 3,4 e 3,6 viewports. A página
não é uma sequência de seções de tamanhos arbitrários; é um **compasso**. Cada
capacidade recebe a mesma quantidade de espaço e de tempo, e isso é o que faz a
rolagem ter métrica em vez de ter apenas comprimento.

## 2. A ordem em que o produto é apresentado

1. **O que é** (hero: nome + um atributo novo)
2. **Por que importa** (manifesto: 3 frases, zero mídia, muito respiro)
3. **O objeto** (design: examinado de perto, antes de qualquer software)
4. **O que ele faz** (7 capítulos, do prazer para o técnico)
5. **No que a empresa acredita** (values)
6. **Como comprar**

A progressão é **do benefício para o detalhe** e, dentro dela, **do emocional
para o técnico**: Entertainment vem primeiro, Technology vem por último. Ninguém
é obrigado a ler sobre micro-OLED para entender a proposta, mas quem quiser lê.

## 3. Como alterna produto, benefício e explicação

Cada capítulo repete a mesma estrutura de quatro camadas, nesta ordem:

```
1. headline-lockup   → eyebrow (24px/700) + headline (80px/700)
2. scroll-container  → sticky-element: palco de mídia de 1425×871px (0,97 vh)
3. portal-content    → corpo de texto (21px), coluna de 970px
4. drawer-wrapper    → gaveta expansível com 11–16 cartões de detalhe
```

Traduzindo o ritmo: **afirmação curta → experiência → explicação → detalhe sob
demanda.**

A camada 4 é o mecanismo mais inteligente da página inteira. As gavetas
carregam **9 galerias com 11 a 16 cartões cada** — mais de cem itens de detalhe
técnico. Nada disso está aberto por padrão. **A página é curta para quem quer
pouco e profunda para quem quer muito, no mesmo comprimento de rolagem.**

## 4. Como cada capacidade recebe um capítulo próprio

O padrão é rigoroso e sem exceção:

- **Um eyebrow de uma palavra** que nomeia o território ("Entertainment",
  "Productivity", "Connection", "Apps").
- **Uma headline de 3 a 7 palavras**, frequentemente quebrada em duas linhas
  curtas: "The ultimate theater. / Wherever you are." — "Be in the moment. /
  All over again."
- **Um palco de mídia de uma viewport inteira**, `position: sticky`, que fica
  parado enquanto o texto passa.
- **Um parágrafo só** de corpo.
- **Uma gaveta** com o resto.

O que isso produz: **cada capacidade tem um momento em que é a única coisa na
tela.** Não há dois recursos disputando a mesma viewport. Não há grade de cards
com seis funcionalidades lado a lado. Em nenhum ponto da página.

## 5. Uso do produto em escala grande

O palco de mídia é medido em **1425 px de largura numa viewport de 1440** —
praticamente full-bleed — por **871 px de altura**, ou **0,97 da viewport**.

O produto, portanto, ocupa **a tela inteira**, com margem lateral quase nula.
Não há moldura, sombra, card, borda arredondada em volta, nem "mockup de
notebook". O produto **é** o plano de fundo naquele momento.

## 6. Uso de close-ups

O capítulo "Take a closer look" existe só para isso: examinar o objeto peça por
peça (banda, dial, Light Seal, alto-falantes, Digital Crown, bateria, lentes).
Cada peça é um cartão de gaveta com sua própria mídia e sua própria frase.

Função narrativa: o close-up é onde a página **prova a qualidade** que a
headline afirma. Uma afirmação de precisão é barata; um close-up do mecanismo é
que a sustenta.

## 7. Uso de espaço negativo

- Fundo `#ffffff` puro. Sem gradiente, sem textura, sem ruído, sem blob.
- A coluna de texto tem **970 px numa viewport de 1440** — ela ocupa 67 % da
  largura e **deixa um terço da tela vazio de propósito**.
- Entre a headline e a mídia, entre a mídia e o corpo, entre o corpo e a gaveta,
  há intervalos grandes e constantes.

O espaço negativo aqui não é estilo: é o que permite que o palco de mídia leia
como **grande**. Um objeto só é grande em relação ao vazio ao redor.

## 8. Relação texto/imagem

Medido:

| Elemento | Tamanho | Peso |
|---|---|---|
| eyebrow | 24 px | 700 |
| headline | 80 px / 84 px de entrelinha | 700 |
| corpo | 21 px / 29 px de entrelinha | 600 |

**A headline é 3,8× o corpo.** Essa é a única hierarquia tipográfica relevante
da página, e ela é enorme. Compare com a landing atual do Capital Cycle, onde a
maior diferença entre dois níveis de informação é 18 px contra 11 px (1,6×).

Proporção de texto por capítulo: **1 eyebrow + 1 headline + 1 parágrafo** para
**1 viewport inteira de mídia**. O texto nomeia; a mídia demonstra. Não há
legenda descrevendo o que a mídia já mostra.

## 9. Progressão pelo scroll

- **Zero `position: sticky` no nível de seção.** O pin acontece **dentro** de
  cada capítulo: `scroll-container > sticky-element`, um palco de 1 viewport
  preso dentro de um capítulo de 3,4 viewports.
- Consequência: o scroll é sempre normal. Nunca há sequestro de rolagem, nunca
  há uma barra de rolagem que mente sobre o comprimento da página.
- A duração do pin é curta e proporcional: **1 viewport presa dentro de 3,4**.
  Aproximadamente 30 % do capítulo é palco parado; 70 % é rolagem normal.
- Todos os vídeos são `muted` e `loop`; nenhum tem `autoplay` no atributo — eles
  são iniciados por JS quando entram em vista, e pausados quando saem.

## 10. Entrada e saída de vídeos

O padrão: o vídeo entra **já dentro do palco pinado**, roda em loop curto
enquanto o palco está preso, e sai quando o palco se solta. Não há crossfade
entre seções, não há vídeo escrubado pelo scroll no corpo da página, não há
vídeo de fundo atrás de texto.

Cada vídeo é **um gesto só**: uma mão que pinça, uma janela que se expande, um
ambiente que se abre. Nunca uma sequência narrativa longa.

---

# 11. Princípios que se traduzem para um SaaS financeiro

Cada um passa pelo teste da regra final do projeto.

### 11.1 Um compasso constante por capítulo
**Traduz.** Se cada funcionalidade do Capital Cycle recebe a mesma altura de
rolagem, a página passa a ter métrica — e métrica é literalmente o vocabulário
de um produto que mede dinheiro. *Comunica: precisão, sistema, ciclo.*

### 11.2 Uma capacidade por vez, sozinha na tela
**Traduz, e é o antídoto exato para o problema atual.** Hoje a landing tem sete
estações com a mesma tipografia e nenhuma tem um momento próprio.
*Comunica: cada etapa do ciclo do dinheiro tem o seu momento.*

### 11.3 O produto em escala quase full-bleed
**Traduz, e é a mudança mais importante.** O produto do Capital Cycle é uma
tela. Uma tela em 0,97 vh é o único jeito honesto de mostrá-la.
*Comunica: dados financeiros, a interface real, o que a pessoa compra.*

### 11.4 Hierarquia tipográfica de ~3,8×
**Traduz.** A página precisa de picos. Um número financeiro grande — o
consolidado, a sobra do mês — é o clímax natural de um produto de capital.
*Comunica: capital, o valor como protagonista.*

### 11.5 Eyebrow de uma palavra + headline de 3–7 palavras
**Traduz, e o projeto já tem o vocabulário pronto:** ENTRAR, ORGANIZAR,
ANALISAR, DECIDIR, ESCOLHER já existem em `estacoes.js`.
*Comunica: as etapas do ciclo.*

### 11.6 Gavetas de detalhe sob demanda
**Traduz muito bem.** O Capital Cycle tem muito detalhe verdadeiro (categorias,
travas de plano, aportes que não mexem em saldo, cálculo de renda comprometida)
que hoje não cabe em lugar nenhum. Gaveta é onde ele cabe.
*Comunica: planejamento, profundidade, inteligência financeira.*

### 11.7 Pin curto e proporcional dentro do capítulo, com scroll normal
**Traduz.** E é compatível com a arquitetura atual, que deliberadamente removeu
o pin de seção inteira e o crossfade.
*Comunica: continuidade, trajetória — sem enganar o visitante.*

### 11.8 Vídeo curto, mudo, em loop, de um gesto só
**Traduz.** Um gesto do produto = uma ação real na interface (lançar uma
transação, um aporte subindo a barra de uma meta).
*Comunica: o produto funcionando, não a ideia dele.*

### 11.9 Espaço negativo como contraste, não como estilo
**Traduz — com correção.** A página atual já tem vazio de sobra e não tem
nenhum objeto grande. O princípio só funciona com os dois lados.

### 11.10 Ordem: emocional → técnico
**Traduz.** Consolidado e sobra do mês primeiro; travas de plano, categorias e
`runTransaction` por último.

---

# 12. Princípios que NÃO fazem sentido para o Capital Cycle

### 12.1 A extensão de 35 viewports
**Descartar.** A Apple vende um objeto de US$ 3.499 com sete territórios de uso
e um orçamento de produção cinematográfico. O Capital Cycle vende um app de
R$ 64,90/ano com 8 telas, feito por uma pessoa. Uma página de 35 viewports com
material insuficiente vira uma página vazia e longa — que é pior do que a atual.
**Alvo proposto: 12 a 14 viewports.**

### 12.2 O capítulo "Design / Take a closer look"
**Descartar.** Não há objeto físico. Um close-up de "materiais" de um software
seria decoração pura, e cai direto na regra da remoção.

### 12.3 Persona, EyeSight, imersão — a linguagem do espanto
**Descartar por inteiro.** O registro emocional da Apple é o assombro. O
registro correto para dinheiro de outra pessoa é **confiança e controle**. Uma
landing financeira que tenta provocar assombro produz desconfiança.

### 12.4 28 vídeos e 73 imagens
**Descartar como quantidade, não como técnica.** 28 vídeos é orçamento de
estúdio. A política do Capital Cycle é **um** vídeo cinematográfico, na hero, e
capturas reais em todo o resto (`08-media-plan.md` §1). O que não se traduz é a
escala de produção — não o uso de vídeo em si.

### 12.5 Fundo branco puro com produto escuro isolado
**Descartar como cópia direta.** A Apple usa branco porque o produto é claro e
físico. O painel do Capital Cycle é escuro (`#070b14`). Manter o mesmo branco e
colar um retângulo escuro em cima já é o erro que a página comete hoje. Ver
`03-design-principles.md` §5.

### 12.6 "Values" institucional
**Descartar na forma da Apple.** O equivalente honesto aqui não é valores de
marca — é **segurança e privacidade de dados financeiros**, que é objeção real
de compra, e não posicionamento. Ver `04-information-architecture.md`.

### 12.7 A ausência de prova social e de preço no corpo
**Descartar.** A Apple pode não ter depoimentos nem tabela de preços na página.
Um produto brasileiro desconhecido, que pede dados financeiros e cobra
antecipado, **não pode**. Ausência de prova, aqui, lê como ausência de produto.

### 12.8 A ausência de footer
**Descartar.** A Apple tem um footer institucional imenso. A landing atual do
Capital Cycle não tem nenhum, e para um SaaS pago isso é uma falha de
credibilidade antes de ser uma falha de design.
