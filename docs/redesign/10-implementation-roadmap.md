# 10 — Roteiro de implementação

Nove etapas, em ordem de dependência. Cada uma é **um commit**, verificável
isoladamente, e a página fica funcional ao final de todas elas.

**Regra que rege este roteiro:** nenhuma etapa começa antes de a anterior estar
commitada. É a lição que gerou as regras de segurança do `CLAUDE.md` — trabalho
não commitado é trabalho que pode se perder.

---

## Etapa 0 — Salvar o estado atual `[bloqueante]`

O `git status` mostra 12 arquivos modificados, 14 deletados e 5 não rastreados.
**O working tree não corresponde a nenhum commit.**

```
1. git status  — revisar item por item
2. Decidir com o usuário: as deleções de referencias/ e dos vídeos do hero
   são intencionais?
3. Commit WIP de tudo que fica
4. git push
```

**Nada mais começa antes disso.** Não é burocracia: os arquivos não rastreados
de hoje não existem em nenhum commit, stash ou branch. Entre eles, três que o
redesign **precisa** ter:

| Não rastreado | Por que não pode se perder |
|---|---|
| `src/assets/video/ProductCapital.mp4` | **O vídeo aprovado da hero**, 3,4 MB |
| `FramesCeneHero/` | A composição-fonte da dashboard do vídeo e os frames de referência — é o material para a reexportação descrita em `08-media-plan.md` §2.2 |
| `src/components/home/estacoes.js` | A camada de identidade da Home, que o redesign preserva |

Também não rastreados: `CapitalCycle-Hero-Referencias/`, `HeroOdometer.jsx`,
`.claude/`.

**Decisão a tomar com o usuário antes do commit:** o repositório já versiona
vídeos, e o `CLAUDE.md` registra que `git push` chega a falhar por isso. Vale
decidir se o `.mp4` entra no Git ou se os assets de mídia passam a viver fora
dele. **Não decidir sozinho.**

---

## Etapa 1 — Limpeza `[sem risco visual]`

Remover o que não é referenciado por ninguém:

- `components/home/AmbientGlow.jsx` e `.cc-ambient*` em `index.css`
- `components/home/FloatingFigures.jsx`
- `components/home/hero/HeroOdometer.jsx`
- `components/shared/PrivateRoute.jsx` (duplicata)
- `components/ui/CurriculoUpload.jsx`
- `hooks/useFirestore.js`

**`ProductCapital.mp4` NÃO é removido** — é o asset aprovado da hero. Na Etapa 3
ele é reencodado e movido para `public/media/`. Até lá, permanece onde está.
**Cuidado:** é um arquivo não rastreado de 3,4 MB. Precisa entrar num commit na
Etapa 0, antes de qualquer limpeza, ou corre o risco de ser perdido.

**Decidir com o usuário:** `pages/admin/Usuarios.jsx` (540 linhas, sem rota).
São três opções — dar-lhe uma rota, arquivar em branch própria, ou remover.
**Não decidir sozinho.**

**Verificação:** `npm run build` e `npm run lint` passam; a página não muda.

---

## Etapa 2 — Performance estrutural `[maior ganho, maior risco]`

Correções F1, F2, F3, F6, F7, F8 de `09-performance-plan.md`.

**Um commit por correção**, nesta ordem:

1. F7 — headers de cache no `firebase.json` (risco zero)
2. F6 — logo em SVG (elimina as compensações ópticas)
3. F8 — fonte auto-hospedada com `preload`
4. F3 — remover `framer-motion` da landing
5. F2 — `React.lazy` em Login, Register, Payment
6. **F1 — tirar o `AuthProvider` da raiz** ← isolado, testado a fundo

**Testes obrigatórios da F1:** visitante anônimo em `/`; login completo;
cadastro completo até `/pagamento`; sessão já autenticada abrindo `/`;
`/capital/dashboard` direto pela URL sem sessão.

**Meta ao fim:** JS na rota `/` abaixo de 180 KB.
**Verificação:** `ls -la dist/assets` e aba Network, número antes e depois.

---

## Etapa 3 — Produzir a mídia `[sem código]`

Pode correr em paralelo com as etapas 1 e 2.

### 3a — Capturas do produto

