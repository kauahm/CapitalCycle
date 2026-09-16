# 07 — Auditoria do Capital Cycle atual

Branch: `feat/hero-designer` · base `ad37205` · data: 2026-09-16
**Revisado em 2026-09-16** após a leitura do bundle do Designer.

Tudo aqui é **[CÓDIGO]** salvo marcação em contrário. Nenhuma auditoria
anterior (`docs/01-auditoria-landing.md`) foi reutilizada como verdade.

> ⚠️ **Revisão importante.** A recomendação original de §2.4 e §4 deste
> documento — extrair uma `DashboardView` pura compartilhada entre app e
> landing — **foi revogada** depois de comparar a Dashboard real com
> `CapitalCycleDashboard.dc.html`. Ver §2.5 abaixo e
> `04-gap-analysis.md` §4.3.

---

## 1. Mapa da Home atual

Arquivo único e monolítico: `src/pages/HomePage.jsx` — **890 linhas**, das
quais ~400 são uma string `PAGE_CSS` injetada via `<style>` inline no render.

```
HomePage (fragmento, sem wrapper)
├── <style>{PAGE_CSS}</style>          ← CSS global com prefixo .cch
├── [condicional] overlay de reveal    ← framer-motion, entrada vinda do Login
├── .cch-story                          ← height: 180vh  (o "runway")
│   └── .cch-pin                        ← sticky; top:0; height:100vh; overflow:hidden
│       ├── .cch-nav-wrap (z-30)        ← MainNav: logo-slot vazio + 4 links + "Entrar"
│       └── .cch-layers-viewport
│           ├── .cch-hero-layer  (z-1)  ← 2 <video> + scrim + h1 + lead + 2 CTA + 2 stats + hint
│           └── .cch-recursos-layer (z-2) ← bg #f4f5f7 + AmbientGlow + FloatingFigures + eyebrow/h2/lead/CTA
├── .cch-feats                          ← 4 cards ("Recursos em destaque"), grid 2×2, IntersectionObserver
├── <CapitalAdvisorSection />           ← seção própria, sticky h-screen, framer-motion useScroll
└── <PlanosSection />                   ← cards de preço, framer-motion reveal
```

### 1.1 Como a transição atual funciona

`useScrollStory` (linhas ~505-575): lê `getBoundingClientRect().top` do
`.cch-story`, divide pelo runway (`offsetHeight - innerHeight` = **80vh**) e
interpola com rAF (lerp de 0.22) para um `progress` 0→1 guardado em
`useState`. Esse progress vira três sub-faixas:

| faixa | fórmula | efeito |
|---|---|---|
| `heroContentP` | `progress / 0.45` | Hero: `opacity 1→0`, `translateY 0→-46px` |
| `bgCrossP` | `(progress - 0.15) / 0.45` | fundo dos Recursos: `opacity 0→1` |
| `recContentP` | `(progress - 0.5) / 0.5` | Recursos: `opacity 0→1`, `translateY 36px→0` |

**Isto é um crossfade de duas camadas.** Não há objeto persistente, não há
Dashboard, não há escala, não há perspectiva. É exatamente o padrão que §18
do briefing proíbe para a transição Dashboard → Recursos.

Observação de arquitetura: o `progress` vive em `useState` no componente raiz
da página, então **cada frame de scroll re-renderiza a HomePage inteira**. O
comentário no código admite que antes era pior (laço infinito); hoje o laço
encerra ao alcançar o alvo, mas o custo por frame continua sendo um render do
React, não uma escrita direta no estilo.

### 1.2 Fallback atual

`usePinnedStoryEnabled()` desliga a história inteira quando
`(min-width: 981px) and (prefers-reduced-motion: no-preference)` não bate.
A classe `.cch-story--static` então converte o sticky em fluxo normal e as
duas camadas viram blocos empilhados de `min-height:100vh`. **Fallback já
correto em princípio** (estados finais estáticos, sem scrub) — serve de
referência para §21 do briefing.

### 1.3 Destino de cada parte

