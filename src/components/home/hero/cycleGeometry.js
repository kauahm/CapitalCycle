import * as THREE from 'three';

/* =========================================================
   Geometria procedural do Ciclo.

   Nada aqui vem de arquivo: a fita, a hélice de crescimento e a
   sombra de contato são construídas em runtime. O peso de asset da
   Hero é zero — o que entra no bundle é só este módulo.
   ========================================================= */

/* ---------- A curva do ciclo ----------
   Círculo no plano XZ com uma ondulação senoidal discreta em Y, de
   dois períodos.

   Os dois períodos não são estética: sin(2a) zera exatamente em
   a = 0, π/2, π e 3π/2 — as quatro fronteiras das quatro fases do
   ciclo (entrada, alocação, crescimento, patrimônio). Cada fase cai
   sobre um pico ou um vale, então a forma já conta a história antes
   de qualquer animação.

   A amplitude é deliberadamente pequena. Alta, a ondulação briga com
   a leitura de "anel" — a curva se cruza na projeção e o objeto vira
   uma fita amassada em vez de um ciclo. */
export class CycleCurve extends THREE.Curve {
  constructor(radius = 2.62, lift = 0.16) {
    super();
    this.radius = radius;
    this.lift = lift;
  }

  getPoint(t, target = new THREE.Vector3()) {
    const a = t * Math.PI * 2;
    // O raio é igual nos dois eixos: o achatamento em elipse tem que
    // vir da perspectiva da câmera, não da geometria. Achatar os dois
    // ao mesmo tempo transformava o anel numa gota.
    return target.set(
      Math.cos(a) * this.radius,
      Math.sin(a * 2) * this.lift,
      Math.sin(a) * this.radius
    );
  }
}

/* ---------- A hélice de crescimento ----------
   Sobe do pico do ciclo em espiral, fechando mais e mais: o capital
   que saiu do ciclo e virou patrimônio. Aberta (não é loop). */
const PHASE0 = Math.PI * 0.25;

export class GrowthCurve extends THREE.Curve {
  constructor(radius = 1.15, height = 2.35, turns = 1.6) {
    super();
    this.radius = radius;
    this.height = height;
    this.turns = turns;
  }

  getPoint(t, target = new THREE.Vector3()) {
    const a = t * Math.PI * 2 * this.turns + PHASE0;
    // O raio encolhe conforme sobe — a espiral "afunila" em vez de
    // subir como um cilindro, que ficaria mecânico demais.
    const r = this.radius * (1 - t * 0.55);
    // Ease-out na altura: sobe rápido e desacelera no topo.
    const y = this.height * (1 - Math.pow(1 - t, 2.1));

    // A origem da curva é transladada para (0,0,0). Sem isso o primeiro
    // ponto nasce deslocado do centro e a espiral aparece solta no ar,
    // ao lado do anel em vez de saindo dele.
    return target.set(
      Math.cos(a) * r - Math.cos(PHASE0) * this.radius,
      y,
      (Math.sin(a) * r - Math.sin(PHASE0) * this.radius) * 0.82
    );
  }
}

/* ---------- Fita de seção retangular ----------
   TubeGeometry só faz tubo redondo. Uma fita chapada (dois vértices
   por amostra) desaparece quando vista de perfil. A seção retangular
   — larga e fina, como uma tira de alumínio anodizado — lê bem em
   qualquer ângulo da câmera e é o que dá o aspecto usinado.

   Cada vértice carrega `aT` (0→1 ao longo da curva), que é o que o
   shader usa para acender as fases em sequência. */
export function makeRibbonGeometry(curve, {
  segments = 320,
  width = 0.2,
  thickness = 0.05,
  closed = true,
} = {}) {
  const frames = curve.computeFrenetFrames(segments, closed);
  const rings = closed ? segments : segments + 1;

  const positions = [];
  const normals = [];
  const ts = [];

  const p = new THREE.Vector3();
  const halfW = width / 2;
  const halfT = thickness / 2;

  // Os 4 cantos da seção, em coordenadas (binormal, normal).
  const corners = [
    [+halfW, +halfT],
    [+halfW, -halfT],
    [-halfW, -halfT],
    [-halfW, +halfT],
  ];

  for (let i = 0; i < rings; i++) {
    const t = i / segments;
    curve.getPoint(closed ? t % 1 : t, p);
    const N = frames.normals[i % frames.normals.length];
    const B = frames.binormals[i % frames.binormals.length];

    for (const [b, n] of corners) {
      positions.push(
        p.x + B.x * b + N.x * n,
        p.y + B.y * b + N.y * n,
        p.z + B.z * b + N.z * n
      );
      // Normal da face: dominada pelo eixo de maior offset.
      const useN = Math.abs(n) > Math.abs(b) * (thickness / width);
      const dir = useN
        ? [N.x * Math.sign(n), N.y * Math.sign(n), N.z * Math.sign(n)]
        : [B.x * Math.sign(b), B.y * Math.sign(b), B.z * Math.sign(b)];
      normals.push(dir[0], dir[1], dir[2]);
      ts.push(t);
    }
  }

  const indices = [];
  const last = closed ? rings : rings - 1;
  for (let i = 0; i < last; i++) {
    const a = i * 4;
    const b = ((i + 1) % rings) * 4;
    for (let c = 0; c < 4; c++) {
      const c2 = (c + 1) % 4;
      indices.push(a + c, b + c, b + c2);
      indices.push(a + c, b + c2, a + c2);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geo.setAttribute('aT', new THREE.Float32BufferAttribute(ts, 1));
  geo.setIndex(indices);
  geo.computeBoundingSphere();
  return geo;
}

/* ---------- Halo de luz ----------
   Um radial gradient branco desenhado em canvas 2D, usado como textura
   em planos com blending aditivo.

   Serve a duas funções que as referências mostram serem essenciais e
   que a versão anterior não tinha:

   1. O SANGRAMENTO. Em apple-macbook-pro.webp a luz do objeto não fica
      presa nele — vaza para o fundo como um brilho colorido difuso. É
      isso que faz o objeto parecer estar DENTRO de um espaço, e não
      recortado por cima de um fundo.
   2. O PESO. Sobre fundo escuro uma sombra escura é invisível, então o
      que ancora o objeto é o oposto: uma poça de luz sob ele, como o
      reflexo sob o MacBook Pro.

   Um pass de bloom de verdade (EffectComposer) custaria dois render
   targets em tela cheia por frame. Isto custa dois quads. */
export function makeGlowTexture(size = 256) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  // A curva é deliberadamente suave no miolo e longa na cauda: um
  // gradiente linear formaria um disco com borda perceptível.
  g.addColorStop(0.00, 'rgba(255,255,255,1)');
  g.addColorStop(0.16, 'rgba(255,255,255,0.62)');
  g.addColorStop(0.36, 'rgba(255,255,255,0.24)');
  g.addColorStop(0.62, 'rgba(255,255,255,0.06)');
  g.addColorStop(1.00, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
