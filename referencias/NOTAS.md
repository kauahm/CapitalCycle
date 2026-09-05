# Hero 3D — Referências e Conceitos

## 1. Captura de screenshots — BLOQUEADA nesta sessão

A tarefa pedia capturas próprias (Playwright) de apple.com, awwwards.com,
spline.design e dappasol.com em vários pontos de scroll.

O ambiente desta sessão roda atrás de um proxy de egresso com política de
domínios. Todas as tentativas de CONNECT para esses hosts voltaram **403
(policy denial)**:

```
connect_rejected  gateway answered 403 to CONNECT   www.apple.com:443
connect_rejected  gateway answered 403 to CONNECT   www.awwwards.com:443
connect_rejected  gateway answered 403 to CONNECT   spline.design:443
```

O manual do proxy é explícito: **não contornar nem insistir em negação de
política** — apenas reportar o host bloqueado. Portanto não há PNGs nesta
pasta. A pesquisa foi feita por busca na web (que passa por outra rota) e
está registrada abaixo.

## 2. O que foi levantado das referências

### Apple (AirPods Pro / Vision Pro) — técnica e direção
- A animação não é um modelo 3D girando por conta própria: é uma **sequência
  pré-renderizada com o scroll como "playhead"**. Cada posição de scroll mapeia
  para um frame determinístico. O usuário sente que *dirige* a cena.
- Seção **pinada (sticky)** com runway de scroll: o conteúdo fica preso na
  viewport enquanto o progresso 0→1 avança.
- Fundo **claro**, luz suave e difusa, sombra de contato bem resolvida.
  Sofisticação vem de material e luz, não de neon.
- Tipografia enorme, poucas palavras, alto contraste; o objeto nunca cobre a
  headline — eles ocupam zonas distintas da tela.
- Transição entre seções é **contínua** (a cena recua/desfoca e entrega a
  próxima), nunca um corte seco.

### Awwwards — Finance / 3D (Future of Finance, Autonomous Finances, Razorpay Sprint26, Jeton, Stripe)
- Os prêmios em fintech vão para **metáforas abstratas**, não para cartões e
  celulares. "Autonomous Finances" e "Future of Finance" trabalham forma
  abstrata + movimento, não objeto literal.
- Stripe: malha de gradiente WebGL + globo 3D — o 3D carrega *significado*
  (alcance global), não é enfeite.
- Padrão recorrente: um único objeto-herói forte, muito espaço negativo,
  paleta contida, movimento lento e controlado.

### Spline — Finance & Banking
- Tese central: **"conceitos financeiros abstratos viram narrativas 3D"**.
  O valor está em tornar compreensível algo intangível (fluxo, alocação,
  risco), não em ilustrar um produto físico.

### dappasol — scroll-driven 3D
- Conceito do **scroll como playhead**: o scroll não dispara animações, ele
  *é* a linha do tempo. Reversível, determinístico, sem estado preso.

### Pesquisa técnica (R3F / GSAP / performance)
- Recomendação corrente: Three.js **lazy-loaded** (é o item mais pesado do
  bundle), scroll suavizado, e cada biblioteca com um papel só.
- R3F v8 é a linha compatível com React 18 (v9 exige React 19).

## 3. Os três conceitos avaliados

### A. CAPITAL CORE — núcleo de patrimônio
Núcleo 3D central (esfera facetada/vidro) representando o patrimônio, com
ativos e indicadores orbitando. Scroll aproxima a câmera, o núcleo se abre em
camadas.
- **Contra (decisivo):** "esfera brilhante + partículas orbitando" é o clichê
  visual de landing de cripto e de IA. A própria tarefa proíbe parecer
  "crypto scam" e "fintech genérica". Alto risco de parecer template.

### B. CAPITAL FLOW / O CICLO — o ciclo do capital  ← ESCOLHIDO
Uma fita/anel 3D contínuo: o capital percorrendo **entrada → alocação →
crescimento → patrimônio** e voltando ao início como reinvestimento. O scroll
avança o playhead ao longo do ciclo; as fases acendem em sequência e uma
curva de crescimento sobe do plano do anel.
- **A favor:** é o nome do produto virando forma ("Capital Cycle"), e "Ciclos
  de Investimento" já é uma feature real do app. Não é cartão, não é esfera,
  não é dashboard — não se confunde com banco nem com cripto. É 100%
  procedural (TubeGeometry sobre curva), então o peso de asset é zero. E o
  mapeamento scroll→ciclo é narrativo por construção, não decorativo.

### C. FINANCIAL SYSTEM / STRATA — camadas do sistema
Planos empilhados em profundidade (transações → categorias → ciclos →
patrimônio → IA); a câmera atravessa a pilha e as camadas se separam.
- **Contra:** lê como "dashboard SaaS explodido", exatamente o que a tarefa
  pede para evitar. Mais literal e menos emocional que B.

## 4. Por que B venceu

| Critério | A (Core) | B (Ciclo) | C (Strata) |
|---|---|---|---|
| Clareza (é sobre investimento?) | média | **alta** | média |
| Originalidade | baixa (clichê cripto) | **alta** | média |
| Coerência com o produto | média | **altíssima** (é o nome) | alta |
| Potencial de scroll narrativo | médio | **alto** (ciclo tem fases) | alto |
| Performance / peso de asset | médio | **alto** (procedural) | médio |
| Risco de parecer template | **alto** | baixo | médio |

O ciclo é a única das três direções em que o objeto 3D **é** a tese do produto
em vez de uma ilustração ao lado dela.
