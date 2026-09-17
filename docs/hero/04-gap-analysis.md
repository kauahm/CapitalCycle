# 04 — Gap analysis: Designer × app atual

Fonte Designer: `referencia/designer/` (lido 2026-09-16).
Fonte código: branch `feat/hero-designer`, base `ad37205`.

---

## 0. Resumo executivo

| Região | Veredicto |
|---|---|
| Header / navbar | **REESCREVER** — estrutura próxima, visual e tokens totalmente diferentes |
| Hero | **SUBSTITUIR** — conceito diferente (vídeo de cartão → Dashboard 3D) |
| Dashboard na Hero | **CONSTRUIR** — não existe nada equivalente hoje |
| Dashboard → Recursos | **SUBSTITUIR** — crossfade atual × translação rígida |
| Recursos | **SUBSTITUIR** — grid 2×2 estático × trilho horizontal pinado |
| Design tokens | **SUBSTITUIR** — 3 fontes novas, paleta nova |
| Capital Advisor / Planos | **PRESERVAR** — fora do escopo do Designer |

Nenhuma região é aproveitável como está. A copy, em compensação, é
**majoritariamente idêntica** — os textos do subtítulo do Hero, do subtítulo
de Recursos e dos 4 cards batem caractere por caractere.

---

## 1. Design tokens

### 1.1 Tipografia

| | Designer | App atual |
|---|---|---|
| Display | **Playfair Display 700** (serifada) | Inter 900 (sans) |
| Corpo / UI | **Outfit** 300-700 | Inter 400-900 |
| Mono / labels | **JetBrains Mono** 400/500 | — (não existe) |
| Telas de acesso | — | IBM Plex Sans |

**Diferença conceitual, não de ajuste.** O Designer usa uma serifada de
display sobre uma grotesca geométrica, com mono para dados — uma tríade
editorial. O app usa Inter para tudo, em caixa alta com `font-weight:900`.

**Ação:** adicionar as três famílias ao `index.html` e ao
`tailwind.config.js`. **[PENDENTE]** — manter Inter para as telas internas
(§8 do briefing protege o sistema) ou migrar tudo? Recomendo manter: o
Designer só cobre a landing.

### 1.2 Cores

| Papel | Designer | App atual (`tailwind.config.js` / `PAGE_CSS`) |
|---|---|---|
| Roxo de marca | **`#5b52f0`** | `#6366f1` (tailwind `primary`) e `#5358ee` / `#7c62f2` / `#8b7cf6` (landing) |
| Fundo escuro (página) | **`#07070b`** | `#070b14` (`background`) |
| Fundo escuro (produto) | **`#0b0b11`** | `#070b14` |
| Superfície de card | **`#101017`** | `#101623` (`surface`) |
| Borda | **`#1e1e28`** / `#17171f` | `#1e293b` (`border`) |
| Texto principal | **`#f5f5f7`** | `#f8fafc` (`textMain`) |
| Texto secundário | **`#9a9aa6`** / `#8e8e9a` | `#94a3b8` (`textSecondary`) |
| Verde | **`#22c55e`**, `#15803d`, `#4ade80` | `#10b981` (`success`) |
| Link | **`#4f7dff`** | — |
| Fundo claro (Recursos) | **`linear-gradient(#f6f5f3, #efedea)`** | `#f4f5f7` chapado |
| Tinta escura (Recursos) | **`#14141a`** | `#131316` / `#0f1216` |

**O app atual tem quatro roxos diferentes** (`#6366f1`, `#5358ee`, `#7c62f2`,
`#8b7cf6`). O Designer tem **um só**: `#5b52f0`. As paletas escuras do app
puxam para azul (`slate`), as do Designer são neutras-arroxeadas.

**Ação:** introduzir os tokens do Designer num escopo só da landing, sem
tocar nos tokens do painel.

---

## 2. Header / navbar

| | Designer | App atual (`MainNav`, `HomePage.jsx:466`) |
|---|---|---|
| Altura | 82px | `padding:1.9rem 3.2rem 0`, altura implícita |
| Logo | **texto** `CAPITAL`/`CYCLE`, 15px w700 `ls:0.06em` | `<div class="cch-logo-slot">` **vazio** |
| Links | 4, `gap:38px`, centralizados | 4, `gap:0.3rem`, à direita, dentro de pílula com `backdrop-filter` |
| Rótulos | Início · Recursos · Capital Advisor · Planos | **idênticos** |
| Fundo dos links | nenhum | `rgba(0,0,0,0.13)` + `blur(12px)` |
| Ativo | só cor/peso | `background:#38383b` |
| Entrar (escuro) | contornado, `radius:999px` | sólido `#0b0b0d`, `radius:11px` |
| Entrar (claro) | sólido `#14141a`, `radius:999px` | não existe variante |
| Duas variantes de tema | **sim** | não |