1. Criar uma conta de demonstração real no Firebase
2. Popular com **exatamente** os dados de `demoAccount.js`
3. Capturar as cinco telas, em desktop e mobile (`08-media-plan.md` §3.1)
4. Exportar em WebP @1x e @2x, dentro do orçamento de peso
5. **Variante de match** da captura nº 1 (dashboard), enquadrada para coincidir
   com o último frame exibido do vídeo
6. Produzir `public/og.png`
7. Colocar em `public/media/`

**Portão:** se as capturas não baterem com `demoAccount.js`, a etapa não está
concluída. A página se contradiria na mesma dobra.

### 3b — Preparar o vídeo da hero

1. **Determinar o ponto de handoff** examinando os quadros entre 4,3 s e 4,8 s:
   o último em que a tela do tablet cobre a viewport e o texto interno ainda
   **não** está legível
2. **Cortar** o vídeo nesse ponto (~4,5 s)
3. **Remover a faixa de áudio** (`-an`)
4. Encodar as três variantes com **GOP curto a partir de ~3,0 s**
   (`08-media-plan.md` §2.3)
5. Extrair `hero-poster.webp` (0,0 s) e `hero-apresentacao.webp` (~3,0 s)
6. Colocar tudo em `public/media/` e **versionar**

**Portão:** cada variante dentro do orçamento de peso, e nenhum defeito de texto
legível no último quadro exibido.

**Item aberto, não bloqueante:** reexportar o vídeo com uma captura real da
aplicação dentro do tablet e os números de `demoAccount.js`
(`08-media-plan.md` §2.2). Melhora o *match* e libera o corte em 6,0 s.
Registrado como melhoria; não segura nenhuma etapa.

---

## Etapa 4 — Reduzir o circuito de sete para cinco estações

1. `estacoes.js`: `TOTAL_ESTACOES = 5`; remover as leituras 5 (INVESTIR) e 6
   (EVOLUIR); reindexar ESCOLHER para 5; ajustar `INDICE_DO_HERO`
2. Remover `PassagemSection.jsx` e `passagemStyles.js`
3. Remover `RetornoSection.jsx` e `retornoStyles.js`
4. Remover `geometriaDaPassagem` e `geometriaDoRetorno` de
   `circuitoGeometria.js`
5. `PlanosSection`: a estação vira 5

**Justificativa:** `04-information-architecture.md` §3 — as duas estações
apontavam para funcionalidades que não existem.

**Verificação:** o traço continua contínuo do Hero até os Planos; os códigos
leem `01/05` a `05/05`; o motor não registra trechos órfãos.

---

## Etapa 5 — O sistema de capítulo

A peça de arquitetura nova. Um componente reutilizável usado quatro vezes:

```jsx
<Capitulo
  estacao={2}
  headline="Tudo o que você tem, em um número só."
  midia={{ desktop, mobile, alt }}
  corpo="..."
  prova={{ valor, unidade }}
/>
```

Ele implementa, de uma vez só para os quatro capítulos:
o compasso de 2,4 vp (P3), o palco `sticky` de 1,0 vp, a alternância
claro→escuro→claro (P5), a hierarquia de 4× (P6) e o registro no motor do
circuito (P8).

**Justificativa:** quatro capítulos com a mesma medida exigem **um** componente.
Quatro implementações separadas garantem que o compasso quebre na primeira
alteração — e o compasso é o que faz a página ler como ciclo.

Migrar `ProdutoSection` e `CapitalAdvisorSection` para ele. Criar os dois novos
capítulos (Analisar, Ciclos e metas).

**Verificação:** as quatro alturas não divergem mais de 10 % entre si.

---

## Etapa 6 — Hero cinematográfica e match cut `[a peça mais delicada]`

Seis passos, nesta ordem — **cada um verificável antes do seguinte**:

1. **Composição estática primeiro.** Poster no lugar do vídeo, headline, lead,
   CTAs e a coluna de estações posicionados. Fechar a legibilidade do texto
   sobre o fundo do vídeo **sem véu, sem gradiente, sem sombra** — se faltar
   contraste, move-se o texto. Esta é a versão que roda com
   `prefers-reduced-motion` e sem JS, e ela precisa estar boa sozinha.
2. **T1 — reprodução.** Trocar o poster pelo `<video>`, disparar por
   `IntersectionObserver`, parar em `T_SCRUB`.
