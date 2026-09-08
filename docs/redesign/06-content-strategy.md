# 06 — Estratégia de conteúdo

## 1. Voz

**Instrumento, não vendedor.** A página descreve o que a ferramenta faz, com o
mesmo tom de um mostrador: curto, exato, sem adjetivo.

Três testes para qualquer frase:

1. **É verificável em `01-product-truth.md`?** Se não, sai.
2. **Sobra alguma coisa se eu tirar os adjetivos?** Se não sobrar, a frase não
   dizia nada.
3. **Um usuário do produto reconheceria isso na primeira semana?** Se não, é
   promessa, não descrição.

**Vocabulário proibido:** "revolucionário", "poderoso", "inteligente" como
adjetivo solto, "transforme sua vida financeira", "liberdade financeira",
"tudo em um só lugar", "simples e intuitivo", "IA de última geração",
"experiência única".

**Vocabulário da marca, que já existe no código:** entrar, organizar, analisar,
decidir, escolher, ciclo, consolidado, disponível, investido, sobra, fluxo
líquido, aporte, meta, teto, lançamento, conta, categoria.

---

## 2. Correções obrigatórias de copy

Três frases da landing atual contradizem o produto (`01-product-truth.md` §8).

### 2.1 O lead do Hero

**Hoje:**
> Centralize suas contas, acompanhe seus investimentos e veja seu patrimônio em
> um só lugar.

**Problema:** "centralize suas contas" sugere agregação bancária; "acompanhe
seus investimentos" sugere carteira. O produto não faz nenhum dos dois.

**Proposta:**
> Um lugar para registrar, medir e decidir sobre o seu dinheiro.

Três verbos que são literalmente três telas: Transações, Dashboard, Ciclos.

### 2.2 A unidade da estação 01

**Hoje:** `Contas conectadas` (em `estacoes.js`)

**Problema:** "conectada" é o vocabulário do Open Finance. As contas são
cadastradas à mão.

**Proposta:** `Contas cadastradas` — ou simplesmente `Contas`.
É uma palavra em um arquivo. É a correção mais barata e mais importante da
página inteira.

### 2.3 "Sincronização em tempo real" (`plans.js`)

**Problema:** num contexto financeiro, lê-se como sincronização bancária. O que
existe é `onSnapshot` entre dispositivos do mesmo usuário.

**Proposta:** `Seus dados em todos os seus dispositivos, na hora`.
Verdadeiro, específico, e ainda é um benefício.

---

## 3. Copy bloco a bloco

### Hero
```
H1        Todo capital
          tem um ciclo.

Lead      Um lugar para registrar, medir e decidir
          sobre o seu dinheiro.

CTA 1     Criar conta
CTA 2     Ver o produto

Clímax    R$ 24.232,00
Unidade   CONSOLIDADO · CONTA DE DEMONSTRAÇÃO
```

`Todo capital tem um ciclo` é preservado: são cinco palavras, contém as duas
metades do nome da marca, e é a tese da página inteira. Não há motivo para
mexer.

**"CONTA DE DEMONSTRAÇÃO" é obrigatório.** Sem ele, um número grande na primeira
tela sugere que é o dinheiro de alguém real. Princípio P9.

### Entrada no produto
Sem copy, exceto `01/05 ENTRAR`.

### Manifesto
```
Dinheiro não é um saldo.
É um ciclo.

Entra, é organizado, é analisado, vira decisão —
e recomeça no mês seguinte.
O Capital Cycle é o instrumento desse ciclo.
```

### Capítulo 1 — Organizar
```
Eyebrow   02/05 ORGANIZAR
Headline  Tudo o que você tem,
          em um número só.

Corpo     Cadastre contas correntes, poupanças, caixinhas e contas de
          investimento. O que é investimento fica separado do que está
          disponível. Cada lançamento tem categoria, conta e data — e
          editar ou apagar um lançamento reajusta o saldo da conta na
          mesma operação.

Prova     R$ 24.232,00 · CONSOLIDADO · 4 CONTAS
```

