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

  const concluida = valorMeta > 0 && valorAcumulado >= valorMeta;

  // ── Quanto guardar por período ────────────────────────────────────────
  // Responde "quanto preciso guardar em cada período que ainda resta", e não
  // "quanto é o valor diário multiplicado por 7/30/365": com 3 dias pela
  // frente não existe uma semana inteira para distribuir. Por isso cada
  // equivalente divide o restante pelo número de períodos que cabem no
  // horizonte, arredondado para cima.
  //
  // Períodos maiores que o horizonte ficam em null e não devem ser exibidos.
  // Usa 7/30/365 de propósito: a conta precisa ser explicável, e o desvio
  // frente ao calendário real não muda nenhuma decisão financeira aqui.
  let equivalentes = null;
  if (!prazoEncerrado && !concluida && valorMeta > 0 && valorRestante > 0 && diasRestantes != null) {
    if (diasRestantes === 0) {
      // O prazo é hoje e ainda falta dinheiro: tudo precisa entrar hoje.
      // Sem esta ramificação a divisão por zero deixava o bloco sumir da tela
      // justamente no último dia.
      equivalentes = {
        hoje: valorRestante,
        porDia: null, porSemana: null, porMes: null, porAno: null,
        horizonte: 'hoje',
      };
    } else {
      const porPeriodo = (dias) => valorRestante / Math.max(Math.ceil(diasRestantes / dias), 1);
      equivalentes = {
        hoje: null,
        porDia: valorRestante / Math.max(diasRestantes, 1),
        porSemana: diasRestantes >= 7 ? porPeriodo(7) : null,
        porMes: diasRestantes >= 30 ? porPeriodo(30) : null,
        porAno: diasRestantes >= 365 ? porPeriodo(365) : null,
        horizonte:
          diasRestantes < 7 ? 'menos-de-uma-semana'
          : diasRestantes < 30 ? 'menos-de-um-mes'
          : diasRestantes < 365 ? 'menos-de-um-ano'
          : 'um-ano-ou-mais',
      };
    }
  }

  return {
    equivalentes,
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
    concluida,
  };
}
