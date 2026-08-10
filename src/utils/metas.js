// Cálculos de progresso de metas — Fase 1.
// Regras e fórmulas definidas em CapitalCycle-Especificacao-Fase1.md,
// seção 7 (Fórmulas) e seção 9 (Casos extremos). Não alterar sem revisar
// a especificação primeiro.

import { hojeStr, diasEntre, addDias, parseData } from './data';

/**
 * Calcula o progresso completo de uma meta a partir dos aportes registrados.
 *
 * @param {{orcamento: number, fim: string, criadoEm: any}} ciclo - documento do ciclo (tipo Meta)
 * @param {Array<{valor: number, data: string}>} aportes - aportes da subcoleção ciclos/{id}/aportes
 */
export function calcularProgressoMeta(ciclo, aportes = []) {
  const hoje = hojeStr();
  const valorMeta = parseFloat(ciclo?.orcamento) || 0;

  const valorAcumulado = aportes.reduce((acc, a) => acc + (parseFloat(a.valor) || 0), 0);
  const valorRestante = Math.max(0, valorMeta - valorAcumulado);
  const progressoPct = valorMeta > 0 ? Math.min(100, (valorAcumulado / valorMeta) * 100) : 0;

  const prazoEncerrado = !!ciclo?.fim && ciclo.fim < hoje;
  const diasRestantesBruto = ciclo?.fim ? diasEntre(hoje, ciclo.fim) : null;
  // Caso extremo: meta vencida trava dias_restantes em 0 em vez de virar negativo
  const diasRestantes = diasRestantesBruto == null ? null : Math.max(0, diasRestantesBruto);

  const temAporte = aportes.length > 0;

  // Ritmo necessário (R$/dia) — só faz sentido com prazo em aberto
  let ritmoNecessario = null;
  if (!prazoEncerrado && diasRestantes != null && diasRestantes > 0) {
    ritmoNecessario = valorRestante / diasRestantes;
  }

  // Ritmo atual (R$/dia, janela de até 30 dias, ou desde a criação da meta
  // se ela for mais nova que 30 dias — evita ritmo artificialmente baixo)
  let ritmoAtual = null;
  if (temAporte) {
    const dataCriacao = ciclo?.criadoEm?.toDate
      ? ciclo.criadoEm.toDate()
      : (ciclo?.criadoEm ? new Date(ciclo.criadoEm) : null);

    const hojeDate = parseData(hoje);
    const janela30 = new Date(hojeDate);
    janela30.setDate(janela30.getDate() - 30);

    const janelaInicioDate = dataCriacao && dataCriacao > janela30 ? dataCriacao : janela30;
    const janelaInicioStr = `${janelaInicioDate.getFullYear()}-${String(janelaInicioDate.getMonth() + 1).padStart(2, '0')}-${String(janelaInicioDate.getDate()).padStart(2, '0')}`;

    const aportesJanela = aportes
      .filter((a) => a.data >= janelaInicioStr)
      .reduce((acc, a) => acc + (parseFloat(a.valor) || 0), 0);

    const diasJanela = Math.max(1, diasEntre(janelaInicioStr, hoje));
    ritmoAtual = aportesJanela / diasJanela;
  }

  // Comparação de ritmo: só é exibida se a meta tiver ao menos 1 aporte
  let diferencaPct = null;
  if (temAporte && ritmoNecessario != null && ritmoNecessario > 0 && ritmoAtual != null) {
    diferencaPct = ((ritmoAtual - ritmoNecessario) / ritmoNecessario) * 100;
  }

  // Previsão de conclusão — só quando há ritmo atual real (> 0)
  let dataPrevista = null;
  let diasParaConcluir = null;
  if (ritmoAtual != null && ritmoAtual > 0 && valorRestante > 0) {
    diasParaConcluir = valorRestante / ritmoAtual;
    dataPrevista = addDias(hoje, diasParaConcluir);
  }

  // Atraso estimado — só reportado quando positivo
  let atrasoDias = null;
  if (diasParaConcluir != null && diasRestantes != null) {
    const bruto = diasParaConcluir - diasRestantes;
    if (bruto > 0) atrasoDias = bruto;
  }

  return {
    valorMeta,
    valorAcumulado,
    valorRestante,
    progressoPct,
    prazoEncerrado,
    diasRestantes,
    temAporte,
    ritmoNecessario,
    ritmoAtual,
    diferencaPct,
    dataPrevista,
    diasParaConcluir,
    atrasoDias,
    concluida: valorMeta > 0 && valorAcumulado >= valorMeta,
  };
}
