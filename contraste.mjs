import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args:['--no-sandbox','--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader']});
const ctx = await browser.newContext({ viewport:{width:1600,height:950} });
await ctx.addInitScript(`Object.defineProperty(navigator,'hardwareConcurrency',{get:()=>12});
Object.defineProperty(navigator,'deviceMemory',{get:()=>8});`);
const page = await ctx.newPage();
await page.goto('http://localhost:4173/',{waitUntil:'load'});
await page.waitForTimeout(7000);

// Amostra o pixel de fundo real (do screenshot) atrás de cada elemento,
// e compõe a cor do texto com a opacidade acumulada dos ancestrais.
const buf = await page.screenshot();
const rows = await page.evaluate(() => {
  const SEL = [
    ['Headline', '.cch-hero-layer .cch-title'],
    ['Subtitulo', '.cch-hero-layer .cch-lead'],
    ['CTA primario', '.cch-hero-layer .cch-btn-primary'],
    ['CTA secundario', '.cch-hero-layer .cch-btn-ghost'],
    ['Titulo da regua', '.cchero-phases-title'],
    ['Rotulo fase ATIVA', '.cchero-phase.is-on .cchero-phase-label'],
    ['Valor fase ATIVA', '.cchero-phase.is-on .cchero-phase-value'],
    ['Nota fase ATIVA', '.cchero-phase.is-on .cchero-phase-note'],
    ['Rotulo fase inativa', '.cchero-phase:not(.is-on) .cchero-phase-label'],
    ['Valor fase inativo', '.cchero-phase:not(.is-on) .cchero-phase-value'],
    ['Dica de rolagem', '.cchero-scroll'],
    ['Navbar link', '.cch-nav--dark .cch-menu a:not(.is-active)'],
    ['Navbar Entrar', '.cch-nav--dark .cch-login'],
  ];
  const out = [];
  for (const [name, sel] of SEL) {
    const el = document.querySelector(sel);
    if (!el) { out.push({ name, erro: 'nao encontrado' }); continue; }
    const cs = getComputedStyle(el);
    let op = 1, n = el;
    while (n && n !== document.body) { op *= parseFloat(getComputedStyle(n).opacity || '1'); n = n.parentElement; }
    const r = el.getBoundingClientRect();
    // Elemento com fundo proprio opaco compara contra ELE, nao contra o
    // pixel ao lado (que para um botao na borda cai fora da area util).
    const ownBg = cs.backgroundColor;
    const hasOwnBg = ownBg && !/rgba\(0, 0, 0, 0\)|transparent/.test(ownBg)
      && (parseFloat((ownBg.match(/[\d.]+/g) || [])[3] ?? '1') > 0.9);
    out.push({ name, color: cs.color, ownBg: hasOwnBg ? ownBg : null,
      opacity: +op.toFixed(3), fontSize: cs.fontSize, fontWeight: cs.fontWeight,
      x: Math.round(r.left + r.width/2), y: Math.round(r.top + r.height/2),
      bx: Math.round(r.left + r.width + 14), by: Math.round(r.top + r.height/2) });
  }
  return out;
});
await browser.close();

// decodifica o PNG para amostrar o fundo
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { execSync } = await import('child_process');
const fs = await import('fs');
fs.writeFileSync('/tmp/claude-0/-home-user-CapitalCycle/7f22b168-a28a-58ad-af8e-6efb7df771a1/scratchpad/contraste.png', buf);
console.log(JSON.stringify(rows));
