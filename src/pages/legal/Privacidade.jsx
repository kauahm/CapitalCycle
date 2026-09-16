import React from 'react';
import LegalLayout, { Secao } from './LegalLayout';

export default function Privacidade() {
  return (
    <LegalLayout titulo="Política de Privacidade" atualizadoEm="setembro de 2026">

      <Secao numero="1" titulo="Quais dados são coletados">
        <p>O sistema guarda apenas o que você fornece ou gera ao usá-lo:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li><strong>Cadastro:</strong> nome, e-mail e plano escolhido.</li>
          <li><strong>Financeiros:</strong> contas e saldos, lançamentos com descrição, valor, categoria e data, limites por categoria, metas, aportes e renda mensal.</li>
          <li><strong>Uso:</strong> quantidade de consultas feitas ao Capital Advisor no mês.</li>
          <li><strong>Pagamento:</strong> registro técnico da operação simulada — plano, método, valor e identificador da transação.</li>
        </ul>
        <p>
          Não coletamos localização, contatos, dados de navegação para publicidade nem
          qualquer informação obtida de fora do sistema. Não há integração bancária:
          nenhum dado é importado do seu banco.
        </p>
      </Secao>

      <Secao numero="2" titulo="Para que os dados são usados">
        <p>
          Exclusivamente para operar as funcionalidades que você vê na tela: exibir seu
          painel, calcular saldos e progresso de metas, aplicar os limites do plano e
          permitir o acesso à sua conta. Seus dados não são vendidos, alugados nem
          usados para publicidade.
        </p>
      </Secao>

      <Secao numero="3" titulo="Onde os dados ficam">
        <p>
          O sistema usa o <strong>Firebase</strong>, plataforma do Google, para
          autenticação e banco de dados. Seus dados ficam armazenados na infraestrutura
          do Google, que atua como operador desses dados e possui suas próprias
          políticas de privacidade e segurança.
        </p>
      </Secao>

      <Secao numero="4" titulo="Capital Advisor e o provedor de IA">
        <p>
          Esta seção merece atenção, porque envolve envio de dados para fora do sistema.
        </p>
        <p>
          Quando você conversa com o Capital Advisor, <strong>as mensagens que você
          escreve são enviadas ao provedor do modelo de inteligência artificial</strong>{' '}
          (Google) para que a resposta seja gerada. Se você digitar valores, nomes ou
          qualquer informação pessoal na conversa, esse conteúdo será enviado junto.
        </p>
        <p>
          Por outro lado, o sistema <strong>não envia automaticamente</strong> seus
          saldos, lançamentos, contas ou metas ao Advisor. Ele recebe apenas o texto da
          conversa. Por isso o assistente não tem conhecimento dos seus dados
          financeiros a menos que você mesmo os escreva.
        </p>
        <p>
          O tratamento dessas mensagens pelo provedor segue as políticas do próprio
          provedor, fora do controle deste projeto.
        </p>
      </Secao>

      <Secao numero="5" titulo="Quem pode ver seus dados">
        <p>
          As regras de acesso do banco de dados são configuradas para que cada usuário
          leia e escreva somente os próprios registros, identificados pelo seu
          identificador de conta.
        </p>
        <p>
          A comunicação entre o navegador e os serviços ocorre por HTTPS.{' '}
          <strong>Não há criptografia ponta a ponta</strong>: os dados ficam legíveis
          no banco para quem administra o projeto.
        </p>
        <p>
          Este é um trabalho acadêmico e não passou por auditoria de segurança nem
          possui certificação. As medidas adotadas são as oferecidas pela própria
          plataforma, dentro do que o escopo do projeto permite.
        </p>
      </Secao>

      <Secao numero="6" titulo="Por quanto tempo os dados ficam guardados">
        <p>
          Enquanto sua conta existir. Você pode editar ou apagar contas, lançamentos,
          metas e limites a qualquer momento pelas telas do sistema.
        </p>
        <p>
          Uma conta financeira com lançamentos vinculados não pode ser excluída — isso
          é intencional, para preservar seu histórico. Nesse caso, edite a conta em vez
          de removê-la.
        </p>
      </Secao>

      <Secao numero="7" titulo="Exclusão da conta">
        <p>
          A exclusão da conta remove seus dados de cadastro e financeiros — contas,
          lançamentos, ciclos, metas, aportes e limites por categoria — e é
          irreversível.
        </p>
        <p>
          <strong>Exceção:</strong> os registros técnicos das operações de pagamento são
          mantidos como histórico da operação, porque o sistema os trata como imutáveis
          desde a criação. Eles contêm plano, método, valor e identificador da
          transação, e não incluem dados de cartão.
        </p>
      </Secao>

      <Secao numero="8" titulo="Seus direitos">
        <p>
          Você pode, a qualquer momento, consultar os dados que cadastrou e corrigi-los
          pelas telas do sistema, além de solicitar a exclusão da conta. Para dúvidas
          sobre o tratamento dos dados, use o contato indicado nos Termos de Uso.
        </p>
      </Secao>

      <Secao numero="9" titulo="Alterações nesta política">
        <p>
          Esta política pode ser atualizada conforme o projeto evolui. A data da última
          atualização fica indicada no topo desta página.
        </p>
      </Secao>

    </LegalLayout>
  );
}