### Capítulo 2 — Analisar
```
Eyebrow   03/05 ANALISAR
Headline  O que os seus números
          estão dizendo.

Corpo     O fluxo líquido dos últimos seis meses, o gasto deste mês
          comparado com o do mês passado, as maiores despesas por
          categoria. Informe a sua renda e o painel passa a mostrar
          quanto você economizou e quanto da renda já foi comprometida.

Prova     +R$ 1.236,50 · SOBRA DO MÊS · abr — set
```

### Capítulo 3 — Ciclos e metas
```
Eyebrow   04/05 DECIDIR
Headline  Um objetivo com
          prazo e medida.

Corpo     Meta é um alvo em dinheiro, alimentado por aportes. Orçamento é
          um teto de gasto num período, medido pelos seus lançamentos.
          Um aporte registra a destinação do dinheiro: não cria
          lançamento e não altera o saldo da conta.

Prova     R$ 6.400 de R$ 10.000 · 64% · RESERVA DE EMERGÊNCIA
```

### Capítulo 4 — Capital Advisor
```
Eyebrow   04/05 DECIDIR
Headline  Pergunte sobre os seus
          próprios números.

Corpo     O Capital Advisor conversa sobre os seus lançamentos, contas e
          metas — não sobre finanças em geral. "Quanto eu economizei este
          mês?", "onde estou gastando mais do que deveria?".
          Funciona com uma chave da API Gemini que você configura no
          aplicativo.

Prova     50 / ilimitado · CONSULTAS POR MÊS · JOVEM / ADULTO
```

A última linha do corpo **não é nota de rodapé**. É a diferença entre a página
ser verdadeira e não ser.

### Recursos em detalhe
Sete pares de título curto + uma linha. Ver `05-storyboard-scroll.md`.

### Dados / confiança
```
Headline  Sobre os seus dados.

Corpo     A autenticação é do Firebase, do Google. Cada consulta ao banco
          é filtrada pelo seu identificador de usuário — você alcança
          apenas os seus próprios dados. Nenhuma senha de banco é pedida
          em momento nenhum: as contas são cadastradas por você.
```

Sem "criptografia de nível militar", sem "seus dados estão seguros". Só o que é
verdade e verificável.

### Planos
```
Eyebrow   05/05 ESCOLHER
Headline  Escolha seu ritmo financeiro.
Lead      Do controle prático ao avançado com IA — dois planos para cada
          etapa da sua jornada de capital.
```

Preservados como estão. A qualificação de limites (`qualificacaoDoPlano`)
continua sendo lida de `plans.js`, e o Mercado ganha linha explícita no plano
Adulto.

### Footer
```
Todo capital tem um ciclo.
[ Criar conta ]  ·  Entrar

Início · Organizar · Analisar · Decidir · Escolher
Termos de uso · Privacidade · Contato
Capital Cycle · 2026
```

**Termos e Privacidade precisam existir de fato.** Um link morto num footer de
produto financeiro é pior que a ausência dele.

---

## 4. Regra dos números

Todo número visível na página **deriva de `demoAccount.js` ou de `plans.js`**,
via `estacoes.js`. Nenhum literal novo em componente. A disciplina atual é
excelente e é ampliada, não relaxada.

Nova constante necessária em `estacoes.js`:

```
TOTAL_ESTACOES: 7 → 5
```

`codigo()` já deriva o total, então `01/05 … 05/05` sai sozinho.

---

## 5. Metadados (`index.html`)

Hoje: um `<title>` genérico, e nada mais.

```html
<title>Capital Cycle — o ciclo do seu dinheiro, medido</title>
<meta name="description" content="Registre contas e lançamentos, veja o fluxo
  dos últimos seis meses, defina metas com aportes e pergunte sobre os seus
  próprios números. A partir de R$ 44,90 por ano.">
<meta property="og:title" content="Capital Cycle">
<meta property="og:description" content="Todo capital tem um ciclo.">
<meta property="og:image" content="/og.png">
<meta property="og:url" content="https://capitalcycle-tcc.web.app">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
<link rel="canonical" href="https://capitalcycle-tcc.web.app">
```

**Justificativa:** hoje, compartilhar o link no WhatsApp — o canal mais provável
de distribuição de um produto brasileiro de entrada — não gera nenhum preview.
É a correção de maior retorno por menor esforço do redesign inteiro.
