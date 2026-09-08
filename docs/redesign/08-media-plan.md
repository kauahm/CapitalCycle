# 08 — Plano de mídia

## 1. A política de mídia

A landing atual não mostra o produto: **zero capturas de tela**, e o único
"produto" que ela exibe é um retângulo com HTML reconstruído à mão.

A política aprovada tem quatro cláusulas:

1. **Um vídeo cinematográfico, e apenas um, na hero.**
2. **Screenshots e interfaces reais em todas as demais seções.**
3. **Nenhum vídeo decorativo adicional sem justificativa.** Um segundo vídeo é
   veto explícito em `07-motion-strategy.md` §5.
4. **A dashboard do vídeo faz *match* visual com a dashboard real seguinte.**

A cláusula 4 é a que amarra as outras três: o vídeo não é uma abertura solta,
é a **primeira metade de uma emenda**. Sem o *match*, ele vira um comercial
antes do produto; com ele, é o produto sendo entregue na mão de alguém.

---

## 2. O vídeo da hero

### 2.1 O asset atual, medido

`src/assets/video/ProductCapital.mp4` — presente no disco, **não versionado** e
hoje não referenciado por nenhum arquivo do código.

| | Atual | Alvo |
|---|---|---|
| Resolução | 1920×1080 | 1920×1080 e 1280×720 |
| Duração | 6,000 s (144 quadros @ 24 fps) | **~4,5 s** (ver 2.2) |
| Codec | H.264 **+ áudio AAC** | H.264 e AV1/VP9, **sem áudio** |
| Bitrate | 4,5 Mbps | ver 2.3 |
| Tamanho | **3,4 MB** | **≤ 900 KB** (H.264 720p) |

### 2.2 Cortar em ~4,5 s — decisão editorial e de peso ao mesmo tempo

O último segundo do vídeo não pode ir ao ar. Conforme o push-in avança, o texto
renderizado dentro da dashboard fica legível — e ele contém erros: **"CANTAL
CYCLE"** no lugar da marca na sidebar, "Contas e Calsas", "Orçamento por
Categaria", "Capital Advisar (IA)", "Olá, Cerents", "este más", "Ccriar minha
primeira meta", meses fora de ordem. Os números também não batem com
`demoAccount.js` (R$ 3.200 / R$ 7.842 / 3 contas, contra R$ 14.820 / R$ 9.412 /
4 contas), e o próprio vídeo se contradiz entre dois quadros. O inventário
completo está em `04-information-architecture.md` §2.3.

