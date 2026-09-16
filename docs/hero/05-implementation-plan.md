# 05 — Plano de implementação

Branch: `feat/hero-designer` · base `ad37205` · data: 2026-09-16

> **Aviso de estado.** A estrutura de gates abaixo vem do §26 do briefing.
> O **critério de aceite** de cada gate é "idêntico ao Designer" — e o
> Designer não pôde ser lido nesta sessão (`00-designer-source.md`). Portanto
> os gates existem, mas **nenhum deles é executável ainda**: não há o que
> comparar. O que está preenchido são os pré-requisitos, as dependências e as
> decisões que travam cada gate.

---

## GATE 0 — Desbloqueio (pré-requisito de tudo)

| # | Item | Estado |
|---|---|---|
| 0.1 | Autorizar o MCP `claude_design` (`/design-login` em sessão interativa) | **BLOQUEADO** |
| 0.2 | Ler os 6 `.dc.html` + `support.js` integralmente | bloqueado por 0.1 |
| 0.3 | Produzir `01-keyframes-designer.md` (tabela frame a frame) | bloqueado por 0.2 |
| 0.4 | Produzir `02-copy-oficial.md` (copy exata, divergências registradas) | bloqueado por 0.2 |
| 0.5 | Produzir `04-gap-analysis.md` (Designer × app atual) | bloqueado por 0.3 |
| 0.6 | Completar a seção A de `03-assets.md` | bloqueado por 0.2 |
| 0.7 | Confirmar a identidade do objeto persistente (§5) | bloqueado por 0.3 |
| 0.8 | Escolher a engine de motion (§14) com os keyframes na mão | bloqueado por 0.3 |
| 0.9 | Decidir Lenis (§15) | bloqueado por 0.8 |

Nada abaixo começa antes do GATE 0 fechar.

### Decisões suas, independentes do Designer

Estas podem ser respondidas agora e destravam preparo:

| # | Decisão | Impacto |
|---|---|---|
| D1 | Autorizar edição de `src/pages/admin/DashboardFinanceiro.jsx` para extrair uma `DashboardView` pura — ou mandar duplicar o JSX | §8 protege o arquivo; sem resposta, GATE 2 não sai |
| D2 | Autorizar mexer em `App.jsx` para tirar o `AuthProvider` do caminho crítico da landing | é a única forma de atingir o "ZERO Firebase" de §11 |
| D3 | Apagar `DashboardMockup.jsx` e `MobileNav.jsx` (código morto) | limpeza |
| D4 | `CapitalAdvisorSection` e `PlanosSection` migram de `framer-motion` para a nova engine, ou as duas libs coexistem? | bundle + risco R10 |
| D5 | O vídeo do cartão (3,8 MB) sobrevive na Hero nova? | depende do Designer, mas a decisão é sua |

---

## GATE 1 — Composição estática da Hero

**Aceite:** a primeira dobra, parada, indistinguível do keyframe inicial do
`Hero Scroll Storyboard.dc.html` em 1440×900.

Escopo:

- CSS da landing sai da template string `PAGE_CSS` para arquivo próprio (R9)
- Navbar, H1, subtítulo, CTAs com a **copy oficial** (de 0.4)
- Zero motion. Zero scroll. Só a composição.
- `ProductStage` existe como caixa vazia, montado **uma única vez**, irmão
  das camadas — nunca filho de um elemento com `isolation: isolate` (R2)

Bloqueado por: 0.3, 0.4, 0.6.

---

## GATE 2 — Dashboard preview estática

**Aceite:** o conteúdo do `ProductStage` idêntico ao
`CapitalCycleDashboard.dc.html`, sem motion.

Escopo:

- `DashboardView` pura — módulo **sem nenhum import de Firebase/Auth/Router**
  (R8). Verificação obrigatória: `dist/index.html` não pode ganhar nenhum
  `modulepreload` novo por causa dela.
