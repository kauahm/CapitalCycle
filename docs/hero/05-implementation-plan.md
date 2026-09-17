# 05 — Plano de implementação

Branch: `feat/hero-designer` · atualizado 2026-09-16 (bundle do Designer lido)

> **GATE 0 fechado.** O bundle oficial foi lido integralmente e os keyframes,
> a copy e o gap analysis estão documentados. Os gates 1 a 7 passam a ter
> critério de aceite verificável.
>
> **Decisões A, C, C6, D, E, G, H, K, L e N fechadas pelo usuário em
> 2026-09-16** e incorporadas abaixo. A decisão **B permanece bloqueada** por
> falta de fixture aprovada — ver §"Dados do preview".

---

## Arquitetura alvo

```
src/components/landing/
├── LandingNav.jsx              ← navbar, 2 variantes (escura/clara)
├── hero/
│   ├── HeroStage.jsx           ← bloco A: copy + palco
│   └── hero.css
├── product/
│   ├── ProductStage.jsx        ← palco: instância ÚNICA, atravessa A e B
│   ├── DashboardPreview.jsx    ← fiel a CapitalCycleDashboard.dc.html
│   ├── dashboardPreviewData.js ← dados fictícios, zero rede
│   └── product.css
├── recursos/
│   ├── RecursosSection.jsx     ← bloco C: lockup + pin
│   ├── RecursosTrack.jsx       ← trilho 2164×480
│   ├── RecursosPanel.jsx       ← card 520×480 (×4)
│   └── recursos.css
└── tokens.css                  ← Outfit/Playfair/Mono, #5b52f0, escalas
```

**Zero import de `firebase`, `useAuth` ou `react-router` em
`product/`.** Verificável por `grep` e pelo `dist/index.html`.

### Estrutura DOM da narrativa

```
<section class="cc-story">            ← runway A+B
  <div class="cc-pin">                ← pin, 100vh, overflow hidden
    <LandingNav variant="dark|light"/>
    <HeroCopy/>                       ← H1 + subtítulo + CTAs
    <div class="cc-rig">              ← ✱ transladado −903px no bloco B
      <ProductStage>                  ← ✱ escala/rotaciona no bloco A
        <Glow/>                       ← filho, offset −440px
        <DashboardPreview/>
      </ProductStage>
      <RecursosPanel/>                ← irmão imediato, colado por fluxo
    </div>
  </div>
</section>
<section class="cc-showcase">         ← runway C, pin próprio
  ...
</section>
```

Os dois `transform` ficam em **níveis diferentes**: `ProductStage` cuida do
bloco A (escala, rotação, raio), `cc-rig` cuida do bloco B (translação
rígida). Nenhum precisa desfazer o do outro.

`RecursosPanel` é irmão imediato de `ProductStage` **sem offset calculado** —
resolve o R18 (fresta de 0,022px).

---

## GATE 1 — Composição estática do Hero

**Aceite:** Hero F1 parado, indistinguível do frame do Designer em 1440×900.

| # | Item | Referência |
|---|---|---|
| 1.1 | `tokens.css`: Outfit/Playfair/JetBrains Mono no `index.html`; paleta `#5b52f0`, `#07070b`, `#0b0b11` etc. | `03-assets.md` §A.3-A.4 |
| 1.2 | `LandingNav` variante escura, logo textual `CAPITAL`/`CYCLE` | `02-copy-oficial.md` §2.1 |
| 1.3 | H1 `Sua jornada`/`financeira.` Playfair 86px, `top:128` | §3.1 |
| 1.4 | Subtítulo `top:322`, CTAs `top:398` | §3.2-3.3 |
| 1.5 | Glow 1300×760, `top:82`, `opacity:1` | `01-keyframes` §1.3.1 |
| 1.6 | `ProductStage` com `perspective:2400px`, `rotateX(6deg) scale(0.86)`, `top:522`, `radius:19px` | §1.2 |
| 1.7 | CSS sai da string `PAGE_CSS` para arquivos | R9 |