**O `.cch-logo-slot` vazio é resolvido pelo Designer:** a logo é textual, não
precisa de arquivo de imagem.

**Ação:** reescrever `MainNav` com as duas variantes e a logo textual.
Preserva-se a lógica de navegação (`NAV_LINKS`, `onNavigate`).

---

## 3. Hero

| | Designer | App atual |
|---|---|---|
| Conceito | Dashboard 3D inclinada emergindo do fold | vídeo de cartão em loop + scrim |
| Fundo | `#07070b` + glow radial violeta | `#d8d8d8` + `<video>` + gradiente + ruído SVG |
| H1 | `Sua jornada` / `financeira.` Playfair 86px branco | `Sua`/`Jornada`/`Financeira` Inter 900 caixa alta, 3ª linha roxa |
| Alinhamento | **centralizado** | grid 2 colunas (texto à esquerda) |
| Subtítulo | idêntico, 17px `#a5a5b0` centrado, `max-w:610px` | idêntico, 1,1rem `#3c3c40` à esquerda, `max-w:28.6rem` |
| CTAs | "Começar agora" / "Já tenho conta" centrados | **mesmos rótulos**, à esquerda |
| Stats | **não existe** | "Fluxo positivo R$ 18k" / "Ciclos ativos 14+" |
| Scroll hint | **não existe** | ícone de mouse + "Role para baixo" |
| Vídeo | **não existe** | `hero-cartao.mp4` (2,5 MB) + loop (587 KB) + poster PNG (2,74 MB) |
| Produto visível | **sim, é o centro da cena** | não |

**Diferença estrutural:** o app organiza o Hero em duas colunas; o Designer
centraliza tudo e reserva a metade inferior para a Dashboard.

**Consequência de bundle:** se os stats, o scroll hint e o vídeo saem,
**~5,2 MB de mídia saem do caminho crítico**. Ver §7.

### 3.1 Elementos do app sem correspondência no Designer

| Elemento | Ação sugerida |
|---|---|
| `<video>` do cartão (×2) + poster | **REMOVER** |
| Bloco de stats (Fluxo positivo / Ciclos ativos) | **REMOVER** — **[PENDENTE]** |
| Scroll hint (`MouseIcon` + "Role para baixo") | **REMOVER** — **[PENDENTE]** |
| `cch-scrim` + ruído SVG | **REMOVER** |
| `AmbientGlow` no Hero | **SUBSTITUIR** pelo glow do Designer (que é filho da Dashboard) |
| `FloatingFigures` | **PRESERVAR** nas seções de baixo; não entra no Hero |

---

## 4. Dashboard: Designer × React real

Esta é a comparação pedida no §7 do briefing.

### 4.1 Estrutura — o que coincide

| Aspecto | Designer | React real | Veredicto |
|---|---|---|---|
| Shell | sidebar fixa + topbar + conteúdo | **igual** | ✅ |
| Largura da sidebar | **214px** | `w-64` = 256px | ⚠️ ajustável |
| Altura da topbar | **66px** | `h-16` = 64px | ✅ ~igual |
| Título da topbar | "Dashboard" | `getPageTitle()` → "Dashboard" | ✅ |
| Topbar direita | nome + papel + avatar circular | **igual** (`Avatar.jsx`) | ✅ |
| Saudação | "Olá, {nome}. Aqui está o resumo do seu capital." | **idêntico** | ✅ |
| KPI 1 | SALDO DISPONÍVEL + valor + linha de fluxo | **igual** | ✅ |
| KPI 2 | INVESTIDO | **igual** | ✅ |
| KPI 3 | CONTAS ATIVAS | **igual** | ✅ |
| Gráfico | "Fluxo líquido — últimos 6 meses", 6 barras | **idêntico**, mesmo título | ✅ |
| Metas | card com estado vazio | **igual** | ✅ |
| Renda mensal | faixa com CTA | **igual** | ✅ |

