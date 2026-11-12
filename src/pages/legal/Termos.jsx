import React from 'react';
import LegalLayout, { Secao } from './LegalLayout';

export default function Termos() {
  return (
    <LegalLayout titulo="Termos de Uso" atualizadoEm="novembro de 2026">

      <Secao numero="1" titulo="Finalidade do sistema">
        <p>
          O Capital Cycle é uma ferramenta de organização financeira pessoal. Ele
          serve para registrar onde o seu dinheiro está, lançar entradas e saídas,
          definir limites de gasto por categoria e acompanhar metas de poupança.
        </p>
        <p>
          O sistema não é uma instituição financeira, não movimenta dinheiro e não
          executa nenhuma operação em seu nome. Ele apenas <strong>lê</strong> informações:
          o que você digita e, se você autorizar, o que o seu banco compartilha pelo
          Open Finance.
        </p>
      </Secao>

      <Secao numero="2" titulo="Criação de conta">
        <p>
          Para usar o sistema é necessário criar uma conta com nome, e-mail e senha. A
          escolha de um plano faz parte do cadastro.
        </p>
        <p>
          Você é responsável por manter sua senha em segurança e por tudo que for feito
          na sua conta. Se perceber acesso indevido, troque a senha imediatamente.
        </p>
      </Secao>

      <Secao numero="3" titulo="Uso responsável">
        <p>
          Use o sistema apenas para organizar as suas próprias finanças. Não é
          permitido tentar acessar dados de outras pessoas, contornar os limites do
          plano contratado, sobrecarregar o serviço de forma automatizada ou usar o
          sistema para qualquer finalidade ilícita.
        </p>
      </Secao>

      <Secao numero="4" titulo="Dados que você cadastra e dados importados">
        <p>
          Parte das informações é inserida por você: lançamentos manuais, categorias,
          metas, aportes, limites e renda mensal. A exatidão desses dados depende do
          que você registra.
        </p>
        <p>
          Outra parte pode vir do <strong>Open Finance</strong>: ao conectar um banco, o
          sistema importa, por meio do agregador Pluggy, as contas, os saldos e os
          lançamentos dos últimos 90 dias. A conexão é autorizada por você no ambiente
          do próprio banco e pode ser desfeita a qualquer momento na tela Open Finance,
          o que remove do sistema tudo o que foi importado daquele banco. Os dados
          importados refletem o que o banco informa; o sistema não os altera, apenas
          os classifica em categorias.
        </p>
        <p>
          Os detalhes sobre tratamento de dados estão na Política de Privacidade.
        </p>
      </Secao>

      <Secao numero="5" titulo="Capital Advisor">
        <p>
          O Capital Advisor é um assistente de conversa que usa um modelo de
          inteligência artificial de terceiros. As mensagens que você escreve nele são
          enviadas ao provedor do modelo para gerar a resposta. Se você ligar a opção
          <strong> &ldquo;usar meus dados&rdquo;</strong>, um resumo agregado das suas
          finanças (totais por categoria, saldos por tipo de conta e estado das metas)
          acompanha cada pergunta. A opção fica desligada por padrão e pode ser desligada
          a qualquer momento.
        </p>
        <p>
          As respostas são geradas automaticamente e podem conter erros ou imprecisões.
          Elas têm caráter informativo e <strong>não constituem recomendação ou
          consultoria de investimentos</strong>. Nenhuma decisão financeira deve ser
          tomada apenas com base nelas.
        </p>
        <p>
          O número de consultas por mês depende do plano contratado.
        </p>
      </Secao>

      <Secao numero="6" titulo="Planos e limites">
        <p>
          Os planos definem quantas contas, lançamentos, ciclos e consultas ao Capital
          Advisor você pode usar. Os limites vigentes aparecem na tela de escolha de
          plano e podem ser ajustados ao longo do desenvolvimento do projeto.
        </p>
        <p>
          O pagamento nesta versão do sistema é <strong>simulado</strong>: nenhuma
          cobrança real é feita e nenhum dado de cartão é processado por instituição
          financeira.
        </p>
      </Secao>

      <Secao numero="7" titulo="Limitações do serviço">
        <p>
          Por se tratar de um projeto acadêmico, o sistema é oferecido no estado em que
          se encontra. Não há garantia de disponibilidade contínua, de ausência de
          falhas ou de preservação permanente dos dados.
        </p>
        <p>
          Funcionalidades podem ser alteradas ou removidas durante o desenvolvimento.
          Recomendamos manter seus próprios registros das informações importantes.
        </p>
      </Secao>

      <Secao numero="8" titulo="Exclusão da conta">
        <p>
          Você pode excluir sua conta quando quiser, em <strong>Meu Perfil</strong>. Para
          confirmar que é você, pedimos sua senha atual — ou, em contas do Google, uma
          confirmação na janela do próprio Google.
        </p>
        <p>
          A exclusão remove seus dados financeiros do sistema e é irreversível.
        </p>
        <p>
          Os registros técnicos das operações de pagamento simuladas são mantidos como
          histórico da operação, conforme descrito na Política de Privacidade.
        </p>
      </Secao>

      <Secao numero="9" titulo="Alterações nestes termos">
        <p>
          Estes termos podem ser atualizados conforme o projeto evolui. A data da
          última atualização fica indicada no topo desta página. O uso continuado do
          sistema após uma alteração indica concordância com a versão vigente.
        </p>
      </Secao>

      <Secao numero="10" titulo="Contato">
        <p>
          Dúvidas sobre estes termos podem ser encaminhadas ao responsável pelo projeto
          acadêmico, pelo canal informado na apresentação do trabalho.
        </p>
      </Secao>

    </LegalLayout>
  );
}
