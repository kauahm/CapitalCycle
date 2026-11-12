# Relatório da revisão geral — novembro de 2026

Branch: `feat/revisao-geral` (criada a partir de `feat/open-finance` em `acca2c5`).
Backup integral do estado original: `C:\Users\Martins\Documents\CapitalCycle-BACKUP-ORIGINAL-2026-11-11`
(279 arquivos verificados por SHA-256 + `capitalcycle-all-refs.bundle` com as 12 refs do Git).

## 1. Auditoria — o que foi encontrado

### Funcional
- **Lançamento manual impossível sem banco conectado.** Com a aba Contas substituída
  pelo Open Finance, o formulário de transação exigia uma conta e a lista vinha vazia.
- **Saldo de contas importadas alterado pelo app.** Editar/excluir um lançamento do
  Open Finance somava/subtraía no saldo que vem do banco, divergindo do extrato.
- **Dashboard com indicador morto.** "Investido" dependia do tipo de conta
  "Investimentos", que não existe mais: ficava sempre em R$ 0,00. "Saldo disponível"
  somava a fatura do cartão como se fosse dinheiro em caixa. "Maiores despesas"
  desenhava barras contra um limite inventado (`valor × 1,2`).
- Loading do Dashboard só terminava pelo listener de ciclos; um erro de permissão
  deixava o spinner eterno e silencioso.
- Formulários aceitavam valor zero/negativo, datas futuras e metas com alvo 0 (NaN%).
- Rota desconhecida redirecionava para a home sem explicar; erro de renderização
  deixava a tela em branco.
- Página inicial em branco até o Firebase resolver a sessão (sem splash).

### Código e arquitetura
- 14 arquivos mortos herdados de outro projeto (gestão de escolas/diretoras):
  `Usuarios.jsx`, `MobileNav.jsx`, `CurriculoUpload.jsx`, `Modal`, `ConfirmDialog`,
  `Badge`, `EmptyState`, `PrivateRoute` duplicado, `useFirestore`, `calcularStatus`,
  `formatters`, `DashboardMockup`, `vercel.json`, `logo-topo.png`.
- 5,6 MB de vídeos não referenciados em `src/assets/video`.
- `window.alert`/`window.confirm` nativos em Transações, Ciclos e Open Finance.
- Cada tela com seu próprio estado de toast e sua própria cópia de `formatarMoeda`.
- Planos duplicados à mão em `Payment.jsx` (podiam divergir de `plans.js`).
- Modais sem `role="dialog"`, sem Esc, sem foco preso, sem retorno de foco.
- Labels sem `htmlFor`; botões de ícone sem `aria-label`.
- Lint quebrado por arquivos de referência do Designer; 2 avisos de Fast Refresh.
- Nenhum teste automatizado.

### Segurança
- Arquivo `env` (sem ponto) com chaves reais na raiz, não ignorado pelo Git
  (nunca commitado, mas um `git add .` o levaria).
- Regras do Firestore validavam só o dono, não a forma dos dados.
- 17 vulnerabilidades no `npm audit` (1 crítica em `websocket-driver`, via ferramentas).
- Textos legais afirmavam "não há integração bancária" após a entrada do Open Finance.

### Dependências
- Vite 5, Vitest ausente, React Router 6 com flags v7 ligadas, `react-router` com
  CVE de open redirect.

## 2. Correções realizadas