3. **T2 — scrub.** Escrita de `currentTime` **dentro do rAF do motor**, nunca num
   laço novo. Medir FPS com CPU 6× antes de seguir.
4. **T3 — match cut.** Inserir a captura de *match*, calibrar o enquadramento
   dentro de ~2 %, trocar num quadro. **Sem crossfade.**
5. **T4 — bloco 2.** A dashboard real assume em 0,95 vh, full-bleed.
6. **Corrigir o lead** (`06-content-strategy.md` §2.1) e confirmar que o clímax
   numérico **saiu** da hero e está no capítulo Analisar.

**Verificação, cinco cenários:**

| Cenário | Esperado |
|---|---|
| Desktop, tudo normal | vídeo roda, escruba, corta para a dashboard |
| `prefers-reduced-motion` | imagem estática de ~3,0 s, sem pista de scrub, corte direto |
| Sem JS | poster + dashboard real logo abaixo; página legível |
| `autoplay` bloqueado | fica no poster; o scrub continua funcionando |
| Vídeo falha ao carregar | composição estática; nenhum buraco no layout |

**Se o passo 4 não fechar** — se a emenda saltar de forma perceptível em alguma
largura —, a saída é **antecipar mais o handoff**, não adicionar crossfade.
Um crossfade sobrepõe as duas imagens exatamente onde elas precisam parecer a
mesma coisa.

---

## Etapa 7 — Blocos novos

1. **Manifesto** — três frases, sem mídia
2. **Recursos em detalhe** — grade tipográfica de sete itens
3. **Dados / confiança** — segurança e dados, só fatos verificáveis
4. **Footer** — o primeiro da história do projeto

**Portão:** Termos de uso e Privacidade precisam **existir** antes de o footer
apontar para eles. Um link morto num footer de produto financeiro é pior que a
ausência dele. Se ainda não existirem, o footer entra sem esses dois links e
eles viram um item aberto e declarado.

---

## Etapa 8 — Correções de copy, metadados e mobile

1. As três correções de copy (`06-content-strategy.md` §2)
2. `index.html`: título, description, Open Graph, canonical
3. **Menu de navegação abaixo de 980 px**, que hoje simplesmente some
4. Capturas mobile nos palcos, com pino de 0,7 vh
5. Escala de clímax mobile (~64 px)
6. **A hero em retrato** (`05-storyboard-scroll.md`, mobile): variante
   `hero-mobile`, **sem scrub**, texto acima do vídeo em vez de ao lado

---

## Etapa 9 — Verificação final

| Verificação | Critério |
|---|---|
| Lighthouse mobile | Performance ≥ 90, Acessibilidade ≥ 95 |
| CLS | ≤ 0,02 |
| JS na rota `/` | ≤ 180 KB |
| Sem JavaScript | Página inteiramente legível |
| `prefers-reduced-motion` | Nenhum movimento, nenhuma perda de conteúdo |
| Teclado | Toda a página navegável, foco sempre visível |
| Compasso | Os quatro capítulos com ≤ 10 % de desvio |
| **Hero — desktop** | vídeo roda, escruba a 50+ fps com CPU 6×, corta sem salto |
| **Hero — mobile** | reprodução única até o handoff, **sem scrub**, captura mobile |
| **Hero — reduced-motion** | quadro estático de ~3,0 s, sem pista de scrub |
| **Hero — sem vídeo** | poster ou quadro estático; nenhum buraco no layout |
| **Hero — último quadro** | nenhum texto da sidebar do vídeo legível a 100 % |
| **LCP** | é o `poster`, não o `<video>` |
| Números | Todos derivados de `demoAccount.js` / `plans.js` |
| Capturas | Batem com `demoAccount.js` |
| Copy | Nenhuma afirmação fora de `01-product-truth.md` |
| Checklist de veto | Zero itens marcados (`03-design-principles.md`) |

**Deploy:** só depois de tudo commitado e enviado ao GitHub, confirmando branch
e commit antes de publicar — regra 2 do `CLAUDE.md`.

---

## Riscos técnicos

