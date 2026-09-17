# 01 — Keyframes do Designer

Fonte: `referencia/designer/` (handoff oficial exportado do Claude Design).
Lido em 2026-09-16. Branch `feat/hero-designer`.

Tudo neste documento é **[DESIGNER]** — transcrito dos `.dc.html`, não dos
PNGs. Marcações **[INFERÊNCIA]** e **[DECISÃO PENDENTE]** onde aplicável.

---

## 0. Estrutura do bundle

Três **pranchas** (storyboards, `design_doc_mode: canvas`) e três
**componentes** (blocos reutilizáveis):

| Arquivo | Papel | Tamanho natural |
|---|---|---|
| `Hero Scroll Storyboard.dc.html` | prancha — 5 frames | frames de 1440×900 |
| `Dashboard to Recursos.dc.html` | prancha — 5 frames | frames de 1440×900 |
| `Recursos Showcase.dc.html` | prancha — 4 frames | frames de 1440×900 |
| `CapitalCycleDashboard.dc.html` | componente | **1180×740** |
| `RecursosPanel.dc.html` | componente | **1440×900** |
| `RecursosTrack.dc.html` | componente | **2164×480** |

### Grafo de imports (`dc-import`)

```
Hero Scroll Storyboard  ──5×──▶ CapitalCycleDashboard (1180×740)

Dashboard to Recursos   ──5×──▶ CapitalCycleDashboard (1180×740)
                        ──5×──▶ RecursosPanel (1440×900)
                                    └──1×──▶ RecursosTrack (2164×480)

Recursos Showcase       ──4×──▶ RecursosTrack (2164×480)
```

Nenhum outro import. Nenhum `x-import` (JS externo). **Nenhum arquivo
referencia `uploads/`** — ver `03-assets.md`.

### Contagem oficial de keyframes

**14 frames desenhados**, **13 estados distintos**:
Hero 5 + Dashboard→Recursos 5 + Showcase 4, sendo que Hero F5 e D→R F1 são o
mesmo momento da narrativa (ver §1.4).

---

## 1. PRANCHA A — Hero Scroll Storyboard

Subtítulo da prancha, verbatim:

> "Cinco momentos da mesma sequência. A dashboard é um único objeto do frame 1
> ao 5 — só mudam posição, escala, perspectiva, raio e a relação com o fundo."

**Isto responde §5 do briefing: o objeto persistente é a própria Dashboard,
confirmado pelo Designer, e vira requisito técnico.**

### 1.1 Estrutura comum a todos os 5 frames

Viewport `1440×900`, `position:relative`, `overflow:hidden`.
Camadas, de baixo para cima na ordem do documento:

| z | Elemento | Posicionamento |
|---|---|---|
| 1 | **Glow** | `absolute; left:50%; top:G; width:1300; height:760; translateX(-50%)` |
| 2 | **Navbar** | `absolute; top:0; left:0; right:0; height:82px; padding:0 48px` |
| 3 | **H1** | `absolute; top:128px; left:0; right:0` — centralizado |
| 4 | **Subtítulo** | `absolute; top:322px; left:0; right:0` — centralizado |
| 5 | **CTAs** | `absolute; top:398px; left:0; right:0` — centralizado, `gap:14px` |
| 6 | **Palco da Dashboard** | `absolute; left:50%; top:T; translateX(-50%); perspective:2400px` |

Não há `z-index` explícito em lugar nenhum — **a ordem de pintura é a ordem
do DOM**. A Dashboard é o último filho, portanto o topo da pilha.

O palco tem duas camadas aninhadas, e a distinção importa:

```html
<!-- externo: posição + perspectiva (NÃO transformado além do centramento) -->
<div style="position:absolute;left:50%;top:T;transform:translateX(-50%);perspective:2400px;">
  <!-- interno: a transformação animada -->
  <div style="transform:rotateX(R) scale(S);transform-origin:50% 0;
              border-radius:B;overflow:hidden;
              border:1px solid rgba(255,255,255,A);box-shadow:SH;">
    <dc-import name="CapitalCycleDashboard" hint-size="1180px,740px">
  </div>
</div>
```