**Decisão A (fechada):** remover `<video>` ×2 + poster, scrim, ruído SVG,
**bloco de stats** ("Fluxo positivo R$ 18k" / "Ciclos ativos 14+") e
**scroll hint** (`MouseIcon` + "Role para baixo") — nenhum deles pertence aos
frames oficiais.

Os arquivos de `src/assets/video/` **não** são apagados ainda (GATE 7).

**Decisão E (fechada): este gate é exclusivamente 1440×900.** Nenhuma media
query, nenhuma unidade fluida. A escala da Dashboard é a do Designer
(`1,2203` no fim), sem cálculo em função da viewport.

---

## GATE 2 — Dashboard preview estática

**Aceite:** `DashboardPreview` idêntica a `CapitalCycleDashboard.dc.html` em
1180×740, isolada, sem motion.

| # | Item |
|---|---|
| 2.1 | Sidebar 214px, `#08080d`, **7 itens — "Mercado" NÃO aparece** (decisão C) |
| 2.2 | Item 3 rotulado **"Contas"**, não "Contas e Caixas" (decisão C6) |
| 2.3 | Ícones: **SVG exato do Designer** onde a geometria faz parte da fidelidade; `lucide-react` só onde for geometricamente equivalente (decisão D) |
| 2.4 | Topbar 66px: "Dashboard" 23px w700 + nome/papel + avatar `#5b52f0` |
| 2.5 | 3 KPIs em grid, altura 132px, cards `#101017` borda `#1e1e28` |
| 2.6 | Gráfico 6 barras 62px, alturas `92/112/132/94/122/150` |
| 2.7 | Cards de metas e renda, moldura tracejada `1px dashed #2a2a36` |
| 2.8 | `dashboardPreviewData.js` — **🔴 BLOQUEADO**, ver §"Dados do preview" |
| 2.9 | **Verificar:** `grep -rn "firebase\|useAuth\|react-router" src/components/landing/product/` → vazio |
| 2.10 | **Verificar:** `dist/index.html` sem `modulepreload` novo |
| 2.11 | **Verificar:** nada de `support.js` em produção (decisão D) — o runtime do Claude Design nunca é copiado |

`src/pages/admin/DashboardFinanceiro.jsx` **não é tocado**.

### Efeito da decisão C na composição

Remover "Mercado" tira **um item de ~40px** da sidebar. A sidebar do Designer
não tem altura travada (`display:flex; flex-direction:column`), então o bloco
de navegação simplesmente encurta — nenhuma outra medida muda. A largura
continua 214px e a Dashboard continua 1180×740.

**[INFERÊNCIA]** O Designer também não tem o botão "Sair" que o app real tem
no rodapé da sidebar. Como a preview não é funcional, mantenho a ausência —
fiel ao Designer e sem prometer uma ação que não existe na landing.

---

## Dados do preview — 🔴 BLOQUEADO (decisão B)

**Diretriz recebida:** preservar layout/estrutura do Designer, mas não
perpetuar o estado contraditório de KPIs zerados + gráfico cheio. Os dados
devem ser coerentes com o produto atual. **Não inventar números.** Procurar
primeiro fixture/demo já aprovada; se não existir, registrar os campos e
parar.

### Busca por fixture aprovada — resultado

```
find src -iname "*mock*" -o -iname "*demo*" -o -iname "*fixture*" \
        -o -iname "*seed*" -o -iname "*sample*"
```

| Candidata | Situação |
|---|---|
| `src/components/home/DashboardMockup.jsx` | **descartada** — código morto: não é importado por nenhum arquivo, e as classes CSS que usa (`.cc-mockup`, `.cc-mock-kpi`, …) não existem em CSS nenhum do projeto. Renderizaria sem estilo. Não é fixture aprovada, é resíduo. |
| `src/components/ui/UpgradeModal.jsx` | falso positivo — só contém a palavra "demo" em outro contexto |
| `src/components/ui/plans.js` | é a fonte de verdade dos **planos**, não de dados financeiros |

