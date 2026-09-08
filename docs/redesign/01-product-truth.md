# 01 — A verdade do produto

Este documento é a **única fonte autorizada** para qualquer afirmação que a nova
landing fizer. Tudo aqui foi lido na implementação. Onde o produto não faz algo,
está escrito que não faz.

---

## 1. O que é o Capital Cycle

Um **aplicativo web de gestão financeira pessoal**, em português do Brasil,
vendido por assinatura anual em dois planos. O usuário cadastra as próprias
contas e lançamentos; o sistema consolida, compara com o mês anterior, mede
metas e orçamentos, e oferece um assistente de IA que conversa sobre esses
números.

Não é banco, não é corretora, não é agregador bancário. **Não há Open Finance,
não há integração com instituição financeira nenhuma.** Todo dado entra à mão.

## 2. Qual problema resolve

A pessoa tem dinheiro em mais de um lugar (conta corrente, poupança, caixinha,
investimento) e não tem uma leitura única do próprio patrimônio. Sabe quanto
ganha, não sabe quanto sobra. Tem objetivos ("juntar uma reserva") sem um
instrumento que meça o avanço até eles.

O Capital Cycle responde a três perguntas, nesta ordem, e é assim que o produto
está construído:

1. **Quanto eu tenho?** → contas consolidadas em disponível + investido
2. **Para onde está indo?** → transações, categorias, fluxo líquido de 6 meses,
   comparação com o mês anterior, % da renda comprometida
3. **Estou chegando onde eu quis chegar?** → metas com aportes, orçamentos com
   teto, limites por categoria

O Capital Advisor é uma quarta camada: interpretar as três primeiras em
linguagem natural.

## 3. Público e contexto de uso

Deduzido do produto, não suposto:

- **Os planos se chamam "Jovem" e "Adulto"** e custam R$ 44,90 e R$ 64,90 **por
  ano**. É um preço de produto de entrada, para pessoa física brasileira. Não é
  ferramenta corporativa.
