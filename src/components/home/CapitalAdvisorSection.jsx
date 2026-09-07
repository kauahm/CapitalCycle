import { memo, useLayoutEffect, useRef, useState } from 'react';

import ADVISOR_CSS from './advisorStyles';
import { geometriaDoAdvisor } from './hero/circuitoGeometria';

/* =========================================================
   CAPITAL ADVISOR — etapa 04 do circuito, DECIDIR.

   Não é um chatbot nem uma demonstração de IA: é a etapa em que a
   leitura organizada e analisada vira uma decisão. O circuito
   chega do Produto na mesma prumada em que o gráfico terminou,
   segue descendo por toda a seção, e de dentro dele sai o ramo
   que vira o sublinhado do campo.

   Saíram, por serem exatamente o que esta seção não pode ser: a
   cápsula flutuante com desfoque e sombra, o ícone Sparkles, o
   selo "Sessão ativa", o LED vermelho pulsando com "Analisando
   seus dados em tempo real", o botão que balançava em laço, o
   placeholder que digitava sozinho, o halo radial branco, os
   150vh de pista com sticky e os dois `useTransform` que não
   animavam nada.

   O comportamento do campo é o que já existia e não foi
   inventado: um input controlado de verdade, e um envio que ainda
   não faz nada. A diferença é que a seção deixou de afirmar o
   contrário.
   ========================================================= */

/* Perguntas de exemplo — o mesmo conteúdo que antes rodava como
   placeholder animado. Agora uma delas é o placeholder estático do
   campo e as outras viram texto de apoio: mesma informação, sem
   animação decorativa.

   O placeholder é a mais curta das quatro porque na faixa estreita
   as demais passavam da largura do campo e apareciam cortadas. */
const PERGUNTAS = [
  'Faça um resumo do meu mês financeiro.',
  'Quanto eu economizei este mês?',
  'Como posso juntar R$ 20 mil em 6 meses?',
  'Onde estou gastando mais do que deveria?',
];

function CapitalAdvisorSection() {
  const faixaRef = useRef(null);
  const inputRef = useRef(null);

  const [pergunta, setPergunta] = useState('');
  const [focado, setFocado] = useState(false);
  const [geo, setGeo] = useState(() => geometriaDoAdvisor({ largura: 0, altura: 0, yCampo: 0 }));

  // Medição antes da pintura, como nas outras seções. Sem listener
  // de scroll: o ResizeObserver só dispara quando a faixa ou o
  // campo mudam de tamanho.
  useLayoutEffect(() => {
    const faixa = faixaRef.current;
    const campo = inputRef.current;
    if (!faixa || !campo) return undefined;

    const arred = (v) => Math.round(v * 100) / 100;

    const medir = () => {
      const largura = faixa.clientWidth;
      const altura = faixa.clientHeight;
      // Linha de base do INPUT, não do formulário: no mobile o botão
      // desce para baixo do campo, e medindo o formulário o ramo ia
      // parar embaixo do botão em vez de sublinhar o campo.
      const yCampo = campo.getBoundingClientRect().bottom - faixa.getBoundingClientRect().top;

      setGeo((atual) => (atual.largura === arred(largura)
        && atual.altura === arred(altura)
        && atual.yCampo === arred(yCampo)
        ? atual
        : { ...geometriaDoAdvisor({ largura, altura, yCampo }), yCampo: arred(yCampo) }));
    };

    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(faixa);
    ro.observe(campo);

    // O título reflui quando a Inter termina de carregar e desloca
    // o campo; sem isto o ramo ficaria na posição antiga.
    let vivo = true;
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => { if (vivo) medir(); }).catch(() => {});
    }

    return () => { vivo = false; ro.disconnect(); };
  }, []);

  return (
    /* `cch` junto: esta seção é irmã do wrapper .cch em HomePage, não
       filha dele, então --cc-faixa e a paleta (--cch-ink, --cch-muted,
       --cch-purple-rec) não chegavam aqui — o traço saía sem cor e a
       faixa sem largura. Herdar a classe resolve na própria seção, sem
       mexer na estrutura da página nem duplicar a paleta. */
    <section className="cch ccdec" id="capital-advisor">
      <style>{ADVISOR_CSS}</style>

      <div className={`ccdec-faixa${focado ? ' is-focado' : ''}`} ref={faixaRef}>
        {geo.largura > 0 && geo.altura > 0 && (
          <svg
            width={geo.largura}
            height={geo.altura}
            viewBox={`0 0 ${geo.largura} ${geo.altura}`}
            aria-hidden="true"
            focusable="false"
          >
            {/* O eixo não desvia: segue reto para a seção seguinte. */}
            <path className="ccdec-traco" d={geo.eixo} />
            {/* O ramo sai dele e vira o sublinhado do campo. */}
            <path className="ccdec-traco ccdec-sublinhado" d={geo.sublinhado} />
          </svg>
        )}

        {/* Travado na largura do campo, que termina exatamente onde a
            curva do ramo começa: assim nenhum texto da seção cruza o
            eixo em nenhuma largura. */}
        <div
          className="ccdec-conteudo"
          style={geo.larguraCampo > 0 ? { maxWidth: `${geo.larguraCampo}px` } : undefined}
        >
          <span className="ccdec-estacao">04 — Decidir</span>
          <p className="ccdec-nota">Da leitura para a decisão</p>

          <h2 className="ccdec-titulo">
            O que faz sentido fazer com esses números agora.
          </h2>

          {/* O envio continua sem efeito, como na implementação
              anterior: nada de resposta simulada. */}
          <form
            className="ccdec-campo"
            onSubmit={(e) => e.preventDefault()}
            style={geo.larguraCampo > 0 ? { width: `${geo.larguraCampo}px` } : undefined}
          >
            <label className="sr-only" htmlFor="ccdec-pergunta">
              Pergunte ao Capital Advisor
            </label>
            <input
              id="ccdec-pergunta"
              className="ccdec-input"
              ref={inputRef}
              type="text"
              autoComplete="off"
              placeholder={PERGUNTAS[1]}
              value={pergunta}
              onChange={(e) => setPergunta(e.target.value)}
              onFocus={() => setFocado(true)}
              onBlur={() => setFocado(false)}
            />
            <button className="ccdec-enviar" type="submit">
              Perguntar
            </button>
          </form>

          <p className="ccdec-rodape">
            Sobre os seus próprios lançamentos, contas e metas — os mesmos dados
            da tela anterior. Por exemplo: “{PERGUNTAS[0]}” ou “{PERGUNTAS[3]}”
          </p>
        </div>
      </div>
    </section>
  );
}

export default memo(CapitalAdvisorSection);