`perspective: 2400px` fica no **pai**, constante nos 5 frames.
`transform-origin: 50% 0` — a Dashboard cresce **para baixo**, ancorada pelo
topo. É por isso que ela "sobe" enquanto cresce sem o centro escapar.

### 1.2 Tabela frame a frame — a Dashboard

| | F1 | F2 | F3 | F4 | F5 |
|---|---|---|---|---|---|
| **Identificador** | HERO INICIAL | INÍCIO DA TRANSIÇÃO | PRODUTO ASSUMINDO A TELA | QUASE FULLSCREEN | DENTRO DO CAPITAL CYCLE |
| **scroll** | 0% | ~25% | ~50% | ~75% | 100% |
| `top` | **522px** | **360px** | **184px** | **54px** | **0px** |
| `top` em vh (÷900) | 58,0% | 40,0% | 20,4% | 6,0% | 0% |
| `rotateX` | **6deg** | **3,6deg** | **2,1deg** | **0,7deg** | — (ausente) |
| `scale` | **0,86** | **0,94** | **1,05** | **1,14** | **1,2203** |
| `perspective` | 2400px | 2400px | 2400px | 2400px | — (ausente) |
| `border-radius` | **19px** | **17px** | **14px** | **9px** | — (0) |
| `border` | `1px rgba(255,255,255,0.09)` | `0.09` | `0.08` | `0.06` | — (ausente) |
| `box-shadow` | `0 50px 130px rgba(0,0,0,0.62)` | `0 46px 120px .58` | `0 40px 100px .5` | `0 28px 70px .42` | — (ausente) |
| `overflow` | hidden | hidden | hidden | hidden | — (ausente) |
| **Fundo do frame** | `#07070b` | `#07070b` | `#07070b` | `#07070b` | **`#0b0b11`** |

**Verificação da escala final:** `1180 × 1,2203 = 1439,95 ≈ 1440`. A legenda
do F5 confirma: *"a largura do frame encontra exatamente 1440px"*. Em F5 a
Dashboard **é** a viewport.

**Mudança de fundo em F5:** `#07070b` → `#0b0b11`. Não é decorativo —
`#0b0b11` é exatamente o `background` do próprio `CapitalCycleDashboard`. O
fundo da página encontra o fundo do produto e a emenda some.

### 1.3 Tabela frame a frame — os demais elementos

| Elemento | prop | F1 | F2 | F3 | F4 | F5 |
|---|---|---|---|---|---|---|
| **Glow** | `top` | 82px | −80px | −256px | −386px | ausente |
| | `opacity` | `g1` = **1,00** | `g2` = **0,72** | `g3` = **0,42** | `g4` = **0,14** | — |
| **Navbar** | `opacity` | **1** | **0,85** | **0,4** | **0,06** | **0** |
| **H1** | `opacity` | **1** | **0,38** | **0,04** | **0** | ausente |
| | `translateY` | 0 | **−10px** | **−22px** | **−28px** | — |
| **Subtítulo** | `opacity` | **1** | **0,26** | **0** | ausente | ausente |
| | `translateY` | 0 | **−12px** | **−24px** | — | — |
| **CTAs** | `opacity` | **1** | **0,18** | **0** | ausente | ausente |
| | `translateY` | 0 | **−8px** | **−16px** | — | — |

> **[INFERÊNCIA]** Elementos marcados "ausente" foram omitidos do markup do
> frame por economia da prancha, não removidos da cena. Em F3 o subtítulo já
> está em `opacity:0`; em F4 ele simplesmente não foi redesenhado. Na
> implementação são **o mesmo nó**, continuando em `opacity: 0`.

### 1.3.1 O glow é filho da Dashboard

Descoberta relevante, derivada das coordenadas:

| Frame | `top` do glow | `top` da Dashboard | diferença |
|---|---|---|---|
| F1 | 82 | 522 | **−440** |
| F2 | −80 | 360 | **−440** |
| F3 | −256 | 184 | **−440** |
| F4 | −386 | 54 | **−440** |

