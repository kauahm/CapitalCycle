/* =========================================================
   As quatro fases do ciclo.

   São quartos exatos da curva (t 0→0.25, 0.25→0.5, ...), e é por isso
   que a ondulação da CycleCurve usa dois períodos: cada fase cai sobre
   um pico ou um vale da fita.

   Os números não são inventados para a Hero — "R$ 18k de fluxo
   positivo" e "14 ciclos" já eram as duas estatísticas da Hero
   antiga. Aqui elas deixam de ser dois números soltos e viram os
   marcos do ciclo que o 3D está desenhando.
   ========================================================= */

export const PHASES = [
  {
    id: 'entrada',
    label: 'Entrada',
    value: 'R$ 18k',
    note: 'Fluxo positivo no período',
  },
  {
    id: 'alocacao',
    label: 'Alocação',
    value: '6 categorias',
    note: 'Orçamento distribuído por meta',
  },
  {
    id: 'crescimento',
    label: 'Crescimento',
    value: '↑ 12,4%',
    note: 'Progresso calculado no ciclo',
  },
  {
    id: 'patrimonio',
    label: 'Patrimônio',
    value: '14 ciclos',
    note: 'Consolidado e reinvestido',
  },
];

export default PHASES;

/* Mesma matemática que a cena 3D usa para acender a fita, para que a
   fase destacada no texto e o trecho aceso do ciclo nunca discordem.
   Se um dia a janela de reveal mudar em CycleScene, muda aqui junto. */
export const REVEAL_FROM = 0.06;
export const REVEAL_TO = 0.66;

/* O ciclo já chega com a primeira fase acesa. Começar do zero absoluto
   deixaria o estado de aterrissagem — justamente o que mais gente vê —
   como o mais apagado da narrativa, e contradiria a coluna de leitura,
   que mostra "Entrada" ativa desde o início. */
export const REVEAL_BASE = 1 / PHASES.length;

export function revealFromProgress(p) {
  const t = Math.min(1, Math.max(0, (p - REVEAL_FROM) / (REVEAL_TO - REVEAL_FROM)));
  const eased = t * t * (3 - 2 * t);
  return REVEAL_BASE + (1 - REVEAL_BASE) * eased;
}

export function phaseFromProgress(p) {
  const reveal = revealFromProgress(p);
  // O epsilon evita que reveal exatamente igual a 1/4, 2/4... pule uma
  // fase adiante: com a base acima, o estado inicial cairia em "Alocação".
  return Math.min(PHASES.length - 1, Math.floor(reveal * PHASES.length - 1e-6));
}
