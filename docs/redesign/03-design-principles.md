# 03 — Princípios de design do Capital Cycle

Nove princípios. Cada um passa pelo teste obrigatório:

> **"Como isso comunica Capital, Cycle, dados financeiros, planejamento ou
> inteligência financeira?"**

Se a resposta não estiver escrita aqui, o princípio não entra.

---

## P1 — Apresentar, demonstrar, explicar ou reforçar

> **Todo elemento deve apresentar, demonstrar, explicar ou reforçar o Capital
> Cycle. Elementos puramente decorativos, sem função narrativa ou de produto,
> devem ser removidos.**

Quatro funções legítimas, e um elemento precisa cumprir **pelo menos uma**:

| Função | O que é | Exemplo nesta página |
|---|---|---|
| **Apresentar** | Conduz o visitante até o produto | A hero cinematográfica: uma pessoa oferece o tablet com a dashboard real |
| **Demonstrar** | Mostra o produto funcionando | As capturas das cinco telas, em escala |
| **Explicar** | Diz o que aquilo faz ou por quê | Headline, corpo, o bloco Fundamentos |
| **Reforçar** | Sustenta a tese da marca | O traço do circuito, o compasso constante, a alternância claro/escuro |

**Como comunica:** um produto que mede dinheiro não pode ter na sua página
elementos que não fazem nada. Mas "não fazer nada" é diferente de "não exibir um
número" — apresentar o produto a alguém **é** uma função, e é a primeira do
funil.

**Nota sobre a formulação anterior.** Uma versão anterior deste princípio dizia
"todo elemento visual deve medir alguma coisa, ou desaparecer". Era restritiva
demais: por ela, qualquer recurso narrativo que não exibisse um dado seria
descartado, inclusive a hero aprovada. O teste correto é **função**, não
**dado**. A disciplina de dado permanece, mas como P9 e como a regra dos números
em `06-content-strategy.md` §4 — não como filtro de existência visual.

**O que continua proibido**, porque não cumpre nenhuma das quatro funções:
ícone decorativo, ilustração conceitual, gradiente ornamental, blob, "sparkle"
para IA, halo radial, partícula, e toda a lista de proibições da direção visual
do projeto, que segue valendo por inteiro.

**Teste prático:** aponte para o elemento e diga em voz alta qual das quatro
funções ele cumpre e como. Se a frase precisar da palavra "fica bonito",
"equilibra" ou "dá vida", o elemento sai.

---

## P2 — A regra da remoção vem antes de qualquer adição

Diante de um problema visual, a primeira pergunta é sempre: **isto se resolve
tirando alguma coisa?** Só depois de a resposta ser não é que se propõe uma
adição.

**Como comunica:** planejamento financeiro é a disciplina de cortar o que não
serve. Uma página construída pela mesma regra pratica o que vende.

**Aplicação imediata neste redesign:** `RetornoSection` e `PassagemSection` são
removidas (§`04`), não redesenhadas. Duas seções inteiras saem antes de qualquer
seção nova entrar.

---

## P3 — Compasso constante: cada capacidade recebe a mesma medida

Todo capítulo de funcionalidade ocupa **a mesma altura de rolagem** — proposta:
**2,4 viewports**, dos quais **1,0 é palco pinado** e 1,4 é rolagem normal.

**Como comunica:** ciclo. Um ciclo é definido por repetição com intervalo
constante. Uma página em que cada etapa dura o mesmo tempo **é** um ciclo,
antes de dizer a palavra "ciclo".

**Como se mede:** se dois capítulos têm alturas diferentes em mais de 10 %, o
princípio foi violado.

---

## P4 — Uma capacidade por vez, sozinha na tela

Em nenhum momento da página duas funcionalidades dividem a mesma viewport.
Nunca uma grade de cards de recursos.

**Como comunica:** o dinheiro passa por uma etapa de cada vez — entra, é
organizado, é analisado, vira decisão. Mostrar quatro etapas lado a lado
contradiz a única tese da marca.

---

## P5 — O produto em escala, e escuro é escuro

O palco de mídia é **full-bleed, ~0,95 vh**, sem moldura, sem sombra, sem
mockup de dispositivo, sem borda arredondada.

**A hero é a única exceção, e é uma exceção com função.** Ali o tablet não é
moldura decorativa: é o objeto que o personagem **oferece** — o gesto de
apresentação que dá início ao percurso (P1, função "apresentar"). No instante em
que a apresentação termina e a tela passa a ser o assunto, a moldura sai e a
dashboard assume o quadro inteiro. O tablet existe enquanto há um gesto; some
quando há um produto.

Em nenhum outro ponto da página uma tela aparece dentro de um dispositivo.

E — a correção do erro atual — **o palco assume o fundo escuro do produto
(`#070b14`)**. O painel do app é escuro; hoje a landing cola um retângulo escuro
num fundo `#f4f5f7` e ele lê como card. A página passa a alternar:

```
faixa clara  (#f4f5f7)  → texto, estação, leitura
faixa escura (#070b14)  → o produto, ocupando tudo
faixa clara             → explicação, detalhe
```

