# 09 — Plano de performance

## 1. Linha de base medida (build de 2026-09-07 em `dist/`)

| Recurso | Tamanho | Carregado em `/`? |
|---|---|---|
| `firebase-*.js` | **462 KB** | **Sim** |
| `index-*.js` | **429 KB** | **Sim** |
| `index-*.css` | 45 KB | Sim |
| `logo-topo.png` | 81 KB | Sim |
| `logo-black.png` | 38 KB | Sim (o outro fica ocioso) |
| Rotas do painel | 8–19 KB cada | Não (lazy — correto) |

> **Um visitante que abre a landing e nunca faz login baixa ~890 KB de
> JavaScript** para ver uma página cujo conteúdo é texto e SVG.

E o redesign vai **adicionar ~1,7 MB de mídia** — dos quais ~900 KB são o vídeo
da hero, na primeira dobra. Sem as correções abaixo, a página fica mais pesada e
mais lenta do que já é.

**A relação entre as duas coisas é o argumento central deste documento:** as
correções liberam ~750 KB de JavaScript inútil na rota pública, e o vídeo ocupa
esse espaço com algo que o visitante realmente vê. A hero aprovada só cabe
porque a limpeza acontece antes dela.

---

## 2. As sete causas

### C1 — O Firebase inteiro na rota pública `[462 KB]`

`AuthProvider` está na raiz do `App` e importa `firebase/auth` +
`firebase/firestore`. A landing não autentica ninguém.

### C2 — Login, Register e Payment no bundle inicial `[grande parte dos 429 KB]`

Os três são importados ansiosamente em `App.jsx`, ao contrário das rotas do
painel. `Payment.jsx` sozinho tem 810 linhas, incluindo geração de payload PIX.

### C3 — `framer-motion` para um fade de 500 ms

A biblioteca inteira no bundle público por um `motion.div` de opacidade.

### C4 — CSS injetado em runtime

Sete componentes injetam `<style>{CSS}</style>` — ~1.160 linhas de CSS que não
passam pelo pipeline do Vite, não são minificadas junto, não têm cache próprio,
e são reinseridas no DOM a cada montagem.

### C5 — Três laços de `requestAnimationFrame`

`useSecaoAtiva` e `useNavTema` (`HomePage.jsx`) leem `getBoundingClientRect()`
por frame durante a rolagem, além do motor do circuito.

### C6 — Logo em PNG de 119 KB para 32 px de altura

### C7 — Sem headers de cache no `firebase.json`

E sem `preload` da fonte: a Inter chega tarde, o layout reflui, e **quatro
componentes precisam de `document.fonts.ready` para remedir a geometria**. Isso
é um sintoma, não uma solução.

---

## 3. As correções, em ordem de retorno

### F1 — Tirar o Firebase da rota pública `[−462 KB]` ⭐ maior ganho isolado

`AuthProvider` deixa de estar na raiz e passa a envolver apenas as rotas que
precisam de autenticação:

```jsx
<Routes>
  <Route path="/" element={<HomePage />} />          {/* sem AuthProvider */}
  <Route element={<ComAuth />}>                       {/* lazy + AuthProvider */}
    <Route path="/login" .../>
    <Route path="/cadastro" .../>
    <Route path="/pagamento" .../>
    <Route path="/capital" .../>
  </Route>
</Routes>
```

Com `ComAuth` em `React.lazy`, o chunk do Firebase só é buscado quando alguém
sai da landing.

**Cuidado:** o `MainNav` tem um `Link to="/login"`. Um `Link` não dispara o
import — só a navegação dispara. Opcionalmente, pré-carregar o chunk no
`mouseenter` do botão "Entrar".

### F2 — `React.lazy` em Login, Register e Payment `[−100 a 150 KB]`

Mesmo tratamento já dado às rotas do painel. Não há razão para o tratamento ser
diferente.

### F3 — Remover `framer-motion` da landing `[−40 a 60 KB]`

O fade preto de volta do login vira:

```css
@keyframes cch-revelar { from { opacity: 1 } to { opacity: 0 } }
```