### RT1 — Tirar o `AuthProvider` da raiz `[alto]`
É a correção de maior ganho (−462 KB) e a que mais pode quebrar. Um `Link` para
`/login` não dispara o import do chunk; a navegação sim. Se algum componente
fora de `/capital` chamar `useAuth`, quebra em runtime.
**Mitigação:** commit isolado; `grep -rn "useAuth" src/` antes; os cinco testes
de fluxo da Etapa 2.

### RT1b — O match cut não fechar `[médio, e é o risco de direção]`
Se o enquadramento da captura não coincidir com o último frame, a emenda salta e
chama atenção para si — destruindo justamente o efeito que a hero existe para
produzir.
**Mitigação:** calibrar com os dois quadros lado a lado, tolerância de ~2 %;
antecipar o handoff se necessário; jamais mascarar com crossfade.
**Verificação:** gravar a tela rolando e assistir quadro a quadro.

### RT1c — Os defeitos de texto do vídeo aparecerem `[alto se ignorado]`
"CANTAL CYCLE" em tela cheia na primeira dobra de um produto financeiro é um
dano de credibilidade maior que qualquer ganho da hero.
**Mitigação:** o corte em ~4,5 s (Etapa 3b) é obrigatório, não opcional.
**Verificação:** examinar o último quadro exibido a 100 % de zoom, em 1440 px e
em 1920 px de largura. Nenhum texto da sidebar pode estar legível.

### RT2 — Geometria do circuito com imagens grandes `[médio]`
A geometria é medida do DOM. Uma imagem sem `width`/`height` desloca tudo, e a
linha é desenhada no lugar errado.
**Mitigação:** `width`/`height` obrigatórios; `ResizeObserver` já existe e cobre
o reflow; testar com cache desligado em rede lenta.

### RT3 — `sticky` de 100vh com imagem grande em GPU fraca `[médio]`
**Mitigação:** `contain: paint`; `will-change` só durante a rolagem; medir num
Android intermediário real antes de fechar.

### RT4 — Migrar o CSS de string para arquivo `[baixo, tedioso]`
São ~1.160 linhas em 7 arquivos, com comentários longos e valiosos que precisam
sobreviver. Uma classe perdida quebra silenciosamente.
**Mitigação:** um arquivo por commit; comparação visual antes/depois de cada um.

### RT5 — Capturas envelhecerem `[baixo, permanente]`
Os meses em `demoAccount.js` derivam da data; os das capturas ficam congelados.
**Mitigação:** item no checklist de release, recaptura anual.

### RT6 — O pagamento continua simulado `[fora do escopo, mas real]`
O redesign vai deixar a página muito mais convincente. **Quanto melhor a
landing, mais gente chega a um fluxo de pagamento que não cobra nada.**
Isto não é problema de design — é a decisão de produto mais urgente do projeto,
e este documento a registra explicitamente para que não seja descoberta depois.

---

## Ordem recomendada, resumida

```
0. Commit do estado atual                    <- bloqueante (inclui o .mp4)
1. Limpeza de código morto                   <- sem risco
2. Performance estrutural                    <- abre o espaço para o vídeo
3. Mídia: 3a capturas + 3b vídeo da hero     <- em paralelo, sem código
4. Sete estações -> cinco                    <- remoção antes de adição (P2)
5. O sistema de capítulo                     <- a peça nova
6. Hero cinematográfica + match cut          <- a peça mais delicada
7. Manifesto, recursos, dados/confiança, footer
8. Copy, metadados, mobile
9. Verificação e deploy
```

**Por que a hero vem na Etapa 6 e não na 1**, sendo a peça mais visível: porque
ela depende de tudo que vem antes. O vídeo só cabe no orçamento depois que a
Etapa 2 tira 750 KB de JavaScript da rota pública; o *match cut* só pode ser
calibrado depois que a captura da Etapa 3a existe; e o palco pinado da hero usa o
mesmo mecanismo do sistema de capítulo da Etapa 5. Construí-la primeiro
significaria construí-la duas vezes.

**Por que a limpeza e a performance vêm antes do design:** porque a regra da
remoção (P2) vale também para o roteiro. Redesenhar sobre 890 KB de JavaScript
e sete arquivos mortos é construir em cima do problema. E porque as etapas 1 e 2
são as únicas em que se pode verificar objetivamente que nada quebrou — depois
que o layout mudar, a comparação antes/depois deixa de existir.
