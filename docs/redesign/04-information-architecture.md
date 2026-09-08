# 04 — Nova arquitetura de informação

## 1. Veredito sobre a estrutura proposta na Fase 4

A hipótese apresentada tinha 10 blocos. Avaliada contra o produto real:

| # | Bloco proposto | Veredito | Motivo |
|---|---|---|---|
| 1 | Hero cinematográfica com personagem segurando tablet | **APROVADO — asset produzido** | Ver §2 |
| 2 | Entrada/transição para a dashboard real | **Mantido, encadeado ao 1** | É o desfecho do push-in: o *match cut* do quadro final do vídeo para a interface real |
| 3 | Controle financeiro | **Mantido**, dividido em dois | É a maior parte do produto: Contas+Transações e Análise são coisas diferentes |
| 4 | Ciclos e Metas | **Mantido** | Funcionalidade real, com comportamento próprio (aportes) |
| 5 | Capital Advisor | **Mantido, com qualificação obrigatória** | Real, mas exige chave do usuário |
| 6 | Investimentos / Evolução | **REMOVIDO** | **Não existe no produto.** Ver §3 |
| 7 | Visão detalhada dos recursos | **Mantido, em forma de gaveta** | É onde cabem Orçamento por Categoria, Mercado e Perfil |
| 8 | Fundamentos / Segurança | **Mantido e promovido** | É objeção de compra real, não bloco institucional |
| 9 | Planos | **Mantido** | Preservar `PlanosSection` quase inteira |
| 10 | CTA final | **Fundido no footer** | Um CTA final sozinho numa seção é o tipo de bloco que a regra da remoção elimina |

E dois blocos que **faltavam** na hipótese:

- **Manifesto** (o "por que", 3 frases sem mídia) — é o que dá ao circuito o
  direito de existir antes de a primeira tela aparecer.
- **Footer** — a página **não tem nenhum** hoje. Para um SaaS pago é falha de
  credibilidade antes de ser falha de design.

---

## 2. A hero cinematográfica — decisão aprovada

**Esta seção substitui a análise anterior, que recomendava descartar a hero com
personagem. A decisão foi revista pelo responsável pelo projeto: o asset foi
produzido, testado e aprovado.** O que segue não avalia se a hero deve existir —
define como integrá-la.

### 2.1 Por que ela passa no P1

Pela formulação corrigida do princípio (`03-design-principles.md` §P1), um
elemento precisa **apresentar, demonstrar, explicar ou reforçar**. A hero cumpre
as duas primeiras, e é a única peça da página que cumpre a primeira:

- **Apresenta** — uma pessoa oferece o produto a quem está do outro lado da
  tela. É o gesto que dá início ao percurso e o único momento em que a página
  tem um interlocutor.
- **Demonstra** — o que está no tablet é a interface do Capital Cycle, com a
  navegação e o layout do produto. A demonstração começa no primeiro segundo, e
  o bloco 2 a completa entregando a tela de verdade. (Sobre a fidelidade dessa
  composição, ver §2.3.)

O elemento roxo do figurino alinha o personagem à marca sem que a página precise
de nenhum ornamento adicional — é a única saturação daquele quadro, o que é
consistente com a regra do índigo único (P3 de cor).

### 2.2 O asset, medido

`src/assets/video/ProductCapital.mp4` — hoje não referenciado por nenhum
arquivo, e é este o asset aprovado.

| | |
|---|---|
| Resolução | 1920×1080 |
| Duração | **6,000 s exatos** |
| Taxa | 24 fps — **144 quadros** |
| Codec | H.264 + faixa de áudio AAC |
| Bitrate | 4,5 Mbps |
| Tamanho | **3,4 MB** |

Progressão observada: 0 s a pessoa olha o tablet junto ao corpo → ~1,5 s começa
a apresentar → ~3,0 s o tablet está de frente, ocupando ~45 % da largura →
~4,5 s push-in, tablet em ~70 % → 6,0 s a dashboard preenche o quadro, com as
bordas do tablet e as mãos ainda visíveis nos cantos.

