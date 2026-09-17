# 06 — Riscos técnicos

Branch: `feat/hero-designer` · atualizado 2026-09-16 (bundle do Designer lido)

Cada risco aponta a **árvore concreta** que o cria. Riscos da versão anterior
que o Designer resolveu ou reclassificou estão marcados como tal.

---

## Riscos reclassificados pela leitura do Designer

| # | Risco | Antes | Agora | Motivo |
|---|---|---|---|---|
| R3 | `fixed` de Sidebar/Topbar sob ancestral transformado | alta | **eliminado** | a landing não monta `Sidebar`/`Topbar`. `DashboardPreview` é componente novo, sem `fixed` — ver `04-gap-analysis.md` §4.3 |
| R4 | Scroll interno do `DashboardLayout` | alta | **eliminado** | `DashboardLayout` não é usado na landing |
| R8 | Firebase no caminho crítico | alta | **alta, inalterada** | independe do Designer |
| R10 | Interferência framer-motion × nova engine | média | **alta** | agora há dois pins aninhados (ver R15) |

---

## R1 — `overflow: hidden` em `.cch` e `.cch-pin` recorta o palco

**Gravidade: alta.** **[CÓDIGO]**

```
.cch-story              height: 180vh
└── .cch-pin            position: sticky; top:0; height:100vh; overflow: hidden  ← recorte 1
    └── .cch-layers-viewport
        └── .cch-layer.cch   overflow: hidden;    ← recorte 2
                             isolation: isolate;  ← ver R2
```

O Designer **precisa** que o palco transborde: em Hero F1 a Dashboard começa
em `top:522` com 740×0,86 = 636px de altura, terminando em 1158px — 258px
abaixo do fold de 900. A legenda confirma: *"cortada pelo fold"*.

Esse corte deve ser o da **viewport**, não o de um `.cch` interno com
`overflow:hidden` que recortaria também a `box-shadow` de
`0 50px 130px rgba(0,0,0,0.62)`.

**Mitigação:** o palco vive numa camada própria, fora de `.cch`, com
`overflow: visible`; o único recorte é o do contêiner pinado de 100vh.

---

## R2 — `isolation: isolate` sela o contexto de empilhamento

**Gravidade: média.** **[CÓDIGO]** — `PAGE_CSS`, regra `.cch`.

O Designer não usa `z-index` em lugar nenhum: **a ordem de pintura é a ordem
do DOM**. Isso só funciona se todos os elementos da cena forem irmãos no
mesmo contexto de empilhamento.

Com `isolation: isolate` em cada `.cch-layer`, a Dashboard dentro de uma
camada nunca poderia pintar acima de algo da outra.

**Mitigação:** a nova Hero não replica `isolation: isolate` por camada. Glow,
navbar, copy, palco e Recursos são irmãos, na ordem do Designer.

---

## R5 — Runway de 80vh é curto demais

**Gravidade: alta.** **[CÓDIGO]** + **[DESIGNER]**

`.cch-story{height:180vh}` menos `.cch-pin{height:100vh}` = **80vh de runway**
para tudo.

A narrativa oficial tem **três blocos encadeados**:

| Bloco | Keyframes | Natureza |
|---|---|---|
| A — Hero → Dashboard | 5 | scrub vertical com escala e perspectiva |
| B — Dashboard → Recursos | 5 | translação rígida de 903px |
| C — Showcase horizontal | 4 | pin com deslocamento X de 964px |

Treze estados distintos em 80vh dariam ~6vh por transição.

**Mitigação:** dimensionar cada bloco separadamente. **[PENDENTE]** — os
valores concretos (K3 em `01-keyframes-designer.md` §5.2) só se fecham
testando no GATE 4.

---

## R6 — `progress` em `useState` re-renderiza a página a cada frame

**Gravidade: alta** (subiu de média). **[CÓDIGO]**

`useScrollStory` faz `setProgress()` dentro do `rAF`, re-renderizando
`HomePage` inteira — hoje com 2 vídeos, 4 cards e a string `PAGE_CSS`.

