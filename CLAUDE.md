# CapitalCycle — Regras de Segurança

Estas regras valem para **todas as sessões** de trabalho neste repositório.
Elas existem porque já houve perda real de arquivos e porque produção já ficou
divergente do repositório local e do GitHub sem ninguém perceber.

---

## 1. Comandos destrutivos exigem confirmação prévia

**Nunca** rode comandos destrutivos sem confirmar antes, em especial:

- `git clean -fd` (ou **qualquer** variação de `git clean`)
- `rm` em massa ou em pastas inteiras
- `git push --force` ou `--force-with-lease`
- `git reset --hard`

Antes de rodar qualquer um deles: **mostre exatamente o que será apagado ou
sobrescrito e espere confirmação explícita.**

> **Por que:** rodar `git clean -fd` para destravar um cherry-pick apagou
> permanentemente arquivos não versionados que não existiam em nenhum commit,
> stash ou branch. Parte era irrecuperável — um refactor em andamento
> (`HeroCapitalCycle.jsx`, `HomePage.css`, `fonts.css`, `public/fonts/`) e uma
> imagem de referência. **`git clean` não manda para a Lixeira**: a exclusão é
> imediata e definitiva.

## 2. Deploy tem pré-requisitos

**Nunca** rode `firebase deploy` (ou qualquer deploy) sem antes:

1. Confirmar em qual **branch e commit** você está
2. Confirmar que esse commit **já foi enviado ao GitHub** (`git push`)
3. **Avisar qual branch/commit vai para o ar** — e esperar o OK

> **Por que:** um deploy já foi feito a partir de um working tree que não
> correspondia a nenhuma branch pushada. Foi assim que produção passou a
> conter código que não estava em lugar nenhum do Git.

## 3. `git status` antes de mexer em branches

Sempre rode `git status` **antes** de trocar de branch, mergear ou fazer
cherry-pick.

Se houver qualquer mudança não commitada: **avise e pergunte** se deve
commitar, descartar ou dar stash. **Nunca decida sozinho.**

## 4. Sugira commit antes de encerrar

Ao final de qualquer sessão com mudanças relevantes — **mesmo incompletas** —
sugira um commit (pode ser WIP) antes do terminal ser fechado ou da troca de
tarefa.

> Trabalho não commitado é trabalho que pode se perder.

## 5. Divergência entre ambientes: pare e avise

Se perceber divergência entre **local**, **GitHub** e **produção**: **PARE e
avise antes de tentar corrigir sozinho.**

A estratégia de correção é decidida em conjunto — não deve ser descoberta
depois de já aplicada.

---

## Contexto do projeto

- **Produção:** https://capitalcycle-tcc.web.app (Firebase Hosting, projeto `capitalcycle-tcc`)
- **Deploy:** manual (`npm run build` + `firebase deploy`) — não há CI; `git push` **não** publica
- **Branch principal:** `main`
- **Nota:** o repositório versiona vídeos (~6 MB). Se um `git push` falhar com
  `RPC failed; curl 7 Send failure`, aumente `http.postBuffer` em vez de forçar.