**A correspondência é alta e não é coincidência** — o Designer claramente
partiu da Dashboard real. Títulos como "Fluxo líquido — últimos 6 meses" e a
saudação batem palavra por palavra.

### 4.2 Diferenças

| # | Aspecto | Designer | React real |
|---|---|---|---|
| D1 | Itens da sidebar | **8** (com "Mercado") | **7** (Mercado removido em `5750b7f`) |
| D2 | Rótulo do item 3 | "Contas e Caixas" | "Contas" |
| D3 | Botão "Sair" | ausente | presente no rodapé |
| D4 | Item ativo | `background:#5b52f0` sólido | `border-l-2` indigo + `bg-indigo-500/10` |
| D5 | Largura da sidebar | 214px | 256px |
| D6 | Layout dos KPIs | **grid 3 colunas** de cards com borda | cabeçalho com saldo gigante (`6xl`) + dois números menores ao lado |
| D7 | Nº de blocos no corpo | **4** | **8** |
| D8 | Barras do gráfico | 6 verticais, 62px, cores por intensidade | barras `div` com lógica de líquido +/− |
| D9 | Layout | **alturas fixas** (19/132/268/153px) | fluido, `space-y-10` |
| D10 | Fundo | `#0b0b11` / cards `#101017` | `#070b14` / cards `#101623` |
| D11 | Fonte | Outfit | Inter |

**A diferença D6 é a mais séria.** O Designer usa três cards iguais em grid; o
app atual usa uma hierarquia deliberada em que o saldo é o dado hero em `6xl`
e o resto orbita — decisão tomada numa fase anterior e comentada no código.

**A diferença D7 também pesa:** o Designer tem 4 blocos, o app tem 8 (renda,
meta em destaque, orçamento por categoria, comparação mensal, maiores
despesas). Os 4 extras foram construídos nas "Fases do gerente" e **não
existem no Designer**.

### 4.3 O que isso significa para a arquitetura

> **Conclusão: `DashboardView` puro compartilhado entre app e landing
> deixa de ser a melhor arquitetura.**

Raciocínio:

1. O Designer não é "a Dashboard real com outro tema". É uma **composição
   diferente**: 4 blocos contra 8, KPIs em grid contra hierarquia de saldo
   hero, alturas fixas contra layout fluido.
2. Forçar um componente único a servir os dois exigiria props de variante
   (`variant="landing" | "app"`) que trocariam layout, não só estilo. Isso é
   dois componentes vestidos de um.
3. Pior: qualquer evolução futura do painel (fase 2 do gerente, novo bloco)
   quebraria a fidelidade da landing sem ninguém notar — exatamente o tipo de
   divergência silenciosa que o `CLAUDE.md` existe para evitar.
4. E o benefício que motivava o compartilhamento — "a landing mostra o
   produto real" — não se sustenta: o Designer **já desenhou** uma versão
   editorial, com dados fictícios e menos blocos. Ela nunca foi para ser a
   tela real.

**Arquitetura recomendada no lugar:**

```
src/components/landing/product/
├── ProductStage.jsx          ← palco, instância única, recebe refs
├── DashboardPreview.jsx      ← reprodução fiel do CapitalCycleDashboard.dc.html
├── dashboardPreviewData.js   ← dados fictícios, zero rede
└── preview.css               ← tokens do Designer, escopo local
```

Sem import de Firebase, de Auth ou de Router. `DashboardFinanceiro.jsx` fica
**intocado** — o que também resolve o conflito com §8 do briefing.

**Custo aceito:** duplicação visual entre `DashboardPreview` e a Dashboard
real. Mas as duas **já divergem** no Designer, então não há uma verdade única
a preservar. A duplicação é o desenho, não um acidente.

> **Isto revoga a recomendação anterior** de `07-auditoria-codigo-atual.md`
> §2.4 e a decisão D1 de `05-implementation-plan.md`, escritas antes de o
> bundle estar disponível.

---

## 5. Dashboard → Recursos