Com o Designer a cena fica **muito** mais pesada: `DashboardPreview` tem
sidebar de 8 itens com SVG, topbar, 3 KPIs, 6 barras, 2 cards de estado
vazio; `RecursosTrack` tem 4 painéis com demos completas. São centenas de nós
que não podem passar pelo reconciliador a 60fps.

**Mitigação:** a engine escreve direto no estilo via ref. `progress` nunca
volta para o estado do React.

---

## R7 — `100vh` sem `100dvh` em mobile

**Gravidade: média.** **[CÓDIGO]**

Ocorrências: `PAGE_CSS` (`.cch`, `.cch-pin`, `.cch-inner`, `.cch-rec-inner`,
`.cch-story--static .cch-layer`), `CapitalAdvisorSection.jsx:68`,
`DashboardLayout.jsx:10`, `AnaliseIA.jsx:209`.

Hoje o problema é mascarado porque abaixo de 981px a história pinada é
desligada. Se a Hero nova tiver motion em mobile, a barra de endereço do iOS
Safari faz o palco "pular".

**Mitigação:** `100dvh` para alturas de viewport na landing. Não mexer no app.

---

## R8 — Firebase no caminho crítico da landing

**Gravidade: alta.** **[CÓDIGO]**

`App.jsx:3` importa `AuthProvider` estaticamente → `useAuth` →
`services/firebase.js`. O `dist/index.html` traz
`<link rel="modulepreload" href="/assets/firebase-Cs7Dl__z.js">` — 466 KB.

**O Designer não muda nada aqui.** A boa notícia: como `DashboardPreview` será
um componente novo sem imports de Firebase/Auth (`04-gap-analysis.md` §4.3),
não há risco de o palco **piorar** a situação. Mas o "ZERO Firebase" de §11 do
briefing continua violado pelo `AuthProvider`.

**[PENDENTE]** — decisão B no relatório.

---

## R9 — CSS da landing injetado como `<style>` no render

**Gravidade: média** (subiu de baixa). **[CÓDIGO]**

`HomePage.jsx:20` — ~400 linhas de CSS numa template string, reinserida a cada
render (ver R6). A Hero do Designer traz muito mais CSS: dois temas de navbar,
a Dashboard inteira, 4 painéis com demos.

**Mitigação:** arquivos `.css` próprios por componente da landing.

---

## R11 — Restauração de scroll forçada para o topo

**Gravidade: baixa.** **[CÓDIGO]** — `HomePage.jsx`, efeito de montagem.

`history.scrollRestoration = 'manual'` + `window.scrollTo(0,0)`. Com uma
narrativa de três blocos pinados, voltar do Login sempre reinicia do começo.
Comportamento provavelmente desejado; registrado para não ser "corrigido" por
engano.

---

## R12 — Overlay de transição de rota dentro do palco

**Gravidade: baixa.** **[CÓDIGO]**

O overlay de reveal (`fixed inset-0 z-[60]`) precisa continuar **fora** da
árvore do `ProductStage`. Se cair dentro de um ancestral transformado, cobriria
só o palco.

---

## R13 — 🆕 Texto rasterizado em escala variável

**Gravidade: alta.** **[DESIGNER]** + **[INFERÊNCIA]**

A Dashboard atravessa `scale: 0,86 → 0,94 → 1,05 → 1,14 → 1,2203`, com
`rotateX` de 6° a 0° e `perspective: 2400px`. Dentro dela há texto de **10,5px
a 30px**.

Dois problemas concretos:

1. **Nitidez.** Um elemento com `transform` 3D é promovido a camada de
   composição e rasterizado **uma vez**, na escala do momento da promoção.
   Enquanto a escala anima, o navegador reescala o bitmap: texto de 10,5px
   (os labels `SALDO DISPONÍVEL`) fica visivelmente borrado em escalas
   intermediárias.
2. **Custo.** Se o navegador optar por re-rasterizar a cada frame para
   manter nitidez, uma camada de 1180×740 com centenas de nós é cara.

**Mitigações a avaliar no GATE 4** (nenhuma é gratuita):