O offset é **constante em −440px**. O glow não tem trajetória própria: ele
acompanha a Dashboard em lockstep, ancorado 440px acima do topo dela. Só a
`opacity` é animada de forma independente (1,00 → 0,72 → 0,42 → 0,14 → 0).

**Consequência técnica:** o glow deve ser um elemento **dentro do
`ProductStage`**, deslocado −440px, e não uma camada de fundo separada com
timeline própria.

Definição do glow (idêntica nos 4 frames em que existe):

```css
width: 1300px; height: 760px;
background: radial-gradient(ellipse 50% 46% at 50% 50%,
              rgba(124,92,255,0.45),
              rgba(124,92,255,0.10) 52%,
              rgba(124,92,255,0) 72%);
```

### 1.3.2 Props declaradas na prancha

```js
props: {
  showCaptions: { editor:"boolean", default:true,  section:"Storyboard" },
  glow:         { editor:"range", default:1, min:0, max:1.6, step:0.05, section:"Motion" }
}
renderVals() {
  const m = this.props.glow ?? 1;
  return { g1: min(1, 1.00*m), g2: min(1, 0.72*m),
           g3: min(1, 0.42*m), g4: min(1, 0.14*m) };
}
```

Os valores `1,00 / 0,72 / 0,42 / 0,14` são a **curva de referência** do glow
(`glow = 1`). `showCaptions` e o multiplicador `glow` são controles de
autoria da prancha — **não** fazem parte do produto.

### 1.4 As curvas não são lineares

Deltas entre frames consecutivos:

| prop | F1→F2 | F2→F3 | F3→F4 | F4→F5 | leitura |
|---|---|---|---|---|---|
| `top` | −162 | −176 | −130 | −54 | acelera e **desacelera no fim** |
| `scale` | +0,08 | +0,11 | +0,09 | +0,08 | quase constante |
| `rotateX` | −2,4 | −1,5 | −1,4 | −0,7 | desacelera |
| `radius` | −2 | −3 | −5 | −9 | **acelera** |
| glow `opacity` | −0,28 | −0,30 | −0,28 | −0,14 | quase constante |
| navbar `opacity` | −0,15 | −0,45 | −0,34 | −0,06 | pico no meio |

Um tween linear entre 0% e 100% **não** reproduz isto. Os cinco valores são o
contrato; a implementação precisa cravar os keyframes em 0/25/50/75/100% do
progresso e deixar a engine interpolar entre eles.

### 1.5 Relação entre frames (leitura das legendas oficiais)

- **F1:** *"Repouso. Dashboard em 0.86, inclinada 6°, topo em 58vh — cortada
  pelo fold. Glow violeta na intensidade de referência."*
  → A Dashboard **já aparece na primeira dobra**, cortada pela borda inferior.
- **F2:** *"A dashboard sobe 162px e vai a 0.94; a copy sai para cima em
  bloco. Navbar ainda intacta — é o último elemento institucional a cair."*
- **F3:** *"Ponto de virada: escala cruza 1.0, a inclinação quase zera e a
  copy sai de cena. O centro óptico desce dos KPIs para o gráfico."*
- **F4:** *"Escala 1.14, inclinação quase nula, raio em 9px. Restam 47px de
  fundo de cada lado — a moldura ainda existe, mas já é só uma linha."*
  → Verificação: `(1440 − 1180×1,14) / 2 = (1440 − 1345,2)/2 = 47,4px` ✓
- **F5:** *"Escala 1.2203 — a largura do frame encontra exatamente 1440px. Sem
  perspectiva, sem raio, sem glow, sem moldura. O scroll da página termina
  aqui."*

---

## 2. PRANCHA B — Dashboard → Recursos

Subtítulo da prancha, verbatim:

> "Sem faixa neutra, sem fade, sem corte. A borda inferior da dashboard e a
> borda superior de Recursos são a mesma linha durante toda a passagem — os
> dois planos sobem juntos e a seção se revela na ordem em que deve ser lida."

### 2.1 A descoberta central: um único bloco rígido

