# 03 — Inventário de assets

Branch: `feat/hero-designer` · base `ad37205` · data: 2026-09-16

---

## A. Assets do Designer (oficiais)

**[PENDENTE] — nada inventariado.**

O projeto do Claude Designer não pôde ser lido nesta sessão (ver
`00-designer-source.md`). Não há como listar imagens, ícones, fontes ou
exports que a composição oficial exija.

Quando o acesso existir, esta seção precisa registrar, por asset:
arquivo · origem · dimensões · formato · peso · uso no Designer ·
uso atual · utilizável diretamente? · precisa export? · precisa otimizar?

---

## B. Assets atuais do projeto

Todos **[CÓDIGO]**, medidos no working tree.

### B.1 Em uso

| Arquivo | Formato | Peso | Dimensões | Usado por | Observação |
|---|---|---|---|---|---|
| `src/assets/video/hero-cartao.mp4` | MP4 | **2,50 MB** | — | `HomePage.jsx:6` | vídeo de abertura do Hero; toca uma vez |
| `src/assets/video/hero-cartao-loop.mp4` | MP4 | 587 KB | — | `HomePage.jsx:7` | entra no evento `ended` do primeiro |
| `src/assets/video/hero-cartao-poster.png` | PNG | **2,74 MB** | — | `HomePage.jsx:8` | **maior asset do projeto**; poster de vídeo em PNG |
| `src/assets/logo-topo.png` | PNG | 81 KB | — | `Sidebar.jsx:15` | logo clara, usada no painel |
| `src/assets/logo-black.png` | PNG | 38 KB | — | Login / Register / Legal | logo escura |
| `public/favicon.svg` | SVG | ~1 KB | — | `index.html` | — |

### B.2 Otimização necessária

| Asset | Problema | Ação sugerida |
|---|---|---|
| `hero-cartao-poster.png` | 2,74 MB em PNG para um poster de vídeo | converter para WebP/AVIF na resolução real de exibição — queda esperada para dezenas de KB |
| `hero-cartao.mp4` | 2,50 MB no caminho crítico | reencodar; considerar `preload="metadata"` em vez de `"auto"` |
| `logo-topo.png` / `logo-black.png` | PNG para uma logo | SVG seria menor e nítido em qualquer escala — **[PENDENTE]** existe fonte vetorial? |

Primeira dobra da Home hoje: **~5,2 MB** só entre `.mp4` + poster, fora
os 400 KB de JS + 466 KB de Firebase.

### B.3 Destino na Hero nova

**[PENDENTE]** — depende inteiramente do Designer. Se a composição oficial
não tiver o vídeo do cartão, os três arquivos de `src/assets/video/`
(3,8 MB somados) saem do bundle. Se tiver, precisam ser reencodados.

O `.cch-logo-slot` (`HomePage.jsx:471`) é um `<div>` vazio de 3rem × 2,5rem
reservado para a logo na navbar da landing — **a logo nunca foi colocada
ali**. Qual arquivo entra nesse slot é **[PENDENTE]** do Designer.

---

## C. Referências locais (não são assets de produção)

Pasta `referencia/`, fora de `src/` e fora do build.

| Arquivo | Peso | Natureza |
|---|---|---|
| `Hero Scroll Storyboard-selection.png` | 219 KB | export parcial ("selection") de tela do Designer |
| `Dashboard to Recursos-selection.png` | 274 KB | idem |
| `Recursos Showcase-selection.png` | 192 KB | idem |
| `dashboard.PNG` | 112 KB | captura da Dashboard |
| `referenciaDashboard.pdf` | 232 KB | referência visual da Dashboard |
| `inspiracao-externa-lemma.png` | 241 KB | inspiração externa |
| `referencia.png` (raiz do repo) | 139 KB | referência solta, fora da pasta |

**Nenhum destes foi usado como fonte nesta fase.** §2 do briefing autoriza os
exports locais apenas como verificação auxiliar de estados já lidos no
Designer, e não há estado lido para verificar. Além disso são recortes de
seleção: não carregam medidas, coordenadas, z-order, clipping nem copy.

`docs/00-INCIDENTE-referencia-apagada.md` registra que material de
referência já foi perdido neste repositório. Esses arquivos estão
versionados — **não apagar**.

---

## D. Assets obsoletos

| Asset | Situação |
|---|---|
| nenhum arquivo de mídia órfão encontrado | todos os arquivos em `src/assets/` têm ao menos um import |

Código morto (não é asset, mas é peso): `DashboardMockup.jsx` e
`MobileNav.jsx` — ver `07-auditoria-codigo-atual.md` §3.3.