- O campo **`renda_mensal`** no perfil, e as métricas derivadas dele ("economia
  do mês", "% da renda comprometida"), indicam alguém assalariado que planeja
  dentro de uma renda previsível.
- As categorias de saída, os "caixas" e a meta de exemplo ("Reserva de
  emergência") apontam para controle doméstico, não para gestão de carteira.
- O plano Adulto inclui **Mercado com B3, cripto e câmbio** — a pessoa acompanha
  ativos, mas o produto não os gerencia.
- Uso em desktop e mobile: o painel tem `Sidebar` + `MobileNav`.

## 4. Funcionalidades que existem

### 4.1 Dashboard Financeiro — `/capital/dashboard` (real)

Quatro assinaturas `onSnapshot` em tempo real: `accounts`, `transactions`,
`ciclos` e `orcamentosPorCategoria/{uid}`. Tudo calculado no cliente a partir de
dados reais do usuário. Entrega:

- **Saldo disponível** (soma das contas cujo `tipo !== 'Investimentos'`)
- **Total investido** (soma das contas cujo `tipo === 'Investimentos'`)
- **Contas ativas** (contagem)
- **Sobra/falta do mês** (entradas − saídas do mês corrente), com sinal e cor
- **Fluxo líquido dos últimos 6 meses** — gráfico de barras com dado real
- **Metas em andamento** (até 2), com progresso vindo dos aportes
- **Renda do mês**: renda mensal, economia do mês, % da renda comprometida
  (só aparece se o usuário preencheu a renda no perfil)
- **Comparação com o mês anterior**: variação % de gasto e de economia
- **Maiores despesas no mês** (top 3 por categoria)
- **Orçamento por categoria**: progresso contra os limites
- Estados vazios com CTA para a tela que resolve a lacuna

### 4.2 Transações — `/capital/transacoes` (real, e é a peça mais séria)

CRUD completo com **`runTransaction` do Firestore**: criar, editar e excluir um
lançamento **ajusta o saldo da conta de forma atômica**. Na edição, se o usuário
troca a transação de conta, o efeito antigo é revertido na conta antiga e
aplicado na nova, na mesma transação. Excluir reverte o saldo antes de apagar.

Campos: descrição, valor, tipo (entrada/saída), categoria, conta, data.
Busca textual simples. Categorias em fonte única (`utils/categorias.js`,
compartilhada com Orçamento por Categoria).

Trava de plano: cota mensal de lançamentos.

### 4.3 Contas e Caixas — `/capital/contas` (real)

CRUD de contas: nome, banco, tipo, saldo. O **tipo `Investimentos` é o que
separa "disponível" de "investido"** em toda a aplicação. Trava de plano: número
de contas.

### 4.4 Ciclos e Metas — `/capital/ciclos` (real, dois comportamentos distintos)

- **Meta**: um alvo em dinheiro com prazo. O progresso vem **exclusivamente de
  aportes** registrados na subcoleção `ciclos/{id}/aportes`. Um aporte **nunca
  cria transação e nunca mexe no saldo de conta** — é um registro de destinação.
- **Orçamento**: um teto de gasto num período. O progresso é a soma das saídas
  no intervalo, lida das transações. Estoura visualmente quando passa de 100 %.

Trava de plano: ciclos ativos simultâneos.

### 4.5 Orçamento por Categoria — `/capital/orcamento` (real)

Limite mensal por categoria de saída, salvo em
`orcamentosPorCategoria/{uid}.limites`. Comparado com os gastos do mês corrente.
Alimenta o bloco correspondente no Dashboard. Sem trava de plano.

### 4.6 Capital Advisor — `/capital/analise-ia` (real, **com ressalva grande**)

Chat contra a **API Gemini do Google**
(`generativelanguage.googleapis.com/v1beta/models/{model}:generateContent`).
O histórico é montado no formato Gemini com um system prompt injetado.

**A ressalva:** a chave de API **não é do produto, é do usuário**. Ou vem de um
`.env` no build (`VITE_GEMINI_API_KEY`), ou o próprio usuário cola a chave numa
tela de configuração dentro do app. Sem chave, o recurso não funciona: a tela
abre no modo de configuração e o envio responde que é preciso configurar a chave
primeiro.

A cota de consultas é contada e persistida em `usuarios/{uid}.iaUso.{YYYY-MM}`.

**Consequência para a landing:** não se pode dizer "Capital Advisor incluído" ou
"IA que analisa seus dados" sem qualificar. Ver §8.

### 4.7 Mercado — `/capital/mercado` (real, **com a mesma ressalva**)

- **Ações B3** via `brapi.dev` — **exige token, fornecido pelo usuário**
- **Cripto** via CoinGecko — funciona sem chave
- **Câmbio**
- Watchlist editável, busca por ticker

Exclusivo do plano Adulto (`temMercado`).

### 4.8 Meu Perfil — `/capital/perfil` (real)

Dados da conta, data de criação, plano atual e link para trocar de plano,
**renda mensal** editável (o campo que destrava metade do Dashboard) e troca de
senha com reautenticação Firebase (indisponível para contas Google).

## 5. Fluxos existentes

**Aquisição:** `/` → `/cadastro` (passo 1: escolher plano; passo 2: dados) →
`/pagamento` → cria o usuário no Firebase Auth, grava o perfil e o registro de
pagamento → `/capital/dashboard`.
Escolher um plano na Home passa o `id` no `state` da rota e o `Register` já abre
no passo 2.

**Entrada:** `/login` com e-mail/senha ou Google, com persistência selecionável.
`PrivateRoute` protege `/capital/*`.

**Troca de plano:** Perfil → `/cadastro` em modo troca → `/pagamento` → volta ao
Perfil.

**Uso diário:** cadastrar contas → lançar transações → o Dashboard consolida →
criar meta ou orçamento → registrar aportes → perguntar ao Advisor.

## 6. Dados reais e dados de demonstração

- **No produto:** 100 % dados reais do usuário no Firestore, por `uid`.
  Coleções: `accounts`, `transactions`, `ciclos` (+ subcoleção `aportes`),
  `orcamentosPorCategoria`, `usuarios`.
- **Na landing:** `demoAccount.js` é a única fonte, e `estacoes.js` deriva todas
  as sete leituras dela e de `plans.js`. Nenhum número da landing é escrito à
  mão, e os rótulos de mês derivam da data corrente para a página não
  envelhecer. **Essa disciplina é uma das melhores decisões do projeto e deve
  ser mantida integralmente no redesign.**

## 7. O que é apresentação, não produto

Esta seção existe para impedir que o redesign venda o que não há.

| Item | Situação real |
|---|---|
| **Pagamento** | **Simulado.** O PIX gera um payload BR Code e um botão "Já paguei" que simula a verificação; o cartão simula processamento. Não há PSP, não há cobrança, não há recorrência. |
| **Capital Advisor** | Real, mas **exige chave Gemini do próprio usuário**. Sem chave, não funciona. |
| **Mercado (B3)** | Real, mas **exige token brapi do próprio usuário**. Cripto funciona sem chave. |
| **"Sincronização em tempo real"** (`plans.js`) | É o `onSnapshot` do Firestore entre dispositivos do mesmo usuário. **Não é sincronização bancária.** |
| **"Investir" (estação 05)** | **Não existe tela.** O produto só sabe marcar uma conta como do tipo `Investimentos`. Não há carteira, ativo, aporte em ativo, rentabilidade ou posição. |
| **"Evoluir" (estação 06)** | **Não existe tela.** É consequência de metas e do comparativo mensal, não um recurso. |
| **Campo do Advisor na Home** | O `onSubmit` chama `preventDefault()` e nada mais. É um formulário morto. |
| **Painel do Produto na Home** | Uma **reconstrução em HTML** de parte do Dashboard, não uma captura do produto. |
| **`Usuarios.jsx`** | Painel administrativo completo, **sem rota**. Não existe para o usuário. |

## 8. Riscos de copy que o redesign precisa corrigir

Três frases da landing atual **contradizem o produto**:

1. **"Centralize suas contas"** (lead do Hero) — sugere agregação bancária. As
   contas são cadastradas manualmente.
2. **"Contas conectadas"** (unidade da estação 01, `estacoes.js`) — "conectada"
   é o vocabulário do Open Finance. O produto **cadastra** contas.
3. **"acompanhe seus investimentos"** (lead do Hero) — o produto não acompanha
   investimentos; ele soma o saldo de contas marcadas como investimento.

Nenhuma delas é mentira deliberada, e todas são corrigíveis sem perder força.
Ver `06-content-strategy.md`.

## 9. Os planos, como estão em `plans.js`

| | Jovem — R$ 44,90/ano | Adulto — R$ 64,90/ano |
|---|---|---|
| Contas | 3 | ilimitadas |
| Lançamentos | 100/mês | ilimitados |
| Ciclos ativos | 2 | ilimitados |
| Capital Advisor | 50 consultas/mês | ilimitado |
| Mercado | ✗ | ✓ |

As travas são predicados reais (`canAddConta`, `canAddTransacao`,
`canAddCiclo`, `canConsultarIA`, `temMercado`) consultados pelas telas, com um
`UpgradeModal` e mensagens em `GATES`. **A diferença entre os planos é
verdadeira e verificável no código** — e por isso pode ser o argumento da seção
de planos, sem selo de "mais popular".
