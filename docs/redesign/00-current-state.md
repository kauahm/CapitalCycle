# 00 — Estado atual (auditoria técnica)

Levantamento do que existe hoje no repositório, em 2026-09-08, na branch
`claude/hero-section-3d-redesign-2y2wgx`. **Fonte da verdade: o código.** Nada
aqui foi inferido de documentação, de commits antigos ou de intenção declarada.

---

## 1. Stack e infraestrutura

| Camada | O que é |
|---|---|
| Build | Vite 5 + `@vitejs/plugin-react` |
| UI | React 18.2, React Router 6.22 |
| Estilo | Tailwind 3.4 (painel) + CSS-in-`<style>` string (landing) |
| Backend | Firebase 10.14 — Auth + Firestore |
| Ícones | `lucide-react` |
| Animação | `framer-motion` 13 |
| Hospedagem | Firebase Hosting, projeto `capitalcycle-tcc`, deploy manual |

Não há CI, não há testes, não há TypeScript. `npm run lint` existe e roda ESLint
com `--max-warnings 0`.

## 2. Mapa de rotas (`src/App.jsx`)

**Públicas (carregadas ansiosamente, no bundle inicial):**

- `/` → `HomePage`
- `/login` → `Login`
- `/cadastro` → `Register`
- `/pagamento` → `Payment`
- `*` → redireciona para `/`

**Privadas (`PrivateRoute` + `DashboardLayout`, todas em `React.lazy`):**

- `/capital/dashboard`, `/transacoes`, `/contas`, `/ciclos`, `/orcamento`,
  `/analise-ia`, `/mercado`, `/perfil`

## 3. Composição da Home

Ordem real de renderização em `src/pages/HomePage.jsx`:

| # | Componente | Arquivo | id | Estações |
|---|---|---|---|---|
| — | `MainNav` (fixa) | `HomePage.jsx` | — | — |
| 1 | `HeroSection` | `components/home/hero/HeroSection.jsx` | `#inicio` | 01 ENTRAR |
| 2 | `ProdutoSection` | `components/home/ProdutoSection.jsx` | `#produto` | 02 ORGANIZAR, 03 ANALISAR |
| 3 | `CapitalAdvisorSection` | `components/home/CapitalAdvisorSection.jsx` | `#capital-advisor` | 04 DECIDIR |
| 4 | `PassagemSection` | `components/home/PassagemSection.jsx` | — | 05 INVESTIR, 06 EVOLUIR |
| 5 | `PlanosSection` | `components/home/PlanosSection.jsx` | `#planos` | 07 ESCOLHER |
| 6 | `RetornoSection` | `components/home/RetornoSection.jsx` | — | fechamento |

**Não existe footer.** Não há links legais, contato, termos, privacidade ou
qualquer informação institucional em nenhum ponto da página.

### Sistema de suporte da Home

- `circuitoScroll.js` (419 linhas) — motor único de revelação. Um listener de
  scroll, um `requestAnimationFrame`, um `ResizeObserver`, um
  `IntersectionObserver` para a página inteira. Seções se registram com trechos
  de path; o scroll controla apenas `stroke-dashoffset`. Respeita
  `prefers-reduced-motion` e degrada para "linha inteira" sem JS.
- `hero/circuitoGeometria.js` (532 linhas) — toda a geometria dos paths, em
  pixels 1:1 com a tela.
- `estacoes.js` — as sete leituras (`unidade` + `valor`), derivadas de
  `demoAccount.js` e `plans.js`. Nenhum número é escrito à mão.
- `demoAccount.js` — conta demo: saldo R$ 14.820 + R$ 9.412 investido, 4 contas,
  sobra R$ 1.236,50, 6 meses de fluxo, meta "Reserva de emergência" 6.400/10.000.
  Os rótulos de mês derivam da data corrente.
- `*Styles.js` (7 arquivos, ~1.160 linhas de CSS) — cada seção injeta o próprio
  CSS via `<style>{CSS}</style>` no corpo do componente.

## 4. Mídia, animação e SVG na Home

- **Imagens:** duas — `logo-topo.png` (81 KB) e `logo-black.png` (38 KB). Nada mais.
- **Vídeo:** nenhum em uso *nesta versão da página*.
  `src/assets/video/ProductCapital.mp4` (1920×1080, 6,0 s, H.264+AAC, 3,4 MB)
  existe no disco, **não é versionado** e não é referenciado por nenhum arquivo
  do código. **Não é código morto:** é o asset aprovado da nova hero
  cinematográfica, ainda não integrado. Ver `04-information-architecture.md` §2
  e `08-media-plan.md` §2.
- **SVG:** seis, todos gerados em runtime a partir de medidas do DOM. Nenhum
  arquivo `.svg` de asset além do favicon.
- **Animação:** duas fontes. (a) o motor do circuito, que anima só
  `stroke-dashoffset`; (b) um `motion.div` do `framer-motion` no `HomePage` que
  faz um fade preto de 500 ms na volta do `/login`. É o único uso de
  `framer-motion` na landing inteira.