### F4 — Mover o CSS das seções para arquivos `.css` importados `[−~15 KB e
menos trabalho de runtime]`

`import './heroStyles.css'` em vez de `<style>{HERO_CSS}</style>`. O Vite
extrai, minifica, junta e versiona por hash. O CSS passa a ter cache próprio e
some do bundle de JS.

**Ressalva honesta:** os arquivos `*Styles.js` contêm comentários longos e
valiosos, que explicam *por que* cada decisão foi tomada. Comentários CSS
sobrevivem à migração — mas o minificador os remove no build, que é o desejado.

### F5 — Três laços de rAF viram um `[ganho de frame time]`

- **scroll-spy:** `IntersectionObserver` com `rootMargin` de linha de leitura
- **tema da navbar:** sentinela de 1 px no topo + `IntersectionObserver`

Ambos deixam de custar leitura de layout por frame.

### F6 — Logo em SVG `[−115 KB]`

Uma versão só, com `currentColor`. Elimina de quebra as compensações de
alinhamento óptico em fração de pixel.

### F7 — Headers de cache no `firebase.json`

```json
"headers": [
  { "source": "/assets/**",
    "headers": [{ "key": "Cache-Control",
                  "value": "public,max-age=31536000,immutable" }] },
  { "source": "/media/**",
    "headers": [{ "key": "Cache-Control",
                  "value": "public,max-age=31536000,immutable" }] },
  { "source": "/index.html",
    "headers": [{ "key": "Cache-Control", "value": "no-cache" }] }
]
```

Assets do Vite já têm hash no nome; `immutable` é seguro. `index.html` **não**
pode ter cache longo, senão um deploy não chega ao usuário.

### F8 — `preload` da fonte

Hoje: `preconnect` para `fonts.googleapis.com` + um `<link rel="stylesheet">`.
São **duas viagens em série** antes de qualquer texto aparecer.

Melhor: hospedar o `.woff2` variável em `public/fonts/` e:

```html
<link rel="preload" href="/fonts/inter-var.woff2" as="font"
      type="font/woff2" crossorigin>
