import React from 'react';

import {
  dashboardPreviewData,
  formatBRL,
  formatBRLCurto,
} from './dashboardPreviewData';

/* ==========================================================================
   DashboardPreview — 1180 × 740

   Reprodução da prancha `referencia/designer/CapitalCycleDashboard.dc.html`
   para uso EXCLUSIVO da landing.

   Este componente é deliberadamente burro: não conhece Firebase, Auth,
   Firestore, DashboardLayout nem DashboardFinanceiro. Ele recebe uma
   fixture estática e desenha. É por isso que existe em vez de a landing
   reaproveitar a dashboard real — a vitrine não pode arrastar o produto
   (e suas dependências de sessão) para dentro da página pública.

   Duas divergências deliberadas em relação à prancha, já aprovadas:
   - "Mercado" não aparece: a área foi removida do produto.
   - "Contas e Caixas" vira "Contas", como no app real.
   ========================================================================== */

/* Ícones transcritos da prancha. O Designer desenhou geometria própria
   (viewBox 16, stroke 1.5), então trocar por Lucide mudaria o desenho. */
const IconeDashboard = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1.4" />
    <rect x="9" y="1.5" width="5.5" height="5.5" rx="1.4" />
    <rect x="1.5" y="9" width="5.5" height="5.5" rx="1.4" />
    <rect x="9" y="9" width="5.5" height="5.5" rx="1.4" />
  </svg>
);

const IconeTransacoes = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M2 5h11M10.5 2.5 13 5l-2.5 2.5" />
    <path d="M14 11H3M5.5 8.5 3 11l2.5 2.5" />
  </svg>
);

const IconeContas = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M1.8 6 8 2.4 14.2 6" />
    <path d="M3.5 6.5v5M7 6.5v5M10.5 6.5v5M13.5 6.5v5" />
    <path d="M2 13.6h12" />
  </svg>
);

const IconeRelogio = ({ size = 15, cor = 'currentColor', traco = 1.5 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={cor} strokeWidth={traco}>
    <circle cx="8" cy="8" r="6" />
    <path d="M8 2.4V8h5.5" />
  </svg>
);

const IconeOrcamento = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    style={{ flex: 'none', marginTop: '2px' }}
  >
    <rect x="1.8" y="2.2" width="12.4" height="11.6" rx="1.6" />
    <path d="M1.8 6.2h12.4M6.4 6.2v7.6" />
  </svg>
);

const IconeAdvisor = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M8 1.6 9.5 6.5 14.4 8 9.5 9.5 8 14.4 6.5 9.5 1.6 8 6.5 6.5Z" />
  </svg>
);

const IconePerfil = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="8" cy="5.6" r="2.9" />
    <path d="M2.8 14c0-2.7 2.3-4.4 5.2-4.4s5.2 1.7 5.2 4.4" />
  </svg>
);

const ITENS_SIDEBAR = [
  { id: 'dashboard', rotulo: 'Dashboard', Icone: IconeDashboard, ativo: true },
  { id: 'transacoes', rotulo: 'Transações', Icone: IconeTransacoes },
  { id: 'contas', rotulo: 'Contas', Icone: IconeContas },
  { id: 'ciclos', rotulo: 'Ciclos e Metas', Icone: IconeRelogio },
  { id: 'orcamento', rotulo: ['Orçamento por', 'Categoria'], Icone: IconeOrcamento },
  { id: 'advisor', rotulo: 'Capital Advisor (IA)', Icone: IconeAdvisor },
  { id: 'perfil', rotulo: 'Meu Perfil', Icone: IconePerfil },
];

/* A barra mais alta da prancha tem 150px. As demais são derivadas do valor,
   proporcionalmente, para que a fixture continue mandando na geometria. */
const ALTURA_BARRA_MAXIMA = 150;