**Não existe fixture ou demo aprovada de dados financeiros no projeto.**
Conforme a diretriz, paro aqui e registro os campos.

### Campos necessários para `dashboardPreviewData.js`

Derivados de `CapitalCycleDashboard.dc.html`. A coluna "Designer" mostra o
que está desenhado hoje; **os valores marcados 🔴 são os que preciso de
você**, porque preenchê-los seria inventar.

| # | Campo | Tipo | Designer | Situação |
|---|---|---|---|---|
| 1 | `nome` | string | "Kaua Martins" | ✅ usar o do Designer |
| 2 | `papel` | string | "Investidor" | ✅ usar o do Designer |
| 3 | `inicialAvatar` | char | "K" | ✅ derivado de `nome` |
| 4 | `saudacao` | template | "Olá, {primeiroNome}. Aqui está o resumo do seu capital." | ✅ derivado |
| 5 | `saldoDisponivel` | number | `0` | 🔴 |
| 6 | `sobrouNoMes` | number | `0` | 🔴 |
| 7 | `investido` | number | `0` | 🔴 |
| 8 | `contasAtivas` | int | `0` | 🔴 |
| 9 | `fluxo6Meses[]` | 6 × {label, liquido} | rótulos `Mar…Ago`, alturas `92/112/132/94/122/150` px | 🔴 valores; ⚠️ rótulos, ver abaixo |
| 10 | `mesAtual` | index | último (Ago, em `#4ade80`) | ✅ sempre o último |
| 11 | `metas[]` | array | **vazio** → "Nenhuma meta cadastrada ainda." | 🔴 manter vazio ou popular? |
| 12 | `rendaMensal` | number \| null | **null** → "Defina sua renda mensal…" | 🔴 manter vazio ou definir? |

### As três incoerências a resolver

**(i) KPIs zerados × gráfico cheio.** É a contradição principal. Com
`saldoDisponivel = 0` e `contasAtivas = 0`, seis meses de fluxo líquido
positivo são impossíveis. Ou os KPIs ganham valores, ou o gráfico esvazia.

**(ii) Estados vazios em cascata.** Os campos 11 e 12 estão coerentes **entre
si** e com os KPIs zerados — os três dizem "conta recém-criada". Se os KPIs
forem populados, metas e renda provavelmente também deveriam ser, senão a
incoerência apenas se desloca.

**(iii) Rótulos do gráfico congelam no tempo.** O Designer fixa `Mar…Ago`. A
Dashboard real calcula os últimos 6 meses dinamicamente. Hoje é **setembro de
2026** — uma preview mostrando "Ago" como mês corrente já nasce um mês
atrasada, e piora a cada mês.

> **[DECISÃO PENDENTE B1]** Rótulos fixos como no Designer (fiel, envelhece)
> ou calculados a partir da data atual (sempre correto, diverge do frame)?

### Dados aprovados que existem no próprio bundle

Registro sem aplicar, porque cobrem só 3 dos 8 campos e vêm de **outro
componente** (o card 1 do `RecursosTrack`), não da Dashboard:

| Campo | Valor no `RecursosTrack.dc.html` |
|---|---|
| `SALDO` | R$ 12.480 |
| `INVESTIDO` | R$ 8.200 |
| `FLUXO` | +4,2% |

São oficiais do Designer e internamente coerentes entre si. **Não os apliquei
à Dashboard** — estender um card de vitrine a uma tela inteira exigiria
inventar os cinco campos restantes, o que a diretriz proíbe.

### O que preciso de você

Uma destas três:

- **(a)** Os valores dos campos 🔴, que eu transcrevo;
- **(b)** Autorização para derivar os 5 campos faltantes a partir dos 3
  valores oficiais acima, apresentando-os para aprovação **antes** de
  escrever qualquer arquivo;
- **(c)** Uma fixture existente que eu não encontrei na busca.