- `will-change: transform` + `backface-visibility: hidden` para estabilizar a
  promoção
- rasterizar na escala **máxima** (1,2203) e só reduzir — evita upscale de
  bitmap, que é o caso feio
- aceitar o leve borrão nos estados intermediários, já que F1/F5 (os estados
  de repouso) são nítidos

**[DECISÃO PENDENTE]** — pode ser necessário testar em máquina real antes de
fechar a abordagem.

---

## R14 — 🆕 A largura de 1180px é fixa; a viewport não é

**Gravidade: alta.** **[DESIGNER]**

`CapitalCycleDashboard` declara `width:1180px; height:740px` — **medidas
absolutas**, com sidebar de 214px fixa, grid de KPIs de 132px de altura,
gráfico de 268px. Não há uma única unidade relativa no componente.

A escala final de **1,2203** não é um número mágico: é `1440 ÷ 1180`. Ela só
faz a Dashboard ocupar a viewport **num monitor de exatamente 1440px**.

Em 1366px a mesma escala transbordaria 74px; em 1920px sobrariam 480px.

**Duas estratégias, e a escolha muda a implementação inteira:**

| | (a) Escala responsiva | (b) Largura fluida |
|---|---|---|
| Como | manter 1180px fixos e calcular `scaleFinal = viewportW / 1180` | reescrever a Dashboard com unidades relativas |
| Fidelidade | **total** — proporções idênticas ao Designer em qualquer tela | parcial — o layout reflui |
| Texto | escala junto; em telas pequenas fica ilegível | permanece no tamanho nominal |
| Keyframes | `scale` intermediários viram fração de `scaleFinal` | precisam ser reinterpretados |
| Risco | R13 piora em telas grandes (upscale) | quebra a fidelidade pixel-perfect |

**Recomendação: (a)**, com um piso — abaixo de ~1024px a narrativa vira o
fallback estático (ver R16). A fidelidade é o requisito explícito de §1 do
briefing, e (b) a sacrificaria.

**[DECISÃO PENDENTE]** — precisa do seu aval, porque define o comportamento
em todas as larguras que não sejam 1440.

---

## R15 — 🆕 Dois pins aninhados na mesma página

**Gravidade: alta.** **[DESIGNER]** + **[INFERÊNCIA]**

A narrativa tem **dois pins independentes**:

```
Bloco A+B: pin do ProductStage      (Hero → Dashboard → saída, ~13 keyframes)
Bloco C:   pin do Showcase          (trilho horizontal, 964px de curso)
```

Mais `CapitalAdvisorSection`, que **já tem** o seu próprio
`sticky top-0 h-screen` + `useScroll` do framer-motion
(`CapitalAdvisorSection.jsx:68`).

Três mecanismos de pin na mesma página, dois deles de bibliotecas diferentes.
Um pin de ScrollTrigger insere espaçadores no documento e muda as alturas —
e o `useScroll` do framer-motion, que mede pela posição do elemento, **não é
notificado**. `ScrollTrigger.refresh()` conserta o lado do GSAP, não o outro.

**Mitigações:**

- ordem de criação importa: os triggers devem ser registrados na ordem do
  documento, ou o `refresh()` recalcula posições erradas
- §16 do briefing já pede timelines separadas — isso está certo e deve ser
  respeitado
- **[PENDENTE]** — decisão D no relatório: migrar `CapitalAdvisorSection` para
  a mesma engine elimina a classe inteira de problema

---

## R16 — 🆕 O Designer não tem nenhum estado responsivo

**Gravidade: alta.** **[DESIGNER]**

Varredura completa do bundle:

```
grep -c "@media|[0-9]vw|[0-9]vh|clamp(" referencia/designer/*.dc.html
# Hero Scroll Storyboard: 1  ← "58vh" dentro do TEXTO de uma legenda
# todos os demais: 0
```

**Zero media queries. Zero unidades relativas. Zero frames de mobile ou
tablet.** Os 14 frames são 1440×900.

O §20 do briefing prevê exatamente isto: *"Se NÃO possui: não invente layout
detalhado ainda."*