| Parte | Onde vive | Destino proposto | Nota |
|---|---|---|---|
| `MainNav` + `NAV_LINKS` | HomePage:466-497 | **REAPROVEITAR** (estrutura) / **SUBSTITUIR** (visual) | copy dos links é **[PENDENTE]** do Designer |
| `.cch-logo-slot` | HomePage:471 | **SUBSTITUIR** | hoje é um `<div>` vazio de 3×2.5rem — a logo nunca foi colocada |
| Hero (vídeo do cartão + h1 + stats) | HomePage:745-810 | **SUBSTITUIR** | o Designer define outra composição |
| `useScrollStory` (crossfade) | HomePage:505-575 | **REMOVER** | incompatível com objeto persistente |
| Camada Recursos (eyebrow/h2/lead/CTA) | HomePage:813-850 | **SUBSTITUIR** | vira o showcase horizontal |
| `.cch-feats` (4 cards) | HomePage:858-876 | **[PENDENTE]** | podem virar os painéis do `RecursosTrack` ou morrer |
| `CapitalAdvisorSection` | componente próprio | **PRESERVAR** | fora da narrativa Hero→Recursos |
| `PlanosSection` | componente próprio | **PRESERVAR** | idem |
| `AmbientGlow` / `FloatingFigures` | `src/components/home/` | **PRESERVAR** | usados também pelas seções preservadas |
| `useSmoothScrollTo` | HomePage:583-610 | **REESCREVER** | calcula o destino em função do runway; o runway vai mudar |
| `DashboardMockup.jsx` | `src/components/home/` | **REMOVER** | ver §3.3 |

---

## 2. Dashboard real — viabilidade de reuso visual na Hero

Comparação com `CapitalCycleDashboard.dc.html`: **impossível nesta fase** —
o arquivo não foi lido (ver `00-designer-source.md`). O que segue é a
caracterização do lado do código, que é a metade da resposta que existe hoje.

### 2.1 Acoplamentos de `DashboardFinanceiro.jsx` (569 linhas)

| Acoplamento | Onde | Gravidade para a Hero |
|---|---|---|
| `useAuth()` → `currentUser`, `userProfile` | linha 16 | **Bloqueante** — sem login, `currentUser` é `null` |
| `if (!currentUser) return;` | linha 25 | **Bloqueante** — deslogado o efeito nem roda; os arrays ficam vazios |
| 4 × `onSnapshot` (`accounts`, `transactions`, `ciclos`, `orcamentosPorCategoria`) | linhas 28-59 | **Bloqueante** — conexões Firestore ao vivo |
| `useAportesPorMeta` → mais `onSnapshot` | linha 69 + `useAportesPorMeta.js:2` | **Bloqueante** |
| `loading` só vira `false` dentro do snapshot de `ciclos` | linha 53 | **Bloqueante** — deslogado, o componente fica **preso no spinner para sempre** |
| Regras do Firestore filtram por `uid` | `firestore.rules` | visitante anônimo não leria nada nem se tentasse |

**Conclusão: `DashboardFinanceiro` não é reutilizável como está.** Montado
numa landing pública ele renderiza um `LoadingSpinner` eterno.

### 2.2 O que é puro e aproveitável

Cálculo e apresentação estão **misturados no mesmo componente**: ~130 linhas
de derivação (saldos, gastos por categoria, evolução de 6 meses, variação
mensal, progresso de metas) seguidas de ~390 linhas de JSX. O JSX em si
(linhas 176-569) é puro: só lê variáveis locais já calculadas.

Blocos visuais, na ordem em que aparecem:

1. Cabeçalho — saldo disponível como dado hero + investido + contas ativas
2. Fluxo líquido, últimos 6 meses (barras em `div`, sem lib de gráfico)
3. Metas / ciclos
4. Renda mensal: economia e % comprometida
5. Meta em destaque: ritmo e previsão
6. Orçamento por categoria
7. Comparação com o mês anterior
8. Maiores despesas do mês