**Como comunica:** a alternância claro/escuro é literalmente **entrar no produto
e sair dele**. É o gesto de "abrir o app" transformado em ritmo de página, e
resolve a hierarquia sem adicionar um único elemento novo — só reorganizando
duas cores que a página já usa.

---

## P6 — Hierarquia de 4× entre o dado e o rótulo

O maior elemento tipográfico da página é **um número financeiro real**, não uma
headline de marketing. Escala proposta:

| Nível | Tamanho (desktop) | Uso |
|---|---|---|
| Valor de clímax | 96–120 px, tabular | O consolidado, a sobra do mês |
| Headline de capítulo | 56–64 px | Uma frase de 3–7 palavras |
| Estação (eyebrow) | 11 px, caixa alta, tracking 0.08em | `01/07 ENTRAR` — **já existe** |
| Corpo | 18–19 px | Um parágrafo |
| Unidade / rótulo | 10–11 px, caixa alta | **já existe** |

O átomo `.cc-most` é preservado inteiro. O que muda é que ele deixa de ser o
maior elemento da página e passa a ser o **menor** — a legenda do instrumento,
que é o papel correto dele.

**Como comunica:** capital. Num produto sobre dinheiro, o número tem que ser a
coisa maior na tela. Hoje o maior corpo da página, fora headlines, é 18 px.

---

## P7 — Espaço negativo como contraste, nunca como ausência

Vazio só existe para tornar outra coisa grande. Uma seção sem nada grande dentro
não tem "respiro" — tem uma lacuna.

**Como comunica:** clareza. É a diferença entre um painel financeiro limpo e um
painel financeiro vazio, e é exatamente a diferença que o produto entrega.

**Como se mede:** toda faixa de mais de meia viewport sem nenhum elemento em
escala de clímax é uma lacuna, não respiro.

---

## P8 — O traço do circuito continua, e continua sendo uma coisa só

O motor `circuitoScroll.js` é preservado. O scroll continua controlando **uma
única propriedade** (`stroke-dashoffset`). Nada de texto, card ou gráfico é
animado por scroll.

Mas o traço muda de papel: hoje ele é o protagonista visual; passa a ser a
**espinha que costura os capítulos**, correndo na prumada mestra e ligando um
palco ao seguinte.

**Como comunica:** cycle, continuidade, trajetória. A linha é a única metáfora
gráfica que o projeto tem, e ela já está construída, medida e acessível. Trocá-la
por outra coisa seria descartar a única identidade própria que a página possui.

---

## P9 — Nada é afirmado sem estar no código

Nenhuma frase, número ou captura pode dizer algo que `01-product-truth.md` não
sustente. Se um recurso exige chave de API do usuário, a página diz. Se contas
são cadastradas e não conectadas, a página escreve "cadastradas".

**Como comunica:** inteligência financeira e confiança. Um produto que pede os
dados financeiros de alguém e exagera na primeira tela já perdeu o argumento.
E, em termos práticos: toda promessa exagerada na landing vira churn no primeiro
mês.

---

## Cores, tipografia e traço — sistema consolidado

Nada aqui é novo; é o que a página já usa, formalizado.

```
--cch-ink          #131316   texto principal (claro)
--cch-body         #3c3c40   corpo
--cch-muted        #6d6d72   unidades, códigos de estação
--cch-purple-rec   #5358ee   ÚNICO acento — estado corrente ou ação primária
fundo claro        #f4f5f7
fundo escuro       #070b14   (o mesmo do painel real, src/pages/admin/*)
```

**Regra do índigo, mantida:** no máximo **um** elemento saturado por viewport.
É estado corrente ou CTA primário. Nunca decoração.

**Tipografia:** Inter variável, com `cv11` e `ss03` já configurados em
`index.css`. `font-variant-numeric: tabular-nums` em **todo** número —
inegociável: um valor financeiro que muda de largura ao mudar de dígito não é
um instrumento.

**Traço:** espessura constante em pixels 1:1 com a tela, como já está em
`circuitoGeometria.js`.

---

## Checklist de veto

Uma proposta é rejeitada se qualquer item for verdadeiro:

- [ ] Existe para preencher espaço
- [ ] **Não apresenta, não demonstra, não explica e não reforça** (P1)
- [ ] Repete uma informação já dada na mesma página
- [ ] Adiciona um elemento onde remover um resolveria
- [ ] Afirma algo que `01-product-truth.md` não sustenta
- [ ] Coloca duas funcionalidades na mesma viewport
- [ ] Usa o índigo em algo que não é estado corrente nem ação primária
- [ ] Anima algo fora do inventário de `07-motion-strategy.md` §2
- [ ] Põe uma tela dentro de uma moldura de dispositivo fora da hero
- [ ] Está na lista de proibições da direção visual (moedas, cifrões, cadeados,
      robôs, cérebros, partículas, hologramas, sparkles, stock financeiro,
      glassmorphism, gradiente decorativo, halo radial, selo "mais popular")
- [ ] A resposta à pergunta final é "porque parece Apple"
