/* =========================================================
   CURVA DE AVANÇO DO HERO

   O clipe não avança de forma uniforme: a câmera acelera para o
   fim. Medindo a largura aparente da tampa do notebook quadro a
   quadro (36 amostras ao longo dos 144 quadros), ela vai de 162px
   a 890px, mas na METADE do vídeo apenas 20% desse avanço já
   aconteceu. Mapear scroll direto em tempo faria os primeiros 60%
   da rolagem parecerem travados.

   A tabela abaixo é o inverso dessa medição: para cada fração de
   scroll numa grade uniforme, qual fração do tempo do vídeo
   entrega um avanço visual proporcional. Com ela, meio scroll =
   metade da aproximação, três quartos de scroll = três quartos da
   aproximação.

   Note como ela é íngreme no começo (0 → 0,21 no primeiro passo):
   é exatamente o trecho em que o vídeo quase não muda de escala,
   atravessado depressa. Isso não se vê como salto justamente
   porque quase nada muda ali.
   ========================================================= */

const CURVA_LINEARIZADA = [
  0.0000, 0.2083, 0.3111, 0.3898, 0.4558, 0.5074, 0.5543, 0.5976,
  0.6317, 0.6670, 0.6976, 0.7241, 0.7496, 0.7747, 0.7975, 0.8193,
  0.8404, 0.8608, 0.8805, 0.8996, 0.9186, 0.9383, 0.9580, 0.9783,
  1.0000,
];

/* Quanto da linearização aplicar, de 0 a 1.

   0 = mapeamento linear cru (a aproximação toda espremida no fim,
       a "opção B" — revelação proposital).
   1 = avanço visual perfeitamente constante.

   Um pouco abaixo de 1 mantém a leitura de constante mas deixa uma
   ponta de aceleração na chegada, que é o que dá o senso de
   chegada. Ajustar olhando rolar, não no papel. */
export const MISTURA_PADRAO = 0.85;

export const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

/* Progresso de scroll (0-1) -> fração do tempo do vídeo (0-1). */
export function avancoDoScroll(progresso, mistura = MISTURA_PADRAO) {
  const p = clamp01(progresso);

  const n = CURVA_LINEARIZADA.length - 1;
  const posicao = p * n;
  const i = Math.min(Math.floor(posicao), n - 1);
  const f = posicao - i;
  const linearizado = CURVA_LINEARIZADA[i] + f * (CURVA_LINEARIZADA[i + 1] - CURVA_LINEARIZADA[i]);

  return p + (linearizado - p) * mistura;
}

export default avancoDoScroll;