Átomos já puros e sem Firebase: `CurrencyValue.jsx`, `LoadingSpinner.jsx`,
`Avatar.jsx`. Bom sinal para a extração de uma `DashboardView`.

### 2.3 Chrome: `DashboardLayout` / `Sidebar` / `Topbar`

| Componente | Problema para a Hero |
|---|---|
| `DashboardLayout` | `h-screen` + `overflow-clip`; o `<main>` tem `overflow-y-auto` → **container de scroll interno**. Dentro do palco da Hero isso sequestra a roda do mouse. |
| `Sidebar` | `position: fixed; top-0; left-0; w-64; z-50` + `useAuth()` (logout) + `useNavigate` + `useLocation` |
| `Topbar` | `position: fixed; top-0; z-10; md:ml-64; md:w-[calc(100%-16rem)]` + `useAuth()` (nome, perfil, foto) + `useLocation` (título da página) |

Ambos dependem de **Router** e de **Auth**. `Topbar` renderiza
`userProfile?.nome || 'Usuário'` — deslogado, a preview mostraria
"Usuário / Investidor" com avatar de inicial.

`MobileNav.jsx` está **morto e desatualizado**: aponta para
`/admin/dashboard` e `/diretora/dashboard`, rotas que não existem em
`App.jsx`. Não é importado por ninguém.

### 2.4 Veredicto

| Pergunta | Resposta |
|---|---|
| Dá para montar `DashboardFinanceiro` na Hero? | **Não.** |
| Dá para montar `DashboardLayout` na Hero? | **Não** — scroll interno + `fixed` + Auth. |
| O JSX de apresentação é extraível? | Tecnicamente sim — mas **não vale a pena**, ver §2.5. |
| Quão equivalente é ao Designer? | **Parcialmente** — mesma família, composição diferente. Ver `04-gap-analysis.md` §4. |

---

## 2.5 Revisão: por que `DashboardView` compartilhada foi descartada

Com `CapitalCycleDashboard.dc.html` em mãos, a comparação (detalhada em
`04-gap-analysis.md` §4) mostra que o Designer **não** desenhou a Dashboard
real com outro tema. Desenhou uma peça editorial diferente:

| | Designer | App real |
|---|---|---|
| Blocos no corpo | **4** | **8** |
| KPIs | grid de 3 cards iguais | saldo hero em `6xl` + 2 números menores |
| Itens da sidebar | 8 (com "Mercado") | 7 (removido em `5750b7f`) |
| Layout | alturas fixas (19/132/268/153px) | fluido, `space-y-10` |
| Largura | 1180px absolutos | fluido |

Um componente único servindo os dois exigiria props de variante que trocam
**layout**, não só estilo — ou seja, dois componentes disfarçados de um. Pior:
qualquer bloco novo no painel (fase 2 do gerente) quebraria a fidelidade da
landing sem ninguém perceber, que é exatamente o tipo de divergência silenciosa
que o `CLAUDE.md` existe para evitar.

**Arquitetura adotada no lugar:** `DashboardPreview` novo, em
`src/components/landing/product/`, fiel ao `.dc.html`, com dados fictícios e
zero imports de Firebase/Auth/Router.

**Efeito colateral bem-vindo:** `src/pages/admin/DashboardFinanceiro.jsx`
**não precisa ser tocado**. O conflito com §8 do briefing desaparece, e a
decisão D1 deixa de existir.

---

## 3. Bundle e performance

### 3.1 Estado medido (`dist/`, build de 2026-09-15 23:51)

| Arquivo | Tamanho |
|---|---|
| `index-O_vXrs8S.js` | **400 KB** |
| `firebase-Cs7Dl__z.js` | **466 KB** |
| `index-BpzrPva4.css` | 50 KB |
| `hero-cartao.mp4` | 2,50 MB |
| `hero-cartao-loop.mp4` | 587 KB |
| `hero-cartao-poster.png` | **2,74 MB** |

Rotas internas já saem em chunks próprios via `lazy()` (`DashboardFinanceiro`
18 KB, `Perfil` 22 KB, `CiclosInvestimento` 17 KB, etc.) — esse trabalho
anterior está preservado e funcionando.