**O GATE 2 não fecha sem isso.** Os itens 2.1-2.7 e 2.9-2.11 podem ser
executados antes: a estrutura não depende dos valores.

---

## GATE 3 — ~~Responsividade estática~~ → **ADIADO** (decisão E)

**Decisão E (fechada):** os gates iniciais são **exclusivamente 1440×900**.
Nenhuma responsividade fluida agora. A adaptação para 1366, 1024 e mobile
vira uma **fase posterior**, depois da aprovação pixel-perfect em desktop.

Consequências:

- Os gates 1, 2, 4, 5 e 6 são construídos e validados **só em 1440×900**
- A estratégia de escala do R14 (`scaleFinal = viewportW / 1180`) fica
  **suspensa**: em 1440 a escala é literalmente `1,2203`, o número do Designer
- Abaixo de 1440 o comportamento nesta fase é **indefinido e aceito como tal**
- `100dvh` (R7) e o piso de fallback (R16) migram para a fase posterior

Este gate passa a ser o **GATE 3-FUTURO**, fora do escopo atual. Os riscos
R14 e R16 continuam registrados em `06-riscos-tecnicos.md` — apenas não são
endereçados agora.

> A numeração dos gates seguintes é mantida para não invalidar referências
> cruzadas nos outros documentos.

---

## GATE 4 — Motion do bloco A (Hero → Dashboard)

**Aceite:** os 5 keyframes de `01-keyframes-designer.md` §1.2 batem em
0/25/50/75/100% do progresso, com scrub.

| # | Item |
|---|---|
| 4.1 | Instalar a engine (ver "Engine" abaixo) — **primeira instalação do projeto** |
| 4.2 | Pin do `.cc-pin`, timeline com os 5 keyframes cravados |
| 4.3 | **A mesma instância** de `ProductStage` nos 5 estados — proibido `{n===x && <Dashboard/>}` |
| 4.4 | Escrita direta no estilo via ref; `progress` fora do `useState` (R6) |
| 4.5 | Glow como filho do palco, offset −440px, só `opacity` animada |
| 4.6 | Palco fora de `.cch`, sem `overflow:hidden` de ancestral (R1) |
| 4.7 | Navbar `opacity` 1→0,85→0,4→0,06→0 |
| 4.8 | Copy: H1/subtítulo/CTAs com `opacity` + `translateY` conforme §1.3 |
| 4.9 | Fundo `#07070b` → `#0b0b11` nos últimos ~8% ([PENDENTE F], K1) |
| 4.10 | Testar R13 (nitidez do texto em escala) em máquina real |
| 4.11 | `gsap.context()` / `ScrollTrigger.kill()` no unmount |

**Runway:** a definir empiricamente (R5, K3).

---

## GATE 5 — Motion do bloco B (Dashboard → Recursos)

**Aceite:** os 5 keyframes de §2.1 batem. **Não é crossfade.**

| # | Item |
|---|---|
| 5.1 | Um único `translateY` em `.cc-rig`: `0 → −903px` |
| 5.2 | `scale` da Dashboard **constante** em `scaleFinal` durante todo o bloco |
| 5.3 | `box-shadow: 0 21px 44px rgba(0,0,0,0.32)` entra no início, sai em 100% |
| 5.4 | Navbar clara: `opacity` 0→1 entre ~67% e 100% |
| 5.5 | Fundo `#f3f2f0` atrás do par |
| 5.6 | Sem `clip-path`, sem máscara — o Designer não usa nenhum |
| 5.7 | `ProductStage` **permanece montado** em `−903px` até o pin soltar |

---

## GATE 6 — Showcase horizontal (bloco C)

**Aceite:** os 4 keyframes de §3.1 batem.

