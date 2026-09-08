# 07 — Estratégia de movimento

## 1. A regra que não muda

**Do fim da hero até o rodapé, o scroll controla uma coisa: quanto do traço já
foi desenhado.**

Está escrita no topo de `circuitoScroll.js` e é a melhor decisão técnica do
projeto. O redesign a mantém e adiciona **exatamente três** exceções, todas
justificadas abaixo — e **duas delas vivem apenas na hero**, num trecho de 0,8
viewport, uma vez na vida da página.

Sem easing, sem mola, sem suavização, sem inércia. A posição real do documento é
soberana. Rolar para trás desfaz na ordem inversa. Um salto de âncora assume o
estado correto no mesmo frame.

**Como comunica:** um instrumento de medida não tem inércia. Um mostrador que
"chega suavemente" ao valor está mentindo sobre o valor. *Comunica precisão e
dados financeiros* pela própria física da página.

---

## 2. O inventário de movimento — completo

Toda a animação da página, sem exceção:

| # | O quê | Propriedade | Gatilho | Duração |
|---|---|---|---|---|
| 1 | **Hero: apresentação** | `currentTime` do vídeo | reprodução normal | 0 → ~3,0 s |
| 2 | **Hero: push-in** | `currentTime` do vídeo | posição do scroll | — (1:1) |
| 3 | **Hero: texto saindo** | `opacity` | posição do scroll | — (1:1) |
| 4 | Traço do circuito | `stroke-dashoffset` | posição do scroll | — (1:1) |
| 5 | Marcas e pontos | `visibility` | posição do scroll | 0 (binário) |
| 6 | Código da estação corrente | `color` | posição do scroll | 0 (binário) |
| 7 | Palco escuro entrando | `transform: translateY` | posição do scroll | — (1:1) |
| 8 | Mídia do palco | `opacity` 0→1 | entrou em vista | 150 ms |
| 9 | Navbar ganhando chão | `background` | posição do scroll | 0 (estado) |
| 10 | Hover de link | `color` | hover | 200 ms |
| 11 | Foco visível | `outline` | `:focus-visible` | 0 |

**Onze. É tudo.** As de #1 a #3 existem **somente na hero** e somente uma vez.
O *match cut* (§3.0, T3) não está na lista porque não é animação: é uma troca de
elemento num único quadro.

---

## 3. As adições, justificadas

### 3.0 A hero: apresentação, scrub e match cut (#1, #2, #3)

**Justificativa de existência:** é decisão de produto e direção criativa
aprovada, com asset produzido. O que este documento define é **como** executá-la
sem custar performance nem acessibilidade.

#### T1 — Apresentação (0 → ~3,0 s), reprodução normal

```js
// dispara quando o <video> entra em vista, uma vez
video.play();            // muted + playsinline obrigatórios
// para sozinho no ponto de entrega do scrub
if (video.currentTime >= T_SCRUB) video.pause();
```

**Por que reprodução normal e não scrub desde o começo:** a apresentação é um
**gesto humano**. Um gesto escrubado depende de quanto a pessoa rolou e, se ela
não rolar, nunca acontece — a hero ficaria congelada num quadro de alguém
olhando para baixo. Este é o único trecho autônomo da página, e ele existe por
essa razão específica.

#### T2 — Push-in (~3,0 → ~4,4 s), escrubado 1:1 com o scroll

```js
// dentro do rAF já existente do motor do circuito
const p = progressoDaPista();               // 0..1, medido do DOM
video.currentTime = T_SCRUB + p * (T_HANDOFF - T_SCRUB);
```

Regras:

- **Escreve `currentTime` no rAF que já existe.** Nenhum listener novo, nenhum
  laço novo (§7).
- **`requestVideoFrameCallback`** onde houver, para não escrever `currentTime`
  mais de uma vez por quadro decodificado.
- **Sem easing.** 1:1 com o documento, como o traço.
- **A pista é curta de propósito:** 0,8 vp de rolagem para ~1,4 s de vídeo. Um
  scrub longo é o que trava telefones.

#### T3 — Match cut (~4,4 s), troca de elemento

```
1. a captura real já está no DOM, sob o vídeo, com opacity: 0
2. no quadro do handoff:  video.hidden = true; captura.style.opacity = 1
3. o <video> é descartado; nada mais o referencia
```

Não é crossfade. **É um corte**, em um quadro. Um crossfade aqui mostraria as
duas imagens sobrepostas justamente no momento em que elas precisam parecer a
mesma coisa.

