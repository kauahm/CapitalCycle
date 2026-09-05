import * as THREE from 'three';

/* =========================================================
   Material da fita do Ciclo.

   Reescrito a partir das referências em /referencias. A versão
   anterior usava iluminação hemisférica suave sobre fundo cinza claro,
   e o resultado era o que as referências deixam evidente que não
   funciona: um objeto sem faixa tonal, chapado, "plástico de vetor".

   O que as referências ensinam:

   - apple-macbook-pro.webp / WatchUltra.png — sobre fundo preto, o que
     separa o objeto do vazio é o RIM LIGHT: uma linha especular
     contínua percorrendo todo o contorno. Sem ela o objeto some.
   - WatchUltra.png — a faixa tonal vai de preto puro a especular quase
     branco no mesmo material. É esse alcance que lê como metal.
   - apple-macbook-pro.webp — a luz não fica presa no objeto: ela sangra
     para o fundo como brilho colorido.
   - 1.png (Jeton) — o objeto é tingido pelo ambiente, não é uma cor
     isolada colada por cima.

   Continua sem HDRI e sem textura: tudo é analítico, ~70 linhas de GLSL.
   ========================================================= */

const vertexShader = /* glsl */`
  attribute float aT;
  varying float vT;
  varying vec3 vWorldNormal;
  varying vec3 vViewDir;
  varying float vDepth;

  void main() {
    vT = aT;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    vec4 world = modelMatrix * vec4(position, 1.0);
    vViewDir = normalize(cameraPosition - world.xyz);
    vDepth = distance(cameraPosition, world.xyz);
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const fragmentShader = /* glsl */`
  precision highp float;

  uniform vec3  uBase;
  uniform vec3  uAccent;
  uniform vec3  uPhaseA;   // entrada
  uniform vec3  uPhaseB;   // alocação
  uniform vec3  uPhaseC;   // crescimento
  uniform vec3  uPhaseD;   // patrimônio
  uniform float uChroma;   // 0 = monocromático, 1 = varredura completa
  uniform vec3  uRim;
  uniform float uReveal;     // 0→1: quanto do ciclo já acendeu
  uniform float uPulse;      // posição (0→1) do pulso de capital
  uniform float uPulseGain;
  uniform float uOpacity;
  uniform float uAccentGain;

  uniform vec3  uFog;        // cor do fundo, para a perspectiva aérea
  uniform float uFogNear;
  uniform float uFogFar;

  varying float vT;
  varying vec3  vWorldNormal;
  varying vec3  vViewDir;
  varying float vDepth;

  // Key light alta à esquerda, como no Watch Ultra.
  const vec3 KEY = vec3(-0.55, 0.78, 0.42);
  // Contraluz que alimenta o rim: vem de trás e de cima, do lado oposto.
  const vec3 BACK = vec3(0.38, 0.46, -0.80);

  /* Varredura cromática ao longo do ciclo.

     Em apple-macbook-pro.webp a MESMA aresta percorre ciano, roxo,
     magenta e laranja. É essa variação interna que faz o objeto
     parecer fotografado; um objeto de cor única lê como render.

     Aqui a varredura não é enfeite: cada trecho carrega a cor da fase
     que ele representa, então a cor passa a codificar informação. Os
     quatro tons ficam dentro da família indigo/violeta da marca — o
     objetivo é variação, não arco-íris.

     Interpolação circular: o quarto tom volta para o primeiro, senão
     apareceria uma emenda dura na costura do anel. */
  vec3 phaseColor(float t) {
    float x = fract(t) * 4.0;
    int i = int(floor(x));
    float f = smoothstep(0.0, 1.0, fract(x));
    vec3 c0 = i == 0 ? uPhaseA : i == 1 ? uPhaseB : i == 2 ? uPhaseC : uPhaseD;
    vec3 c1 = i == 0 ? uPhaseB : i == 1 ? uPhaseC : i == 2 ? uPhaseD : uPhaseA;
    return mix(c0, c1, f);
  }

  void main() {
    vec3 N = normalize(vWorldNormal);
    vec3 V = normalize(vViewDir);
    // A face interna da fita precisa da normal invertida, senão fica
    // preta quando o ciclo gira.
    if (!gl_FrontFacing) N = -N;

    vec3 L = normalize(KEY);
    float ndl = max(dot(N, L), 0.0);

    /* ---- Especular de metal escovado ----
       Dois lóbulos: um durésimo (o risco de luz que corre pela peça) e
       um largo e fraco (o corpo acetinado). Um lóbulo só dá plástico. */
    vec3 H = normalize(L + V);
    float ndh = max(dot(N, H), 0.0);
    float spec = pow(ndh, 380.0) * 5.2 + pow(ndh, 28.0) * 0.40;

    /* ---- Varredura especular contínua ----
       Blinn-Phong com uma luz direcional só acende dois PONTOS ao longo
       de um anel — é onde o meio-vetor se alinha. Nas referências o que
       existe é uma LINHA de luz percorrendo a peça inteira
       (WatchUltra.png), porque num estúdio a fonte é um softbox largo,
       não um ponto.

       Aproximar uma área de luz de verdade sairia caro. Mas o efeito
       que importa é geométrico: a faixa acesa é a que aponta para cima,
       na direção da fonte. N.y elevado a uma potência reproduz
       exatamente essa varredura contínua ao longo de toda a fita, por
       uma potência e uma multiplicação. */
    float sheen = pow(max(N.y, 0.0), 3.4);

    /* ---- Rim light ----
       O item mais importante deste material. Fresnel puro acende o
       contorno inteiro por igual, o que lê como neon barato; modulando
       pela contraluz, só o lado que "recebe" o contraluz acende forte,
       e o contorno ganha direção. */
    float fres = pow(1.0 - max(dot(N, V), 0.0), 4.2);
    float rimDir = smoothstep(-0.45, 1.0, dot(N, normalize(BACK)));
    float rim = fres * (0.30 + rimDir * 1.75);

    // Ambiente quase nulo: no escuro, o que não é atingido por luz
    // alguma tem mesmo que cair para perto do preto.
    vec3 ambient = mix(
      vec3(0.010, 0.011, 0.022),
      vec3(0.130, 0.138, 0.205),
      N.y * 0.5 + 0.5
    );

    // ---- Acendimento das fases ----
    float ignited = 1.0 - smoothstep(uReveal - 0.035, uReveal + 0.012, vT);
    // Borda quente na frente do acendimento.
    float edge = exp(-pow((vT - uReveal) * 34.0, 2.0))
               * step(0.001, uReveal) * step(uReveal, 0.999);

    // ---- Pulso de capital circulando ----
    // Distância com wrap: atravessa a emenda t=1→0 sem piscar.
    float d = abs(fract(vT - uPulse + 0.5) - 0.5);
    float pulse = exp(-pow(d * 24.0, 2.0));

    vec3 tone = mix(uAccent, phaseColor(vT), uChroma);
    vec3 albedo = mix(uBase, tone, ignited * 0.45 * uAccentGain);

    vec3 color = albedo * (ambient + ndl * 1.45);
    color += vec3(0.88, 0.90, 1.0) * spec * (0.55 + ignited * 0.60);
    color += vec3(0.82, 0.85, 1.0) * sheen * (0.34 + ignited * 0.38);
    // O rim também recebe a cor da fase: é ele que percorre o contorno
    // inteiro, então é por ele que a varredura fica visível.
    vec3 rimTone = mix(uRim, mix(uRim, tone, 0.62), uChroma);
    color += rimTone * rim * (0.34 + ignited * 0.95);
    color += tone * (ignited * 0.42 + edge * 2.30 + pulse * uPulseGain * 1.7);

    /* ---- Perspectiva aérea ----
       Em 1.png (Jeton) os discos do fundo somem em desfoque; é isso que
       cria a separação de planos. Desfoque de verdade exigiria um pass
       de profundidade de campo. O mesmo trabalho de leitura é feito por
       este esmaecimento: o lado distante do ciclo se dissolve na cor do
       ambiente, e o lado próximo fica limpo — o anel deixa de parecer
       um decalque chapado e passa a ocupar profundidade. */
    float aerial = smoothstep(uFogNear, uFogFar, vDepth);
    color = mix(color, uFog, aerial * 0.72);

    gl_FragColor = vec4(color, uOpacity);
    #include <colorspace_fragment>
  }
