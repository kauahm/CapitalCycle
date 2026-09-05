import { chromium } from 'playwright';
import fs from 'fs';
const OUT = process.env.OUT; fs.mkdirSync(OUT, { recursive: true });
const SPOOF = `Object.defineProperty(navigator,'hardwareConcurrency',{get:()=>12});
Object.defineProperty(navigator,'deviceMemory',{get:()=>8});`;
const browser = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args:['--no-sandbox','--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader']});
const VIEWS = JSON.parse(process.env.VIEWS);
const errors=[];
for (const v of VIEWS) {
  const ctx = await browser.newContext({viewport:{width:v.w,height:v.h}, deviceScaleFactor:1,
    hasTouch:!!v.touch, isMobile:!!v.touch, reducedMotion: v.reduce?'reduce':'no-preference'});
  await ctx.addInitScript(SPOOF);
  const page = await ctx.newPage();
  page.on('console', m=>{ if(m.type()==='error' && !m.text().includes('ERR_CONNECTION_RESET')) errors.push(`[${v.name}] ${m.text()}`); });
  page.on('pageerror', e=>errors.push(`[${v.name}] PAGEERROR ${e.message}`));
  await page.goto('http://localhost:4173/',{waitUntil:'load'});
  await page.waitForTimeout(v.wait ?? 8000);
  for (const s of (v.scrolls ?? [0])) {
    const y = await page.evaluate((ss)=>{ const el=document.querySelector('.cch-story');
      const r = el?Math.max(0, el.offsetHeight-window.innerHeight):0; return el?el.offsetTop+r*ss:0; }, s);
    await page.evaluate(yy=>window.scrollTo(0,yy), Math.round(y));
    await page.waitForTimeout(1600);
    await page.screenshot({path:`${OUT}/${v.name}-${String(Math.round(s*100)).padStart(3,'0')}.png`});
  }
  if (v.full) { await page.evaluate(()=>window.scrollTo(0,document.body.scrollHeight));
    await page.waitForTimeout(2000); await page.screenshot({path:`${OUT}/${v.name}-fim.png`}); }
  const of = await page.evaluate(()=>({sw:document.documentElement.scrollWidth, cw:document.documentElement.clientWidth}));
  if (of.sw > of.cw+1) errors.push(`[${v.name}] OVERFLOW-X ${of.sw} > ${of.cw}`);
  await ctx.close();
}
await browser.close();
console.log(errors.length?'ERROS:\n'+errors.join('\n'):'OK: sem erros de console, sem overflow-x');