**Por que o handoff é antecipado (~4,4 s e não 6,0 s):** o texto renderizado
dentro do vídeo contém erros que ficam legíveis no último segundo — "CANTAL
CYCLE" na sidebar, entre outros, e números que não batem com `demoAccount.js`.
O inventário completo está em `04-information-architecture.md` §2.3. O handoff
antecipado é ao mesmo tempo a correção editorial e a decisão de performance
correta: ~25 % menos vídeo para baixar.

### 3.1 O palco escuro entrando (#7)

A faixa `#070b14` sobe do rodapé da viewport e cobre a tela conforme o scroll.

- **Propriedade única:** `transform: translateY`. Composta na GPU, sem layout,
  sem paint.
- **1:1 com o scroll**, como o traço. Sem easing.
- Com `prefers-reduced-motion: reduce`, a faixa **já está no lugar** — a seção
  simplesmente é escura. Nenhuma informação se perde.

**Justificativa:** é o gesto de "entrar no produto" **nos quatro capítulos**,
onde não há vídeo nenhum e não deve haver. A hero entra no produto pelo push-in;
os capítulos entram por esta faixa. Mesma leitura narrativa, uma propriedade de
CSS, custo zero.

**Como comunica:** é o gesto de abrir o aplicativo. *Comunica a entrada nos
dados financeiros* literalmente.

### 3.2 Opacidade da mídia do palco (#8)

A captura entra com `opacity 0→1` em 150 ms quando o palco entra em vista.
Não é ligado ao scroll — é um `IntersectionObserver`, disparado uma vez.

**Justificativa:** uma imagem que aparece num corte seco durante a rolagem lê
como falha de carregamento. 150 ms é curto o bastante para não ser percebido
como animação e longo o bastante para não parecer um erro.

Com movimento reduzido: `opacity: 1` direto.

---

## 4. Os pinos

**Um pino por capítulo, com `position: sticky`, dentro do capítulo.**

```
.capitulo            height: 2,4 vp
  .palco             height: 1,4 vp     ← a "pista"
    .palco-fixo      position: sticky
                     top: 0
                     height: 100vh      ← o que fica preso
```

Regras:

- **Nunca `sticky` no nível da seção.** A rolagem continua normal e a barra de
  rolagem continua honesta sobre o comprimento da página.
- **Nunca sequestro de scroll.** Nenhum `preventDefault` em `wheel`, nenhum
  `scrollTo` programático durante a rolagem.
- **Duração curta:** ~40 % do capítulo é palco preso. A referência usa ~30 %.
  Nada perto dos 150 vh de pista que a auditoria anterior removeu do Advisor.
- **Nada de crossfade entre camadas pinadas.** Foi removido antes, de propósito,
  e não volta.

**Justificativa do sticky nativo em vez de JS:** ele é resolvido pelo compositor
do navegador, não custa um frame de JavaScript, e funciona com o motor de
scroll existente sem nenhuma alteração nele.

---

## 5. O que o movimento **não** faz

Lista de veto, explícita para não ser reaberta:

- ❌ Vídeo escrubado pelo scroll **fora da hero**. Dentro da hero é permitido e
  especificado (§3.0, T2); em qualquer outro ponto da página, não. O trecho
  removido em `a812f97` era escrubagem ao longo da página inteira — é isso que
  continua vetado, não a técnica.
- ❌ Push-in / zoom de câmera **fora da hero**, pela mesma razão
- ❌ Um segundo vídeo em qualquer lugar da página (`08-media-plan.md` §1)
- ❌ Vídeo com áudio, ou com som acionável pelo visitante
- ❌ Véu, gradiente ou sombra sobre o vídeo para forçar contraste de texto
- ❌ Parallax de qualquer camada
- ❌ Crossfade entre seções
- ❌ Entrada escalonada (*stagger*) de cards ou listas
- ❌ Contador que sobe sozinho ao carregar (`HeroOdometer` fica fora)
- ❌ Texto que digita sozinho
- ❌ Elementos que balançam, pulsam ou respiram em laço
- ❌ Blob ou gradiente com deriva lenta (`AmbientGlow` é removido)
- ❌ Qualquer animação de `blur`, `box-shadow`, `width`, `height` ou `top`
- ❌ Biblioteca de animação — `framer-motion` sai da landing

**Justificativa da saída do `framer-motion`:** hoje ele está no bundle da rota
pública para fazer **um** fade preto de 500 ms na volta do login. Esse fade é
duas linhas de CSS com `@keyframes`. Uma biblioteca inteira por um fade é o
oposto do princípio P2.

