# 03 — Inventário de assets

Branch: `feat/hero-designer` · atualizado 2026-09-16 (bundle do Designer lido)

---

## A. Assets do Designer (oficiais)

### A.1 Achado principal: **zero assets raster**

```
grep -rn "uploads" referencia/designer/*.dc.html          # → nenhum
grep -rno "<img[^>]*>|background-image:[^;]*" *.dc.html   # → nenhum
```

**Nenhum `.dc.html` referencia imagem alguma.** Todo o design é composto por:

- HTML + CSS inline
- **SVG inline** para todos os ícones
- `radial-gradient` / `linear-gradient` para o glow e os fundos

Consequência prática: **não há nada para exportar, otimizar ou versionar**.
A implementação é código, não mídia.

### A.2 Ícones — todos SVG inline, `viewBox="0 0 16 16"`

| Ícone | Onde | `stroke-width` | Path (resumo) |
|---|---|---|---|
| Grade 2×2 (Dashboard) | sidebar item 1, ativo | 1.5 | 4 `<rect>` 5.5×5.5 `rx:1.4` |
| Setas opostas (Transações) | sidebar 2, card 2 do trilho | 1.5 / 1.6 | 2 `<path>` com pontas |
| Banco/colunas (Contas) | sidebar 3 | 1.5 | telhado + 4 colunas + base |
| Relógio (Ciclos) | sidebar 4, card metas, card 3 | 1.5 / 1.6 | `<circle r:6>` + ponteiro |
| Tabela (Orçamento) | sidebar 5 | 1.5 | `<rect>` + divisórias |
| Faísca (Advisor) | sidebar 6, card 4 | 1.5 / 1.6 | estrela de 4 pontas |
| Barras (Mercado / card 1) | sidebar 7, card 1 do trilho | 1.5 / 1.6 | 3 barras + base |
| Pessoa (Perfil) | sidebar 8 | 1.5 | `<circle>` + ombros |
| Cartão | faixa de renda da Dashboard | 1.4 | `<rect rx:1.8>` + faixa |

Tamanhos: **15px** na sidebar, **20px** nos cards do trilho, **22px** na
faixa de renda. Todos usam `stroke="currentColor"` ou cor explícita
(`#5b52f0`, `#ffffff`, `#8e8e9a`, `#f5f5f7`) e `fill="none"`.

> **[INFERÊNCIA]** Estes ícones são próximos dos equivalentes de
> `lucide-react` já usado no projeto (LayoutDashboard, ArrowLeftRight,
> Landmark, Clock/PieChart, Wallet, Sparkles, BarChart3, User). Mas os paths
> **não são idênticos** — o Designer desenhou os seus, com geometria e
> `stroke-width` próprios. **[DECISÃO PENDENTE]**: transcrever os SVGs do
> Designer (fiel, mais verboso) ou mapear para `lucide-react` (menos código,
> divergência visual pequena mas real). Recomendo **transcrever** — §1 do
> briefing trata o Designer como referência bloqueada, e os ícones são parte
> da composição.

### A.3 Fontes — os únicos recursos externos

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:wght@700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

| Família | Pesos usados | Papel |
|---|---|---|
| **Outfit** | 300, 400, 500, 600, 700 | corpo, UI, navbar, títulos de card |
| **Playfair Display** | 700 | H1 do Hero, H2 de Recursos |
| **JetBrains Mono** | 400, 500 | eyebrows, labels de KPI, percentuais |

Nenhuma está no projeto hoje (que usa Inter + IBM Plex Sans).

**[PENDENTE]** — o `index.html` passaria a carregar **cinco** famílias. Vale
avaliar subsetting, ou restringir Inter/IBM Plex às rotas internas e de
acesso via `@font-face` com `unicode-range`. A medir no GATE 7.

### A.4 Cores declaradas no Designer

| Token | Valor | Uso |
|---|---|---|
| Roxo de marca | `#5b52f0` | CTAs, item ativo, eyebrow, barra de progresso, ícones |
| Roxo do glow | `rgba(124,92,255, α)` | só o gradiente radial do Hero |
| Link | `#4f7dff` | links dentro da Dashboard |
| Fundo da página (Hero) | `#07070b` | frames 1-4 da prancha A |
| Fundo do produto | `#0b0b11` | Dashboard e frame 5 da prancha A |
| Sidebar | `#08080d` | — |
| Card escuro | `#101017` | KPIs, gráfico, metas |
| Borda escura | `#1e1e28`, `#17171f`, `#24242c` | — |
| Tinta clara | `#f5f5f7` | texto principal no escuro |
| Cinza texto | `#9a9aa6`, `#8e8e9a`, `#6b6b78` | secundários |
| Fundo claro | `linear-gradient(180deg,#f6f5f3,#efedea)` | Recursos |
| Fundo da moldura | `#f3f2f0` | frames da prancha B |
| Card claro | `#fbfaf9` / demo `#f2f0ed` / `#faf9f7` | trilho |
| Borda clara | `#e6e4e0`, `#e8e6e2`, `#e4e2de`, `#d8d5cf` | — |
| Tinta escura | `#14141a` | texto em fundo claro, card 4 |
| Cinza texto claro | `#5a5a63`, `#63636c`, `#76767e` | secundários |
| Verdes | `#22c55e`, `#15803d`, `#166534`, `#14532d`, `#4ade80` | fluxo positivo, barras |
| Neutros de barra | `#d7d4ce`, `#cfccc5`, `#c6c2ba`, `#b4b0a8`, `#e0ddd8` | demos do trilho |