### 3.2 Achado crítico: Firebase está no caminho crítico da landing

`dist/index.html` gerado contém:

```html
<link rel="modulepreload" crossorigin href="/assets/firebase-Cs7Dl__z.js">
```

Cadeia: `main.jsx` → `App.jsx` → `AuthProvider` (import **estático**,
`App.jsx:3`) → `hooks/useAuth.jsx` → `services/firebase.js`.

O `manualChunks` do `vite.config.js` **separa** o Firebase num chunk, mas não
o **adia**: como `AuthProvider` envolve o `<Routes>` inteiro, quem abre `/`
baixa e executa 466 KB de Firebase, inicializa o app e abre um
`onAuthStateChanged`.

Ou seja, o requisito de §11 do briefing ("a landing pública deve ter ZERO
Firebase") **já está violado hoje**, antes de qualquer Dashboard entrar na
Hero. Não é um risco futuro de import acidental — é o estado atual.

### 3.3 Código morto encontrado

- **`src/components/home/DashboardMockup.jsx` (95 linhas)** — não é importado
  por nenhum arquivo (`grep -rn "DashboardMockup" src/` retorna apenas a
  própria definição). Pior: as classes que ele usa (`.cc-mockup`,
  `.cc-mock-kpi`, `.cc-mock-chart`, …) **não existem em nenhum CSS do
  projeto**; ele renderizaria sem estilo nenhum. É resíduo de uma tentativa
  anterior de mockup de Dashboard na Home.
- **`src/components/layout/MobileNav.jsx` (38 linhas)** — não importado, e
  aponta para rotas inexistentes.
- `src/pages/admin/Usuarios.jsx` (540 linhas) — não está em nenhuma rota de
  `App.jsx`. **[INFERÊNCIA]** possivelmente intencional (tela de admin ainda
  não ligada). Não mexer sem confirmar.

### 3.4 Assets pesados

`hero-cartao-poster.png` com **2,74 MB** é o maior asset do projeto: um
poster de vídeo em PNG. Em WebP/AVIF, na resolução real de exibição, cairia
para a casa das dezenas de KB. Hoje ele é baixado junto com o `.mp4` de
2,5 MB — cerca de **5,2 MB só para a primeira dobra**.

Custo previsto de GSAP (**[INFERÊNCIA]**, a confirmar na instalação): core
~70 KB min / ~28 KB gzip; ScrollTrigger ~40 KB min / ~14 KB gzip. Relevante,
mas uma ordem de grandeza abaixo do Firebase e do poster.

`framer-motion` já está no bundle inicial (usado por `HomePage`,
`CapitalAdvisorSection`, `PlanosSection`). Se GSAP entrar, as duas libs
coexistem — **[PENDENTE]** decidir se `CapitalAdvisorSection` e
`PlanosSection` migram para GSAP ou se aceitamos as duas.

---

## 4. Decisões que dependem de você

1. ~~**Extrair uma `DashboardView` pura**~~ — **resolvida sem você**. A
   comparação com o Designer (§2.5) descartou o compartilhamento.
   `DashboardFinanceiro.jsx` fica intocado.
2. **Tirar `AuthProvider` do caminho crítico** da landing mexe em `App.jsx` e
   no comportamento de auth do sistema inteiro. É a única forma de atingir o
   "ZERO Firebase" de §11. Autorizar?
3. **`DashboardMockup.jsx` e `MobileNav.jsx`**: apago, ou prefere manter?
4. **Divergências Designer × app na sidebar** (`02-copy-oficial.md` C5-C7):
   o Designer tem "Mercado" (removido do app), diz "Contas e Caixas" onde o
   app diz "Contas", e não tem botão "Sair". Como isso só afeta a **preview
   da landing**, minha recomendação é reproduzir o Designer **menos**
   "Mercado" — ressuscitar visualmente uma área removida do produto seria
   propaganda enganosa. Confirma?