| # | Item |
|---|---|
| 6.1 | **Timeline/trigger próprio**, não apêndice do bloco A+B (§16 do briefing) |
| 6.2 | 4 painéis 520×480, `gap:28px`, trilho 2164px |
| 6.3 | Curso: `left 120 → −844` (964px) por `transform`, **nunca** `scrollLeft` (R19) |
| 6.4 | Lockup: 88px centrado (C1) → 46px à esquerda (C2) — **decisão G** |
| 6.5 | Hairline 180px com fill **99px no frame de 50% do trilho** — **decisão H** |
| 6.6 | As 4 demos internas dos cards (§3.4) — o grosso do trabalho |
| 6.7 | `overscroll-behavior-x: none` (R19) |
| 6.8 | Ordem de registro dos triggers + `ScrollTrigger.refresh()` (R15) |

### Decisão G — a passagem B5 → C1 tem dois keyframes, não um

**Decisão G (fechada):** `Dashboard to Recursos` F5 e `Recursos Showcase` F1
são preservados como **dois keyframes consecutivos**. A legenda que afirma
serem idênticos é tratada como **anotação desatualizada**, não como
especificação. Nenhum endpoint aprovado é descartado.

Sequência resultante, agora explícita:

| Keyframe | Estado | Lockup | Trilho |
|---|---|---|---|
| **B5** | `RecursosPanel` | esquerda, H2 **52px**, subtítulo presente | `top:364`, inteiro visível |
| **C1** | Showcase intro | **centralizado**, H2 **88px**, subtítulo + CTA | `top:864`, 36px visíveis |
| **C2** | pin engata | esquerda, H2 **46px**, sem subtítulo | `top:330`, `left:120` |

São três composições distintas, e a narrativa passa pelas três. A transição
B5 → C1 precisa animar: lockup da esquerda para o centro, H2 de 52px para
88px, subtítulo reposicionado, CTA entrando, trilho descendo de 364 para 864.
Depois C1 → C2 reverte parcialmente: H2 de 88px para 46px, volta à esquerda,
subtítulo e CTA saem, trilho sobe para 330.

> **[INFERÊNCIA]** O vaivém tipográfico (52 → 88 → 46) é o que a leitura dos
> arquivos entrega. Não o "corrijo": a decisão G determina preservar os
> endpoints como desenhados. Registro apenas que a curva de tamanho do H2 não
> é monotônica, e isso precisa de atenção no scrub para não parecer um
> solavanco.

### Decisão H — o indicador é fiel, não matemático

**Decisão H (fechada):** o hairline fica **exatamente como desenhado**. No
frame em que o trilho está a 50% do curso (`left:−362`), o fill é **99px de
180px (55%)**. Não corrigir matematicamente.

Implicação: `fillWidth` **não** é `180 × progressoDoTrilho`. É uma curva
própria, com keyframes cravados:

| Progresso do trilho | `left` | fill |
|---|---|---|
| 0% | 120 | **0px** |
| 50% | −362 | **99px** |
| 100% | −844 | **180px** |

Ou seja, o indicador **adianta-se** ao trilho na primeira metade e
desacelera na segunda. É intencional na composição e deve ser reproduzido
como três keyframes, não como fórmula.

---

## GATE 7 — Reduced motion, performance e limpeza

**Aceite:** com `prefers-reduced-motion: reduce` a landing é compreensível
sem movimento; e o bundle inicial melhorou.

| # | Item |
|---|---|
| 7.1 | Fallback: Hero **F1**, D→R **F5**, Showcase **F1** ([PENDENTE I], R20) |
| 7.2 | Apagar `src/assets/video/*` (5,82 MB) |
| 7.3 | `DashboardMockup.jsx` + `MobileNav.jsx` ([PENDENTE J]) |
| 7.4 | ~~Resolver R8~~ — **decisão K: NÃO alterar `App.jsx`/`AuthProvider`** |
| 7.5 | Medir o custo das famílias de fonte (R17) |
| 7.6 | Medir bundle antes/depois e registrar |

**Decisão K (fechada):** `App.jsx` e o `AuthProvider` ficam **intocados**.