Altura renderizada da Dashboard: `740 × 1,2203 = 903,02 ≈ **903px**`.

| Frame | scroll | Dashboard `top` | RecursosPanel `top` | `dash.top + 903` |
|---|---|---|---|---|
| F1 | 0% | **0** | **903** | 903 ✓ |
| F2 | ~14% | **−113** | **790** | 790 ✓ |
| F3 | ~38% | **−343** | **560** | 560 ✓ |
| F4 | ~67% | **−603** | **300** | 300 ✓ |
| F5 | 100% | **−903** | **0** | 0 ✓ |

**A identidade `panel.top = dash.top + 903` vale nos cinco frames, sem
exceção.** A borda inferior da Dashboard e a borda superior de Recursos são
literalmente a mesma linha.

**Consequência técnica decisiva:** isto **não** são duas animações
sincronizadas. É **uma única translação vertical** de um conjunto rígido de
dois planos empilhados, de `translateY(0)` a `translateY(−903px)`. Um só
`translateY` no contêiner do par resolve os cinco frames.

Isto é o oposto de um crossfade, e responde §18 do briefing: **nada
desaparece por opacidade — a Dashboard sai de cena por deslocamento, e
Recursos ocupa o espaço que ela liberou.**

### 2.2 Demais propriedades

| | F1 | F2 | F3 | F4 | F5 |
|---|---|---|---|---|---|
| **Nome** | DASHBOARD FULLSCREEN | INÍCIO DA SAÍDA | RECURSOS NASCENDO DO PRODUTO | A TRILHA ENTRA | RECURSOS ESTABELECIDA |
| Dashboard `scale` | 1,2203 | 1,2203 | 1,2203 | 1,2203 | 1,2203 |
| Dashboard `box-shadow` | `0 21px 44px rgba(0,0,0,0.32)` | idem | idem | idem | **ausente** |
| Navbar (clara) | ausente | ausente | ausente | **opacity 0** | **opacity 1** |
| Fundo do frame | `#f3f2f0` | `#f3f2f0` | `#f3f2f0` | `#f3f2f0` | `#f3f2f0` |
| RecursosPanel | fora do fold | 113px visíveis | 340px visíveis | 600px visíveis | 900px (inteiro) |

- **`scale` é constante em 1,2203.** A Dashboard não encolhe nem cresce nesta
  prancha. Só translada.
- **A sombra aparece aqui** e não existia no Hero F5. Legenda do F2:
  *"A sombra da dashboard cai sobre a superfície clara — é o que faz ela ler
  como plano superior, e não como tela trocada."* Ela some em F5, quando a
  Dashboard já saiu inteira.
- **A navbar clara** só é desenhada em F4 (opacity 0) e F5 (opacity 1): faz
  fade-in entre ~67% e 100%.
- **z-order (ordem do DOM, sem `z-index`):** RecursosPanel é declarado
  **primeiro** (plano inferior), Dashboard **depois** (plano superior), e a
  navbar **por último** (acima de tudo) nos frames em que existe.
- **Clipping:** apenas o `overflow:hidden` do próprio frame de 1440×900.
  Nenhum `clip-path`, nenhuma máscara, em nenhum frame.

### 2.3 Fronteira Hero F5 ↔ D→R F1

O mesmo momento narrativo, com três diferenças deliberadas:

| | Hero F5 | D→R F1 |
|---|---|---|
| Fundo do frame | `#0b0b11` (escuro) | `#f3f2f0` (off-white) |
| Sombra da Dashboard | ausente | `0 21px 44px rgba(0,0,0,0.32)` |
| Plano inferior | nenhum | RecursosPanel em `top:903` |

**[INFERÊNCIA]** As três diferenças são a mesma decisão: no instante em que
Recursos passa a existir logo abaixo, o fundo atrás do palco deixa de ser o
preto do Hero e passa a ser a superfície clara de Recursos — e a Dashboard
precisa da sombra para continuar lendo como plano superior. Na implementação
isso é uma transição curta no fim do Hero, **não** um corte entre pranchas.
Registrado como **[DECISÃO PENDENTE]** — ver §5.2.