```
com `font-display: swap` no `@font-face`.

**Efeito colateral importante:** com a fonte disponível antes do primeiro paint,
as remedições por `document.fonts.ready` em quatro componentes deixam de ser
críticas. Elas continuam como rede de segurança, mas param de ser a diferença
entre o circuito estar certo ou errado no primeiro quadro.

---

## 4. Projeção

| | Hoje | Depois |
|---|---|---|
| JS na rota `/` | ~890 KB | **~140 KB** |
| CSS | 45 KB (parcial; parte está no JS) | ~28 KB |
| Logos na primeira dobra | 119 KB (PNG) | ~4 KB (SVG) |
| Poster da hero | — | ~60 KB |
| **Vídeo da hero** | — | **~900 KB** |
| Mídia dos capítulos | 0 | ~700 KB (lazy, abaixo da dobra) |
| **Total da primeira dobra** | **~1.054 KB** | **~1.132 KB** |
| **— dos quais o visitante vê** | logos e texto | **o produto sendo apresentado** |

**A primeira dobra fica praticamente do mesmo peso — e passa a mostrar o
produto.** Hoje esse peso é JavaScript que o visitante nunca usa; depois, é o
vídeo aprovado. É a mesma conta com o dinheiro gasto em outra coisa.

**Sem o vídeo** (mobile em conexão lenta, `prefers-reduced-motion`, `save-data`),
a primeira dobra cai para **~232 KB** — ~4,5× mais leve que hoje.

---

## 5. Orçamento de performance (limites, não metas)

| Métrica | Limite |
|---|---|
| JS na primeira dobra | ≤ 180 KB comprimido |
| CSS | ≤ 35 KB |
| **Vídeo da hero (variante servida)** | **≤ 900 KB** |
| Mídia na primeira dobra, sem o vídeo | ≤ 200 KB |
| Peso total da página | ≤ 2,6 MB |
| **LCP (4G, notebook de entrada)** | **≤ 2,5 s** |
| CLS | **≤ 0,02** |
| INP | ≤ 200 ms |
| FPS durante o scroll | 60 sustentados |
| **FPS durante o scrub (CPU 6×)** | **≥ 50** |

**LCP subiu de 2,0 s para 2,5 s** e isto é uma concessão consciente: o elemento
LCP passa a ser o vídeo da hero, e ele não pode ser adiado. O que mantém a
métrica sob controle é o `poster` — se ele pintar cedo, o LCP é dele, não do
vídeo. **Por isso o poster tem orçamento próprio de 60 KB e `preload`.**

**CLS a 0,02 e não 0,1:** a geometria do circuito é medida do DOM. Um
deslocamento de layout não é só um número ruim de Core Web Vitals — ele desenha
a linha no lugar errado.

---

## 6. Riscos de performance específicos deste redesign

### R0 — O vídeo da hero na primeira dobra `[alto]`
900 KB bloqueando a percepção de carregamento da página inteira.
**Mitigações, em ordem:** (a) `poster` leve com `preload`, para que o LCP seja
ele e a hero pinte imediatamente; (b) corte em 4,5 s, −25 % do arquivo;
(c) `hero-mobile` separado, mais leve; (d) `save-data` e 2g/3g **não baixam o
vídeo**, caem no quadro estático; (e) AV1/VP9 primeiro, para quem suporta.
**Verificação:** LCP medido com e sem vídeo; se o LCP for o vídeo e não o poster,
a mitigação (a) falhou e precisa ser refeita antes de seguir.

### R0b — O scrub travar em máquinas modestas `[médio]`
Escrubar vídeo é uma sequência de *seeks*; com GOP longo, cada seek decodifica o
grupo inteiro.
**Mitigações:** GOP curto no trecho escrubado (`08-media-plan.md` §2.3) — é o
parâmetro mais importante; pista curta de 0,8 vp; escrita de `currentTime` no
rAF já existente, no máximo uma por quadro decodificado; **sem scrub em mobile**.
**Verificação:** Performance do DevTools com CPU 6×; se não sustentar 50 fps,
reencodar com mais keyframes — **nunca** adicionar suavização, que esconde o
problema em vez de resolvê-lo.

### R1 — Cinco telas full-bleed em @2x
**Mitigação:** `srcset` com @1x e @2x, `loading="lazy"` em todas menos a
primeira, orçamento de peso por arquivo (`08-media-plan.md` §6).

### R2 — Palcos `sticky` de 100vh e repaint
`position: sticky` com uma imagem grande dentro pode forçar repaint em GPUs
fracas.
**Mitigação:** `contain: paint` no palco; `will-change` **apenas** durante a
rolagem, nunca permanente. Medir em um Android intermediário real antes de
fechar a implementação.

### R3 — Mais seções, mais paths registrados no motor
**Mitigação:** o `IntersectionObserver` do motor já pula seções fora de vista.
`getTotalLength()` continua só na montagem e no resize.

### R4 — A remoção do `AuthProvider` da raiz quebrar algo
É a correção de maior ganho e maior risco.
**Mitigação:** fazer **isolada**, em commit próprio, e testar os quatro fluxos:
visitante anônimo, login, cadastro completo e sessão já autenticada abrindo `/`.

---

## 7. Como medir

Antes e depois de cada correção, no mesmo build de produção:

```bash
npm run build
```

- Tamanho dos chunks: `ls -la dist/assets`
- O que entra na rota `/`: aba Network do DevTools, cache desligado
- Lighthouse em modo mobile, com throttling
- FPS durante a rolagem: Performance do DevTools, 6× de CPU throttling

Para a hero, três medições próprias:

- **LCP com e sem o vídeo.** Se o elemento LCP for o `<video>` e não o `poster`,
  a estratégia de poster falhou — corrigir antes de seguir.
- **FPS durante o scrub**, com CPU 6×. Limite: 50 fps.
- **Peso servido por variante**, confirmando que o navegador escolheu o
  `<source>` esperado (AV1 no desktop moderno, H.264 no resto, `hero-mobile` em
  telefone) e que `save-data` realmente não baixa vídeo nenhum.

**Nenhuma correção é dada como concluída sem número antes e número depois.**
É o mesmo princípio que rege a página: só conta o que é medido.
