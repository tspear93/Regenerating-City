
const state = { t0: performance.now(), data: [] };
async function loadData() {
  try {
    const res = await fetch('assets/regenerating_city_sample_metrics.json');
    state.data = await res.json();
  } catch(e) {
    state.data = [
      {"department":"Education","coord":{"r":1.2,"theta":0.3}},
      {"department":"Media","coord":{"r":1.5,"theta":1.8}},
      {"department":"Health","coord":{"r":1.1,"theta":0.05}},
      {"department":"Housing","coord":{"r":1.7,"theta":2.6}}
    ];
  }
}
function draw() {
  const cvs = document.getElementById('metricCanvas');
  if (!cvs) return;
  const ctx = cvs.getContext('2d');
  const w = cvs.clientWidth, h = cvs.clientHeight;
  if (cvs.width !== w || cvs.height !== h) { cvs.width = w; cvs.height = h; }
  ctx.clearRect(0,0,w,h);
  const cx = w/2, cy = h/2;
  const base = Math.min(w,h)*0.33;
  ctx.fillStyle = "rgba(255,255,255,0.02)";
  ctx.beginPath(); ctx.arc(cx, cy, base*1.35, 0, Math.PI*2); ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.18)"; ctx.lineWidth = 2;
  [1.0, 1.4, 1.8].forEach(m => { ctx.beginPath(); ctx.arc(cx, cy, base*m, 0, Math.PI*2); ctx.stroke(); });
  ctx.strokeStyle = "rgba(255,255,255,0.25)";
  ctx.beginPath(); ctx.moveTo(cx, cy-base*1.9); ctx.lineTo(cx, cy+base*1.9); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx-base*1.9, cy); ctx.lineTo(cx+base*1.9, cy); ctx.stroke();
  ctx.fillStyle = "rgba(231,238,247,0.95)"; ctx.font = "14px system-ui, -apple-system, Segoe UI, Roboto";
  ctx.textAlign = "center"; ctx.fillText("LIFE ↑", cx, cy-base*2.05); ctx.fillText("DEATH ↓", cx, cy+base*2.05);
  ctx.textAlign = "left"; ctx.fillText("WHAT IF →", cx+base*1.95, cy);
  const t = (performance.now()-state.t0)/1000; const pulse = (Math.sin(t*2)+1)/2;
  ctx.strokeStyle = `rgba(141,245,155,${0.25+0.35*pulse})`; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(cx, cy, base*(1.0 + 0.15*pulse), 0, Math.PI*2); ctx.stroke();
  state.data.forEach((d) => {
    const r = (d.coord?.r || 1.2) * base * 0.8;
    const a = (d.coord?.theta || 0) - Math.PI/2;
    const x = cx + r * Math.cos(a); const y = cy + r * Math.sin(a);
    ctx.fillStyle = "rgba(103,211,255,0.95)";
    ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = "rgba(154,176,199,0.95)"; ctx.font = "12px system-ui, -apple-system, Segoe UI, Roboto";
    ctx.textAlign = "center"; ctx.fillText(d.department || "Dept", x, y-10);
  });
  requestAnimationFrame(draw);
}
window.addEventListener('DOMContentLoaded', async () => {
  await loadData(); draw();
  document.getElementById('dlApi').addEventListener('click', () => window.open('assets/regenerating_city_public_api.yaml','_blank'));
  document.getElementById('dlJSON').addEventListener('click', () => window.open('assets/regenerating_city_sample_metrics.json','_blank'));
});