---

## B. Assets atuais do projeto

### B.1 Em uso hoje

| Arquivo | Formato | Peso | Usado por | Destino |
|---|---|---|---|---|
| `src/assets/video/hero-cartao.mp4` | MP4 | **2,50 MB** | `HomePage.jsx:6` | **REMOVER** |
| `src/assets/video/hero-cartao-loop.mp4` | MP4 | 587 KB | `HomePage.jsx:7` | **REMOVER** |
| `src/assets/video/hero-cartao-poster.png` | PNG | **2,74 MB** | `HomePage.jsx:8` | **REMOVER** |
| `src/assets/logo-topo.png` | PNG | 81 KB | `Sidebar.jsx:15` | **PRESERVAR** (app real) |
| `src/assets/logo-black.png` | PNG | 38 KB | Login / Register / Legal | **PRESERVAR** |
| `public/favicon.svg` | SVG | ~1 KB | `index.html` | **PRESERVAR** |

### B.2 O vídeo sai

O Designer não tem vídeo em nenhum frame. O Hero dele é a Dashboard 3D sobre
fundo escuro com glow. Os três arquivos de `src/assets/video/`
(**5,82 MB somados**) deixam de ter uso.

**[DECISÃO PENDENTE]** — apagar os arquivos ou só remover o import? Apagar
reduz o repositório; o `CLAUDE.md` alerta que o repo versiona mídia pesada.
Recomendo **remover o import no GATE 1 e apagar os arquivos só no GATE 7**,
depois que a Hero nova estiver aprovada.

### B.3 A logo deixa de precisar de imagem na landing

`.cch-logo-slot` (`HomePage.jsx:471`) é um `<div>` vazio de 3rem × 2,5rem que
nunca recebeu logo. O Designer resolve: a logo é **textual** —
`CAPITAL<br>CYCLE`, 15px, w700, `letter-spacing:0.06em`, `line-height:1.18`.
Nenhum arquivo necessário.

`logo-topo.png` continua sendo usado pela sidebar do **app real**, que não
muda.

---

## C. Referências locais (não são assets de produção)

### C.1 `referencia/designer/uploads/` — material de concepção

| Arquivo | Peso | Situação |
|---|---|---|
| `dashboard.PNG` | 118 KB | não referenciado por nenhum `.dc.html` |
| `pasted-1789354109786-0.png` | 313 KB | idem |
| `pasted-1789355014796-0.png` | 788 KB | idem |
| `pasted-1789355491379-0.png` | 167 KB | idem |

Capturas coladas durante a concepção do design. **Não entram no produto.**

### C.2 `referencia/designer/.thumbnail`

WebP 360×401, 14 KB. Miniatura do projeto no Claude Design. Não é asset.

### C.3 `referencia/` — material anterior

| Arquivo | Peso | Natureza |
|---|---|---|
| `Hero Scroll Storyboard-selection.png` | 219 KB | export de seleção da prancha A |
| `Dashboard to Recursos-selection.png` | 274 KB | export de seleção da prancha B |
| `Recursos Showcase-selection.png` | 192 KB | export de seleção da prancha C |
| `dashboard.PNG` | 112 KB | captura da Dashboard |
| `referenciaDashboard.pdf` | 232 KB | referência visual |
| `inspiracao-externa-lemma.png` | 241 KB | inspiração externa |
| `referencia.png` (raiz do repo) | 139 KB | referência solta |

**Nenhum foi usado como fonte.** Todas as medidas vieram dos `.dc.html`.
Servem para conferência visual humana.

`docs/00-INCIDENTE-referencia-apagada.md` registra que material de referência
já foi perdido neste repositório. **Não apagar nada de `referencia/`.**

> ⚠️ `referencia/designer/` está **sem rastreamento no Git** no momento desta
> escrita. É a fonte visual oficial do projeto e deveria ser versionada —
> ver a decisão A no relatório.

---

## D. Assets obsoletos

| Item | Situação |
|---|---|
| `src/assets/video/*` (3 arquivos, 5,82 MB) | obsoletos assim que o GATE 1 fechar |
| nenhum outro arquivo de mídia órfão | todos os demais têm import ativo |

Código morto (peso de bundle, não asset): `DashboardMockup.jsx` e
`MobileNav.jsx` — ver `07-auditoria-codigo-atual.md` §3.3.

---

## E. Balanço de peso

| | Antes | Depois | Delta |
|---|---|---|---|
| Mídia da landing | 5,82 MB | **0** | **−5,82 MB** |
| Assets raster do Designer | — | **0** | 0 |
| Ícones | lucide-react (tree-shaken) | SVG inline | ~neutro |
| Fontes | 2 famílias | 5 famílias | **[a medir]** |
| GSAP + ScrollTrigger | — | ~42 KB gzip **[INFERÊNCIA]** | +42 KB |

O Designer é dramaticamente mais leve que a Hero atual.
