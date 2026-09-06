import { useEffect, useRef, useState } from 'react';

import HERO_CSS from './heroStyles';
import avancoDoScroll, { clamp01 } from './heroCurve';
import videoUrl from '../../../assets/video/hero-notebook.mp4';
import posterUrl from '../../../assets/video/hero-notebook-poster.webp';

/* =========================================================
   HeroSection — a câmera que entra na tela do notebook.

   A pista de rolagem (280vh de seção presa com sticky) é dividida
   em três trechos que se sucedem sem se sobrepor:

     0 → 74%    o vídeo avança, quadro a quadro, preso ao scroll
     74% → 93%  o vídeo já está no último quadro; um zoom digital
                em CSS continua o movimento até a área de vidro da
                tela cobrir a viewport inteira
     93% → 100% o texto entra em crossfade

   Nunca há dois movimentos somados: quando o CSS assume, o vídeo
   já parou. É isso que faz a emenda entre um e outro não aparecer.

   Nada é reproduzido — o vídeo só é posicionado por currentTime,
   então rolar para cima desfaz tudo exatamente na ordem inversa.
   ========================================================= */

/* Área de vidro da tela no quadro do vídeo, em fração de 0 a 1.
   Medida no último quadro decodificado: a moldura externa da tampa
   fica em 15,4%-87,6% da largura e começa em 2,8% da altura; o
   vidro escuro desce até ~90%. Os valores abaixo ficam logo dentro
   dessa moldura.

   É a partir daqui que sai TODO o zoom: o centro deste retângulo
   vira o transform-origin, e o fator de escala é o que falta para
   ele cobrir a viewport. Para reconferir visualmente, abrir a
   página com ?debug-tela na URL — no fim da pista o retângulo
   tracejado tem de coincidir com as bordas da tela. */
const VIDRO = { x: 0.164, y: 0.043, l: 0.704, a: 0.857 };

const PROPORCAO = 16 / 9;

/* Folga no zoom para nenhuma borda de moldura aparecer por erro de
   subpixel bem no quadro final. */
const FOLGA_ZOOM = 1.02;

/* Fronteiras dos três trechos da pista. */
const ZOOM_INICIO = 0.74;
const ZOOM_FIM = 0.93;

/* Tolerância de seek: meio quadro a 24fps. Abaixo disso um novo
   currentTime não muda nada na tela e só custa um seek. */
const TOLERANCIA_S = 1 / 48;

function SetaIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  );
}

/* Preferência de movimento reduzido, acompanhada ao vivo: quem
   liga a opção no meio da visita não fica preso ao scrubbing. */
function useSemMovimento() {
  const [sem, setSem] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sincronizar = () => setSem(mq.matches);
    sincronizar();
    mq.addEventListener('change', sincronizar);
    return () => mq.removeEventListener('change', sincronizar);
  }, []);

  return sem;
}

