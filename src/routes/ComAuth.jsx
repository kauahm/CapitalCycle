import { Outlet } from 'react-router-dom';

import { AuthProvider } from '../hooks/useAuth';

/* =========================================================
   COM AUTH — a fronteira entre a landing e o resto do produto

   Este arquivo existe por um motivo só: ser o ponto em que o
   Firebase entra no grafo de módulos.

   Antes, `AuthProvider` ficava na raiz de `App.jsx`. Como ele importa
   `hooks/useAuth`, que importa `services/firebase`, que importa
   `firebase/app`, `firebase/auth` e `firebase/firestore`, o Firebase
   inteiro — 462 KB — era baixado por quem abrisse a página inicial e
   nunca fizesse login. A landing não autentica ninguém e não lê nada
   do Firestore: ela é servida por completo sem uma linha de Firebase.

   Agora `App.jsx` carrega este módulo por `React.lazy`, como rota de
   layout sem caminho próprio. Todas as rotas que precisam de sessão
   ficam abaixo dele, então o contexto continua disponível exatamente
   onde estava, e o chunk do Firebase só é buscado quando alguém sai
   de `/`.

   O `initializeApp` também deixou de rodar na abertura da home: ele
   acontece na avaliação de `services/firebase`, que agora só é
   avaliado quando este módulo é carregado.

   Nada aqui altera comportamento: é o mesmo provider, com o mesmo
   estado, envolvendo as mesmas rotas.
   ========================================================= */

export default function ComAuth() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}