### 2.4 Quando o ProductStage deixa de ser necessário

Em **D→R F5**, `top:−903px`: a Dashboard está inteiramente fora da viewport,
sem sombra. O `ProductStage` pode ser desmontado a partir daqui —
**[INFERÊNCIA]**, porém, o mais seguro é mantê-lo montado em
`translateY(−903px)` até o pin da narrativa soltar, para que a rolagem
reversa reconstrua a cena sem remount.

---

## 3. PRANCHA C — Recursos Showcase

Subtítulo da prancha, verbatim:

> "Dois momentos numa seção só: a introdução editorial e a faixa de quatro
> painéis que atravessa a tela enquanto o scroll continua vertical. Os cards
> são um único objeto — só o deslocamento X muda entre os frames."

**Novamente um objeto persistente:** o `RecursosTrack` é um só, e apenas
`left` muda.

### 3.1 Tabela frame a frame

| | F1 | F2 | F3 | F4 |
|---|---|---|---|---|
| **Nome** | MOMENTO 1 — INTRODUÇÃO | PIN ENGATA — TRILHO EM 0% | TRILHO EM CURSO | CLÍMAX — CAPITAL ADVISOR |
| **Marcador** | antes do pin | trilho 0% | trilho ~55% | trilho 100% · pin solta |
| Fundo | `linear-gradient(180deg,#f6f5f3,#efedea)` | idem | idem | idem |
| Navbar clara | opacity 1 | 1 | 1 | 1 |
| Lockup | **centralizado**, `top:206` | **esquerda**, `left:120; top:142` | idem F2 | idem F2 |
| H2 | **88px**, 2 linhas | **46px**, 1 linha | idem | idem |
| Subtítulo | presente | **ausente** | ausente | ausente |
| CTA | presente | **ausente** | ausente | ausente |
| Hairline | ausente | `left:1140; top:196; w:180`, fill **0px** | fill **99px** | fill **180px** |
| `RecursosTrack` | `left:120; top:864` | `left:120; top:330` | `left:−362; top:330` | `left:−844; top:330` |

### 3.2 Geometria do trilho

- `RecursosTrack`: **2164 × 480**, `display:flex`, `gap:28px`
- **4 painéis** de **520 × 480** cada, `flex:none`
- Verificação: `4×520 + 3×28 = 2080 + 84 = **2164**` ✓
- Percurso horizontal: `left` de **120px** a **−844px** = **964px de curso**
- Verificação da margem final: `−844 + 2164 = 1320 = 1440 − 120` — o trilho
  termina com a mesma margem de 120px com que começou. Simétrico. ✓
- Vertical no estado pinado: `top:330`, altura 480 → base em 810; sobram 90px
  até o pé da viewport.

### 3.3 Divergência encontrada — progresso do hairline

| Frame | posição do trilho | % do curso | fill do hairline | % do hairline |
|---|---|---|---|---|
| F2 | `left:120` | 0,0% | 0px / 180px | 0% |
| F3 | `left:−362` | **50,0%** | 99px / 180px | **55,0%** |
| F4 | `left:−844` | 100,0% | 180px / 180px | 100% |

Em F3 o trilho está em exatamente 50% do curso, mas o hairline marca 55%.
A legenda do frame diz "~55%", sugerindo arredondamento de autoria.

**[DECISÃO PENDENTE]** — o hairline deve ser (a) estritamente proporcional ao
curso do trilho, ou (b) adiantado, como desenhado? Recomendo **(a)**: um
indicador de progresso que mente 5 pontos no meio do percurso é ruído. Preciso
do seu aval para divergir do frame.

### 3.4 Composição de cada painel (`RecursosTrack.dc.html`)

Estrutura comum aos 4:

```css
width:520px; height:480px; flex:none; box-sizing:border-box;
border-radius:20px; overflow:hidden;
display:flex; flex-direction:column; padding:40px 40px 0;
```

