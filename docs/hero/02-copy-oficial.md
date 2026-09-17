# 02 — Copy oficial

Fonte: `referencia/designer/`, transcrito literalmente dos `.dc.html`.
Lido em 2026-09-16.

Toda a copy abaixo é **[DESIGNER]**. Divergências entre telas estão
registradas, nunca resolvidas em silêncio.

---

## 1. Tipografia oficial

Três famílias, via Google Fonts:

| Família | Pesos | Uso |
|---|---|---|
| **Outfit** | 300, 400, 500, 600, 700 | corpo, UI, títulos de card, navbar |
| **Playfair Display** | 700 | H1 do Hero e H2 de Recursos — **serifada** |
| **JetBrains Mono** | 400, 500 | eyebrows, labels de KPI, percentuais |

> ⚠️ **Nenhuma das três é usada hoje no projeto.** O app atual usa **Inter**
> (global) e **IBM Plex Sans** (telas de acesso). Ver `04-gap-analysis.md`.

---

## 2. Navbar

Há **duas variantes** da mesma navbar. Altura `82px`, `padding: 0 48px` em
ambas.

### 2.1 Variante escura (Hero — pranchas A e B)

| Elemento | Texto | Estilo |
|---|---|---|
| Logo | `CAPITAL` `<br>` `CYCLE` | 15px, w700, `ls:0.06em`, `lh:1.18`, `#ffffff` |
| Link 1 | **Início** | 14,5px, w500, `#ffffff` (ativo) |
| Link 2 | **Recursos** | 14,5px, w400, `#9a9aa6` |
| Link 3 | **Capital Advisor** | 14,5px, w400, `#9a9aa6` |
| Link 4 | **Planos** | 14,5px, w400, `#9a9aa6` |
| Botão | **Entrar** | 14px, w500, `#f5f5f7`, `border:1px solid #35353f`, `radius:999px`, `padding:9px 24px` — **contornado** |

Links com `gap:38px`, centralizados via `margin: 0 auto`.

### 2.2 Variante clara (Recursos — pranchas B e C)

| Elemento | Texto | Estilo |
|---|---|---|
| Logo | `CAPITAL` `<br>` `CYCLE` | 15px, w700, `ls:0.06em`, `lh:1.18`, `#14141a` |
| Link 1 | **Início** | 14,5px, w400, `#76767e` |
| Link 2 | **Recursos** | 14,5px, w500, `#14141a` (ativo) |
| Link 3 | **Capital Advisor** | 14,5px, w400, `#76767e` |
| Link 4 | **Planos** | 14,5px, w400, `#76767e` |
| Botão | **Entrar** | 14px, w500, `#ffffff`, `background:#14141a`, `radius:999px`, `padding:10px 25px` — **preenchido** |

**A logo é textual**, não um arquivo de imagem: duas palavras em caixa alta
quebradas por `<br>`. Isso resolve o `.cch-logo-slot` vazio do código atual.

O item ativo muda de **Início** (Hero) para **Recursos** (Showcase), e o
botão Entrar troca de contornado para preenchido junto com a inversão do
tema.

---

## 3. Hero (prancha A)

### 3.1 H1

```
Sua jornada
financeira.
```

`Playfair Display` 700, **86px**, `line-height:0.99`,
`letter-spacing:-0.025em`, `#ffffff`, centralizado, quebra explícita com
`<br>`.

> **Divergência com o código atual.** O app usa **três** linhas em caixa alta
> (`Sua` / `Jornada` / `Financeira`), sans-serif 900, com "Financeira" em
> roxo. O Designer usa **duas** linhas, caixa mista, serifada, tudo branco, e
> **com ponto final**. Ver `04-gap-analysis.md`.

### 3.2 Subtítulo

> Da primeira transação ao ciclo de investimento completo — controle total do
> seu capital com inteligência artificial integrada.

17px, `lh:1.55`, `#a5a5b0`, w300, `max-width:610px`, centralizado.

**Idêntico, palavra por palavra, ao texto já em produção** (`HomePage.jsx`),
inclusive o travessão `—`. Única copy do Hero que não muda.

### 3.3 CTAs

