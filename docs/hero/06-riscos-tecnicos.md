# 06 — Riscos técnicos

Branch: `feat/hero-designer` · base `ad37205` · data: 2026-09-16

Cada risco aponta a **árvore concreta** que o cria. Nada de afirmação
genérica do tipo "overflow:hidden quebra sticky".

---

## R1 — `overflow: hidden` em `.cch` e `.cch-pin` recorta qualquer palco

**Gravidade: alta.** **[CÓDIGO]**

Árvore concreta (`src/pages/HomePage.jsx`, `PAGE_CSS`):

```
.cch-story              height: 180vh
└── .cch-pin            position: sticky; top: 0; height: 100vh; overflow: hidden   ← recorte 1
    └── .cch-layers-viewport   position: absolute; inset: 0
        └── .cch-layer.cch     position: absolute; inset: 0;
                               overflow: hidden;      ← recorte 2
                               isolation: isolate;    ← ver R2
```

Dois recortes empilhados. Um `ProductStage` que precise transbordar a
camada — Dashboard vindo de fora da tela, escala > 1, sombra projetada,
perspectiva que joga um canto para fora — será cortado em ambos.

`.cch-pin { overflow: hidden }` não quebra o próprio sticky (o sticky está
*nele*, não acima dele), mas **impede que qualquer filho ultrapasse a
viewport**, que é justamente o movimento de "Dashboard sai para cima" de §18.

**Mitigação:** o palco precisa da sua própria camada, fora de `.cch`, com
`overflow: visible` e recorte explícito por `clip-path` só onde o Designer
pedir.

---

## R2 — `isolation: isolate` em `.cch` sela o contexto de empilhamento

**Gravidade: média.** **[CÓDIGO]** — `PAGE_CSS`, regra `.cch`, linha 34.

`isolation: isolate` cria um stacking context novo em **cada** `.cch-layer`.
Consequência: os `z-index` internos de uma camada são inertes em relação à
outra; só os `z-index` das próprias camadas (`.cch-hero-layer{z:1}`,
`.cch-recursos-layer{z:2}`) valem na comparação.

Isso é intencional e funciona para o crossfade atual. Mas **um objeto
persistente que precise atravessar as duas camadas não pode viver dentro de
nenhuma delas** — ele passaria a ser sempre "abaixo" ou sempre "acima" de
tudo na outra. O `ProductStage` tem de ser irmão das camadas, não filho.

---

## R3 — `position: fixed` de `Sidebar` e `Topbar` sob ancestral transformado

**Gravidade: alta.** **[CÓDIGO]** — exatamente o cenário de §12 do briefing.

- `Sidebar.jsx:52` → `fixed top-0 left-0 h-full w-64 z-50`
- `Topbar.jsx:25` → `fixed top-0 z-10 md:ml-64 w-full md:w-[calc(100%-16rem)]`

Se o `ProductStage` receber `transform` (e receberá — escala e translação
são o coração da narrativa), ele vira **containing block** para descendentes
`fixed`. Sidebar e Topbar passariam a se posicionar em relação ao palco, e
não à viewport.

Isso *acidentalmente* daria o resultado visual certo. **É por isso que é um
risco e não uma solução:** o efeito depende de um transform existir. No
keyframe em que a timeline estiver em `scale: 1, translate: 0`, o navegador
ainda mantém o containing block (qualquer valor de `transform` diferente de
`none` basta) — mas basta a timeline zerar a propriedade, ou o GSAP limpar o
transform num `clearProps`/refresh do ScrollTrigger, para os dois saltarem
para os cantos da viewport real.

Some-se a isso que `Topbar` usa `w-[calc(100%-16rem)]`, onde `100%` passa a
ser a largura do palco, não da tela — a conta de 16rem deixa de fazer
sentido em escala reduzida.

**Mitigação:** `DashboardPreviewShell` com chrome em `position: absolute`
relativo ao palco. A aplicação real segue com `fixed`, intacta.

---

## R4 — Container de scroll interno no `DashboardLayout`

**Gravidade: alta.** **[CÓDIGO]** — `DashboardLayout.jsx:10,16`.

```
div.flex.h-screen.overflow-clip
└── div.flex-1.flex.flex-col
    ├── Topbar (fixed)
    └── main.flex-1.overflow-y-auto    ← scroll container próprio
```

Dentro da Hero, com o palco ocupando a viewport, a roda do mouse sobre a
Dashboard rolaria o `<main>` em vez de avançar a narrativa. O ScrollTrigger
não recebe o evento e a timeline trava enquanto o ponteiro estiver por cima.

**Mitigação:** a preview usa `overflow: hidden` + `pointer-events: none` no
conteúdo, ou uma shell sem o `overflow-y-auto`.

---

## R5 — Runway de 80vh é curto demais para 5+ keyframes

**Gravidade: média.** **[CÓDIGO]** + **[INFERÊNCIA]**.

`.cch-story { height: 180vh }` com `.cch-pin { height: 100vh }` deixa **80vh
de runway** para a narrativa inteira. Hoje isso cobre dois estados
(Hero → Recursos). A narrativa pedida tem no mínimo cinco
(Hero → aproximação → Dashboard → fullscreen → saída → Recursos).

