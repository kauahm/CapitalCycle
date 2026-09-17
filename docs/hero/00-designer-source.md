# 00 — Fonte oficial: Claude Designer

**Status: DESBLOQUEADO — bundle local lido integralmente.**

Atualizado: 2026-09-16
Branch: `feat/hero-designer`

---

## 1. Como o acesso foi resolvido

A primeira tentativa, via MCP `claude_design` (exposto como a ferramenta
`DesignSync`), falhou:

> DesignSync needs design-system authorization, and /design-login cannot run
> in this non-interactive session.

**O MCP continua não autorizado nesta sessão.** O bloqueio deixou de
importar porque o handoff oficial exportado pelo Claude Design foi
disponibilizado localmente em `referencia/designer/`.

Esse bundle é agora a **fonte visual oficial e bloqueada**.

## 2. Conteúdo do bundle

```
referencia/designer/
├── Hero Scroll Storyboard.dc.html      18.113 bytes   prancha, 5 frames
├── Dashboard to Recursos.dc.html       10.964 bytes   prancha, 5 frames
├── Recursos Showcase.dc.html           13.576 bytes   prancha, 4 frames
├── CapitalCycleDashboard.dc.html       10.839 bytes   componente 1180×740
├── RecursosPanel.dc.html                1.841 bytes   componente 1440×900
├── RecursosTrack.dc.html               10.911 bytes   componente 2164×480
├── support.js                          69.150 bytes   runtime do Claude Design
├── .thumbnail                          14.146 bytes   WebP 360×401, miniatura
└── uploads/
    ├── dashboard.PNG                  117.821 bytes
    ├── pasted-1789354109786-0.png     312.851 bytes
    ├── pasted-1789355014796-0.png     787.577 bytes
    └── pasted-1789355491379-0.png     166.916 bytes
```

**Todos os 7 arquivos de código foram lidos integralmente**, sem pular
trechos.

### 2.1 Não há README no bundle

O briefing pedia para ler `referencia/designer/README.md` antes de tudo.
**Esse arquivo não existe.** Varredura:

```
find referencia -iname "*readme*" -o -iname "*handoff*" -o -iname "*.md"
# → nenhum resultado
```

Não há nenhum `.md` em `referencia/`, nem no bundle nem um nível acima.
Segui direto pelos `.dc.html`, que o próprio briefing define como fonte
primária. **[PENDENTE]** — se o README existir em outro lugar, vale
conferir se ele contradiz alguma leitura feita aqui.

### 2.2 Os `uploads/` não são usados

```
grep -rn "uploads" referencia/designer/*.dc.html
# → nenhum resultado
```

**Nenhum `.dc.html` referencia a pasta `uploads/`.** Também não há um único
`<img>` nem `background-image` em todo o bundle. O design inteiro é HTML +
CSS + SVG inline.

Os quatro PNGs são material de trabalho (capturas coladas durante a
concepção), não assets do produto. Ver `03-assets.md`.

## 3. Grafo de imports

```
Hero Scroll Storyboard  ──5×──▶ CapitalCycleDashboard
Dashboard to Recursos   ──5×──▶ CapitalCycleDashboard
                        ──5×──▶ RecursosPanel ──1×──▶ RecursosTrack
Recursos Showcase       ──4×──▶ RecursosTrack
```

Só o mecanismo `dc-import`. Nenhum `x-import` (que carregaria JS externo),
nenhuma dependência de CDN além das fontes do Google.

## 4. O que `support.js` é e não é

Runtime gerado pelo Claude Design. **Não vai para produção** — confirmado o
§10 do briefing. Serviu para entender três mecanismos:

| Tag | Função | Equivalente no React |
|---|---|---|
| `<dc-import name="X" hint-size="W,H">` | monta o componente X inline (`walkComponent`, linha 661). `hint-size` só define `minWidth`/`minHeight` do placeholder durante o carregamento (`hintToMin`, linha 883) | `<X />` — as dimensões são naturais do componente |
| `<sc-if value="{{ expr }}">` | renderização condicional (`walkIf`, linha 646) | `{cond && ...}` |
| `<helmet>` | injeta `<link>`/`<style>` no head | tags no `index.html` |
| `class Component extends DCLogic` + `renderVals()` | props de autoria da prancha | **nada** — são controles de design |

Ponto importante: `hint-size` é **placeholder**, não layout. As dimensões
reais vêm do próprio componente (`CapitalCycleDashboard` declara
`width:1180px; height:740px` no seu nó raiz). Os dois valores coincidem em
todos os imports, mas a fonte de verdade é o componente.

## 5. Documentos produzidos a partir da leitura

| Arquivo | Estado |
|---|---|
| `01-keyframes-designer.md` | **novo** — 14 frames, propriedade a propriedade |
| `02-copy-oficial.md` | **novo** — copy literal + 10 divergências |
| `04-gap-analysis.md` | **novo** — Designer × código, região a região |
| `03-assets.md` | atualizado — seção Designer preenchida |
| `05-implementation-plan.md` | atualizado — gates desbloqueados |
| `06-riscos-tecnicos.md` | atualizado — riscos revistos e novos |
| `07-auditoria-codigo-atual.md` | atualizado — comparação com o Designer |

## 6. Convenção de marcação

- **[DESIGNER]** — lido nos `.dc.html` do bundle
- **[CÓDIGO]** — verificado no código deste repositório
- **[INFERÊNCIA]** — dedução minha, não confirmada pela fonte
- **[PENDENTE]** / **[DECISÃO PENDENTE]** — depende de você

## 7. Sobre os PNGs em `referencia/` (fora do bundle)

`Hero Scroll Storyboard-selection.png`, `Dashboard to Recursos-selection.png`
e `Recursos Showcase-selection.png` **não foram usados**. Toda medida neste
conjunto de documentos veio do código dos `.dc.html`, conforme §3 do
briefing. Os PNGs continuam servindo para conferência visual humana.
