import * as THREE from 'three';

/* =========================================================
   Material da fita do Ciclo.

   Modelo de iluminação escrito à mão em vez de MeshPhysicalMaterial.
   Dois motivos: sobre fundo CLARO o PBR padrão precisa de um
   environment map para não ficar chapado — e um HDRI seria o asset
   pesado que este conceito existe justamente para evitar; e as fases
   precisam acender ao longo da curva, o que exige acesso ao `aT` de
   cada vértice.

   O modelo é hemisférico + uma key light especular apertada + fresnel.
   É o que dá o aspecto de alumínio anodizado usinado, e cabe em
   ~60 linhas de GLSL.
   ========================================================= */

const vertexShader = /* glsl */`
  attribute float aT;
  varying float vT;
  varying vec3 vWorldNormal;
  varying vec3 vViewDir;

  void main() {
    vT = aT;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    vec4 world = modelMatrix * vec4(position, 1.0);
    vViewDir = normalize(cameraPosition - world.xyz);
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const fragmentShader = /* glsl */`
  precision highp float;

  uniform vec3  uBase;
  uniform vec3  uAccent;
  uniform float uReveal;     // 0→1: quanto do ciclo já acendeu
  uniform float uPulse;      // posição (0→1) do pulso de capital
  uniform float uPulseGain;
  uniform float uOpacity;
  uniform float uAccentGain;

  varying float vT;
  varying vec3  vWorldNormal;
  varying vec3  vViewDir;

  const vec3 SKY    = vec3(1.02, 1.02, 1.05);
  const vec3 GROUND = vec3(0.26, 0.27, 0.36);
  const vec3 KEY    = vec3(-0.42, 0.86, 0.52);

  void main() {
    vec3 N = normalize(vWorldNormal);
    vec3 V = normalize(vViewDir);
    // Faces de trás recebem a normal invertida, senão a parte interna
    // da fita fica preta quando o ciclo gira.
    if (!gl_FrontFacing) N = -N;

    vec3 L = normalize(KEY);

    // Hemisférica: céu em cima, chão embaixo.
    float hemi = N.y * 0.5 + 0.5;
    vec3 ambient = mix(GROUND, SKY, hemi);

    float diffuse = max(dot(N, L), 0.0);

    // Especular apertado = risco de luz de metal escovado.
    vec3 H = normalize(L + V);
    float spec = pow(max(dot(N, H), 0.0), 96.0);

    float fres = pow(1.0 - max(dot(N, V), 0.0), 3.2);

    // ---- Acendimento das fases ----
    // Tudo que já ficou para trás do playhead está aceso.
    float ignited = 1.0 - smoothstep(uReveal - 0.035, uReveal + 0.012, vT);
    // Borda quente na frente do acendimento.
    float edge = exp(-pow((vT - uReveal) * 34.0, 2.0)) * step(0.001, uReveal) * step(uReveal, 0.999);

    // ---- Pulso de capital circulando ----
    // Distância com wrap: o pulso atravessa a emenda t=1→0 sem piscar.
    float d = abs(fract(vT - uPulse + 0.5) - 0.5);
    float pulse = exp(-pow(d * 24.0, 2.0));

    vec3 albedo = mix(uBase, uAccent, ignited * 0.42 * uAccentGain);

    vec3 color = albedo * (ambient * 0.52 + diffuse * 0.92);
    color += vec3(spec) * 0.9;
    color += uAccent * fres * (0.20 + ignited * 0.26);
    color += uAccent * (ignited * 0.09 + edge * 0.85 + pulse * uPulseGain);

    gl_FragColor = vec4(color, uOpacity);
    #include <colorspace_fragment>
  }
`;

export function makeCycleMaterial({
  base = '#767c96',
  accent = '#6366f1',
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
      uReveal: { value: 0 },
      uPulse: { value: 0 },
      uPulseGain: { value: pulseGain },
      uAccentGain: { value: accentGain },
      uOpacity: { value: 1 },
    },
  });
}