| | Cards 1–3 (claros) | Card 4 (escuro) |
|---|---|---|
| `background` | `#fbfaf9` | `#14141a` |
| `border` | `1px solid #e6e4e0` | **nenhuma** |
| `box-shadow` | `0 12px 34px rgba(20,20,26,0.05)` | `0 20px 52px rgba(20,20,26,0.22)` |
| Ícone (44×44, `radius:12px`) | `background:#ecebfd`, stroke `#5b52f0` | `background:#5b52f0`, stroke `#ffffff` |
| Título | 27px, w600, `ls:-0.015em`, `#14141a`, `margin-top:24px` | idem, `#ffffff` |
| Descrição | 16px, `lh:1.6`, `#5a5a63`, w300, `margin-top:14px` | idem, `#9a9aa6` |
| Área de demo | `margin:32px -40px 0; flex:1; border-top:1px solid #e8e6e2; background:#f2f0ed` | `border-top:1px solid #24242c; background:#101016` |

A área de demo usa `margin: 0 -40px` para sangrar até a borda do card,
anulando o `padding:40px` do pai. Conteúdo de cada uma:

1. **Dashboard Financeiro** — 3 mini-KPIs (`SALDO R$ 12.480`,
   `INVESTIDO R$ 8.200`, `FLUXO +4,2%` em `#15803d`) + 6 barras de 58px de
   largura, alturas `36/48/62/41/55/72`, a última em `#5b52f0` e as demais em
   tons de `#d7d4ce`→`#c6c2ba`. `padding:24px 40px`
2. **Transações Inteligentes** — 4 linhas com bolinha de 7px
   (`#15803d` entrada / `#b4b0a8` saída), separadas por
   `border-bottom:1px solid #e4e2de` (a última sem). `padding:14px 40px`
3. **Ciclos de Investimento** — 3 barras de progresso, trilho
   `#e0ddd8` de 6px `radius:999px`, preenchimento `#5b52f0`, percentuais em
   JetBrains Mono 12px `#63636c`. `padding:24px 40px; gap:24px`
4. **Capital Advisor** — eyebrow (bolinha 6px `#5b52f0` +
   `CAPITAL ADVISOR` mono 9,5px `ls:0.18em` `#9a9aa6`) + balão
   `background:#1a1a22; radius:14px; padding:20px 22px` + rodapé 13px
   `#9a9aa6`. `padding:24px 40px; gap:14px`

### 3.5 `RecursosPanel` ≠ Showcase F1 ≠ Showcase F2

`RecursosPanel.dc.html` é o componente importado pela prancha **B**. Ele tem
um estado próprio, que **não coincide** com nenhum frame da prancha C:

| | RecursosPanel | Showcase F1 | Showcase F2 |
|---|---|---|---|
| Fundo | `linear-gradient(180deg,#f6f5f3,#efedea)` | idêntico | idêntico |
| Navbar | **ausente** | presente | presente |
| Lockup | `left:120` (esquerda) | **centralizado** | `left:120` (esquerda) |
| Eyebrow `top` | **132** | (no bloco centralizado) | **142** |
| Eyebrow `font-size` | **11px** | **12px** | **11px** |
| H2 `font-size` | **52px** | **88px** | **46px** |
| H2 quebra | 1 linha | 2 linhas (`<br>`) | 1 linha |
| Subtítulo | **presente**, `top:250`, 17px | presente, 18px, centrado | **ausente** |
| CTA | **ausente** | **presente** | ausente |
| Hairline | ausente | ausente | **presente** |
| `RecursosTrack` `top` | **364** | **864** | **330** |

> **[DECISÃO PENDENTE] — contradição documentada.** A legenda do frame 5 da
> prancha B afirma: *"Este frame é exatamente o estado inicial da prancha
> Recursos Showcase."* O markup diz o contrário: D→R F5 renderiza
> `RecursosPanel` (lockup à esquerda, H2 52px, subtítulo presente, trilho
> inteiramente visível em `top:364`), enquanto Showcase F1 tem lockup
> centralizado, H2 88px e o trilho escondido em `top:864`.
>
> São três estados distintos, não um. **Não escolhi nenhum silenciosamente.**
> Ver §5.1 para as opções.

