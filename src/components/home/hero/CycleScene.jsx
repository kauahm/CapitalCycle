import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

import {
  CycleCurve,
  GrowthCurve,
  makeRibbonGeometry,
  makeContactShadowTexture,
} from './cycleGeometry';
import { makeCycleMaterial } from './cycleMaterial';
import { revealFromProgress } from './cyclePhases';

/* =========================================================
   A cena do Ciclo.

   Este módulo é carregado sob demanda (React.lazy em HeroCycle) —
   three.js é de longe o maior item do bundle e não pode entrar no
   chunk inicial da Home.

   O scroll é o playhead: `progressRef.current` (0→1) determina de
   forma DETERMINÍSTICA a câmera, o quanto do ciclo já acendeu e a
   altura da hélice de crescimento. Rolar para cima desfaz tudo na
   mesma ordem — não há animação disparada por evento, nem estado
   preso no meio do caminho.
   ========================================================= */

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const smooth = (v, a, b) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const lerp = (a, b, t) => a + (b - a) * t;

/* Deslocamento do ciclo para a direita da tela (unidades de mundo).
   No desktop a headline ocupa a metade esquerda; o objeto 3D nunca
   pode disputar espaço com ela. No 'lite' o layout vira coluna única
   e o ciclo passa a ser fundo, centralizado e acima do texto. */
const SHIFT = { full: 1.62, lite: 0 };

/* Percurso da câmera. Quatro marcos, um por estado da narrativa:
   1 aterrissagem · 2 primeiro scroll · 3 história · 4 transição. */
const CAM_FULL = [
  { p: 0.00, pos: [0.25, 4.20, 8.90], look: [0, 0.00, 0] },
  { p: 0.35, pos: [1.30, 5.00, 8.20], look: [0, 0.16, 0] },
  { p: 0.70, pos: [0.50, 6.40, 7.60], look: [0, 0.72, 0] },
  { p: 1.00, pos: [0.00, 7.70, 11.20], look: [0, 0.55, 0] },
];

const CAM_LITE = [
  { p: 0.00, pos: [0, 4.40, 8.10], look: [0, 0.05, 0] },
  { p: 1.00, pos: [0, 5.20, 7.80], look: [0, 0.32, 0] },
];

function sampleCamera(keys, p, outPos, outLook) {
  let i = 0;
  while (i < keys.length - 2 && p > keys[i + 1].p) i++;
  const a = keys[i];
  const b = keys[i + 1];
  const t = smooth(p, a.p, b.p);
  outPos.set(
    lerp(a.pos[0], b.pos[0], t),
    lerp(a.pos[1], b.pos[1], t),
    lerp(a.pos[2], b.pos[2], t)
  );
  outLook.set(
    lerp(a.look[0], b.look[0], t),
    lerp(a.look[1], b.look[1], t),
    lerp(a.look[2], b.look[2], t)
  );
}

const NODE_COUNT = { full: 16, lite: 7 };