| | Designer | App atual |
|---|---|---|
| Mecanismo | **translação rígida** de um par de planos, `translateY(0 → −903px)` | crossfade de opacidade entre duas camadas |
| Objeto persistente | Dashboard + RecursosPanel colados | **nenhum** |
| Relação entre planos | borda inferior da Dashboard **é** a borda superior de Recursos | camadas independentes sobrepostas |
| Sombra | `0 21px 44px rgba(0,0,0,0.32)` faz a Dashboard ler como plano superior | não existe |
| Fundo | `#f3f2f0` fixo | `opacity` de `#f4f5f7` subindo de 0 a 1 |
| Navbar | fade de escura para clara | mesma navbar o tempo todo |
| Runway | 5 keyframes | 80vh para tudo |

**O app atual faz exatamente o que o §18 do briefing proíbe.** Não há o que
reaproveitar: `useScrollStory` e as três sub-faixas (`heroContentP`,
`bgCrossP`, `recContentP`) saem inteiras.

**A boa notícia:** a implementação correta é **mais simples** que a atual. Um
`translateY` num contêiner resolve os cinco frames, contra três interpolações
de opacidade cruzadas.

---

## 6. Recursos

| | Designer | App atual (`.cch-feats`) |
|---|---|---|
| Layout | **trilho horizontal** de 2164px | grid 2×2 estático |
| Nº de painéis | **4** | 4 |
| Dimensões | **520 × 480** cada | fluido, `max-w:54rem`, `gap:1.15rem` |
| Gap | **28px** | 1,15rem ≈ 18px |
| Movimento | `left: 120 → −844` (964px), pinado | `translateY(40px→0)` + fade, IntersectionObserver |
| Conteúdo | ícone + título + descrição + **demo visual** | ícone + título + descrição |
| Card 4 | escuro `#14141a`, sombra reforçada | escuro `#0f1216` |
| Indicador de progresso | hairline de 180px | nenhum |
| Radius | 20px | 1,4rem ≈ 22px |

**Os 4 títulos e as 4 descrições são idênticos** ao array `FEATURE_CARDS` do
código. Só a forma muda — e muda por inteiro.

**O que falta construir:** as quatro demos visuais dentro dos cards (mini-KPIs
+ barras, lista de transações, barras de progresso, balão do Advisor). São o
grosso do trabalho da seção e não existem hoje em nenhuma forma.

---

## 7. Performance

| Item | Hoje | Depois do Designer | Delta |
|---|---|---|---|
| `hero-cartao.mp4` | 2,50 MB | **removido** | −2,50 MB |
| `hero-cartao-loop.mp4` | 587 KB | **removido** | −587 KB |
| `hero-cartao-poster.png` | 2,74 MB | **removido** | −2,74 MB |
| Assets raster do Designer | — | **zero** (tudo HTML/CSS/SVG) | 0 |
| Fontes | Inter + IBM Plex | + Outfit + Playfair + JetBrains Mono | **[a medir]** |
| GSAP + ScrollTrigger | — | ~42 KB gzip **[INFERÊNCIA]** | +42 KB |
| Firebase no caminho crítico | 466 KB | **inalterado** | 0 |

**Saldo estimado: −5,8 MB de mídia**, com acréscimo de ~42 KB de JS e o custo
das fontes novas. A troca é amplamente favorável.

O problema do Firebase (`R8`) permanece independente do Designer e continua
precisando de decisão sua.

---

## 8. Tabela-resumo de ações

| Região | Designer | App atual | Diferença | Ação futura |
|---|---|---|---|---|
| **Tokens** | Outfit/Playfair/Mono, roxo `#5b52f0` | Inter, 4 roxos | total | criar escopo de tokens da landing |
| **Navbar** | 2 variantes, logo textual | 1 variante, slot vazio | alta | reescrever `MainNav` |
| **Hero copy** | 2 linhas serifadas | 3 linhas caixa alta | alta | adotar Designer (C1) |
| **Hero mídia** | Dashboard 3D | vídeo de cartão | total | remover vídeo, construir palco |
| **Hero extras** | — | stats + scroll hint | app tem a mais | **[PENDENTE]** remover |
| **Dashboard preview** | 4 blocos, KPIs em grid | 8 blocos, saldo hero | alta | **construir novo**, não compartilhar |
| **D→Recursos** | translação rígida | crossfade | total | reescrever |
| **Recursos** | trilho horizontal + demos | grid 2×2 | total | reescrever |
| **Capital Advisor** | — | seção própria | fora do escopo | preservar |
| **Planos** | — | seção própria | fora do escopo | preservar |
| **Dashboard real** | — | `/capital/dashboard` | fora do escopo | **não tocar** |
