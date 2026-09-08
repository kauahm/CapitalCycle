import { useEffect, useMemo, useRef, useState } from 'react';

/* =========================================================
   HeroOdometer — o número que assenta

   Regras que moldam a implementação inteira:

   1. O primeiro paint mostra o valor final, correto e legível.
      Nada anima sozinho ao carregar. Por isso o estado de repouso
      do carretel já é o valor certo, e a animação é uma ida e
      volta a partir dele — não uma chegada até ele.

   2. A rolagem só acontece no primeiro gesto de scroll, uma vez.
      Quem controla isso é o pai, pelo booleano `rolar`.

   3. Precisa ser determinística. Se a pessoa voltar ao topo no
      meio da animação, o carretel volta instantaneamente ao valor
      final (sem transição, sem meio-caminho) e fica pronto para
      rodar de novo. Não existe estado quebrado possível: as três
      fases são declarativas e o repouso é sempre o valor correto.

   4. Os dígitos não podem mudar de largura durante a rolagem.
      Resolvido por `font-variant-numeric: tabular-nums` no CSS —
      com números tabulares todo dígito tem o mesmo avanço, então
      a caixa de cada dígito (que se dimensiona pelo carretel)
      nunca muda de tamanho enquanto o conteúdo passa.
   ========================================================= */

/* Quantas casas o carretel percorre antes de parar. 14 dá pouco
   mais de uma volta completa: gira o suficiente para ler como
   "painel girando", sem virar um borrão. */
const CASAS = 14;

/* Duração da parada de um dígito + defasagem entre dígitos.
   Os da esquerda assentam primeiro, então o número se lê da
   esquerda para a direita conforme para. 420 + 6*26 = 576ms no
   total, dentro da janela de 400-600ms combinada. */
const DURACAO_MS = 420;
const DEFASAGEM_MS = 26;

/* Sequência que termina no dígito final: a última casa é o valor
   certo, e as anteriores contam para trás a partir dele. Assim a
   transição para o repouso sobe pelo carretel mostrando os
   dígitos em ordem crescente até travar no final. */
function carretel(digito) {
  return Array.from({ length: CASAS }, (_, i) => (digito - (CASAS - 1 - i) + 10 * CASAS) % 10);
}

function ehDigito(ch) {
  return ch >= '0' && ch <= '9';
}

/* Milhar e decimal — o que sobra ("R$" e o espaço) é a moeda. */
const SEPARADORES = '.,';

export default function HeroOdometer({ valor, rolar = false, className = '' }) {
  // 'repouso'  -> valor final, sem transição (também é o 1º paint)
  // 'topo'     -> carretel no começo, sem transição (um frame só)
  // 'assenta'  -> volta ao valor final, agora com transição
  const [fase, setFase] = useState('repouso');

  // Handles de rAF e de setTimeout vivem separados: cancelar um
  // com a função do outro não faz nada de útil e ainda arrisca
  // derrubar um handle alheio que tenha o mesmo número.
  const frames = useRef([]);
  const prazos = useRef([]);

  const texto = String(valor);

  const partes = useMemo(() => {
    let indiceDigito = 0;
    return Array.from(texto).map((ch) => {
      const digito = ehDigito(ch);
      return {
        ch,
        digito,
        // "R$" é marca de moeda, não pontuação do número: fica em
        // tom mais fraco para o valor em si carregar o peso.
        moeda: !digito && !SEPARADORES.includes(ch),
        // A defasagem conta só os dígitos: separadores não giram.
        ordem: digito ? indiceDigito++ : -1,
      };
    });
  }, [texto]);

  const totalDigitos = partes.filter((p) => p.digito).length;

  useEffect(() => {
    const limpar = () => {
      frames.current.forEach(cancelAnimationFrame);
      prazos.current.forEach(clearTimeout);
      frames.current = [];
      prazos.current = [];
    };

    // Voltou ao topo: corta tudo e volta ao valor final na hora.
    // Sem transição, então não há como ficar num meio-termo.
    if (!rolar) {
      limpar();
      setFase('repouso');
      return undefined;
    }

    const semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (semMovimento) {
      setFase('repouso');
      return undefined;
    }

    setFase('topo');

    // Dois frames: o primeiro pinta o carretel no topo sem
    // transição, o segundo religa a transição e deixa ele cair.
    // Num frame só o browser agrupa as duas mudanças e não anima.
    frames.current.push(
      requestAnimationFrame(() => {
        frames.current.push(requestAnimationFrame(() => setFase('assenta')));
      })
    );

    // Ao fim, tira a transição do caminho. Visualmente é um no-op
    // (repouso e assenta param no mesmo transform), mas deixa o
    // componente pronto para um reset instantâneo.
    prazos.current.push(
      setTimeout(
        () => setFase('repouso'),
        DURACAO_MS + Math.max(0, totalDigitos - 1) * DEFASAGEM_MS + 60
      )
    );

    return limpar;
  }, [rolar, totalDigitos, texto]);

  return (
    <span
      className={`cchero-odo is-${fase} ${className}`.trim()}
      style={{ '--cchero-casas': CASAS, '--cchero-duracao': `${DURACAO_MS}ms` }}
    >
      {/* O número visível está quebrado em dígitos soltos, que o
          leitor de tela soletraria. Esta cópia fora da tela é a
          que ele lê — o valor inteiro, de uma vez. */}
      <span className="cchero-odo-leitura">{texto}</span>

      {partes.map(({ ch, digito, moeda, ordem }, i) =>
        digito ? (
          <span className="cchero-odo-digito" key={i} aria-hidden="true">
            <span
              className="cchero-odo-carretel"
              style={{ '--cchero-atraso': `${ordem * DEFASAGEM_MS}ms` }}
            >
              {carretel(Number(ch)).map((d, j) => (
                <span className="cchero-odo-casa" key={j}>
                  {d}
                </span>
              ))}
            </span>
          </span>
        ) : (
          <span
            className={`cchero-odo-fixo${moeda ? ' cchero-odo-moeda' : ''}`}
            key={i}
            aria-hidden="true"
          >
            {ch}
          </span>
        )
      )}
    </span>
  );
}
