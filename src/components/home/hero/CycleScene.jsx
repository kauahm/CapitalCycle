import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

import {
  CycleCurve,
  GrowthCurve,
  makeRibbonGeometry,
  makeGlowTexture,
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
const SHIFT = { wide: 1.95, narrow: 0 };

/* Percurso da câmera. Quatro marcos, um por estado da narrativa:
   1 aterrissagem · 2 primeiro scroll · 3 história · 4 transição. */
const CAM_FULL = [
  { p: 0.00, pos: [0.30, 3.10, 8.60], look: [0, -0.55, 0] },
  { p: 0.35, pos: [1.70, 4.90, 6.90], look: [0, -0.05, 0] },
  { p: 0.70, pos: [0.30, 7.30, 6.40], look: [0, 0.70, 0] },
  { p: 1.00, pos: [-0.30, 9.20, 11.60], look: [0, 0.40, 0] },
];

/* No layout estreito o alvo da câmera fica bem abaixo do anel, o que joga o
   objeto para o terço superior da tela. Ali ele fica atrás da headline
   — texto preto e enorme, que aguenta uma textura por trás — em vez de
   atravessar a lista de fases, onde rótulos pequenos e cinzas perdem
   legibilidade na hora. */
const CAM_LITE = [
  { p: 0.00, pos: [0, 4.40, 8.10], look: [0, -1.90, 0] },
  { p: 1.00, pos: [0, 5.20, 7.80], look: [0, -1.62, 0] },
];

/* Percurso da câmera como CURVA, não como pares de keyframes.

   A versão anterior interpolava com smoothstep entre o keyframe
   anterior e o seguinte. Smoothstep tem derivada zero nas duas pontas,
   então a câmera PARAVA em cada keyframe intermediário e arrancava de
   novo — um movimento staccato, o oposto do dolly contínuo das
   referências.

   Catmull-Rom passa por todos os pontos com velocidade contínua (C1),
   que é exatamente o que um travelling de verdade faz. */
function makeCameraPath(keys) {
  return {
    pos: new THREE.CatmullRomCurve3(
      keys.map((k) => new THREE.Vector3(...k.pos)),
      false,
      'catmullrom',
      0.5
    ),
    look: new THREE.CatmullRomCurve3(
      keys.map((k) => new THREE.Vector3(...k.look)),
      false,
      'catmullrom',
      0.5
    ),
  };
}

const NODE_COUNT = { full: 16, lite: 7 };

/* Dois eixos independentes, que já foram confundidos uma vez:

   `scrollDriven` é o eixo de LAYOUT — vem do mesmo media query que
   liga a história pinada (>= 981px e sem prefers-reduced-motion).
   Decide de onde vem o playhead e como a cena é enquadrada.

   `tier` é o eixo de DESEMPENHO — vem do WebGL e do aparelho. Decide
   só fidelidade: número de nós, DPR, antialias, segmentos.

   Quando o tier decidia o playhead, um desktop largo com poucos
   núcleos caía em 'lite': a fita rodava a própria linha do tempo
   enquanto a coluna de fases seguia o scroll, e as duas contavam
   histórias diferentes na mesma tela. */
function CycleRig({ progressRef, pointerRef, tier, scrollDriven }) {
  const { camera } = useThree();

  const groupRef = useRef();
  const ringRef = useRef();
  const growthRef = useRef();
  const tipRef = useRef();
  const nodesRef = useRef();
  const haloRef = useRef();
  const poolRef = useRef();

  const intro = useRef(0);
  const clock = useRef(0);
  const eased = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });

  const lite = tier === 'lite';
  const wide = scrollDriven;

  /* ---------- Recursos da cena ----------
     Curvas, geometrias, materiais e textura são criados uma vez.
     `useMemo` aqui não é micro-otimização: sem ele, cada re-render do
     React reconstruiria a fita (320 segmentos × 4 vértices) e vazaria
     buffers de GPU. */
  const scene = useMemo(() => {
    const cycleCurve = new CycleCurve(2.30, 0.15);
    // Mais baixa no layout estreito: em tela alta, a espiral cheia
    // estoura o topo do enquadramento e parece cortada por acidente.
    // (Altura é enquadramento, não fidelidade — por isso `wide`.)
    const growthCurve = new GrowthCurve(0.74, wide ? 2.15 : 1.45, 0.72);

    const ringGeo = makeRibbonGeometry(cycleCurve, {
      segments: lite ? 170 : 380,
      width: 0.40,
      thickness: 0.095,
      closed: true,
    });

    const growthGeo = makeRibbonGeometry(growthCurve, {
      segments: lite ? 90 : 190,
      width: 0.16,
      thickness: 0.05,
      closed: false,
    });

    const ringMat = makeCycleMaterial({ pulseGain: lite ? 0.4 : 0.6 });
    const growthMat = makeCycleMaterial({
      base: '#2b3050',
      accent: '#8b7cf6',
      // A hélice representa uma fase só (crescimento), então não recebe
      // a varredura de cores do ciclo.
      chroma: 0,
      accentGain: 1.6,
      pulseGain: 0,
    });

    const glowTex = makeGlowTexture(256);

    // A hélice nasce num pico da ondulação — o capital não sobe de um
    // ponto arbitrário do anel. Dos dois picos, usamos o de trás
    // (t = 0.625): com o ciclo grande e deslocado para a direita, o
    // pico da frente cai fora do enquadramento, e este sobe para o
    // miolo vazio do frame.
    const growthAnchor = cycleCurve.getPoint(0.625);

    return {
      cycleCurve,
      ringGeo,
      growthGeo,
      ringMat,
      growthMat,
      glowTex,
      growthAnchor,
      growthTip: growthCurve.getPoint(1),
    };
  }, [lite, wide]);

  // Descarta buffers de GPU e a textura quando a Hero sai de cena.
  useEffect(() => () => {
    scene.ringGeo.dispose();
    scene.growthGeo.dispose();
    scene.ringMat.dispose();
    scene.growthMat.dispose();
    scene.glowTex.dispose();
  }, [scene]);

  const count = NODE_COUNT[lite ? 'lite' : 'full'];

  const nodeGeo = useMemo(() => new THREE.SphereGeometry(0.09, 12, 10), []);
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

  const camKeys = wide ? CAM_FULL : CAM_LITE;
  const camPath = useMemo(() => makeCameraPath(camKeys), [camKeys]);
  const shift = wide ? SHIFT.wide : SHIFT.narrow;

  useFrame((state, delta) => {
    // `delta` pode explodir quando a aba volta do background; sem o
    // teto, tudo salta um trecho inteiro da narrativa de uma vez.
    const dt = Math.min(delta, 1 / 20);

    /* Tempo próprio, acumulado a partir do dt já limitado — e não
       `clock.elapsedTime`, que é relógio de parede e continua correndo
       enquanto o laço está parado. Com ele, voltar à Hero depois de
       meio minuto lendo os Planos faria a rotação e o pulso saltarem
       o intervalo inteiro de uma vez. */
    clock.current += dt;
    const time = clock.current;

    /* ---- O playhead ----
       No desktop vem do scroll pinado. Sem ele (layout estático abaixo
       de 981px) a cena roda a própria linha do tempo: acende uma vez na
       entrada e fica no estado de repouso. Não é um loop — reiniciar do
       zero em intervalos fixos chamaria atenção para si mesmo. */
    let target;
    if (!wide) {
      intro.current += dt;
      const e = clamp01(intro.current / 5.5);
      target = (1 - Math.pow(1 - e, 3)) * 0.72;
    } else {
      target = clamp01(progressRef.current);
    }
    eased.current += (target - eased.current) * Math.min(1, dt * 7.5);
    const p = eased.current;

    /* ---- Câmera ---- */
    const u = clamp01(p);
    camPath.pos.getPoint(u, scratch.pos);
    camPath.look.getPoint(u, scratch.look);

    // Parallax de mouse: um empurrão pequeno, amortecido, e que
    // encolhe conforme a narrativa avança — perto da transição a
    // câmera precisa ser da história, não do ponteiro.
    const pt = pointerRef.current;
    pointer.current.x += (pt.x - pointer.current.x) * Math.min(1, dt * 3.2);
    pointer.current.y += (pt.y - pointer.current.y) * Math.min(1, dt * 3.2);
    const parallax = wide ? 0.42 * (1 - smooth(p, 0.55, 1)) : 0;
    scratch.pos.x += pointer.current.x * parallax;
    scratch.pos.y += pointer.current.y * parallax * 0.55;

    camera.position.copy(scratch.pos);
    camera.lookAt(scratch.look);

    /* ---- Estado do ciclo ---- */
    const reveal = revealFromProgress(p);
    const growth = smooth(p, 0.36, 0.70);
    // O ciclo sai antes do apagão terminar de fechar, para não ficar
    // como fantasma por baixo do preto.
    const fade = 1 - smooth(p, 0.58, 0.72);

    const group = groupRef.current;
    if (group) {
      /* ---- Ajuste ao formato da tela ----
         O enquadramento foi desenhado para uma viewport deitada. Numa
         tela em pé (celular, ou uma janela estreita no desktop) a
         largura visível encolhe muito mais rápido que a altura, e o
         anel simplesmente não cabe: sobra só um pedaço dele na borda.
         Em vez de mover a câmera — o que achataria a perspectiva — o
         grupo inteiro é reduzido até caber. */
      const aspect = state.size.width / Math.max(1, state.size.height);
      const fit = Math.min(1, aspect / (wide ? 1.45 : 0.95));
      const scale = Math.max(wide ? 0.6 : 0.42, fit);
      group.scale.setScalar(scale);

      /* O deslocamento lateral é medido em unidades de mundo, mas a
         composição é uma fração da LARGURA da tela. Numa ultrawide a
         largura visível cresce sem que o deslocamento cresça junto, e o
         anel volta para o meio — em cima da headline. Daí a correção
         proporcional ao aspecto, com teto para não jogar o objeto para
         fora em telas absurdamente largas. */
      const spread = Math.min(1.5, Math.max(0.85, aspect / 1.6));
      group.position.x = shift * scale * spread;
      // Um pouco abaixo do centro: a rotação de repouso muda a silhueta
      // projetada ao longo do tempo, e sem essa folga o topo do anel
      // acaba encostando na navbar em algumas voltas.
      group.position.y = wide ? -0.45 : 0.3;
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

    /* O halo e a poça acompanham o acendimento: no início o ciclo está
       quase todo apagado e quase não emite luz; conforme as fases
       acendem, o sangramento no fundo cresce junto. Se a intensidade
       fosse fixa, a luz existiria antes da fonte. */
    const emit = 0.14 + Math.pow(reveal, 1.35) * 1.16;
    if (haloRef.current) {
      haloRef.current.material.opacity = fade * emit * 0.72;
      const hs = 0.82 + reveal * 0.26;
      haloRef.current.scale.set(hs, hs, 1);
    }
    if (poolRef.current) {
      poolRef.current.material.opacity = fade * emit * 0.34;
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
      // Opacidade zero ainda custa a draw call; durante a transição para
      // os Recursos não há motivo para pagá-la.
      nodes.visible = fade > 0.01;
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

      {/* Halo atrás do ciclo: a luz sangrando para o fundo. Fica no
          plano de trás e não escreve profundidade, então o anel passa
          por cima dele sem recorte. Menor no 'lite': plano aditivo
          grande é overdraw em tela cheia, que é o que realmente pesa
          numa GPU móvel. */}
      <mesh ref={haloRef} position={[0, 0.1, -1.6]}>
        <planeGeometry args={lite ? [7, 7] : [10.5, 10.5]} />
        <meshBasicMaterial
          map={scene.glowTex}
          color="#4c50d8"
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>

      {/* Poça de luz sob o ciclo: o que dá peso no escuro, já que
          sombra escura sobre fundo escuro não existe. É o mais sutil
          dos dois efeitos, então é o primeiro a cair no 'lite'. */}
      {!lite && (
      <mesh ref={poolRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.05, 0]}>
        <planeGeometry args={[10.0, 7.8]} />
        <meshBasicMaterial
          map={scene.glowTex}
          color="#3b3fa8"
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
      )}
    </group>
  );
}

export default function CycleScene({ progressRef, pointerRef, tier, scrollDriven, running, onReady }) {
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
      <CycleRig
        progressRef={progressRef}
        pointerRef={pointerRef}
        tier={tier}
        scrollDriven={scrollDriven}
      />
    </Canvas>
  );
}