function CycleRig({ progressRef, pointerRef, tier }) {
  const { camera } = useThree();

  const groupRef = useRef();
  const ringRef = useRef();
  const growthRef = useRef();
  const tipRef = useRef();
  const nodesRef = useRef();
  const shadowRef = useRef();

  const intro = useRef(0);
  const eased = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });

  const lite = tier === 'lite';

  /* ---------- Recursos da cena ----------
     Curvas, geometrias, materiais e textura são criados uma vez.
     `useMemo` aqui não é micro-otimização: sem ele, cada re-render do
     React reconstruiria a fita (320 segmentos × 4 vértices) e vazaria
     buffers de GPU. */
  const scene = useMemo(() => {
    const cycleCurve = new CycleCurve(1.92, 0.13);
    const growthCurve = new GrowthCurve(0.60, 2.05, 0.72);

    const ringGeo = makeRibbonGeometry(cycleCurve, {
      segments: lite ? 190 : 340,
      width: 0.30,
      thickness: 0.07,
      closed: true,
    });

    const growthGeo = makeRibbonGeometry(growthCurve, {
      segments: lite ? 90 : 170,
      width: 0.125,
      thickness: 0.04,
      closed: false,
    });

    const ringMat = makeCycleMaterial({ pulseGain: lite ? 0.4 : 0.6 });
    const growthMat = makeCycleMaterial({
      base: '#7a80a0',
      accentGain: 1.6,
      pulseGain: 0,
    });

    const shadowTex = makeContactShadowTexture(256);

    // A hélice nasce num pico da ondulação — o capital não sobe de um
    // ponto arbitrário do anel. Entre os dois picos, escolhemos o da
    // frente-direita (t = 0.125): o de trás (t = 0.625) jogava a
    // espiral por cima da headline.
    const growthAnchor = cycleCurve.getPoint(0.125);

    return {
      cycleCurve,
      ringGeo,
      growthGeo,
      ringMat,
      growthMat,
      shadowTex,
      growthAnchor,
      growthTip: growthCurve.getPoint(1),
    };
  }, [lite]);

  // Descarta buffers de GPU e a textura quando a Hero sai de cena.
  useEffect(() => () => {
    scene.ringGeo.dispose();
    scene.growthGeo.dispose();
    scene.ringMat.dispose();
    scene.growthMat.dispose();
    scene.shadowTex.dispose();
  }, [scene]);

  const count = NODE_COUNT[lite ? 'lite' : 'full'];

  const nodeGeo = useMemo(() => new THREE.SphereGeometry(0.075, 12, 10), []);
  const nodeMat = useMemo(
    () => new THREE.MeshBasicMaterial({ transparent: true, toneMapped: false }),
    []
  );
  useEffect(() => () => {
    nodeGeo.dispose();
    nodeMat.dispose();
  }, [nodeGeo, nodeMat]);

  const scratch = useMemo(
    () => ({
      pos: new THREE.Vector3(),
      look: new THREE.Vector3(),
      p3: new THREE.Vector3(),
      m4: new THREE.Matrix4(),
      colWarm: new THREE.Color('#6366f1'),
      colCold: new THREE.Color('#aab0c6'),
      col: new THREE.Color(),
    }),
    []
  );

  const camKeys = lite ? CAM_LITE : CAM_FULL;
  const shift = lite ? SHIFT.lite : SHIFT.full;

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    // `delta` pode explodir quando a aba volta do background; sem o
    // teto, tudo salta um trecho inteiro da narrativa de uma vez.
    const dt = Math.min(delta, 1 / 20);

    /* ---- O playhead ----
       No desktop vem do scroll pinado. No 'lite' o scroll pinado não
       existe (o layout é estático abaixo de 981px), então a cena roda
       a própria linha do tempo: acende uma vez na entrada e fica no
       estado de repouso. Não é um loop — reiniciar do zero em
       intervalos fixos chamaria atenção para si mesmo. */
    let target;
    if (lite) {
      intro.current += dt;
      const e = clamp01(intro.current / 5.5);
      target = (1 - Math.pow(1 - e, 3)) * 0.72;
    } else {
      target = clamp01(progressRef.current);
    }
    eased.current += (target - eased.current) * Math.min(1, dt * 7.5);
    const p = eased.current;

    /* ---- Câmera ---- */
    sampleCamera(camKeys, p, scratch.pos, scratch.look);

    // Parallax de mouse: um empurrão pequeno, amortecido, e que
    // encolhe conforme a narrativa avança — perto da transição a
    // câmera precisa ser da história, não do ponteiro.
    const pt = pointerRef.current;
    pointer.current.x += (pt.x - pointer.current.x) * Math.min(1, dt * 3.2);
    pointer.current.y += (pt.y - pointer.current.y) * Math.min(1, dt * 3.2);
    const parallax = lite ? 0 : 0.42 * (1 - smooth(p, 0.55, 1));
    scratch.pos.x += pointer.current.x * parallax;
    scratch.pos.y += pointer.current.y * parallax * 0.55;

    camera.position.copy(scratch.pos);
    camera.lookAt(scratch.look);

    /* ---- Estado do ciclo ---- */
    const reveal = revealFromProgress(p);
    const growth = smooth(p, 0.36, 0.70);
    // O ciclo precisa estar praticamente fora antes de os Recursos
    // aparecerem: com as duas camadas em opacidade alta ao mesmo tempo,
    // o título da próxima seção cai ilegível em cima da fita.
    const fade = 1 - smooth(p, 0.70, 0.86);

    const group = groupRef.current;
    if (group) {
      group.position.x = shift;
      group.position.y = lite ? 0.3 : 0;
      // Rotação lenta de repouso + um giro extra dirigido pelo scroll.
      // Sem o termo do tempo o objeto congela quando ninguém rola;
      // sem o termo do scroll ele giraria "sozinho", que é exatamente
      // o 3D decorativo que este redesenho existe para evitar.
      group.rotation.y = time * 0.052 + p * 0.85;
      group.rotation.x = lerp(0.10, 0.02, smooth(p, 0, 0.75));
    }

    const rm = scene.ringMat.uniforms;
    rm.uReveal.value = reveal;
    rm.uPulse.value = (time * 0.085 + p * 0.45) % 1;
    rm.uOpacity.value = fade;

    const gm = scene.growthMat.uniforms;
    gm.uReveal.value = growth;
    const growthAlpha = fade * smooth(p, 0.34, 0.42);
    gm.uOpacity.value = growthAlpha;

    if (growthRef.current) growthRef.current.visible = growthAlpha > 0.01;
    if (tipRef.current) {
      // A esfera do topo só aparece quando a espiral chega lá.
      const tipIn = growthAlpha * smooth(growth, 0.82, 1);
      tipRef.current.visible = tipIn > 0.01;
      tipRef.current.material.opacity = tipIn;
      const ts = 0.6 + tipIn * 0.4;
      tipRef.current.scale.setScalar(ts);
    }
    if (ringRef.current) ringRef.current.visible = fade > 0.01;

    if (shadowRef.current) {
      shadowRef.current.material.opacity = fade * 0.9;
    }

    /* ---- Nós de alocação ----
       Os "aportes" circulando pelo ciclo. InstancedMesh: uma draw call
       para todos, e a cor de cada um acende quando o playhead passa
       pela posição dele. */
    const nodes = nodesRef.current;
    if (nodes) {
      for (let i = 0; i < count; i++) {
        const base = i / count;
        const t = (base + time * 0.026 + p * 0.3) % 1;
        scene.cycleCurve.getPoint(t, scratch.p3);

        const on = t <= reveal ? 1 : 0;
        const s = (0.72 + (i % 3) * 0.2) * (0.85 + on * 0.35) * fade;

        scratch.m4.makeScale(s, s, s);
        scratch.m4.setPosition(scratch.p3);
        nodes.setMatrixAt(i, scratch.m4);

        scratch.col.copy(on ? scratch.colWarm : scratch.colCold);
        nodes.setColorAt(i, scratch.col);
      }
      nodes.instanceMatrix.needsUpdate = true;
      if (nodes.instanceColor) nodes.instanceColor.needsUpdate = true;
      nodes.material.opacity = fade;
    }
  });

  const anchor = scene.growthAnchor;
  const tip = scene.growthTip;

  return (
    <group ref={groupRef}>
      <mesh ref={ringRef} geometry={scene.ringGeo} material={scene.ringMat} />

      <mesh
        ref={growthRef}
        geometry={scene.growthGeo}
        material={scene.growthMat}
        position={[anchor.x, anchor.y, anchor.z]}
      />

      {/* O topo da subida: o patrimônio consolidado no fim do ciclo.
          Sem esse ponto de chegada a espiral termina no nada. */}
      <mesh ref={tipRef} position={[anchor.x + tip.x, anchor.y + tip.y, anchor.z + tip.z]}>
        <sphereGeometry args={[0.115, 16, 12]} />
        <meshBasicMaterial color="#6366f1" transparent depthWrite={false} toneMapped={false} />
      </mesh>

      <instancedMesh
        ref={nodesRef}
        args={[nodeGeo, nodeMat, count]}
        frustumCulled={false}
      />

      <mesh ref={shadowRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.0, 0]}>
        <planeGeometry args={[7.4, 6.2]} />
        <meshBasicMaterial
          map={scene.shadowTex}
          transparent
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

export default function CycleScene({ progressRef, pointerRef, tier, running, onReady }) {
  return (
    <Canvas
      // `flat` = NoToneMapping. O ACES padrão do R3F lava as cores num
      // fundo claro, e aqui a paleta é autoral: o cinza da fita e o
      // indigo da marca precisam sair exatamente como foram escritos.
      flat
      frameloop={running ? 'always' : 'never'}
      dpr={tier === 'lite' ? [1, 1.5] : [1, 2]}
      gl={{
        antialias: tier !== 'lite',
        alpha: true,
        powerPreference: 'high-performance',
        stencil: false,
        depth: true,
      }}
      camera={{ fov: 38, near: 0.1, far: 60, position: [0, 1.05, 8.7] }}
      style={{ pointerEvents: 'none' }}
      // Avisa a camada de cima que já há o que mostrar, para o canvas
      // entrar com fade por cima do fallback em vez de aparecer seco.
      onCreated={() => onReady?.()}
    >
      <CycleRig progressRef={progressRef} pointerRef={pointerRef} tier={tier} />
    </Canvas>
  );
}