**A faixa de áudio precisa ser removida.** Um vídeo com trilha de áudio não pode
receber `autoplay` sem `muted`, e o arquivo carrega o peso do AAC sem nenhum uso.

### 2.3 Achados que mudam a estratégia de integração

A dashboard renderizada dentro do vídeo **não é uma captura da aplicação**: é
uma reconstrução, e apresenta defeitos de texto que ficam legíveis conforme o
push-in avança. Observado nos quadros a 4,5 s e 5,9 s:

| Aparece no vídeo | Correto |
|---|---|
| **CANTAL CYCLE** (a marca, na sidebar) | CAPITAL CYCLE |
| Contas e **Calsas** | Contas e Caixas |
| Orçamento por **Categaria** | Orçamento por Categoria |
| Capital **Advisar** (IA) | Capital Advisor (IA) |
| Olá, **Cerents**. | Olá, {primeiro nome}. |
| Sobrou R$ 0,00 este **más** | …este mês |
| **Ccriar** minha primeira meta | Criar minha primeira meta |
| Meses: Abr **Mar** Jun Jul Ago Set | ordem cronológica |

Além disso, os números não batem com `demoAccount.js` (R$ 3.200,00 / R$ 7.842
/ 3 contas no vídeo, contra R$ 14.820 / R$ 9.412 / 4 contas na fonte de dados da
página), e o próprio vídeo se contradiz entre quadros (R$ 7842,**10** aos 3,0 s
e R$ 7842,**20** aos 5,9 s). O painel de metas está no estado vazio.

**Isto não invalida a hero.** Invalida um único trecho dela: **o último segundo**,
onde o texto fica grande o bastante para ser lido. A 4,5 s a marca já está no
limite da legibilidade; a 5,9 s "CANTAL CYCLE" é lido sem esforço, em
tela cheia, na primeira dobra de uma página que vende confiança.

**Consequência, e é a mesma solução que o briefing já previa:** trocar do vídeo
para a interface real **assim que o tablet dominar o quadro** — não depois. Ver
§2.4. O handoff antecipado resolve três problemas de uma vez: elimina os
defeitos de texto, corta ~25 % do peso do arquivo e faz o *match cut* acontecer
enquanto ainda há movimento, que é onde ele fica invisível.

**A origem dos defeitos, e por que isso é uma boa notícia.** A pasta
`FramesCeneHero/` (hoje não rastreada) contém `Dashboard.png` — a composição
usada como fonte da tela dentro do tablet. **Ela está correta**: "CAPITAL CYCLE",
"Contas e Caixas", "Orçamento por Categoria", "Capital Advisor (IA)",
"Olá, Gerente", meses em ordem. Os erros de texto **não estão na composição: são
artefato da geração do vídeo**, que redesenhou a tela quadro a quadro em vez de
compô-la.

Isso significa que a reexportação é bem mais barata do que seria: o material
limpo existe. Duas ressalvas que permanecem mesmo com a fonte:

- Os números de `Dashboard.png` (R$ 3.200,00 / R$ 7.842,20 / 3 contas) **não
  batem com `demoAccount.js`**, e "Sobrou R$ 0,00 este mês" contradiz o próprio
  saldo positivo ao lado.
- É um **mockup**, não uma captura: as barras do gráfico de fluxo estão todas na
  mesma altura e "Metas em andamento" está no estado vazio.

**Recomendação, em duas velocidades:**

1. **Agora, sem bloquear nada:** handoff antecipado (§2.4). A hero vai ao ar sem
   nenhum defeito visível.
2. **Depois, quando houver janela:** recompor a tela do tablet a partir de uma
   **captura real** da aplicação com os dados de `demoAccount.js`, e reexportar o
   vídeo com essa tela sobreposta. Aí o vídeo corre até 6,0 s e o *match* fica
   perfeito. É melhoria, não pré-requisito.

### 2.4 A integração, em quatro tempos