Consequência a registrar com honestidade: **o requisito "ZERO Firebase na
landing" (§11 do briefing) continua violado**. O `modulepreload` de 466 KB
permanece no caminho crítico de `/`. O risco R8 deixa de ser endereçado nesta
frente e fica pendente para uma decisão futura, fora do escopo da Hero.

O que a Hero **garante**: `src/components/landing/product/` não acrescenta
nenhum import de Firebase. A verificação 2.9/2.10 continua valendo — a landing
não piora.

---

## Engine de motion — recomendação

Avaliação de §14 do briefing, **agora com os keyframes conhecidos**:

| | A) CSS + IO | B) rAF manual | C) Framer Motion | D) **GSAP + ScrollTrigger** |
|---|---|---|---|---|
| Scrub preciso em 13 keyframes | ✗ | ~ | ~ | ✅ |
| Pin nativo | ✗ | ✗ | `sticky` | ✅ |
| **Dois pins aninhados** (R15) | ✗ | ✗ | ✗ | ✅ |
| Keyframes não-lineares por propriedade (§1.4) | ~ | manual | ~ | ✅ |
| Escrita fora do render do React (R6) | ✅ | ✗ hoje | ✅ (`useMotionValue`) | ✅ |
| `refresh()` em resize/mudança de fonte | ✗ | manual | ✗ | ✅ |
| Bundle | 0 | 0 | já presente | +42 KB gzip |

**Confirmado: GSAP + ScrollTrigger.** O fator decisivo não é o scrub — é o
**pin**. A narrativa tem dois pins independentes com runways próprios, e
`position:sticky` não dá controle sobre início/fim/refresh de forma
confiável quando há três mecanismos concorrendo na mesma página.

O segundo fator é o §1.4: as curvas não são lineares, e cada propriedade tem
a sua. Uma timeline com 5 keyframes cravados por propriedade expressa isso
diretamente.

**Não instalar antes do GATE 4.**

### Decisão L — coexistência, não migração

**Decisão L (fechada):** `CapitalAdvisorSection` e `PlanosSection`
**permanecem em Framer Motion**. As duas bibliotecas coexistem. GSAP fica
**restrito à nova narrativa** que realmente precisa de ScrollTrigger — blocos
A, B e C.

Fronteira operacional:

| Escopo | Engine |
|---|---|
| Hero → Dashboard (bloco A) | GSAP + ScrollTrigger |
| Dashboard → Recursos (bloco B) | GSAP + ScrollTrigger |
| Showcase horizontal (bloco C) | GSAP + ScrollTrigger |
| `CapitalAdvisorSection` | Framer Motion (`useScroll`/`useSpring`) — **inalterado** |
| `PlanosSection` | Framer Motion (`reveal` variants) — **inalterado** |
| Micro-interações futuras da landing | Framer Motion |

**O risco R15 permanece aberto e agora é a principal armadilha do GATE 6.**
Um `pin` do ScrollTrigger insere espaçadores no documento e altera as alturas
a jusante; o `useScroll` do Framer, que mede pela posição do elemento, não é
notificado. `CapitalAdvisorSection` vive **logo abaixo** dos blocos pinados,
então é exatamente o caso afetado.

Mitigações obrigatórias no GATE 6, já que a migração está descartada:

1. Registrar os ScrollTriggers **na ordem do documento**
2. `ScrollTrigger.refresh()` após o layout estabilizar (fontes carregadas)
3. **Testar explicitamente** se o efeito da barra do Capital Advisor continua
   engatando no ponto certo depois dos dois pins
4. Se dessincronizar, a correção fica **do lado do GSAP** (ajustar `end` do
   pin, ou usar `pinSpacing` explícito) — não migrando o Framer

**Custo de bundle aceito:** as duas libs no bundle inicial. Framer Motion já
está lá hoje; GSAP + ScrollTrigger somam ~42 KB gzip **[INFERÊNCIA]**. A
medir no GATE 7.

## Lenis — recomendação