---

## 4. Ordem oficial da experiência

```
  A1  HERO INICIAL                    scroll 0%     dash top 522, scale 0.86
  A2  INÍCIO DA TRANSIÇÃO             ~25%          dash top 360, scale 0.94
  A3  PRODUTO ASSUMINDO A TELA        ~50%          dash top 184, scale 1.05
  A4  QUASE FULLSCREEN                ~75%          dash top  54, scale 1.14
  A5  DENTRO DO CAPITAL CYCLE         100%          dash top   0, scale 1.2203
  ╠══ fronteira: fundo #07070b → #f3f2f0, sombra entra, Recursos nasce abaixo
  B1  DASHBOARD FULLSCREEN            0%            par em translateY(0)
  B2  INÍCIO DA SAÍDA                 ~14%          translateY(−113)
  B3  RECURSOS NASCENDO DO PRODUTO    ~38%          translateY(−343)
  B4  A TRILHA ENTRA                  ~67%          translateY(−603), navbar clara em 0
  B5  RECURSOS ESTABELECIDA           100%          translateY(−903), navbar clara em 1
  ╠══ [DECISÃO PENDENTE] descontinuidade §3.5
  C1  MOMENTO 1 — INTRODUÇÃO          antes do pin  lockup centrado, trilho em top 864
  C2  PIN ENGATA                      trilho 0%     lockup à esquerda, trilho left 120
  C3  TRILHO EM CURSO                 trilho ~55%   trilho left −362
  C4  CLÍMAX — CAPITAL ADVISOR        trilho 100%   trilho left −844, pin solta
```

## 5. Elementos persistentes

| Objeto | Vive de | até | o que muda |
|---|---|---|---|
| **CapitalCycleDashboard** | A1 | B5 | `top`, `scale`, `rotateX`, `radius`, `border`, `box-shadow` |
| **Glow violeta** | A1 | A4 | `opacity` (posição travada em `dash.top − 440`) |
| **Navbar escura** | A1 | A5 | só `opacity` (1 → 0) |
| **Navbar clara** | B4 | C4 | só `opacity` (0 → 1), depois constante |
| **RecursosPanel** | B1 | C4 | `top` (903 → 0), depois é o palco |
| **RecursosTrack** | C1 | C4 | só `left` (120 → −844) |
| **H1 / subtítulo / CTAs do Hero** | A1 | A3 | `opacity` + `translateY` |

### 5.1 Decisões pendentes de §3.5

Para a passagem B5 → C1, três caminhos:

- **(a)** B5 é o estado real e a prancha C começa nele. O `RecursosPanel`
  transforma o lockup de 52px/esquerda para 88px/centro antes de voltar a
  46px/esquerda em C2. Fiel a B, mas cria um vaivém tipográfico estranho.
- **(b) [recomendado]** C1 é descartado como frame de produto. B5 entrega
  `RecursosPanel` e a narrativa segue direto para C2 (lockup à esquerda,
  46px, trilho em `top:330`). O `RecursosPanel` seria então o estado
  intermediário entre B5 e C2: H2 de 52px→46px, subtítulo saindo, trilho
  subindo de 364 para 330. Contínuo e sem vaivém.
- **(c)** C1 é o estado real e a prancha B deve terminar nele — exigiria
  redesenhar `RecursosPanel`, o que §1 do briefing proíbe.

### 5.2 Outras decisões pendentes

| # | Questão | Recomendação |
|---|---|---|
| K1 | Fronteira A5/B1: a troca de fundo `#07070b`→`#f3f2f0` e a entrada da sombra são um trecho contínuo do scroll ou um instante? | contínuo, nos últimos ~8% do bloco A |
| K2 | Hairline do Showcase: proporcional (50%) ou como desenhado (55%)? | proporcional |
| K3 | Distância de scroll de cada bloco (A, B, C) em vh | a definir no GATE 4 |
| K4 | O que existe **depois** de C4? O Designer termina no clímax; `CapitalAdvisorSection` e `PlanosSection` atuais continuam a página? | manter as duas |
