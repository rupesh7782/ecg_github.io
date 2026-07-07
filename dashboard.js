// ===================== Sidebar tabs (visual only, single page demo) =====================
document.querySelectorAll('.side-nav a').forEach(a => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelectorAll('.side-nav a').forEach(x => x.classList.remove('active'));
    a.classList.add('active');
  });
});

// ===================== Big ECG chart =====================
const bigEcg = document.getElementById('bigEcg');
if (bigEcg && typeof setupEcgCanvas === 'function'){
  setupEcgCanvas(bigEcg, { color:'#22c55e', height:160, grid:true });
}

// ===================== KPI random updates =====================
const kHr = document.getElementById('kHr');
const kSpo2 = document.getElementById('kSpo2');
const kResp = document.getElementById('kResp');
const kTemp = document.getElementById('kTemp');
const gaugeArc = document.getElementById('gaugeArc');
const gaugeNum = document.getElementById('gaugeNum');
const sigRing2 = document.getElementById('sigRing2');
const sigNum2 = document.getElementById('sigNum2');

let hrHistory = [];
const historyMax = 30;

function rand(min, max){ return Math.random() * (max - min) + min; }

function updateVitals(){
  const hr = Math.round(rand(65, 95));
  const spo2 = Math.round(rand(95, 99));
  const resp = Math.round(rand(14, 19));
  const temp = (97.6 + Math.random()*1.4).toFixed(1);
  const sig = Math.round(rand(90, 100));

  if (kHr) kHr.textContent = hr;
  if (kSpo2) kSpo2.textContent = spo2;
  if (kResp) kResp.textContent = resp;
  if (kTemp) kTemp.textContent = temp;

  // gauge: map 40-160 bpm to arc dashoffset 283..0
  if (gaugeArc){
    const pct = Math.min(1, Math.max(0, (hr - 40) / (160 - 40)));
    gaugeArc.style.strokeDashoffset = 283 - pct * 283;
  }
  if (gaugeNum) gaugeNum.textContent = hr;

  if (sigRing2){
    const CIRC = 2*Math.PI*42;
    sigRing2.style.strokeDashoffset = CIRC - (sig/100)*CIRC;
  }
  if (sigNum2) sigNum2.textContent = sig;

  hrHistory.push(hr);
  if (hrHistory.length > historyMax) hrHistory.shift();
  drawHistory();
  updateSummary();
  maybeAlert(hr, sig);
}
updateVitals();
setInterval(updateVitals, 1500);

// ===================== Daily summary =====================
const sumHr = document.getElementById('sumHr');
const sumMinMax = document.getElementById('sumMinMax');
const sumSpo2 = document.getElementById('sumSpo2');
const sumReadings = document.getElementById('sumReadings');
let readingCount = 1204;

function updateSummary(){
  if (!hrHistory.length) return;
  const avg = Math.round(hrHistory.reduce((a,b)=>a+b,0) / hrHistory.length);
  const min = Math.min(...hrHistory);
  const max = Math.max(...hrHistory);
  if (sumHr) sumHr.textContent = avg + ' BPM';
  if (sumMinMax) sumMinMax.textContent = min + ' / ' + max;
  if (sumSpo2) sumSpo2.textContent = (Math.round(rand(96,99))) + '%';
  readingCount += Math.round(rand(1,4));
  if (sumReadings) sumReadings.textContent = readingCount.toLocaleString();
}

// ===================== History chart (simple line) =====================
const historyCanvas = document.getElementById('historyChart');
function drawHistory(){
  if (!historyCanvas || !hrHistory.length) return;
  const ctx = historyCanvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = historyCanvas.getBoundingClientRect();
  historyCanvas.width = rect.width * dpr;
  historyCanvas.height = 140 * dpr;
  const w = historyCanvas.width, h = historyCanvas.height;
  ctx.clearRect(0,0,w,h);

  // grid
  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  for (let y=0; y<h; y+=20*dpr){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke(); }

  const min = Math.min(...hrHistory) - 5;
  const max = Math.max(...hrHistory) + 5;
  ctx.beginPath();
  ctx.strokeStyle = '#60A5FA';
  ctx.lineWidth = 2*dpr;
  ctx.shadowColor = '#3B82F6';
  ctx.shadowBlur = 8;
  hrHistory.forEach((v,i) => {
    const x = (i/(historyMax-1)) * w;
    const y = h - ((v - min)/(max-min)) * h;
    i===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
  });
  ctx.stroke();

  // fill
  ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath();
  const grad = ctx.createLinearGradient(0,0,0,h);
  grad.addColorStop(0, 'rgba(59,130,246,0.35)');
  grad.addColorStop(1, 'rgba(59,130,246,0)');
  ctx.fillStyle = grad;
  ctx.shadowBlur = 0;
  ctx.fill();
}

// ===================== Alerts & toasts =====================
const alertList = document.getElementById('alertList');
const toastContainer = document.getElementById('toastContainer');
let lastAlertTime = 0;

function addAlert(text, level){
  if (!alertList) return;
  const li = document.createElement('li');
  li.className = 'alert-item ' + level;
  li.innerHTML = `<span>${text}</span><small>just now</small>`;
  alertList.prepend(li);
  while (alertList.children.length > 8) alertList.removeChild(alertList.lastChild);
}

function addToast(title, text, level){
  if (!toastContainer) return;
  const t = document.createElement('div');
  t.className = 'toast ' + level;
  t.innerHTML = `<strong>${title}</strong><small>${text}</small>`;
  toastContainer.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity .4s'; setTimeout(()=>t.remove(), 400); }, 4500);
}

function maybeAlert(hr, sig){
  const now = Date.now();
  if (now - lastAlertTime < 6000) return; // throttle
  if (hr > 92 && Math.random() < 0.4){
    addAlert('High Heart Rate detected: ' + hr + ' BPM', 'warn');
    addToast('High Heart Rate', hr + ' BPM recorded — above normal range', 'warn');
    lastAlertTime = now;
  } else if (sig < 92 && Math.random() < 0.3){
    addAlert('Low Signal Quality: ' + sig + '%', 'danger');
    addToast('Low Signal Quality', sig + '% — check electrode contact', 'danger');
    lastAlertTime = now;
  } else if (Math.random() < 0.06){
    addAlert('Irregular rhythm pattern flagged for review', 'warn');
    addToast('Irregular Rhythm', 'AI flagged a pattern for review', 'warn');
    lastAlertTime = now;
  }
}