**Não adicionar.** §15 do briefing pede que só entre se resolver um problema
real demonstrável. Nenhum keyframe do Designer depende de inércia ou de
suavização de scroll: todos os 14 frames são posições determinísticas em
função do progresso.

Lenis acrescentaria um scroll virtual que precisa ser sincronizado com o
ScrollTrigger e com o `useScroll` do framer-motion (R15) — ou seja,
**criaria** um problema em vez de resolver um.

Reavaliar só se, no GATE 4, o scrub em trackpad se mostrar visivelmente
"degrau". **[PENDENTE]** — decisão adiada, com critério objetivo.

---

## Decisões — consolidado

### Fechadas em 2026-09-16

| # | Questão | **Decisão** |
|---|---|---|
| A | Stats e scroll hint da Hero | **Remover** — não pertencem aos frames oficiais |
| C | "Mercado" na sidebar da preview | **Não aparece** — foi removido do produto |
| C6 | Rótulo do item 3 | **"Contas"** — rótulo atual do app |
| D | Ícones | **SVG exato do Designer** quando a geometria for parte da fidelidade; Lucide só se geometricamente equivalente. `support.js` **nunca** em produção |
| E | Responsividade | **Só 1440×900 agora.** 1366/1024/mobile viram fase posterior, após aprovação pixel-perfect desktop |
| G | Descontinuidade B5 → C1 | **Preservar os dois como keyframes consecutivos.** A legenda que os iguala é anotação desatualizada. Nenhum endpoint aprovado é descartado |
| H | Hairline | **Exatamente como desenhado** — 55% no frame em que o trilho está a 50%. Não corrigir |
| K | `App.jsx` / `AuthProvider` | **Não alterar ainda.** R8 fica pendente, fora do escopo da Hero |
| L | Engine das seções existentes | **Não migrar.** Framer Motion coexiste; GSAP restrito à nova narrativa |
| N | Versionar `referencia/designer/` | **Sim** — é a fonte visual oficial |

### Ainda abertas

| # | Questão | Bloqueia | Recomendação |
|---|---|---|---|
| **B** | **Dados do preview da Dashboard** | **GATE 2** | 🔴 **não há fixture aprovada no projeto.** Campos registrados na §"Dados do preview". Preciso dos valores, ou de autorização para derivar dos 3 valores oficiais do `RecursosTrack` e submeter à aprovação antes de escrever |
| B1 | Rótulos do gráfico: fixos (`Mar…Ago`) ou calculados? | GATE 2 | calculados — hoje já é setembro/2026 |
| F | Troca de fundo A5→B1: contínua ou instantânea? | GATE 4 | contínua, nos últimos ~8% do bloco A |
| I | Estados do fallback de reduced motion | GATE 7 | Hero F1 / D→R F5 / Showcase F1 |
| J | Apagar `DashboardMockup.jsx` e `MobileNav.jsx`? | GATE 7 | apagar — ambos mortos |
| M | Manter Inter nas telas internas? | GATE 1 | sim — o Designer só cobre a landing |

### Riscos conscientemente não endereçados nesta fase

| Risco | Motivo |
|---|---|
| **R8** — Firebase no caminho crítico (466 KB) | decisão K |
| **R14** — largura de 1180px fixa em viewports ≠ 1440 | decisão E |
| **R16** — ausência de estados responsivos | decisão E |
| **R15** — dois pins + Framer Motion na mesma página | decisão L — **mitigar**, não eliminar; principal armadilha do GATE 6 |

---

## Ordem de commits

Um commit por gate, no mínimo. Gates 1-3 não tocam em nada que já funciona.
Gates 4-6 reescrevem a Home. **Nenhum gate toca no sistema funcional** — essa
é a diferença em relação ao plano anterior.

Nenhum deploy antes do GATE 7 e, quando houver, seguindo §2 do `CLAUDE.md`:
confirmar branch e commit, confirmar push ao GitHub, avisar o que vai ao ar e
esperar OK.
