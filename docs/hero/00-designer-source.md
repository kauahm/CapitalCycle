# 00 — Fonte oficial: Claude Designer

**Status: BLOQUEADO — acesso não autorizado nesta sessão.**

Data da tentativa: 2026-09-16
Branch: `feat/hero-designer` (criada a partir de `ad37205`)

---

## 1. O que foi tentado

O MCP `claude_design` está exposto neste ambiente como a ferramenta
`DesignSync` (métodos `list_projects`, `get_project`, `list_files`,
`get_file`).

Chamada executada:

    DesignSync(method: "list_projects")

Resposta recebida (verbatim):

> DesignSync needs design-system authorization, and /design-login cannot run
> in this non-interactive session. Ask the user to run /design-login once from
> an interactive Claude Code session on this machine — headless and SDK runs
> here then reuse that authorization.

Ou seja: **a sessão atual é não-interativa**, e o fluxo OAuth do
`/design-login` não pode ser executado a partir dela.

## 2. O que isso bloqueia

Nada do projeto do Designer foi lido. Zero arquivos, zero frames, zero
medidas, zero copy.

Projeto oficial pendente de leitura:

    https://claude.ai/design/p/cde0a0f2-fbed-49a0-b2f8-883bfcd32e4c

Arquivos que precisam ser lidos integralmente quando o acesso existir:

| # | Arquivo | Papel esperado |
|---|---|---|
| 1 | `Hero Scroll Storyboard.dc.html` | ordem oficial das cenas / keyframes |
| 2 | `CapitalCycleDashboard.dc.html` | estado visual da Dashboard no palco |
| 3 | `Dashboard to Recursos.dc.html` | transição crítica (§18 do briefing) |
| 4 | `Recursos Showcase.dc.html` | composição da seção Recursos |
| 5 | `RecursosPanel.dc.html` | painel individual |
| 6 | `RecursosTrack.dc.html` | trilho horizontal |
| 7 | `support.js` | lógica e parâmetros de apoio do protótipo |

## 3. Documentos que NÃO foram produzidos (e por quê)

Conforme §2 do briefing ("NÃO tente substituir a leitura do projeto por
suposições"), os seguintes arquivos **não** foram criados, porque 100% do
conteúdo deles viria do Designer:

| Arquivo previsto | Motivo de não existir ainda |
|---|---|
| `01-keyframes-designer.md` | exigiria inventar frames, medidas e ordem |
| `02-copy-oficial.md` | exigiria inventar copy |
| `04-gap-analysis.md` | é uma comparação: falta um dos dois lados |

Criar esses arquivos com conteúdo inferido transformaria suposição em fato
dentro do repositório — exatamente o que §27 proíbe.

## 4. Sobre os arquivos locais em `referencia/`

Existem no repositório:

- `referencia/Hero Scroll Storyboard-selection.png` (218 KB)
- `referencia/Dashboard to Recursos-selection.png` (273 KB)
- `referencia/Recursos Showcase-selection.png` (192 KB)
- `referencia/dashboard.PNG` (112 KB)
- `referencia/referenciaDashboard.pdf` (232 KB)
- `referencia/inspiracao-externa-lemma.png` (240 KB)

Os três primeiros parecem ser exports parciais ("selection") das telas do
Designer. **Não foram usados como fonte.** §2 do briefing autoriza esses
exports apenas como *verificação auxiliar* de estados já lidos no Designer —
e não há nenhum estado lido para verificar. São, além disso, recortes de
seleção: não carregam medidas, coordenadas, z-order, clipping nem copy
completa.

Não existe nenhum `.dc.html` local. Confirmado por varredura:

    find . -path ./node_modules -prune -o -iname "*.dc.html" -print
    # → nenhum resultado

## 5. Como desbloquear

Uma destas rotas:

1. **Preferida** — rodar `/design-login` uma vez numa sessão interativa do
   Claude Code nesta máquina. Depois disso esta sessão (e futuras headless)
   reaproveitam a autorização.
2. Usar o "Send to Claude Code Web" do Claude Design, que semeia o projeto
   no workspace.
3. Exportar os `.dc.html` e o `support.js` manualmente para uma pasta do
   repositório (ex.: `referencia/designer/`), que passariam a ser a fonte
   lida.

## 6. O que FOI feito nesta fase

Só o que não depende do Designer:

- `03-assets.md` — inventário completo dos assets **atuais** (a metade
  "Designer" fica pendente).
- `06-riscos-tecnicos.md` — riscos de CSS/arquitetura levantados na árvore
  concreta do código atual.
- `07-auditoria-codigo-atual.md` — mapa da Home atual, viabilidade de reuso
  da Dashboard real, bundle e performance.
- `05-implementation-plan.md` — esqueleto de gates (a estrutura veio do
  briefing §26; o conteúdo de cada gate depende dos keyframes).

## 7. Convenção de marcação usada nestes documentos

- **[DESIGNER]** — lido no projeto do Claude Designer. *Nesta fase: nenhum.*
- **[CÓDIGO]** — verificado no código deste repositório.
- **[INFERÊNCIA]** — dedução minha, não confirmada.
- **[PENDENTE]** — decisão que depende do usuário ou do Designer.