**Consequência:** tudo em 1024, 768, 430, 390, 375 e 320 será **[INFERÊNCIA]**
minha, sujeita à sua revisão. Concretamente, ficam sem fonte oficial:

- como a Dashboard de 1180px se comporta abaixo de 1024
- se o trilho horizontal vira scroll nativo, carrossel ou empilhamento
- se o H1 de 86px e o H2 de 88px têm tamanhos mobile
- se a navbar vira menu hambúrguer (o app atual esconde os links abaixo de 980px)

**Recomendação:** abaixo de ~1024px, cair no fallback estático — os estados
finais de cada bloco, empilhados, sem scrub. É o mesmo princípio de §21
(reduced motion) e o app já tem precedente funcionando
(`.cch-story--static`).

---

## R17 — 🆕 Cinco famílias de fonte e layout absoluto

**Gravidade: média.** **[DESIGNER]** + **[CÓDIGO]**

O Designer posiciona por coordenada absoluta (`top:128px`, `top:322px`,
`top:398px`). O `index.html` atual já carrega Inter + IBM Plex Sans; somam-se
Outfit + Playfair Display + JetBrains Mono.

Enquanto as fontes carregam, o navegador usa a fallback. Como as posições são
absolutas, o texto **não** desloca o layout — mas muda de largura, e o H1 de
Playfair 86px com fallback serifada do sistema terá quebra diferente. Em
`Sua jornada<br>financeira.` a quebra é explícita, o que ajuda.

**Mitigação:** `font-display: swap` já está na URL; declarar fallbacks
métricos próximos e medir o CLS no GATE 7.

---

## R18 — 🆕 A translação rígida de 903px não tolera arredondamento

**Gravidade: média.** **[DESIGNER]**

A prancha B se apoia na identidade `panel.top = dash.top + 903` nos cinco
frames. O valor real é `740 × 1,2203 = **903,022**`.

Se a altura da Dashboard vier de `getBoundingClientRect()` e o offset do
painel for o inteiro 903, sobra **0,022px** de fresta — que num fundo claro
sob um plano escuro aparece como uma linha de 1px em alguns fatores de zoom.

**Mitigação:** não usar dois valores. Colar os dois planos no DOM (o painel
como irmão imediatamente após a Dashboard, sem offset calculado) e transladar
**o contêiner dos dois**. A fresta deixa de ser possível.

Isto reforça a arquitetura de §2.1 de `01-keyframes-designer.md`.

---

## R19 — 🆕 Scroll horizontal dentro de um pin e trackpads

**Gravidade: média.** **[DESIGNER]** + **[INFERÊNCIA]**

O Showcase converte scroll vertical em deslocamento horizontal de 964px
enquanto pinado. Dois efeitos conhecidos:

1. **Swipe horizontal do trackpad/magic mouse** dispara navegação de
   histórico no Safari e no Chrome (gesto de "voltar"). Mitigação:
   `overscroll-behavior-x: none` no contêiner.
2. **Scroll com shift** ou trackpad diagonal pode rolar o contêiner
   horizontalmente de verdade, dessincronizando da timeline. Mitigação: o
   trilho se move por `transform`, **nunca** por `scrollLeft`, e o contêiner
   não é rolável.

---

## R20 — 🆕 Reduced motion precisa de um estado final por bloco

**Gravidade: baixa, mas decide o GATE 7.** **[DESIGNER]**

§21 do briefing quer os estados finais estáticos. O Designer dá exatamente
esses estados, o que torna o fallback trivial de especificar:

| Bloco | Estado estático |
|---|---|
| A | **Hero F1** — a composição de repouso, com a Dashboard já visível em `scale:0,86` |
| B | **D→R F5** — Recursos estabelecida |
| C | **Showcase F1** — introdução editorial, trilho em rolagem nativa horizontal |

Note que A usa o **primeiro** frame, não o último: o estado final de A é a
Dashboard fullscreen, que sem contexto não comunica nada. O frame de repouso
é o que "continua compreensível sem movimento".

**[DECISÃO PENDENTE]** — confirma essa escolha?
