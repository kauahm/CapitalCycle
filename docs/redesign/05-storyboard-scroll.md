# 05 — Storyboard de scroll

Mapa quadro a quadro da página, em unidades de viewport (`vp`).
Total: **~18 vp**. Referência: 35,3 vp (justificativa da redução em
`02-apple-vision-pro-analysis.md` §12.1).

Convenção: `[claro]` = `#f4f5f7`, `[escuro]` = `#070b14`.
"pino" = `position: sticky` **dentro** do capítulo, nunca no nível da seção.

---

## 0,0 → 1,8 vp · HERO CINEMATOGRÁFICA `[claro]` · 01/05 ENTRAR

O bloco tem 1,8 vp: **1,0 vp de palco pinado** (onde o vídeo vive, sempre
cobrindo a viewport) e 0,8 vp de pista, que é o que o scroll consome para
escrubar o push-in.

### Quadro A — 0,0 vp · repouso · vídeo em 0,0 s

```
┌────────────────────────────────────────────────────────────┐
│ ◐ logo                       Início  Advisor  Planos  Entrar│
│                                                            │
│                        ╭─────╮                    01/05    │
│  Todo capital          │ ▮▮▮ │  ← chapéu roxo     ENTRAR   │
│  tem um ciclo.        ╭┴─────┴╮                            │
│                       │       │                   02/05    │
│  Um lugar para        │ pessoa│                   ORGANIZAR│
│  registrar, medir e   │  ▭▭▭  │ ← tablet junto    03/05    │
│  decidir sobre o      │       │    ao corpo       ANALISAR │
│  seu dinheiro.        ╰───────╯                   04/05    │
│                                                   DECIDIR  │
│  [ Criar conta ]  Ver o produto                   05/05    │
│  ──────────────────────────────                   ESCOLHER │
└──┼─────────────────────────────────────────────────────────┘
   └─ o traço nasce da base do bloco de texto
```

**Movimento:** o vídeo roda em reprodução normal de 0,0 s a ~3,0 s, sem depender
de scroll. É o único movimento autônomo da página, e existe porque a
apresentação é um **gesto humano** — um gesto não pode ficar parado esperando o
visitante rolar.

**O texto não tem véu, gradiente nem sombra por trás.** Ele vive sobre a área
lisa e clara do fundo do vídeo. Se faltar contraste em alguma largura, move-se o
texto — não se escurece o vídeo (`03-design-principles.md` §P1: um véu não
apresenta, não demonstra, não explica e não reforça).

**Nota sobre o clímax numérico:** ele **saiu daqui** e foi para o capítulo
Analisar. O vídeo já é o elemento grande desta viewport; um valor de 110 px ao
lado dele criaria dois clímaxes que se anulam.

### Quadro B — ~0,6 vp · o tablet é oferecido · vídeo em ~3,0 s

```
                        ╭─────╮
  Todo capital          │ ▮▮▮ │                    01/05
  tem um ciclo.        ╭┴─────┴╮                   ENTRAR
                       │       │
  Um lugar para     ┌──┴───────┴──┐
  registrar...      │ ▓ DASHBOARD │  ← o tablet, de frente,
                    │ ▓  R$ ...   │    ocupando ~45% da largura
  [ Criar conta ]   └─────────────┘
```

A partir daqui **o scroll assume**: o vídeo passa a ser escrubado quadro a
quadro, 1:1 com a posição do documento.

### Quadro C — ~1,4 vp · push-in · vídeo em ~4,4 s

```
        ┌───────────────────────────────────────────┐
        │ ▓▓▓  D A S H B O A R D                    │
        │ ▓▓▓  R$ 3.200,00                          │  ← o tablet
        │ ▓▓▓                                       │    domina o quadro
        └───────────────────────────────────────────┘
```

A headline, o lead e os CTAs já saíram em opacidade. **Este é o ponto de
handoff.** Ver `04-information-architecture.md` §2.3 e §2.4: a partir daqui o
texto renderizado dentro do vídeo ficaria legível, e ele contém erros
("CANTAL CYCLE", "Contas e Calsas", números que não batem com `demoAccount.js`).
O vídeo é substituído pela interface real **antes** disso, não depois.

---

## 1,8 → 3,0 vp · ENTRADA NA DASHBOARD REAL `[escuro]` · pino de 1,0 vp

```
1,8 → 1,9    MATCH CUT
             O <video> é trocado pela captura real da dashboard, no
             mesmo enquadramento, na mesma cor de fundo, na mesma
             posição de tela. A moldura do tablet e as mãos saem.
             A única diferença perceptível é que o texto fica nítido.

1,9 → 2,7    ┌──────────────────────────────────────────────┐
     PINO    │                                              │
             │        DASHBOARD REAL — 0,95 vh              │
             │        full-bleed, sem moldura               │
             │        os números de demoAccount.js          │
             │                                              │
             │  01/05 ENTRAR                                │
             └──────────────────────────────────────────────┘

2,7 → 3,0    a tela sai por cima; a faixa clara volta
```