export default function DashboardPreview() {
  const {
    usuario,
    saldoDisponivel,
    totalInvestido,
    sobrouNoMes,
    contasAtivas,
    fluxo,
    rendaMensal,
    rendaComprometida,
    metas,
  } = dashboardPreviewData;

  const maiorFluxo = Math.max(...fluxo.map((m) => m.valor));

  return (
    <div className="ccp" aria-hidden="true">
      <aside className="ccp__sidebar">
        <div className="ccp__logo">
          CAPITAL
          <br />
          CYCLE
        </div>

        <nav className="ccp__nav">
          {ITENS_SIDEBAR.map(({ id, rotulo, Icone, ativo }) => (
            <div
              key={id}
              className={`ccp__nav-item${ativo ? ' ccp__nav-item--ativo' : ''}${
                Array.isArray(rotulo) ? ' ccp__nav-item--duas-linhas' : ''
              }`}
            >
              <Icone />
              <span>
                {Array.isArray(rotulo)
                  ? rotulo.map((linha, i) => (
                      <React.Fragment key={linha}>
                        {i > 0 && <br />}
                        {linha}
                      </React.Fragment>
                    ))
                  : rotulo}
              </span>
            </div>
          ))}
        </nav>
      </aside>

      <div className="ccp__main">
        <header className="ccp__topbar">
          <div className="ccp__topbar-titulo">Dashboard</div>
          <div className="ccp__usuario">
            <div className="ccp__usuario-texto">
              <div className="ccp__usuario-nome">{usuario.nome}</div>
              <div className="ccp__usuario-papel">{usuario.papel}</div>
            </div>
            <div className="ccp__avatar">{usuario.inicial}</div>
          </div>
        </header>

        <div className="ccp__corpo">
          <div className="ccp__saudacao">
            Olá, {usuario.primeiroNome}. Aqui está o resumo do seu capital.
          </div>

          <div className="ccp__kpis">
            <div className="ccp__card ccp__kpi">
              <div className="ccp__kpi-rotulo">SALDO DISPONÍVEL</div>
              <div className="ccp__kpi-valor">{formatBRL(saldoDisponivel)}</div>
              <div className="ccp__kpi-rodape">
                ↗ Sobrou {formatBRL(sobrouNoMes)} este mês
              </div>
            </div>

            <div className="ccp__card ccp__kpi">
              <div className="ccp__kpi-rotulo">INVESTIDO</div>
              <div className="ccp__kpi-valor ccp__kpi-valor--verde">
                {formatBRL(totalInvestido)}
              </div>
            </div>

            <div className="ccp__card ccp__kpi">
              <div className="ccp__kpi-rotulo">CONTAS ATIVAS</div>
              <div className="ccp__kpi-valor">{contasAtivas}</div>
            </div>
          </div>

          <div className="ccp__meio">
            <section className="ccp__card ccp__grafico">
              <div className="ccp__card-titulo">Fluxo líquido — últimos 6 meses</div>
              <div className="ccp__barras">
                {fluxo.map(({ mes, valor, cor }) => (
                  <div key={mes} className="ccp__barra-col">
                    <div
                      className="ccp__barra"
                      style={{
                        height: `${Math.round((valor / maiorFluxo) * ALTURA_BARRA_MAXIMA)}px`,
                        background: cor,
                      }}
                    />
                    <div className="ccp__barra-mes">{mes}</div>
                  </div>
                ))}
              </div>
            </section>

            <section className="ccp__card ccp__metas">
              <div className="ccp__metas-cabecalho">
                <IconeRelogio cor="#f5f5f7" />
                <div className="ccp__card-titulo">Metas em andamento</div>
              </div>

              <div className="ccp__metas-lista">
                {metas.map(({ nome, meta, acumulado, progresso }) => (
                  <div key={nome} className="ccp__meta">
                    <div className="ccp__meta-linha">
                      <span className="ccp__meta-nome">{nome}</span>
                      <span className="ccp__meta-pct">{progresso}%</span>
                    </div>
                    <div className="ccp__trilho">
                      <div className="ccp__trilho-preenchido" style={{ width: `${progresso}%` }} />
                    </div>
                    <div className="ccp__meta-valores">
                      {formatBRLCurto(acumulado)} de {formatBRLCurto(meta)}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <section className="ccp__card ccp__renda">
            <div className="ccp__renda-topo">
              <div className="ccp__renda-bloco">
                <div className="ccp__kpi-rotulo">RENDA MENSAL</div>
                <div className="ccp__renda-valor">{formatBRL(rendaMensal)}</div>
              </div>
              <div className="ccp__renda-bloco ccp__renda-bloco--direita">
                <div className="ccp__kpi-rotulo">RENDA COMPROMETIDA</div>
                <div className="ccp__renda-valor">{rendaComprometida}%</div>
              </div>
            </div>
            <div className="ccp__trilho">
              <div className="ccp__trilho-preenchido" style={{ width: `${rendaComprometida}%` }} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
