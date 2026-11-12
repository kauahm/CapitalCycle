// Carteira manual.
//
// Com a aba Contas substituída pelo Open Finance, quem ainda não conectou um
// banco não tinha onde lançar nada: o formulário de transação exigia uma
// conta e a lista vinha vazia. A carteira manual é uma conta por usuário,
// criada sob demanda no primeiro lançamento, com id determinístico — então
// nunca duplica e as regras de segurança a tratam como qualquer conta.

export const ORIGEM_MANUAL = 'manual';

export const idCarteiraManual = (uid) => `carteira_${uid}`;

export function dadosCarteiraManual(uid) {
  return {
    uid,
    nome: 'Carteira',
    banco: 'Manual',
    tipo: 'Corrente',
    saldo: 0,
    numero: '',
    origem: ORIGEM_MANUAL,
    criadoEm: new Date(),
  };
}

/** Rótulo de uma conta no seletor e nas listas. */
export function rotuloConta(conta) {
  if (!conta) return '';
  if (conta.origem === ORIGEM_MANUAL) return `${conta.nome} (manual)`;
  return [conta.nome, conta.banco].filter(Boolean).join(' · ');
}

/** Só contas manuais têm saldo mantido pelo app; o das importadas vem do banco. */
export const saldoGeridoPeloApp = (conta) => !conta || conta.origem !== 'openfinance';