| Ordem | Texto | Estilo |
|---|---|---|
| 1 | **Começar agora** | `background:#5b52f0`, `#ffffff`, 15px, w500, `padding:14px 28px`, `radius:10px` |
| 2 | **Já tenho conta** | `background:rgba(255,255,255,0.10)`, `#e5e5ea`, mesmas métricas |

`gap:14px`. Os dois rótulos são **idênticos aos do código atual**.

### 3.4 O que o Designer **não** tem no Hero

- Sem indicador "Role para baixo" nem ícone de mouse
- Sem bloco de estatísticas ("Fluxo positivo R$ 18k", "Ciclos ativos 14+")
- Sem vídeo de fundo

---

## 4. Dashboard (`CapitalCycleDashboard.dc.html`)

### 4.1 Sidebar — 8 itens

| # | Texto | Estado |
|---|---|---|
| 1 | **Dashboard** | ativo — `background:#5b52f0`, `#ffffff`, w600 |
| 2 | **Transações** | `#9a9aa6`, w400 |
| 3 | **Contas e Caixas** | `#9a9aa6`, w400 |
| 4 | **Ciclos e Metas** | `#9a9aa6`, w400 |
| 5 | **Orçamento por**`<br>`**Categoria** | `#9a9aa6`, w400, duas linhas |
| 6 | **Capital Advisor (IA)** | `#9a9aa6`, w400 |
| 7 | **Mercado** | `#9a9aa6`, w400 |
| 8 | **Meu Perfil** | `#9a9aa6`, w400 |

Itens em 12,5px, `padding:10px 12px`, `radius:9px`, `gap:11px` com ícone SVG
de 15px. Logo `CAPITAL`/`CYCLE` no topo, 14,5px.

> ⚠️ **Duas divergências com o app atual:**
> 1. O Designer tem **"Mercado"**, que foi **removido do app** no commit
>    `5750b7f` ("feat: remove a área de Mercado financeiro").
> 2. O Designer diz **"Contas e Caixas"**; o app diz **"Contas"**.
>
> Além disso o Designer **não tem o botão "Sair"** que o app tem no rodapé da
> sidebar.

### 4.2 Topbar

| Elemento | Texto |
|---|---|
| Título | **Dashboard** — 23px, w700, `ls:-0.01em` |
| Nome | **Kaua Martins** — 13,5px, w600 |
| Papel | **Investidor** — 11,5px, `#8e8e9a`, w300 |
| Avatar | **K** — 32px, círculo `#5b52f0`, 13px w600 |

### 4.3 Corpo — **estado vazio**

> Olá, Kaua. Aqui está o resumo do seu capital.

12,5px, `#9a9aa6`, w300.

**Três KPIs** (grid `1fr 1fr 1fr`, `gap:16px`, altura 132px):

| Label (10,5px, `ls:0.11em`, `#8e8e9a`) | Valor (30px, w700) | Rodapé |
|---|---|---|
| `SALDO DISPONÍVEL` | **R$ 0,00** | `↗ Sobrou R$ 0,00 este mês` (11,5px, `#22c55e`) |
| `INVESTIDO` | **R$ 0,00** (`#22c55e`) | — |
| `CONTAS ATIVAS` | **0** | — |

**Gráfico** (grid `1.55fr 1fr`, altura 268px):

- Título: **Fluxo líquido — últimos 6 meses** (14px, w700)
- 6 barras de 62px de largura, `radius:6px`, rótulos **Mar / Abr / Mai / Jun
  / Jul / Ago**
- Alturas `92 / 112 / 132 / 94 / 122 / 150`; cores
  `#14532d`, `#166534`, `#15803d`, `#14532d`, `#166534`, **`#4ade80`** (mês
  corrente destacado)

**Metas** (card à direita):

- Título: **Metas em andamento** + ícone de relógio
- Estado vazio em moldura tracejada `1px dashed #2a2a36`, `radius:10px`:
  - **Nenhuma meta cadastrada ainda.** (12px, `#8e8e9a`, w300)
  - Link: **Criar minha primeira meta →** (12,5px, `#4f7dff`, w500)

**Faixa de renda** (altura 153px, centralizada):

- **Defina sua renda mensal para acompanhar economia e % da renda
  comprometida.** (12,5px, `#9a9aa6`, w300)