Espremer cinco transições em 80vh dá ~16vh por transição: cada keyframe
passaria voando. **[PENDENTE]** — a distância de scroll por cena só pode ser
dimensionada depois de ler o storyboard.

---

## R6 — `progress` em `useState` re-renderiza a página a cada frame

**Gravidade: média.** **[CÓDIGO]** — `HomePage.jsx`, `useScrollStory`.

`setProgress(current)` dentro do `rAF` dispara um render do componente
`HomePage` inteiro — que inclui `<style>{PAGE_CSS}</style>`, as duas camadas,
os 4 cards e os dois `<video>`. Com uma narrativa mais pesada (Dashboard real
com ~8 blocos e dezenas de nós), isso deixa de ser aceitável.

**Mitigação:** a engine de motion deve escrever direto no estilo dos nós via
ref, sem passar pelo estado do React. Tanto GSAP quanto `useMotionValue` do
Framer fazem isso; o rAF manual atual não faz.

---

## R7 — `100vh` sem `100dvh` em mobile

**Gravidade: média.** **[CÓDIGO]**.

Ocorrências de `100vh` / `h-screen`:

- `PAGE_CSS`: `.cch { min-height: 100vh }`, `.cch-pin { height: 100vh }`,
  `.cch-inner`/`.cch-rec-inner` com `min-height: calc(100vh - 6.5rem)`,
  `.cch-story--static .cch-layer { min-height: 100vh }`
- `CapitalAdvisorSection.jsx:68`: `h-screen`
- `DashboardLayout.jsx:10`: `h-screen`
- `AnaliseIA.jsx:209`: `h-[calc(100vh-8rem)]`

Em iOS Safari e Chrome Android a barra de endereço recolhe e `100vh`
continua valendo a altura máxima → o palco fica mais alto que a tela e o
sticky "pula" quando a barra some. Hoje o efeito é mascarado porque abaixo de
981px a história pinada é **desligada** — se a nova Hero mantiver motion em
mobile, o problema aparece.

---

## R8 — Firebase no caminho crítico da landing

**Gravidade: alta.** **[CÓDIGO]** — detalhado em `07-auditoria-codigo-atual.md` §3.2.

`App.jsx:3` importa `AuthProvider` estaticamente; `dist/index.html` traz
`<link rel="modulepreload" href="/assets/firebase-Cs7Dl__z.js">`. 466 KB de
Firebase são baixados e inicializados ao abrir `/`.

O requisito "ZERO Firebase na landing" (§11) já está violado **hoje**.
Qualquer `DashboardView` compartilhada precisa viver num módulo sem imports
de Firebase/Auth — mas isso sozinho não resolve o problema, que está no
`AuthProvider`.

---

## R9 — CSS da landing injetado como `<style>` no render

**Gravidade: baixa, mas incômoda.** **[CÓDIGO]** — `HomePage.jsx:20`.

~400 linhas de CSS numa template string dentro do JSX. Sem autocompletar,
sem lint, sem sourcemap, e reinserido no DOM a cada render de `HomePage`
(ver R6). Com a Hero nova o volume de CSS cresce.

**Mitigação:** arquivo `.css` próprio importado pelo módulo da Hero.

---

## R10 — Interferência entre `framer-motion` e a futura engine

**Gravidade: média.** **[CÓDIGO]** + **[PENDENTE]**.

`CapitalAdvisorSection` usa `useScroll` + `useSpring` com
`offset: ['start start','end end']` e a própria seção em `sticky top-0
h-screen`. Se um ScrollTrigger com `pin` for adicionado acima dela no
documento, o `pin` insere espaçadores e altera as alturas — e o `useScroll`
do Framer, que mede pela posição do elemento, passa a computar um progresso
diferente do esperado.

`ScrollTrigger.refresh()` corrige o lado do GSAP; o Framer não é notificado.
**[PENDENTE]** — decidir se as seções preservadas migram de engine.

---

## R11 — Restauração de scroll é forçada para o topo

**Gravidade: baixa.** **[CÓDIGO]** — `HomePage.jsx`, efeito de montagem.

A Home define `history.scrollRestoration = 'manual'` e faz
`window.scrollTo(0,0)` ao montar, com comentário explicando o porquê (voltar
no meio da história pinada deixava a tela num estado intermediário). Uma
narrativa mais longa torna isso mais visível: quem voltar do Login perde a
posição. Comportamento provavelmente desejado — registrado para não ser
"corrigido" por engano depois.

---

## R12 — Transição de rota Home ↔ Login acopla-se ao estado da Home

**Gravidade: baixa.** **[CÓDIGO]**.

`MainNav` passa `state={{ from: 'home' }}` no `<Link to="/login">`, e a
HomePage lê `location.state?.from === 'login'` para fazer o fade de reveal
com um overlay `fixed inset-0 z-[60]`. Esse overlay é `position: fixed` e
irmão da história — se o palco tiver transform, e o overlay acabar dentro
dele numa refatoração, o fade cobriria só o palco. Manter o overlay fora da
árvore do `ProductStage`.