```
T1  0,0 → ~3,0 s   APRESENTAÇÃO      vídeo, reprodução normal, sem scroll
                   A pessoa levanta e apresenta o tablet.
                   Sobre ele: headline, lead e os dois CTAs.

T2  ~3,0 → ~4,4 s  PUSH-IN           vídeo escrubado pelo scroll, 1:1
                   O único trecho scrubado da página inteira.
                   A headline e os CTAs saem em opacidade.

T3  ~4,4 s         HANDOFF           corte para a interface real
                   O quadro do vídeo é substituído pela captura/DOM da
                   dashboard, alinhada ao enquadramento do último frame.

T4  → fim          DASHBOARD REAL    0,95 vh, full-bleed, escuro
                   A moldura do tablet sai. Começa o bloco 2.
```

O ponto exato de T3 é calibrado com a página montada, no quadro em que a tela do
tablet cobre a viewport e antes de o texto interno ficar legível — a janela
observada é **4,3 s a 4,8 s**.

**Blocos 1 e 2 continuam separados na arquitetura**, ao contrário do que a versão
anterior deste documento propunha: T1–T3 são a hero (bloco 1) e T4 é a entrada no
produto (bloco 2). A emenda entre eles é o *match cut*, que é conteúdo, não uma
costura vazia.

Detalhamento técnico completo — codificação, scrub, preload, fallback, mobile e
`prefers-reduced-motion` — em `07-motion-strategy.md` §3 e `08-media-plan.md` §2.

---

## 3. Por que "Investimentos / Evolução" sai

Não existe. O produto sabe marcar uma conta como do tipo `Investimentos` e somar
o saldo dela. Não há ativo, posição, aporte em ativo, rentabilidade nem carteira.

Um capítulo de "Investimentos" com o mesmo peso dos outros seria a única seção
da página inteira sem uma tela por trás — e a única mentira. Pelo princípio P9,
sai.

**O que sobrevive, e onde:** o Mercado (B3, cripto, câmbio) **existe** e é a
diferença comercial do plano Adulto. Ele entra como **cartão de gaveta** no
capítulo de recursos e como **linha da tabela** em Planos — que é o peso
verdadeiro dele.

Consequência colateral: o circuito passa de **sete estações para cinco**.
ENTRAR, ORGANIZAR, ANALISAR, DECIDIR, ESCOLHER — todas com tela real.
INVESTIR e EVOLUIR saem, e `PassagemSection` (que existia só para elas) some
junto. `codigo()` em `estacoes.js` passa a gerar `01/05 … 05/05` sem nenhuma
outra alteração, porque o total já é uma constante derivada.

---

## 4. A nova arquitetura

**11 blocos, ~13 viewports.**

| # | Bloco | Estação | Altura | Fundo | Palco pinado |
|---|---|---|---|---|---|
| — | **Navbar** fixa | — | 72 px | transparente → clara | — |
| 1 | **Hero cinematográfica** | 01 ENTRAR | 1,8 vp | claro (o do vídeo) | ✓ vídeo scrubado |
| 2 | **Entrada/transição para a dashboard real** | 01 → 02 | 1,2 vp | **escuro** | ✓ 1,0 vp |
| 3 | **Manifesto** | — | 0,8 vp | claro | — |
| 4 | **Organizar** — contas + transações | 02 | 2,4 vp | claro + palco escuro | ✓ 1,0 vp |
| 5 | **Analisar** — dashboard e métricas | 03 | 2,4 vp | claro + palco escuro | ✓ 1,0 vp |
| 6 | **Decidir** — ciclos, metas e orçamento | 04a | 2,4 vp | claro + palco escuro | ✓ 1,0 vp |
| 7 | **Capital Advisor** | 04b | 2,4 vp | claro + palco escuro | ✓ 1,0 vp |
| 8 | **Recursos secundários** (gaveta) | — | 1,2 vp | claro | — |
| 9 | **Dados / confiança** | — | 1,0 vp | claro | — |
| 10 | **Planos** | 05 ESCOLHER | 1,6 vp | claro | — |
| 11 | **Footer / CTA final** | — | 0,8 vp | escuro | — |