export default function HeroSection() {
  const semMovimento = useSemMovimento();

  const secaoRef = useRef(null);
  const pinRef = useRef(null);
  const palcoRef = useRef(null);
  const quadroRef = useRef(null);
  const videoRef = useRef(null);
  const camadaRef = useRef(null);

  const [debugTela] = useState(
    () => typeof window !== 'undefined' && window.location.search.includes('debug-tela')
  );

  useEffect(() => {
    const secao = secaoRef.current;
    const pin = pinRef.current;
    const palco = palcoRef.current;
    const quadro = quadroRef.current;
    const camada = camadaRef.current;
    if (!secao || !pin || !palco || !quadro || !camada) return undefined;

    const video = videoRef.current; // ausente no caminho sem movimento

    let raf = null;
    let visivel = true;
    let duracao = 0;

    // Geometria que só muda quando a viewport muda.
    const geo = { k: 1, dx: 0, dy: 0 };

    /* Dimensiona o quadro como um `object-fit: cover` faria, mas em
       coordenadas que o zoom também enxerga, e calcula o quanto
       falta para o vidro cobrir a viewport. */
    const medirGeometria = () => {
      const palcoL = palco.clientWidth;
      const palcoA = palco.clientHeight;
      if (!palcoL || !palcoA) return;

      const quadroL = Math.max(palcoL, palcoA * PROPORCAO);
      const quadroA = Math.max(palcoA, palcoL / PROPORCAO);
      palco.style.setProperty('--cc-quadro-l', `${quadroL}px`);
      palco.style.setProperty('--cc-quadro-a', `${quadroA}px`);

      const cx = VIDRO.x + VIDRO.l / 2;
      const cy = VIDRO.y + VIDRO.a / 2;
      palco.style.setProperty('--cc-vidro-x', `${VIDRO.x * 100}%`);
      palco.style.setProperty('--cc-vidro-y', `${VIDRO.y * 100}%`);
      palco.style.setProperty('--cc-vidro-l', `${VIDRO.l * 100}%`);
      palco.style.setProperty('--cc-vidro-a', `${VIDRO.a * 100}%`);
      palco.style.setProperty('--cc-vidro-cx', `${cx * 100}%`);
      palco.style.setProperty('--cc-vidro-cy', `${cy * 100}%`);

      // Cobrir, não caber: o maior dos dois fatores garante que
      // nenhuma borda de moldura sobre nas laterais.
      const vidroL = VIDRO.l * quadroL;
      const vidroA = VIDRO.a * quadroA;
      geo.k = Math.max(1, palcoL / vidroL, palcoA / vidroA) * FOLGA_ZOOM;

      // O notebook não está no centro exato do quadro, então o
      // centro do vidro precisa ser levado até o centro da viewport
      // enquanto cresce — senão o zoom "puxa" para o lado.
      const vidroCentroX = (palcoL - quadroL) / 2 + cx * quadroL;
      const vidroCentroY = (palcoA - quadroA) / 2 + cy * quadroA;
      geo.dx = palcoL / 2 - vidroCentroX;
      geo.dy = palcoA / 2 - vidroCentroY;
    };

    /* Zoom exponencial: taxa de aproximação relativa constante, que
       é como o próprio vídeo vinha crescendo. Um ramp linear na
       escala desaceleraria visivelmente e denunciaria a emenda. */
    const aplicarZoom = (pZoom) => {
      const escala = Math.pow(geo.k, pZoom);
      quadro.style.transform =
        `translate(-50%, -50%) translate(${geo.dx * pZoom}px, ${geo.dy * pZoom}px) scale(${escala})`;
    };

    /* Escrito direto no DOM em vez de virar estado: isso roda a cada
       frame de rolagem, e um setState por frame re-renderizaria a
       página inteira à toa. */
    const aplicarTexto = (t) => {
      camada.style.opacity = String(t);
      // `is-visivel` acompanha qualquer pedaço de opacidade: é o que
      // tira o CTA da ordem de tabulação enquanto ele não existe na
      // tela. `is-ligada` só devolve o clique quando já dá para ler.
      camada.classList.toggle('is-visivel', t > 0);
      camada.classList.toggle('is-ligada', t > 0.5);
    };

    // Sem scrubbing a seção é estática no estado final.
    if (semMovimento) {
      medirGeometria();
      aplicarZoom(1);
      aplicarTexto(1);
      const ro = new ResizeObserver(() => {
        medirGeometria();
        aplicarZoom(1);
      });
      ro.observe(palco);
      return () => ro.disconnect();
    }

    const medirProgresso = () => {
      const pista = secao.offsetHeight - pin.offsetHeight;
      if (pista <= 0) return 0;
      return clamp01(-secao.getBoundingClientRect().top / pista);
    };

    // Devolve true quando o vídeo já está onde deveria — é o que
    // deixa o laço parar em vez de girar para sempre.
    const aplicarVideo = (pVideo) => {
      if (!video || !duracao) return false;
      // Parar exatamente em `duration` faz alguns navegadores
      // dispararem `ended` e devolverem o quadro errado.
      const alvo = Math.min(avancoDoScroll(pVideo) * duracao, duracao - TOLERANCIA_S);
      if (video.seeking) return false;
      if (Math.abs(video.currentTime - alvo) <= TOLERANCIA_S) return true;
      video.currentTime = alvo;
      return false;
    };

    const tick = () => {
      raf = null;
      const p = medirProgresso();

      aplicarZoom(clamp01((p - ZOOM_INICIO) / (ZOOM_FIM - ZOOM_INICIO)));
      aplicarTexto(clamp01((p - ZOOM_FIM) / (1 - ZOOM_FIM)));

      const noPonto = aplicarVideo(clamp01(p / ZOOM_INICIO));
      if (!noPonto && visivel) raf = requestAnimationFrame(tick);
    };

    const agendar = () => {
      if (raf === null && visivel) raf = requestAnimationFrame(tick);
    };

    const aoRedimensionar = () => {
      medirGeometria();
      agendar();
    };

    const aoCarregar = () => {
      duracao = video.duration || 0;
      // Alguns navegadores (iOS em especial) não pintam quadro
      // nenhum antes do primeiro seek, deixando um retângulo vazio.
      try { video.currentTime = 0; } catch { /* ainda não pode buscar */ }
      agendar();
    };

    medirGeometria();
    palco.classList.add('is-ativo');

    if (video) {
      if (video.readyState >= 1) aoCarregar();
      video.addEventListener('loadedmetadata', aoCarregar);
      video.addEventListener('seeked', agendar);
    }

    // Fora da tela o laço não precisa existir.
    const io = new IntersectionObserver(
      (entradas) => {
        visivel = entradas[0]?.isIntersecting ?? true;
        palco.classList.toggle('is-ativo', visivel);
        if (visivel) agendar();
        else if (raf !== null) { cancelAnimationFrame(raf); raf = null; }
      },
      { rootMargin: '10% 0px' }
    );
    io.observe(secao);

    const ro = new ResizeObserver(aoRedimensionar);
    ro.observe(palco);

    window.addEventListener('scroll', agendar, { passive: true });
    window.addEventListener('resize', aoRedimensionar);

    // Estado inicial correto mesmo se a página abrir rolada.
    const p0 = medirProgresso();
    aplicarZoom(clamp01((p0 - ZOOM_INICIO) / (ZOOM_FIM - ZOOM_INICIO)));
    aplicarTexto(clamp01((p0 - ZOOM_FIM) / (1 - ZOOM_FIM)));

    return () => {
      io.disconnect();
      ro.disconnect();
      window.removeEventListener('scroll', agendar);
      window.removeEventListener('resize', aoRedimensionar);
      if (video) {
        video.removeEventListener('loadedmetadata', aoCarregar);
        video.removeEventListener('seeked', agendar);
      }
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, [semMovimento]);

  return (
    <section
      className={`cchero${semMovimento ? ' cchero--estatico' : ''}`}
      id="inicio"
      ref={secaoRef}
    >
      <style>{HERO_CSS}</style>

      <div className="cchero-pin" ref={pinRef}>
        <div className="cchero-palco" ref={palcoRef}>
          <div className="cchero-quadro" ref={quadroRef}>
            {semMovimento ? (
              /* Sem scrubbing o vídeo não serve para nada — e são
                 1,1 MB que deixam de ser baixados. */
              <img className="cchero-poster" src={posterUrl} alt="" />
            ) : (
              <video
                className="cchero-video"
                ref={videoRef}
                src={videoUrl}
                poster={posterUrl}
                muted
                playsInline
                preload="auto"
                disablePictureInPicture
                tabIndex={-1}
                aria-hidden="true"
              />
            )}

            {debugTela && <div className="cchero-vidro-debug" />}
          </div>

          {/* Fora do quadro para não ser ampliado junto com o vídeo:
              o grão precisa ficar do tamanho de um pixel de tela. */}
          <div className="cchero-grao" aria-hidden="true" />
        </div>

        {/* Fora do palco: não é ampliada pelo zoom, então o texto
            chega nítido enquanto o vídeo por baixo perde definição. */}
        <div
          className={`cchero-camada${semMovimento ? ' is-visivel is-ligada' : ''}`}
          ref={camadaRef}
          style={{ opacity: semMovimento ? 1 : 0 }}
        >
          <div className="cchero-brilho" aria-hidden="true" />

          <div className="cchero-conteudo">
            <span className="cchero-eyebrow">
              <span className="cchero-eyebrow-dot" aria-hidden="true" />
              Capital Cycle
            </span>

            <h1 className="cchero-title">
              <span>Todo capital</span>
              <span className="cchero-accent">tem um ciclo</span>
            </h1>

            <p className="cchero-lead">
              Tenha uma visão completa da sua vida financeira. Centralize suas
              contas, acompanhe seus investimentos e visualize seu patrimônio em
              um único lugar.
            </p>

            <a className="cchero-cta" href="/cadastro">
              Começar agora
              <SetaIcon />
            </a>

            <p className="cchero-ponte">
              A tela que você abre depois de entrar — com os números da sua
              conta no lugar destes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