Cortar em ~4,5 s — o ponto de handoff — resolve isso **e** tira ~25 % do peso do
arquivo. É a mesma decisão que o briefing já previa ("trocar do vídeo para
imagem/interface assim que o tablet dominar o quadro").

**Os defeitos vêm da geração do vídeo, não da composição.** `FramesCeneHero/`
guarda `Dashboard.png`, a tela usada como fonte, e ela está correta em todos os
rótulos. O vídeo redesenhou a interface quadro a quadro em vez de compô-la, e é
daí que saem os erros. **A fonte limpa existe** — o que torna a reexportação
viável a um custo bem menor do que produzir material novo.

**Melhoria posterior, não bloqueante:** recompor a tela do tablet a partir de uma
**captura real** da aplicação (não de `Dashboard.png`, que é um mockup: barras do
gráfico todas na mesma altura, metas vazias, e números que não batem com
`demoAccount.js`) e reexportar o vídeo com essa tela sobreposta. Aí ele pode
correr até 6,0 s e o *match* fica perfeito. Enquanto isso não acontece, o corte
em 4,5 s entrega a hero sem nenhum defeito visível.

### 2.3 Codificação

Três arquivos, servidos por `<source>` em ordem de preferência:

| Arquivo | Uso | Alvo |
|---|---|---|
| `hero-1080.av1.mp4` | desktop, navegador moderno | ≤ 500 KB |
| `hero-720.h264.mp4` | fallback universal | ≤ 900 KB |
| `hero-mobile.h264.mp4` | < 768 px, enquadramento próprio | ≤ 450 KB |

Regras de encode:

- **Sem faixa de áudio** (`-an`). Um vídeo com áudio não recebe `autoplay` sem
  `muted`, e o AAC pesa sem servir a nada.
- **GOP curto no trecho escrubado** (keyframe a cada ~6 quadros a partir de
  ~3,0 s). Scrub é uma sequência de *seeks*; com GOP longo, cada seek decodifica
  o grupo inteiro e o scrub engasga. **É o parâmetro de encode mais importante
  desta página.**
- `-movflags +faststart`, para o `moov` ficar no começo do arquivo.
- `-pix_fmt yuv420p`, compatibilidade.

### 2.4 Poster e fallback estático

- **`hero-poster.webp`** — o quadro de 0,0 s, ≤ 60 KB. É o atributo `poster` e
  é o que aparece antes de o vídeo chegar, se o `autoplay` for bloqueado, ou se
  o arquivo falhar.
- **`hero-apresentacao.webp`** — o quadro de ~3,0 s, em que a pessoa mostra o
  tablet de frente. É a imagem usada com `prefers-reduced-motion: reduce`
  (`07-motion-strategy.md` §6.1) e no fallback sem JS. **É o quadro que mais
  comunica dos 144**, e por isso é ele, e não o de 0,0 s, que substitui o vídeo
  quando não há movimento.

### 2.5 Carregamento

```html
<link rel="preload" as="video" href="/media/hero-720.h264.mp4"
      type="video/mp4" fetchpriority="high">
```

- **`preload="auto"`** no `<video>` da hero — é o LCP da página, não pode ser
  adiado.
- `muted`, `playsinline`, `disablepictureinpicture`, **sem `controls`**,
  **sem `loop`**.
- **Sem `autoplay` no atributo.** A reprodução é disparada por
  `IntersectionObserver`, o que evita que ela comece antes de o vídeo estar
  visível e dá o ponto de parada em T_SCRUB.
- Em conexões lentas (`navigator.connection.saveData` ou `effectiveType` 2g/3g):
  **não carregar o vídeo** e usar `hero-apresentacao.webp` direto. A hero
  continua funcionando; a pessoa só não vê o gesto.

### 2.6 Por que capturas estáticas nas demais seções

| Critério | Captura estática | Vídeo |
|---|---|---|
| Produção | Uma pessoa, um navegador, uma tarde | Roteiro, gravação, edição, exportação |
| Peso (5 telas) | ~600 KB | 8–20 MB |
| Manutenção | Recapturar 1 arquivo | Regravar a sequência |
| Legibilidade de números | Total | Perde em compressão |

**Justificativa decisiva:** o conteúdo que precisa ser lido nas telas dos
capítulos são **números e rótulos pequenos**. Compressão de vídeo destrói
exatamente isso — um dashboard financeiro a 1,5 Mbps é um borrão cinza. É a
mesma razão pela qual o vídeo da hero **entrega o quadro à captura real** no
momento em que o texto começaria a ser lido.

---

## 3. Assets necessários

### 3.1 Capturas do produto — **prioridade máxima**

Cinco telas, cada uma em duas versões (desktop e mobile). **Dez arquivos.**

| # | Tela | Rota | Usada em |
|---|---|---|---|
| 1 | Dashboard completo | `/capital/dashboard` | Entrada no produto + Analisar |
| 2 | Contas e Caixas | `/capital/contas` | Organizar |
| 3 | Transações | `/capital/transacoes` | Organizar |
| 4 | Ciclos e Metas | `/capital/ciclos` | Ciclos e metas |
| 5 | Capital Advisor | `/capital/analise-ia` | Capital Advisor |

**Especificação:**

- **Desktop:** 2560×1600 capturados, entregues a 1600×1000 (@1x) e 2560×1600
  (@2x), WebP qualidade 82
- **Mobile:** 828×1792 capturados, entregues a 414×896 e 828×1792
- Sem moldura de dispositivo, sem sombra, sem cantos arredondados, sem
  perspectiva — o palco é full-bleed (princípio P5)
- Capturar com o **tema real do app** (`#070b14`)
- Barra do navegador **fora** do enquadramento

**Regra de conteúdo — inegociável:**

> Os dados das capturas têm que ser **os mesmos de `demoAccount.js`**.

Saldo disponível R$ 14.820, investido R$ 9.412, 4 contas, sobra R$ 1.236,50,
meta "Reserva de emergência" 6.400/10.000. Se a captura mostrar outros números,
a página se contradiz na mesma dobra — exatamente o problema que
`demoAccount.js` foi criado para evitar.

**Como produzir:** criar uma conta de demonstração real no Firebase, popular com
esses dados via a própria interface, e capturar. Não é mockup: é o produto.

**Captura nº 1 tem um requisito extra — o *match*.** Ela é a metade seguinte da
emenda com o vídeo. Precisa de uma variante enquadrada para coincidir com o
último frame exibido (~4,5 s): mesma proporção de tela dentro do quadro, mesma
posição, mesmo recorte. Calibrar comparando os dois lado a lado, com tolerância
de ~2 % em escala e posição (`05-storyboard-scroll.md`). Na prática são **duas**
saídas do mesmo screenshot: a de *match* e a full-bleed do capítulo Analisar.

**Problema conhecido a resolver:** os rótulos de mês em `demoAccount.js` derivam
da data corrente, mas os das capturas ficam congelados. Duas saídas — (a) as
capturas viram um item de manutenção anual, ou (b) `demoAccount.js` passa a
usar meses fixos que batem com a captura. **Recomendação: (a)**, porque manter a
página viva vale mais que evitar uma recaptura por ano; e o custo é um item de
checklist, não código.

### 3.2 Imagem Open Graph — **prioridade alta**

`public/og.png`, 1200×630. Fundo `#070b14`, a marca, `Todo capital tem um ciclo.`
e um trecho do traço. Sem captura de tela dentro (ilegível a 1200×630).

**Justificativa:** hoje o link não gera preview em nenhum lugar. Para um produto
distribuído por WhatsApp e Instagram, é a maior perda de conversão da página, e
custa um arquivo.

### 3.3 Logo em SVG — **prioridade alta**

Hoje: `logo-topo.png` (81 KB) e `logo-black.png` (38 KB) — **119 KB para uma
marca renderizada a 32 px de altura.**

Em SVG: provavelmente < 4 KB, uma versão só (`currentColor` resolve claro e
escuro), nítida em qualquer densidade.

**Efeito colateral bom:** o alinhamento óptico do logo hoje depende de
compensações em fração da altura do PNG (`-0.2676`, `-0.0465` em
`HomePage.jsx`), calculadas a partir de onde a tinta começa dentro do arquivo.
Um SVG com `viewBox` correto **elimina essas compensações**.

### 3.4 Favicon

`public/favicon.svg` já existe. Verificar que corresponde à marca atual.

---

## 4. Assets que **não** serão produzidos

| Não produzir | Motivo |
|---|---|
| Um segundo vídeo, em qualquer seção | Cláusula 3 da política (§1); veto em `07-motion-strategy.md` §5 |
| Render 3D de tablet ou notebook | "Estética futurista genérica", proibida |
| Mockup de dispositivo em volta das telas dos capítulos | Reduz o produto a um retângulo pequeno (P5). O tablet da hero é a única exceção, e é narrativa, não moldura |
| Stock imagery financeira | Proibida pela direção visual. **Não alcança a hero**, que é produção própria mostrando a interface real |
| Ilustração conceitual de ciclo | O traço já é isso, e é medido |
| Ícones de funcionalidade | Reintroduz "ícone em quadradinho tintado", proibido |
| Vídeo de fundo | Nunca esteve em discussão; anula a legibilidade |
| Selos, escudos, cadeados de segurança | O bloco Fundamentos é texto (P1) |
| Fotos de "equipe" ou depoimentos ilustrados | Não há material verdadeiro |

---

## 5. Entrega técnica

```html
<picture>
  <source media="(max-width: 767px)"
          srcset="/media/dashboard-mobile.webp 1x,
                  /media/dashboard-mobile@2x.webp 2x">
  <img src="/media/dashboard.webp"
       srcset="/media/dashboard.webp 1x, /media/dashboard@2x.webp 2x"
       width="1600" height="1000"
       alt="Painel do Capital Cycle mostrando saldo disponível de R$ 14.820,
            R$ 9.412 investidos e o fluxo líquido dos últimos seis meses."
       loading="lazy" decoding="async">
</picture>
```

Regras:

- `width` e `height` **sempre** — sem eles, cada imagem que carrega empurra o
  layout e desloca a geometria medida do circuito. Isto não é só CLS: quebra
  o desenho.
- `loading="lazy"` em todas, **exceto** a primeira (a do bloco "Entrada no
  produto"), que recebe `fetchpriority="high"` e um `<link rel="preload">`.
- `alt` descreve **o que a tela mostra**, com os números. É o que um leitor de
  tela precisa e é o que o Google indexa.
- Arquivos em `public/media/` e servidos com hash pelo Vite ou com cache longo
  configurado no `firebase.json`.

---

## 6. Orçamento de peso

| Asset | Alvo |
|---|---|
| **Vídeo da hero (720p H.264)** | **≤ 900 KB** |
| Vídeo da hero (1080p AV1) | ≤ 500 KB |
| Vídeo da hero (mobile) | ≤ 450 KB |
| `hero-poster.webp` | ≤ 60 KB |
| `hero-apresentacao.webp` | ≤ 80 KB |
| Captura desktop @1x | ≤ 120 KB |
| Captura desktop @2x | ≤ 280 KB |
| Captura mobile @1x | ≤ 60 KB |
| Logo SVG | ≤ 4 KB |
| `og.png` | ≤ 150 KB |
| **Total de mídia na primeira dobra** (poster + vídeo) | **≤ 960 KB** |
| **Total de mídia da página inteira (@1x)** | **≤ 1,7 MB** |

O vídeo é, sozinho, mais da metade do orçamento de mídia da página — e é por isso
que o corte em 4,5 s, o encode sem áudio e o `hero-mobile` separado não são
detalhes de acabamento: são o que mantém a hero dentro do orçamento. O arquivo
como está hoje (3,4 MB, com áudio, 6 s) estouraria sozinho o total da página.

**Compensação:** as correções de `09-performance-plan.md` removem ~750 KB de
JavaScript da rota pública. O vídeo entra no espaço que elas abrem — não em cima
do que já existe.

---

## 7. Manutenção

Quando a interface do produto mudar, **as capturas mudam junto**. Um item no
checklist de release:

> Alterou uma das cinco telas da landing? Recapture, ou a página passa a mostrar
> um produto que não existe mais.

E, para a captura nº 1, um segundo item:

> Recapturou a dashboard? Reconfira o *match* com o último frame do vídeo. A
> emenda é o argumento da hero; se ela saltar, a hero perde o desfecho.

O vídeo em si envelhece mais devagar — o gesto humano não muda — mas a dashboard
dentro dele sim. Quando ela divergir demais da interface real, é sinal de que
chegou a hora da reexportação descrita em §2.2.

É o mesmo princípio que `estacoes.js` já aplica aos números. A mídia só entra na
página sob a mesma disciplina.