O bloco 1 cresceu de 1,0 para 1,8 vp para acomodar a pista de scrub do push-in
(T2), e o bloco 2 encolheu de 1,4 para 1,2 vp porque a entrada na dashboard
deixou de precisar de um gesto próprio — o *match cut* já a entrega.
**Total: ~18 vp** (a soma dos blocos; a marca de "~13 vp" que constava aqui e no
storyboard estava errada e foi corrigida). Referência: 35,3 vp.

Os quatro capítulos de capacidade (4, 5, 6, 7) têm **exatamente a mesma altura**
— é o princípio P3, o compasso.

---

## 5. Detalhamento por bloco

### 1. Hero cinematográfica — 01/05 ENTRAR
O vídeo aprovado ocupa a viewport. Sobre ele, na prumada mestra e no lado livre
do quadro: headline curta, lead honesto e dois CTAs (`Criar conta` índigo,
`Ver o produto` como link). A coluna de índice das cinco estações fica na
margem oposta. O traço nasce da base do bloco de texto, como hoje.

**O valor de clímax sai daqui e vai para o bloco 5 (Analisar).** O clímax
numérico existia para dar à primeira dobra um elemento grande e concreto; com o
vídeo, esse papel já está ocupado, e dois clímaxes na mesma viewport se anulam.
Regra da remoção (P2).

*Preserva:* prumada mestra, `.cc-most`, `INDICE_DO_HERO`, foco visível.
*Corrige:* o lead deixa de prometer conexão bancária (ver `06`).
*Legibilidade:* o texto vive sobre a área clara e lisa do fundo do vídeo, sem
véu, sem gradiente e sem sombra. Se em alguma largura não houver contraste
suficiente, a solução é **reposicionar o texto**, não escurecer o vídeo.

### 2. Entrada/transição para a dashboard real — a emenda
O *match cut* entrega a dashboard real em ~0,95 vh, escura, full-bleed, sem a
moldura do tablet. Sem texto sobreposto além de uma legenda de estação no canto.
É o único bloco sem headline: ele não explica, ele **entrega**.

**Continuidade com o vídeo:** o enquadramento da captura reproduz o do último
frame exibido, e a cor do fundo é a mesma. O que muda entre o último frame do
vídeo e o primeiro quadro da interface real deve ser **apenas a nitidez do
texto** — que é justamente o argumento.

### 3. Manifesto
Três frases curtas, centradas, sem mídia nenhuma, muito espaço.
É onde o conceito CAPITAL + CICLO é dito por extenso, uma única vez na página.
*É o bloco que dá ao circuito o direito de existir.*

### 4. Organizar — 02/05
**Tela:** Contas e Caixas + Transações.
**Prova:** um lançamento entra e o saldo da conta se ajusta.
**Detalhe:** a atomicidade do `runTransaction` — é a peça de engenharia mais
séria do produto e nunca foi contada a ninguém.

### 5. Analisar — 03/05
**Tela:** Dashboard — fluxo líquido de 6 meses, comparação com o mês anterior,
maiores despesas, % da renda comprometida.
**Prova:** os números que já existem em `demoAccount.js`.
**Clímax do capítulo:** a sobra do mês em escala grande.

### 6. Decidir — ciclos, metas e orçamento — 04a/05
**Tela:** Ciclos e Metas, e Orçamento por Categoria.
**Prova:** um aporte registrado move a barra da meta.
**Detalhe honesto e distintivo:** *um aporte não cria transação e não mexe no
saldo da conta.* É uma decisão de produto real, defensável, e ninguém mais
explica isso. *Comunica planejamento melhor que qualquer frase de marketing.*

### 7. Capital Advisor — 04b/05
**Tela:** a tela real do chat, com uma resposta real sobre a conta demo.
**Qualificação obrigatória, visível na própria seção:** funciona com uma chave
Gemini configurada por você. Não é letra miúda — é a diferença entre a página
ser verdadeira ou não.
**Remoção:** o campo de input morto sai. Um formulário que não faz nada numa
landing é pior que nenhum formulário.