- **Sticky / pin:** nenhum. Os comentários do código registram que o pin e o
  crossfade foram deliberadamente removidos numa auditoria anterior.

## 5. Listeners de scroll ativos na Home

Três laços independentes de `requestAnimationFrame`:

1. `useSecaoAtiva` — scroll-spy da navbar (`HomePage.jsx`)
2. `useNavTema` — decide se a navbar ganha chão (`HomePage.jsx`)
3. `circuitoScroll` — motor do traço

Os dois primeiros leem `getBoundingClientRect()` por frame durante a rolagem.

## 6. Responsividade

- Faixa mestra: `--cc-faixa: min(1120px, 100% - goteira*2)`; goteira 20 px, e
  48 px a partir de 768 px.
- O menu da navbar **some abaixo de 980 px** e não há substituto: em telas
  estreitas restam apenas o logo e "Entrar". `MobileNav.jsx` existe, mas é do
  painel, não da landing.
- Toda a geometria é medida por `ResizeObserver` e recalculada; não há
  breakpoints de layout no circuito.

## 7. Código morto encontrado

| Arquivo | Situação |
|---|---|
| `pages/admin/Usuarios.jsx` (540 linhas) | Painel administrativo completo, **sem rota** |
| `components/home/AmbientGlow.jsx` | Não importado por ninguém |
| `components/home/FloatingFigures.jsx` | Não importado por ninguém |
| `components/home/hero/HeroOdometer.jsx` | Não importado por ninguém (não versionado) |
| `components/shared/PrivateRoute.jsx` | Duplicata; `App.jsx` define o seu próprio |
| `components/ui/CurriculoUpload.jsx` | Não importado por ninguém |
| `hooks/useFirestore.js` | Não importado por ninguém |
| `.cc-ambient*` em `index.css` | CSS do `AmbientGlow` morto |


`src/assets/video/ProductCapital.mp4` **não entra nesta tabela**: apesar de não
ser referenciado hoje, é o asset aprovado da hero do redesign. Precisa ser
versionado, não removido.

## 8. Peso do bundle (build de 2026-09-07 em `dist/`)

| Arquivo | Tamanho |
|---|---|
| `firebase-*.js` | **462 KB** |
| `index-*.js` | **429 KB** |
| `index-*.css` | 45 KB |
| `logo-topo.png` | 81 KB |
| `logo-black.png` | 38 KB |
| Rotas do painel (lazy) | 8–19 KB cada |

**Um visitante que abre `/` e nunca faz login baixa ~890 KB de JavaScript.**
Causa: `AuthProvider` está na raiz de `App.jsx` e importa `firebase/auth` +
`firebase/firestore`; `Login`, `Register` e `Payment` são importados
ansiosamente. O `manualChunks` do `vite.config.js` separa o Firebase num chunk
próprio, mas não impede que ele seja carregado na rota pública.

`firebase.json` não define **nenhum header de cache**. Os assets com hash são
servidos com a política padrão do Hosting.

## 9. `index.html`

- `<title>` único e genérico para o app inteiro: "Capital Cycle - Gestão Financeira"
- **Sem** `meta description`, sem Open Graph, sem Twitter Card, sem `canonical`
- Inter carregada do Google Fonts como fonte variável (`wght 100..900`), com
  `preconnect`. Não há `preload` do arquivo da fonte nem fallback local.
- `<body>` traz `class="bg-gray-50 text-gray-900"` — herança da fase anterior,
  hoje sobrescrita pelo `.cch`.

## 10. Divergências de ambiente

`git status` mostra 12 arquivos modificados não commitados, 14 deleções não
commitadas (a pasta `referencias/` inteira e os vídeos antigos do hero) e 5
itens não rastreados. **O working tree não corresponde a nenhum commit.**
Antes de qualquer implementação, isso precisa virar commit — inclusive WIP.

---

# Parte II — Diagnóstico da landing atual

Crítica de diretor de arte, sem consideração por quem escreveu o código.

## 11. O acerto, dito uma vez

O sistema de diagramação é genuinamente bom e **não deve ser jogado fora**:
uma prumada mestra única (`--cc-faixa`) que alinha navbar, headline e a ponta do
traço; um átomo tipográfico (`.cc-most`: código / nome / unidade / valor) usado
sete vezes; todos os números derivados de uma fonte de dados única; um motor de
scroll que anima uma propriedade só e degrada corretamente sem JS e com
`prefers-reduced-motion`. Isso é infraestrutura de identidade, e é preservável.

## 12. O problema central

**A página é um sistema de diagramação excelente e um argumento de produto
inexistente.**

O Capital Cycle nunca aparece. Em toda a landing não há **uma única imagem, um
único vídeo, uma única captura da interface real**. O que a página chama de
"Produto" é um retângulo escuro com dez linhas de HTML reconstruídas à mão.
O visitante rola sete estações, lê quatorze rótulos em caixa alta e sai sem ter
visto o software que está sendo vendido por R$ 64,90.