| Área | Correção |
|---|---|
| Transações | **Carteira manual** criada sob demanda (`accounts/carteira_<uid>`): lançar sem banco volta a funcionar. Saldo só é recalculado em contas geridas pelo app; lançamentos do Open Finance só permitem editar descrição e categoria. Validação de valor > 0, data válida e não futura. |
| Dashboard | KPIs reais: Saldo disponível (sem cartão), Entradas e Saídas do mês com tendência vs. mês anterior; fatura de cartão à parte; maiores despesas como fatia do total; loading espera as três coleções e mostra erro quando falha. |
| Ciclos | Validação de alvo > 0 e datas; filtro em andamento/encerrados/todos; metas concluídas destacadas; diálogos acessíveis. |
| Orçamento | Resumo do total orçado × gasto; botão salvar só ativa com mudança; aceita vírgula decimal. |
| Perfil | Diálogos acessíveis, botões e campos do kit; preferência do Advisor. |
| Open Finance | Confirmação de desconexão em diálogo; resumo de saldo e faturas; estados vazios do kit. |
| Pagamento | Planos vindos de `plans.js`; variável não usada removida. |
| Navegação | Página 404; `ErrorBoundary`; Splash de abertura; rota `/capital` leva ao dashboard; menu móvel fecha com Esc e ao trocar de página; link "pular para o conteúdo". |
| Acessibilidade | `Dialog` com `role`, `aria-modal`, `aria-labelledby`, Esc, foco preso e devolvido, folha inferior no celular; `Field` liga rótulo/dica/erro por id; `aria-label` em botões de ícone; `role="switch"`, `role="progressbar"`, `aria-live` nos toasts e no chat; anel de foco visível único. |
| Autofill | Texto autopreenchido branco dentro do painel escuro (antes ficava invisível). |
| Lint/build | `referencia/` e `docs/` fora do lint; `npm run lint` com zero avisos; chunks `react`/`firebase`/`motion` separados no build. |
| Dependências | Vite 7.3, Vitest 5.1, React Router 7.18, plugin-react 5; `npm audit fix`; críticas eliminadas. |
| Segurança | `env` e `env.*` no `.gitignore`; regras do Firestore com validação de forma e leitura segura de documento inexistente; textos legais coerentes com Open Finance e com o contexto do Advisor (versão 1.1). |
| Limpeza | 18 arquivos/assets mortos removidos (−5,7 MB no working tree); README reescrito. |

## 3. Funcionalidades novas

1. **Capital Advisor com contexto financeiro (opt-in).** Interruptor "Usar meus dados"
   na tela do Advisor e em Meu Perfil, gravado em `usuarios.advisorContexto`. Ligado,
   cada pergunta vai com um resumo agregado (entradas/saídas do mês, gastos por
   categoria, saldos por tipo de conta, limites e metas com ritmo necessário) montado
   por `utils/advisorContexto.js`. Lançamentos individuais e descrições nunca saem do
   navegador. Respostas marcadas com "com base nos seus dados"; sugestões de pergunta;
   botão limpar conversa.
2. **Exportação CSV** dos lançamentos filtrados (separador `;`, BOM, vírgula decimal —
   abre direto no Excel em português).
3. **Filtros e totais em Transações**: por mês, por tipo e busca; cards de entradas,
   saídas e resultado do recorte; paginação "mostrar mais"; selo de origem Open Finance.
4. **Primeiros passos** no Dashboard: checklist que guia a conta nova (lançamento,
   banco, renda, meta, limites) e some quando concluído.
5. **Últimos lançamentos** no Dashboard e saudação por período do dia.
6. **Carteira manual** (ver correções) — permite usar o produto inteiro sem Open Finance.
7. **Testes automatizados**: 28 testes Vitest sobre as regras de negócio (metas,
   orçamento, comparativo, datas, moeda, planos, mapeamento Pluggy, CSV, contexto do
   Advisor, carteira manual, parser Markdown anti-XSS).

## 4. Melhorias visuais

A identidade do painel (fundo `#03060d`, violeta `#5b5fef`, Inter, medidas da
referência do Designer) e a landing foram **preservadas** — eram decisões recentes,
documentadas em `docs/hero`, e trocá-las descartaria trabalho aprovado. O que mudou:

- **Kit de componentes único** (`src/components/ui`): Button (6 variantes por
  hierarquia de ação), Dialog, ConfirmDialog, Field/Input/Select/Segmented, Badge,
  ProgressBar, EmptyState, StatCard, PageHeader, Skeleton, Toast. As sete telas do
  painel passaram a usar os mesmos tokens (`textMain`, `textSecondary`, `cc-card`,
  `cc-label`) em vez de misturar `slate-*` com os tokens.