---

## 6. Degradação

Três níveis, todos já implementados no motor atual e preservados:

| Cenário | Comportamento |
|---|---|
| **Sem JS** | `stroke-dasharray` nunca é aplicado: todos os traços aparecem inteiros. Palcos escuros já no lugar. **A hero mostra o poster estático** e o bloco seguinte mostra a dashboard real. A página é 100 % legível. |
| **`prefers-reduced-motion: reduce`** | Ver §6.1 — a hero **não reproduz e não escruba**. |
| **JS falha depois de montar** | O último estado desenhado permanece. Se falhar durante a hero, o vídeo fica no quadro em que parou e a dashboard real continua logo abaixo. |
| **Vídeo falha ao carregar** | `<video>` com `poster` e um `<img>` de fallback: a hero vira uma composição estática — a pessoa apresentando o tablet — que é uma primeira dobra perfeitamente válida. |
| **`autoplay` bloqueado pelo navegador** | Idem: fica no poster. O scrub de T2 continua funcionando, porque `currentTime` não depende de `play()`. |

**Este é o teste decisivo do princípio P1:** se desligar todo o JavaScript e a
página continuar **apresentando, demonstrando e explicando** o Capital Cycle, o
movimento era função. Se ela ficar incompreensível, era ornamento. A hero passa
nesse teste porque o quadro parado dela já apresenta o produto.

### 6.1 `prefers-reduced-motion: reduce` na hero

Movimento de câmera e scrub são exatamente o que essa preferência existe para
evitar. Comportamento:

1. **Sem reprodução automática, sem scrub.** O `<video>` não é sequer inserido.
2. No lugar dele, **uma imagem estática**: o quadro de apresentação (~3,0 s), em
   que a pessoa mostra o tablet de frente. É o quadro que mais comunica dos 144.
3. A pista de scrub de 0,8 vp **desaparece**: o bloco encolhe de 1,8 para 1,0 vp.
4. O bloco seguinte entrega a dashboard real sem transição — corte direto.

**Nada se perde.** A hero continua apresentando o produto e a dashboard real
continua chegando logo em seguida. O que se perde é o movimento, que é o pedido.

**Não** oferecer um botão de "reproduzir mesmo assim": quem ativou a preferência
já respondeu à pergunta.

---

## 7. Orçamento de performance de movimento

- **Um** listener de `scroll` para a página inteira (o motor).
- **Um** `requestAnimationFrame` em voo por vez.
- Nenhuma leitura de layout na fase de escrita — a separação já está feita em
  `circuitoScroll.js` e é para ser mantida.
- `getTotalLength()` só na montagem e no resize.
- Alvo: **60 fps sustentados** durante a rolagem, num notebook de entrada.

**Correção necessária:** os dois laços extras de `requestAnimationFrame` em
`HomePage.jsx` (`useSecaoAtiva` e `useNavTema`) leem `getBoundingClientRect()`
por frame durante a rolagem. Ambos devem migrar para `IntersectionObserver`,
que resolve as duas perguntas sem custo por frame:

- **scroll-spy:** um observer com `rootMargin` de linha de leitura
- **tema da navbar:** uma sentinela de 1 px no topo do documento

Resultado: **três laços de rAF viram um** — e a escrita de `currentTime` do
scrub entra **nesse mesmo laço**, não em um novo.

### 7.1 Orçamento específico do scrub

- **O scrub só existe enquanto a pista da hero está em vista.** Fora dela, o
  `IntersectionObserver` do motor já desliga o trecho, e nenhum `currentTime` é
  escrito.
- **Nunca mais de uma escrita de `currentTime` por quadro decodificado.** Com
  `requestVideoFrameCallback` isso é garantido; sem ele, guardar o último valor
  escrito e comparar antes de escrever.
- **Pista curta:** 0,8 vp de rolagem para ~1,4 s de vídeo. Escrubar 6 s ao longo
  de várias viewports é o que trava telefones — e não é o que este documento
  especifica.
- **Alvo:** 60 fps no desktop durante o scrub; em mobile **não há scrub**
  (`05-storyboard-scroll.md`, mobile), então a questão não se coloca.
- **Medir com throttling de CPU 6×** antes de fechar a implementação. Se o
  scrub não sustentar 50 fps nessa condição, a saída é **reduzir o número de
  quadros escrubados** — reencodar o trecho de T2 com GOP curto — e não adicionar
  suavização, que mascararia o problema sem resolvê-lo.