A referência que o projeto quer traduzir dedica **35 viewports e 28 vídeos** a
mostrar o produto funcionando. Esta página dedica **zero**.

## 13. Cobertura: 6 das 8 funcionalidades não existem na landing

| Funcionalidade | Aparece na Home? |
|---|---|
| Dashboard | Só como painel reconstruído em HTML |
| Transações | **Não** |
| Contas e Caixas | Só como o número "4" |
| Ciclos e Metas | Só como a barra de progresso dentro do painel |
| Orçamento por Categoria | **Não** |
| Capital Advisor | Sim — mas como um campo que não faz nada |
| Mercado | **Não** |
| Perfil / renda mensal | **Não** |

E o inverso também acontece: **"Investir" e "Evoluir" recebem estações inteiras
do circuito e não existem no produto.** Duas das sete etapas da narrativa
apontam para o vazio.

## 14. Falta de hierarquia e problema de ritmo

Sete estações usam **exatamente a mesma tipografia**: `cc-most-cod` 11 px,
`cc-most-nome` 11 px, `cc-most-un` 10 px, `cc-most-val` 18 px (15 px na variante
leve). O maior corpo da página inteira, fora as headlines, é 18 px.

Consequência: **não há clímax**. Nada é maior que nada. A página é uma textura
única do começo ao fim, e um percurso sem picos não é um percurso — é uma lista.
Espaço negativo existe em abundância, mas espaço negativo só funciona como
contraste; sem nada grande para contrastar, ele vira apenas página vazia.

## 15. Redundâncias

- O par unidade/valor se repete sete vezes com a mesma forma.
- O total investido aparece na estação 04 e de novo, como percentual, na 05.
- A meta "Reserva de emergência" aparece no painel do Produto e de novo na
  estação 06.
- A coluna de índice do Hero antecipa quatro estações que serão repetidas
  integralmente adiante — é um sumário de uma página que já é curta.

## 16. Elementos sem função

- **`RetornoSection`**: um traço que desce, atravessa e sobe, sem conteúdo,
  sem texto, sem link. Fecha o circuito para quem entendeu que havia um
  circuito. Custa uma seção inteira de rolagem para entregar uma metáfora que
  já foi entregue seis vezes.
- **`PassagemSection`**: duas palavras e duas marcas. É o lugar onde a página
  admite não ter o que dizer.
- **A variante `.cch-nav--dark`**: ~10 regras de CSS para um estado que o
  próprio comentário do código diz que não é mais acionado.

## 17. Inconsistências

- A navbar oferece **3 links** para uma página de **7 estações**.
- O CTA secundário do Hero diz **"Ver o produto"** e leva a uma seção que não
  mostra o produto.
- `plan.featured` e `plan.badge` continuam em `plans.js` e não são renderizados
  — o dado afirma uma hierarquia que a tela nega.
- O painel do Produto é **escuro** numa página inteiramente clara. É o único
  elemento escuro da landing, e ele é justamente a reconstrução do produto —
  que no app real também é escuro. A intenção é boa, mas fica órfã: um bloco
  escuro isolado lê como card, não como tela.

## 18. Acessibilidade e SEO

- **Abaixo de 980 px o menu simplesmente some** e nada o substitui. Em mobile a
  navegação da landing é: logo e "Entrar".
- Sem `meta description`, sem Open Graph, sem `canonical`. Compartilhar o link
  no WhatsApp não gera preview.
- `<title>` genérico e único para todas as rotas.
- O foco visível existe e está bem resolvido — um dos poucos pontos em que a
  página está acima da média.

## 19. Gargalos de performance

1. **~890 KB de JS na rota pública** (462 KB Firebase + 429 KB index). O
   Firebase é carregado por `AuthProvider`, que está na raiz do `App`, para uma
   página que não precisa de autenticação.
2. **CSS injetado em runtime** por 7 componentes via `<style>{CSS}</style>`.
   Não passa pelo pipeline de CSS do Vite, não é minificado junto, e cada
   `<style>` é reinserido no DOM a cada montagem do componente.
3. **Três laços de `requestAnimationFrame`** durante a rolagem, dois deles
   (`useSecaoAtiva`, `useNavTema`) lendo `getBoundingClientRect()` por frame.
4. **`framer-motion` inteiro** importado no `HomePage` para um único fade preto
   de 500 ms na volta do login.
5. **Sem headers de cache** no `firebase.json`.
6. **Logo em PNG de 81 KB** para ser renderizado a 32 px de altura.
7. Sem `preload` da fonte: a Inter chega tarde e o layout reflui — a ponto de
   quatro componentes precisarem de `document.fonts.ready` para remedir a
   geometria.

## 20. Dependências que o redesign herda

`react`, `react-dom`, `react-router-dom`, `firebase` (necessário no app,
**dispensável na landing**), `framer-motion` (hoje injustificado),
`lucide-react` (**não usado na landing**), `tailwindcss` (não usado na landing —
ela é toda CSS puro em string).