### 8. Recursos secundários — a gaveta
Grade fria e tipográfica (sem cards, sem ícones, sem cor) com o que não merece
capítulo mas é verdade: Orçamento por Categoria, Mercado (B3/cripto/câmbio, plano
Adulto), Renda mensal no perfil, Categorias em fonte única, Estados vazios com
próximo passo, Multi-dispositivo em tempo real, Login com Google.
*É a camada 4 da referência, no orçamento deste projeto.*

### 9. Dados / confiança
Bloco novo, e o mais importante dos novos. Só fatos verificáveis no código:
autenticação Firebase; dados isolados por `uid` em todas as consultas; regras
de Firestore; nenhuma credencial bancária é pedida em momento nenhum; os dados
são cadastrados por você.
**Como comunica:** é a objeção que impede a compra de um produto financeiro
desconhecido. Responder a ela é planejamento, não institucional.
**Sem cadeados, sem escudos, sem ícones** — texto e o traço.

### 10. Planos — 05/05 ESCOLHER
`PlanosSection` **quase inalterada**: já foi auditada, já lê de `plans.js`, já
mostra a qualificação de limites, já não tem selo. Só ganha altura e a linha do
Mercado explícita.

### 11. Footer / CTA final
Não existe hoje e precisa existir. Logo, CTA final (`Criar conta`), navegação
das cinco estações, Entrar, e-mail de contato, Termos, Privacidade, CNPJ ou
identificação de quem opera, ano.
**Como comunica:** confiança. Um produto que recebe pagamento sem informar quem
o opera não passa no teste mínimo de credibilidade de um SaaS brasileiro.

---

## 6. O que é preservado, removido e redesenhado

### Preservado integralmente
- `circuitoScroll.js` — o motor
- `circuitoGeometria.js` — a geometria (menos os trechos das seções removidas)
- `estacoes.js` e `demoAccount.js` — a disciplina de dado único
- `.cc-most` — o átomo tipográfico
- A prumada mestra `--cc-faixa` e a goteira responsiva
- A paleta e a regra do índigo único
- O sistema de foco visível
- `PlanosSection`, quase inteira
- A degradação sem JS e com `prefers-reduced-motion`

### Removido
- `RetornoSection` — traço sem conteúdo, uma seção de rolagem para uma metáfora
  já entregue seis vezes (P2)
- `PassagemSection` — existia só para INVESTIR e EVOLUIR, que não existem (P9)
- As estações 05 INVESTIR e 06 EVOLUIR
- O campo de input morto do Advisor
- A variante `.cch-nav--dark`, que o próprio código diz não ser mais acionada
- `AmbientGlow`, `FloatingFigures`, `HeroOdometer`, `useFirestore`,
  `shared/PrivateRoute`, `CurriculoUpload`, `.cc-ambient*` do `index.css`
- `framer-motion` da landing
- O valor de clímax do Hero, que migra para o capítulo Analisar
- A faixa de áudio AAC do vídeo da hero
- A coluna de índice do Hero **se** ela continuar antecipando o que virá logo
  abaixo (decidir na implementação, com a página montada)

**`ProductCapital.mp4` deixa de estar nesta lista.** Na versão anterior deste
documento ele figurava como asset morto a remover; ele é o asset aprovado da
hero. Passa a ser versionado, reencodado e movido para `public/media/`
(`08-media-plan.md` §2).

### Redesenhado
- O Hero, para ter um clímax numérico
- O painel reconstruído em HTML → **capturas da interface real**
- A hierarquia tipográfica, de 1,6× para ~4×
- A alternância de fundo claro/escuro como estrutura, não como exceção
- A navbar em telas estreitas (hoje simplesmente some)
- `index.html`: título, description, Open Graph

### Novos assets necessários
Ver `08-media-plan.md`.
