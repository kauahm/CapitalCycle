import { chromium } from 'playwright';
const browser = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args:['--no-sandbox','--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader']});
const ctx = await browser.newContext({ viewport:{width:1600,height:950} });
await ctx.addInitScript(`Object.defineProperty(navigator,'hardwareConcurrency',{get:()=>12});
Object.defineProperty(navigator,'deviceMemory',{get:()=>8});`);
const page = await ctx.newPage();
await page.goto('http://localhost:4173/',{waitUntil:'load'});
await page.waitForTimeout(7000);
const out = await page.evaluate(async () => {
  const canvas = document.querySelector('.cchero-canvas canvas');
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
  let draws=0, tris=0, frames=0;
  const de=gl.drawElements.bind(gl), dei=gl.drawElementsInstanced?.bind(gl), cl=gl.clear.bind(gl);
  gl.drawElements=(m,c,t,o)=>{draws++;tris+=c/3;return de(m,c,t,o);};
  if(dei) gl.drawElementsInstanced=(m,c,t,o,n)=>{draws++;tris+=(c/3)*n;return dei(m,c,t,o,n);};
  gl.clear=(mask)=>{frames++;return cl(mask);};
  const sample=async(label,ms)=>{ draws=0;tris=0;frames=0;
    const t0=performance.now(); await new Promise(r=>setTimeout(r,ms));
    const secs=(performance.now()-t0)/1000;
    return {label, scrollY:Math.round(window.scrollY), frames, fps:+(frames/secs).toFixed(1),
      drawCallsPorFrame: frames?+(draws/frames).toFixed(2):0,
      trianglesPorFrame: frames?Math.round(tris/frames):0};
  };
  const res=[];
  res.push(await sample('topo (ciclo 1/4 aceso)',2500));
  window.scrollTo(0, document.querySelector('.cch-story').offsetHeight*0.30);
  await new Promise(r=>setTimeout(r,1500));
  res.push(await sample('climax (ciclo + helice)',2500));
  window.scrollTo(0, document.body.scrollHeight);
  await new Promise(r=>setTimeout(r,1500));
  res.push(await sample('hero fora da viewport',2500));
  return res;
});
console.log(JSON.stringify(out,null,2));
await browser.close();