**Sem headline. Sem parágrafo. Sem CTA.** É o único bloco da página que não
explica nada — ele entrega.

**Justificativa:** o *match cut* é o desfecho do push-in. O vídeo apresenta; a
interface real assume. A emenda é o argumento: *isto que você viu na mão dele é
isto aqui, de verdade.* **Comunica dados financeiros** — literalmente, a tela
deles.

**Calibração obrigatória na implementação:** o enquadramento da captura precisa
coincidir com o do último frame exibido, dentro de ~2 % de escala e posição. Um
salto perceptível aqui destrói o efeito e chama atenção para a emenda — que é
exatamente o que um *match cut* existe para esconder.

---

## 3,0 → 3,8 vp · MANIFESTO `[claro]`

```
                    Dinheiro não é um saldo.
                    É um ciclo.

              Entra, é organizado, é analisado,
              vira decisão — e recomeça no mês seguinte.
              O Capital Cycle é o instrumento desse ciclo.
```

Centrado. Sem mídia. Sem traço. Muito espaço acima e abaixo.

**Justificativa:** o conceito da marca é dito por extenso **uma vez só** na
página inteira, e depois de a pessoa já ter visto a tela. Dito antes, seria
promessa; dito aqui, é a explicação do que ela acabou de ver.

---

## 3,8 → 6,2 vp · CAPÍTULO 1 · ORGANIZAR `[claro→escuro→claro]` · 02/05

O compasso de todos os quatro capítulos, definido uma vez:

```
+0,0 → 0,5   HEADLINE-LOCKUP  [claro]
             02/05 ORGANIZAR                     ← 11px, caixa alta
             Tudo o que você tem,                ← 60px
             em um número só.

+0,5 → 1,5   PALCO PINADO  [escuro]              ← 1,0 vp preso
             ┌────────────────────────────────┐
             │  Contas e Caixas + Transações   │
             │  0,95 vh, full-bleed            │
             └────────────────────────────────┘

+1,5 → 2,0   CORPO  [claro]
             Um parágrafo. Coluna de 640px, à direita do traço.

+2,0 → 2,4   PROVA
             R$ 24.232,00        ← o dado, em escala
             CONSOLIDADO · 4 CONTAS
```

**Conteúdo:** contas de qualquer tipo, contas de investimento separadas do
disponível, lançamento com categoria/conta/data, e o fato de que **editar ou
apagar um lançamento reajusta o saldo da conta atomicamente**.

**Movimento:** o traço desce por trás do palco; a mídia entra com opacidade
(150 ms) e fica parada. Nada mais.

---

## 6,2 → 8,6 vp · CAPÍTULO 2 · ANALISAR `[claro→escuro→claro]` · 03/05

Mesmo compasso, mesma altura.

```
03/05 ANALISAR
O que os seus números
estão dizendo.

[palco escuro]  Dashboard: fluxo líquido de 6 meses,
                comparação com o mês anterior,
                maiores despesas, % da renda comprometida

[corpo]         Um parágrafo

[prova]         +R$ 1.236,50        ← clímax do capítulo
                SOBRA DO MÊS · abr — set
```

**Justificativa:** é o capítulo com mais funcionalidade real por trás (todo o
`DashboardFinanceiro.jsx`) e o único que responde à pergunta "para onde está
indo?". O valor de clímax é o mesmo `SOBRA_DO_MES` que já vive em
`demoAccount.js`.

---

## 8,6 → 11,0 vp · CAPÍTULO 3 · DECIDIR — CICLOS, METAS E ORÇAMENTO `[claro→escuro→claro]` · 04/05

```
04/05 DECIDIR
Um objetivo com
prazo e medida.

[palco escuro]  Ciclos e Metas: uma meta com barra de progresso,
                um orçamento com teto

[corpo]         Meta é um alvo em dinheiro alimentado por aportes.
                Orçamento é um teto de gasto num período.
                Um aporte registra a destinação do dinheiro —
                não cria lançamento e não mexe no saldo da conta.

[prova]         R$ 6.400 de R$ 10.000        ← 64%
                RESERVA DE EMERGÊNCIA
```

**Justificativa do detalhe do aporte:** é uma decisão de produto real,
verificável em `CiclosInvestimento.jsx`, e ninguém no mercado explica isso.
*Comunica planejamento* de forma mais convincente que qualquer adjetivo.

---

## 11,0 → 13,4 vp · CAPÍTULO 4 · CAPITAL ADVISOR `[claro→escuro→claro]` · 04/05

```
04/05 DECIDIR
Pergunte sobre os seus
próprios números.

[palco escuro]  A tela real do chat, com uma pergunta e uma
                resposta reais sobre a conta de demonstração

[corpo]         Um parágrafo + a qualificação, no mesmo corpo:
                "Funciona com uma chave da API Gemini
                 configurada por você no aplicativo."

[prova]         50 / ilimitado
                CONSULTAS POR MÊS · JOVEM / ADULTO
```

