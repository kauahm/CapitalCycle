# Segurança — modelo atual e limites conhecidos

Documento de referência para a defesa e para quem for evoluir o projeto.

## O que protege os dados

1. **Autenticação** pelo Firebase Authentication (e-mail/senha e Google). A
   senha nunca passa pelo Firestore. Troca de senha e exclusão de conta exigem
   reautenticação recente.
2. **Regras do Firestore** (`firestore.rules`): cada pessoa só lê e escreve
   documentos cujo `uid` é o dela. Desde a revisão de novembro/2026 as regras
   também **validam a forma** de cada documento na escrita — tipos dos campos,
   valores permitidos (`tipo` em `entrada|saida`, `plan` em `jovem|adulto`…),
   datas no padrão `YYYY-MM-DD`, valores não negativos, textos com tamanho
   máximo. Um cliente alterado não consegue gravar lixo que quebre as telas.
3. **Comprovantes de pagamento** são imutáveis: criar exige `status ==
   'aprovado'` e o próprio uid; `update`/`delete` são negados a todos.
4. **Markdown do Advisor** é renderizado por um parser próprio que só produz
   elementos React — nunca HTML — então o modelo não consegue injetar markup.
5. **Exclusão de conta** apaga aportes → ciclos → transações → contas →
   orçamento → perfil → Auth, nessa ordem, de forma idempotente.

## Chaves no front-end (decisão consciente do TCC)

Toda variável `VITE_*` vai para o bundle e é legível no DevTools:

| Chave | Risco | Mitigação atual |
|---|---|---|
| Firebase (`apiKey`, `appId`…) | Nenhum por si só: identifica o projeto; a proteção são as regras e o Auth | Regras restritivas; domínios autorizados no console |
| `VITE_GEMINI_API_KEY` | Terceiros podem gastar a cota gratuita | Cota baixa; restringir a chave por referenciador HTTP no Google Cloud |
| `VITE_PLUGGY_CLIENT_SECRET` | Terceiros podem criar connect tokens na conta sandbox | Só sandbox; a própria Pluggy recomenda backend |

**Para produção real** as duas integrações devem passar por um backend (Cloud
Function ou API própria) que guarde as chaves e valide o usuário pelo token do
Firebase. O código já isola as chamadas em `services/pluggy.js` e no fetch do
Advisor, então a troca é localizada.

## Arquivos de segredo locais

- `.env` está no `.gitignore`.
- `env` (sem ponto) é um arquivo antigo com chaves reais que **nunca foi
  versionado**; a revisão adicionou `env` e `env.*` ao `.gitignore` para que
  isso continue assim. Recomendação: apagar o arquivo e rotacionar as chaves
  que estavam nele.

## Dependências

`npm audit --omit=dev` acusa vulnerabilidades apenas em dependências internas do
SDK Firebase 10 (`undici`, `@grpc/grpc-js`) que só executam em Node, não no
navegador. Subir para o Firebase 13 as elimina, mas é uma atualização de versão
maior que não foi feita nesta revisão para não arriscar a autenticação.