- **Estados de carregamento** por esqueleto com a silhueta da página, sem salto de
  layout; **estados vazios** com ícone, explicação e uma única ação.
- **Toasts** empilháveis, por tipo, com ícone e `aria-live`, para o app inteiro.
- **Movimento discreto**: entrada de página, diálogo, toast e esqueleto em 180–350 ms
  com a curva do projeto; tudo desligado em `prefers-reduced-motion`.
- **Formulários**: rótulos ligados, erros inline (não mais `alert`), campos
  `inputMode="decimal"` aceitando vírgula, botão de ícone com área de toque.
- **Responsivo**: KPIs em 2 colunas no tablet (antes transbordavam a 1024 px), linhas
  de lançamento em duas linhas no celular sem truncar o nome, diálogos como folha
  inferior, ações do cabeçalho esticadas no celular.
- Barra de rolagem e seletores nativos (`color-scheme: dark`) coerentes com o tema.

## 5. Testes executados

### Automatizados
- `npm run lint` — 0 erros, 0 avisos.
- `npm test` — 4 arquivos, 28 testes, todos passando.
- `npm run build` — ok (chunks: react 180 kB, motion 250 kB, firebase 338 kB, app 102 kB).

### Manuais no navegador (servidor local, Firebase de produção)
Conta de teste criada e **excluída ao final** pelo próprio fluxo do Perfil.

| Fluxo | Resultado |
|---|---|
| Landing, Login, 404 | carregam sem erros no console |
| Cadastro → plano → dados → pagamento PIX simulado → conta criada | ok |
| Dashboard vazio com "Primeiros passos" | ok |
| Novo lançamento (saída) com carteira manual criada automaticamente | ok após ajuste (ver limitações) |
| Novo lançamento (entrada), totais, filtro por mês | ok |
| Editar valor, excluir com confirmação, saldo da carteira ajustado | ok |
| Criar meta, registrar aporte, ritmo e previsão calculados | ok |
| Definir limite por categoria | ok |
| Definir renda mensal; interruptor do Advisor no Perfil | ok |
| Dashboard com dados (KPIs, fluxo, meta, orçamento, últimos lançamentos) | ok |
| Open Finance (tela, estado vazio, aviso de sandbox) | ok (sem conectar banco) |
| Viewport 375 px: Dashboard, Transações, menu lateral | ok |
| Exclusão da conta com reautenticação | ok, redirecionou ao login |

Não exercitado ao vivo: envio de pergunta ao Advisor (a chave do Gemini não está
preenchida no `.env` local; a tela degrada corretamente para "indisponível") e
conexão real de banco pelo Pluggy (fluxo não alterado nesta revisão).

## 6. Como executar

Ver `README.md`. Resumo: `npm ci` → copiar `.env.example` para `.env` → `npm run dev`.

## 7. Limitações e pendências

1. **As regras novas do Firestore ainda não foram publicadas.** O app foi testado
   contra as regras antigas (em produção) e funciona com elas; a criação da carteira
   manual foi ajustada para não depender das regras novas. Publicar com
   `npx firebase deploy --only firestore:rules` após o OK (ver `CLAUDE.md`).
2. **Chaves no front-end** (Gemini e Pluggy) — ver `docs/SEGURANCA.md`.
3. **Firebase 10 → 13** não atualizado (vulnerabilidades apenas em código Node).
4. **Pagamento simulado**: qualquer cliente pode trocar o próprio plano; as travas por
   plano são de produto, não de segurança.
5. **Advisor sem streaming**: respostas chegam inteiras; latência medida de 3 a 30 s.
6. O arquivo local `env` com chaves antigas deve ser apagado e as chaves rotacionadas.
7. O `README` da landing (`docs/hero`) descreve a versão do Designer; a landing não
   foi tocada nesta revisão além de continuar funcionando com Vite 7.