- Link: **Definir renda mensal →** (12,5px, `#4f7dff`, w500)

> **Achado importante:** o Designer desenhou a Dashboard em **estado vazio**
> — R$ 0,00, nenhuma meta, renda não definida — **exceto** o gráfico de 6
> meses, que tem barras cheias. É uma inconsistência interna da prancha.
> **[DECISÃO PENDENTE]** — ver §8.

---

## 5. Recursos — lockup editorial

### 5.1 Eyebrow

**RECURSOS** — JetBrains Mono 500, `ls:0.24em`, `#5b52f0`, precedido de uma
bolinha de 6px na mesma cor.

Tamanho varia: **12px** em Showcase F1, **11px** em `RecursosPanel` e em
Showcase F2-F4.

### 5.2 H2

```
Gestão que evolui com você.
```

`Playfair Display` 700, `#14141a`, com **"evolui" em `#5b52f0`**.

| Onde | Tamanho | `line-height` | `letter-spacing` | Quebra |
|---|---|---|---|---|
| Showcase F1 | **88px** | 0,99 | −0,028em | `Gestão que evolui` `<br>` `com você.` |
| `RecursosPanel` | **52px** | 1,08 | −0,026em | linha única |
| Showcase F2-F4 | **46px** | 1,06 | −0,025em | linha única |

> **Divergência com o código atual.** O app usa caixa alta em duas linhas
> (`Gestão` / `Que evolui com você`) sem ponto final e com a segunda linha
> inteira em roxo. O Designer usa caixa mista, ponto final, e **apenas a
> palavra "evolui"** em roxo.

### 5.3 Subtítulo

> Ferramentas profissionais para controle total do seu dinheiro — do
> lançamento individual à inteligência financeira por IA.

`#5a5a63`, w300. **17px** (`RecursosPanel`, alinhado à esquerda,
`max-width:620px`) ou **18px** (Showcase F1, centralizado,
`max-width:620px`), `lh:1.62`.

**Idêntico ao texto já em produção.**

### 5.4 CTA

**Conhecer os recursos ↓** — `background:#14141a`, `#ffffff`, 15px, w500,
`padding:15px 32px`, `radius:10px`, `gap:12px`. Só existe em Showcase F1.

> **Divergência.** O app atual tem **"Ver planos →"** (pílula
> `radius:999px`), que aponta para outra seção. O Designer tem **"Conhecer os
> recursos ↓"** (`radius:10px`), que aponta para baixo, para o próprio
> trilho.

---

## 6. Cards do trilho (`RecursosTrack.dc.html`)

Quatro painéis, nesta ordem:

| # | Título (27px, w600) | Descrição (16px, `lh:1.6`, w300) |
|---|---|---|
| 1 | **Dashboard Financeiro** | Saldo consolidado de todas as contas com indicadores de fluxo em tempo real. |
| 2 | **Transações Inteligentes** | Registre entradas e saídas com categorias, filtros avançados e histórico completo. |
| 3 | **Ciclos de Investimento** | Metas de orçamento por período com progresso calculado automaticamente. |
| 4 | **Capital Advisor** | Análise dos seus dados financeiros em linguagem natural, direto no aplicativo. |

> **Os quatro títulos e as quatro descrições são idênticos, caractere por
> caractere, ao array `FEATURE_CARDS` de `HomePage.jsx`** — com uma exceção: o
> app escreve **"Capital Advisor"** no card 4 e o Designer também. Sem
> divergência aqui.
>
> A diferença está na **forma**, não no texto: o app renderiza 4 cards num
> grid 2×2 estático; o Designer renderiza 4 painéis de 520px num trilho
> horizontal de 2164px com demo visual dentro de cada um.

### 6.1 Copy dentro das demos

**Card 1 — Dashboard Financeiro** (labels em JetBrains Mono 10px,
`ls:0.14em`, `#63636c`):

| Label | Valor |
|---|---|
| `SALDO` | **R$ 12.480** |
| `INVESTIDO` | **R$ 8.200** |
| `FLUXO` | **+4,2%** (`#15803d`) |

**Card 2 — Transações Inteligentes** (13,5px):

