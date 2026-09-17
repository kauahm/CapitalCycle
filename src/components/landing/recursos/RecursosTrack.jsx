import React, { forwardRef } from 'react';

import { RECURSOS_CARDS } from './recursosTrackData';

/* ==========================================================================
   RecursosTrack — 2164 × 480

   Transcrição de `referencia/designer/RecursosTrack.dc.html`: quatro painéis
   de 520px com gap de 28px (4×520 + 3×28 = 2164).

   Nesta fase o trilho é ESTÁTICO. Ele existe porque o F4 e o F5 de
   `Dashboard to Recursos` já mostram os primeiros painéis entrando por
   baixo; o percurso horizontal de 964px é a fase seguinte. A `ref` fica
   exposta desde já para que a H4 anime este mesmo nó, sem remontar nada.
   ========================================================================== */

const IconeBarras = () => (
  <svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke="#5b52f0" strokeWidth="1.6">
    <path d="M2.4 13.4V9M6.8 13.4V4.2M11.2 13.4V6.8M2 13.9h12.4" />
  </svg>
);

const IconeSetas = () => (
  <svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke="#5b52f0" strokeWidth="1.6">
    <path d="M2 5h11M10.5 2.5 13 5l-2.5 2.5" />
    <path d="M14 11H3M5.5 8.5 3 11l2.5 2.5" />
  </svg>
);

const IconeRelogio = () => (
  <svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke="#5b52f0" strokeWidth="1.6">
    <circle cx="8" cy="8" r="6" />
    <path d="M8 2.4V8h5.5" />
  </svg>
);

const IconeFaisca = () => (
  <svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke="#ffffff" strokeWidth="1.6">
    <path d="M8 1.6 9.5 6.5 14.4 8 9.5 9.5 8 14.4 6.5 9.5 1.6 8 6.5 6.5Z" />
  </svg>
);

const ICONES = {
  dashboard: IconeBarras,
  transacoes: IconeSetas,
  ciclos: IconeRelogio,
  advisor: IconeFaisca,
};

function Demo({ card }) {
  if (card.demo === 'kpis') {
    return (
      <div className="ccr-card__demo ccr-demo-kpis">
        <div className="ccr-demo-kpis__linha">
          {card.kpis.map(({ rotulo, valor, destaque }) => (
            <div key={rotulo} className="ccr-kpi">
              <div className="ccr-kpi__rotulo">{rotulo}</div>
              <div className={`ccr-kpi__valor${destaque ? ' ccr-kpi__valor--verde' : ''}`}>
                {valor}
              </div>
            </div>
          ))}
        </div>
        <div className="ccr-demo-kpis__barras">
          {card.barras.map(({ altura, cor }, i) => (
            <div
              key={i}
              className="ccr-demo-kpis__barra"
              style={{ height: `${altura}px`, background: cor }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (card.demo === 'lancamentos') {
    return (
      <div className="ccr-card__demo ccr-demo-lancamentos">
        {card.lancamentos.map(({ nome, valor, entrada }) => (
          <div key={nome} className="ccr-lancamento">
            <div className="ccr-lancamento__nome">
              <span className={`ccr-ponto${entrada ? ' ccr-ponto--entrada' : ''}`} />
              <span>{nome}</span>
            </div>
            <span className={`ccr-lancamento__valor${entrada ? ' ccr-lancamento__valor--entrada' : ''}`}>
              {valor}
            </span>
          </div>
        ))}
      </div>
    );
  }

  if (card.demo === 'metas') {
    return (
      <div className="ccr-card__demo ccr-demo-metas">
        {card.metas.map(({ nome, progresso }) => (
          <div key={nome}>
            <div className="ccr-meta__linha">
              <span className="ccr-meta__nome">{nome}</span>
              <span className="ccr-meta__pct">{progresso}%</span>
            </div>
            <div className="ccr-meta__trilho">
              <div className="ccr-meta__preenchido" style={{ width: `${progresso}%` }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="ccr-card__demo ccr-demo-advisor">
      <div className="ccr-demo-advisor__eyebrow">
        <span className="ccr-ponto ccr-ponto--roxo" />
        <span>{card.advisor.eyebrow}</span>
      </div>
      <div className="ccr-demo-advisor__balao">{card.advisor.balao}</div>
      <div className="ccr-demo-advisor__rodape">{card.advisor.rodape}</div>
    </div>
  );
}

const RecursosTrack = forwardRef(function RecursosTrack(_props, ref) {
  return (
    <div className="ccr-track" ref={ref}>
      {RECURSOS_CARDS.map((card) => {
        const Icone = ICONES[card.id];
        return (
          <article
            key={card.id}
            className={`ccr-card${card.escuro ? ' ccr-card--escuro' : ''}`}
          >
            <div className={`ccr-card__icone${card.escuro ? ' ccr-card__icone--escuro' : ''}`}>
              <Icone />
            </div>
            <h3 className="ccr-card__titulo">{card.titulo}</h3>
            <p className="ccr-card__descricao">{card.descricao}</p>
            <Demo card={card} />
          </article>
        );
      })}
    </div>
  );
});

export default RecursosTrack;