**Removido deste bloco:** o campo de input que não envia nada.
**Justificativa da qualificação em corpo e não em nota de rodapé:** princípio P9.
Um recurso que exige configuração do usuário e é vendido como incluído gera
churn no primeiro mês.

---

## 13,4 → 14,6 vp · RECURSOS SECUNDÁRIOS `[claro]`

Grade tipográfica fria: título curto + uma linha, em três colunas. Sem card,
sem ícone, sem cor, sem borda. Sete itens:

```
ORÇAMENTO POR CATEGORIA     MERCADO                    RENDA MENSAL
Um teto por categoria,      B3, cripto e câmbio.       Informe a renda e o
comparado com o gasto       Plano Adulto.              painel passa a medir
do mês.                                                economia e % comprometida.

CATEGORIAS                  TEMPO REAL                 ENTRAR COM GOOGLE
As mesmas em lançamentos    Abriu em outro dispositivo,Sem senha nova.
e em orçamento.             já está lá.

PRÓXIMO PASSO
Toda tela vazia diz o que fazer em seguida.
```

**Justificativa:** é a "gaveta" da referência traduzida para este orçamento — a
página fica curta para quem quer pouco e completa para quem quer tudo, sem
custar viewport.

---

## 14,6 → 15,6 vp · DADOS / CONFIANÇA `[claro]`

```
Sobre os seus dados.

Autenticação pelo Firebase, do Google.
Cada consulta é filtrada pelo seu identificador de usuário:
você só alcança os seus próprios dados.
Nenhuma senha de banco é pedida em momento nenhum —
as contas são cadastradas por você.
```

Sem ícone de cadeado, sem escudo, sem selo. Texto e o traço.

**Justificativa:** é a objeção que impede a compra. *Comunica confiança*, que é
pré-condição de qualquer inteligência financeira.

---

## 15,6 → 17,2 vp · PLANOS `[claro]` · 05/05 ESCOLHER

`PlanosSection` como está hoje, com mais altura e a linha do Mercado explícita.
O traço chega aqui e **termina** — não volta.

**Justificativa da remoção do retorno:** o ciclo já foi percorrido cinco vezes
com nome e número. Fechar a linha graficamente custa uma seção inteira de
rolagem para repetir o que a página já disse. Regra da remoção (P2).

---

## 17,2 → 18,0 vp · FOOTER / CTA FINAL `[escuro]`

```
Todo capital tem um ciclo.
[ Criar conta ]   Entrar

Início · Organizar · Analisar · Decidir · Escolher
Termos · Privacidade · Contato
Capital Cycle · 2026
```

O fundo escuro fecha a página na mesma cor em que o produto aparece —
*a pessoa sai por dentro do app.*

---

## Tabela de compasso (verificação do princípio P3)

| Capítulo | Altura | Palco | Desvio |
|---|---|---|---|
| Organizar | 2,4 vp | 1,0 vp | — |
| Analisar | 2,4 vp | 1,0 vp | 0 % |
| Ciclos e metas | 2,4 vp | 1,0 vp | 0 % |
| Capital Advisor | 2,4 vp | 1,0 vp | 0 % |

Se na implementação algum capítulo divergir mais de 10 %, o compasso quebrou e
o conteúdo é que deve ser cortado — não a altura que deve ser esticada.

---

## Comportamento em mobile (< 768 px)

### A hero em retrato

O vídeo é 16:9 e o telefone é ~9:19,5. Recortar o 16:9 para retrato corta
justamente o tablet, que é o assunto. Três decisões:

1. **Sem scrub em mobile.** O vídeo roda **uma vez, do início ao ponto de
   handoff**, disparado quando entra em vista, e para. Nada de escrubar por
   `touchmove`: em iOS o scroll é assíncrono e o resultado engasga.
2. **Enquadramento próprio.** Uma exportação vertical do mesmo material, ou —
   se não houver como reexportar — o vídeo em 16:9 centrado numa faixa, com o
   texto **acima** dele em vez de ao lado. A segunda opção é aceitável e não
   exige produção nova.
3. **O handoff continua existindo**, no mesmo ponto, para a captura **mobile**
   da dashboard.

Ver `08-media-plan.md` §2.4 para as variantes de arquivo.

### O resto

- Palcos pinados **continuam existindo**, mas com **0,7 vh** em vez de 0,95 —
  em retrato, uma tela de dashboard a 0,95 vh fica ilegível.
- **As capturas de tela são outras**: as versões mobile reais das mesmas telas,
  não as de desktop reduzidas. Uma captura desktop encolhida em um telefone é
  ilegível e comunica descuido.
- A grade de recursos vai de 3 colunas para 1.
- **A navbar ganha um menu**, que hoje simplesmente desaparece abaixo de 980 px.
- O valor de clímax cai de 110 px para ~64 px, mantendo a proporção de 4× com o
  corpo.