| Categoria | Valor |
|---|---|
| Salário | **+ R$ 6.200,00** (`#15803d`) |
| Aluguel | **− R$ 1.850,00** (`#14141a`) |
| Freelance | **+ R$ 980,00** (`#15803d`) |
| Mercado | **− R$ 214,90** (`#14141a`) |

**Card 3 — Ciclos de Investimento** (13,5px + percentual em mono 12px):

| Meta | Progresso |
|---|---|
| Reserva de emergência | **62%** |
| Aporte mensal | **88%** |
| Viagem 2026 | **34%** |

**Card 4 — Capital Advisor:**

- Eyebrow: **CAPITAL ADVISOR** (mono 9,5px, `ls:0.18em`, `#9a9aa6`)
- Balão (15px, `lh:1.62`, `#e2e2e8`, w300):
  > Você comprometeu 34% da renda em custos fixos este mês — 6 pontos abaixo
  > da sua média.
- Rodapé (13px, `#9a9aa6`, w300): **Baseado em 142 transações de agosto.**

---

## 7. Textos que NÃO são produto

As pranchas contêm textos de autoria que **não** vão para o site:

- Cabeçalhos: "Capital Cycle · Hero → Dashboard", "Storyboard da transição",
  "Recursos nasce por baixo do produto", "Showcase horizontal"
- Rótulos de frame: "FRAME 1", "HERO INICIAL", "scroll 0%" etc.
- Todas as legendas dentro de `<sc-if value="{{ showCaptions }}">`

O `sc-if` é justamente o mecanismo de autoria que liga/desliga as legendas.
Tudo dentro dele é comentário de design.

---

## 8. Divergências registradas — pendentes de decisão sua

| # | Item | Designer | App atual | Recomendação |
|---|---|---|---|---|
| C1 | H1 do Hero | `Sua jornada` / `financeira.` — Playfair 86px, caixa mista, branco, com ponto | `Sua` / `Jornada` / `Financeira` — sans 900, caixa alta, 3ª linha roxa | **Designer** |
| C2 | H2 de Recursos | `Gestão que **evolui** com você.` — só "evolui" em roxo | `Gestão` / `Que evolui com você` — 2ª linha inteira roxa, caixa alta | **Designer** |
| C3 | Tamanho do H2 de Recursos | 88px / 52px / 46px em três telas | — | ver `01-keyframes` §3.5 |
| C4 | CTA de Recursos | "Conhecer os recursos ↓" | "Ver planos →" | **Designer** |
| C5 | Sidebar item 7 | **Mercado** | removido no commit `5750b7f` | **app** — não ressuscitar uma área removida |
| C6 | Sidebar item 3 | "Contas e Caixas" | "Contas" | **[PENDENTE]** — muda o app real se alinharmos pelo Designer |
| C7 | Botão "Sair" na sidebar | ausente | presente | **app** — é função real |
| C8 | Estado dos dados na Dashboard | vazio (R$ 0,00) **mas com gráfico cheio** | — | **[PENDENTE]** — ver abaixo |
| C9 | Nome no topbar | "Kaua Martins" / "Investidor" | vem do perfil logado | usar dado fictício na landing |
| C10 | Eyebrow de Recursos | 12px (F1) vs 11px (demais) | — | 11px no estado pinado |

### Sobre C8

O `CapitalCycleDashboard` mostra **R$ 0,00** em todos os KPIs, "Nenhuma meta
cadastrada ainda" e a faixa "Defina sua renda mensal" — ou seja, o estado de
uma conta recém-criada. Mas o gráfico "Fluxo líquido — últimos 6 meses" tem
seis barras cheias, o que é impossível numa conta zerada.

Uma landing que exibe R$ 0,00 como vitrine do produto vende mal. As opções:

- **(a)** Reproduzir literalmente, inclusive a inconsistência. Fiel, mas fraco
  comercialmente.
- **(b) [recomendado]** Manter a estrutura exata do Designer e preencher com
  dados fictícios coerentes — na linha dos valores que o próprio Designer já
  usa nos cards do trilho (`R$ 12.480`, `R$ 8.200`, `+4,2%`). Zero mudança de
  layout, só de conteúdo.
- **(c)** Reproduzir literalmente e tratar depois.

Preciso da sua decisão: **(b) é uma alteração de copy**, e §1 do briefing me
proíbe de alterar copy por conta própria.