- `dashboardDemo` — dados fixos, sem rede
- `DashboardPreviewShell` — chrome (sidebar/topbar) em `position: absolute`
  relativo ao palco, **nunca `fixed`** (R3); sem `overflow-y-auto` (R4)
- A aplicação real (`/capital/dashboard`) segue pixel-idêntica ao que é hoje

Bloqueado por: 0.2 (para saber o quanto o Designer difere da Dashboard real),
D1.

---

## GATE 3 — Responsividade estática

**Aceite:** composição correta, ainda sem motion, em 1440×900, 1366×768,
1024, 768, 430, 390, 375, 320.

Escopo:

- Se o Designer tiver estados mobile/tablet: são fonte oficial e devem ser
  reproduzidos
- Se não tiver: as adaptações são derivadas e ficam registradas como
  **[INFERÊNCIA]**, para revisão sua
- Trocar `100vh` por `100dvh` onde for altura de viewport (R7)

Bloqueado por: 0.2, GATE 1, GATE 2.

---

## GATE 4 — Motion: Hero → Dashboard

**Aceite:** a sequência de aproximação bate keyframe a keyframe com o
storyboard, com scrub.

Escopo:

- Instalar a engine escolhida em 0.8 (só aqui, não antes)
- Timeline principal, pin do palco
- **A mesma instância** do `ProductStage` atravessa todos os estados —
  proibido `{estado === n && <Dashboard />}`
- Escrita direta no estilo via ref; `progress` **não** volta para `useState`
  (R6)
- Dimensionar o runway pelo número real de keyframes — hoje são 80vh para a
  narrativa inteira (R5)
- Palco fora de `.cch` / `.cch-pin`, para não ser recortado (R1)
- Cleanup de React: `gsap.context()` / `ScrollTrigger.kill()` no unmount

Bloqueado por: 0.3, 0.7, 0.8, GATE 3.

---

## GATE 5 — Motion: Dashboard → Recursos

**Aceite:** reproduz `Dashboard to Recursos.dc.html`. **Não é crossfade.**

Escopo:

- Direção e distância de saída do palco, momento de entrada dos Recursos,
  sobreposição, z-index, background, clipping — todos vindos do Designer
- Definir o estado que marca o **término** do `ProductStage`
- Handoff explícito para a timeline dos Recursos

Bloqueado por: 0.3, GATE 4.

---

## GATE 6 — Showcase horizontal dos Recursos

**Aceite:** reproduz `Recursos Showcase.dc.html` + `RecursosTrack.dc.html` +
`RecursosPanel.dc.html`.

Escopo:

- **Timeline/trigger próprio**, não um apêndice da timeline principal (§16)
- Nº de painéis, largura, espaçamento, ordem, backgrounds, distância
  horizontal — do Designer

Bloqueado por: 0.3, GATE 5.

---

## GATE 7 — Reduced motion + performance

**Aceite:** com `prefers-reduced-motion: reduce`, a landing é compreensível
sem movimento; e o bundle inicial não regrediu.

Escopo:

- Fallback: estados finais estáticos, sem scrub e sem grandes deslocamentos.
  O `.cch-story--static` atual já é um precedente bom — reaproveitar a ideia.
- Otimizar `hero-cartao-poster.png` (2,74 MB → WebP/AVIF)
- Reavaliar `hero-cartao.mp4` (2,50 MB)
- Resolver D2 (Firebase fora do caminho crítico)
- Medir o bundle antes/depois e registrar

Bloqueado por: GATE 6 (a parte de motion); a parte de assets pode adiantar.

---

## Ordem de commits sugerida

Um commit por gate, no mínimo. Gates 1 a 3 não tocam em nada que já
funciona; gates 4 a 6 mexem na Home; o gate 2 é o único que pode encostar no
sistema funcional, e só com D1 respondido.

Nenhum deploy antes do GATE 7 — e, quando houver, seguindo o §2 do
`CLAUDE.md`: confirmar branch e commit, confirmar que foi para o GitHub,
avisar o que vai ao ar e esperar OK.