`;

export function makeCycleMaterial({
  // Base escura: sobre fundo preto, um metal escuro com contorno aceso
  // lê como peça usinada. Base clara lavaria tudo de novo.
  base = '#2c3150',
  accent = '#6366f1',
  rim = '#a9b0ff',
  // Quatro tons dentro da família indigo/violeta da marca: variação
  // suficiente para o objeto ganhar vida, contida o bastante para não
  // virar outra identidade visual.
  phases = ['#3f63f2', '#6366f1', '#8b7cf6', '#a88af8'],
  chroma = 1,
  fog = '#0d1020',
  fogNear = 7.6,
  fogFar = 13.5,
  accentGain = 1,
  pulseGain = 0.55,
} = {}) {
  return new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    side: THREE.DoubleSide,
    transparent: true,
    depthWrite: true,
    uniforms: {
      uBase: { value: new THREE.Color(base) },
      uAccent: { value: new THREE.Color(accent) },
      uRim: { value: new THREE.Color(rim) },
      uReveal: { value: 0 },
      uPulse: { value: 0 },
      uPulseGain: { value: pulseGain },
      uAccentGain: { value: accentGain },
      uOpacity: { value: 1 },
      uFog: { value: new THREE.Color(fog) },
      uFogNear: { value: fogNear },
      uFogFar: { value: fogFar },
      uPhaseA: { value: new THREE.Color(phases[0]) },
      uPhaseB: { value: new THREE.Color(phases[1]) },
      uPhaseC: { value: new THREE.Color(phases[2]) },
      uPhaseD: { value: new THREE.Color(phases[3]) },
      uChroma: { value: chroma },
    },
  });
}
