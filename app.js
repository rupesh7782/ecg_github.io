// ===================== Loader =====================
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => loader.classList.add('hide'), 500);
});

// ===================== Scroll progress =====================
const progressBar = document.getElementById('scroll-progress');
function updateProgress(){
  const h = document.documentElement;
  const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
  progressBar.style.width = scrolled + '%';
}
document.addEventListener('scroll', updateProgress);

// ===================== Nav toggle (mobile) =====================
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle?.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

// active link on scroll
const sections = document.querySelectorAll('section[id], header[id]');
const navA = document.querySelectorAll('.nav-links a');
function setActiveLink(){
  let current = 'home';
  sections.forEach(sec => {
    const top = sec.offsetTop - 120;
    if (window.scrollY >= top) current = sec.id;
  });
  navA.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
}
document.addEventListener('scroll', setActiveLink);

// ===================== Back to top =====================
const backToTop = document.getElementById('backToTop');
document.addEventListener('scroll', () => {
  backToTop.classList.toggle('show', window.scrollY > 500);
});
backToTop?.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));

// ===================== Reveal on scroll =====================
const revealEls = document.querySelectorAll('[data-reveal]');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: 0.15 });
revealEls.forEach(el => io.observe(el));

// ===================== ECG waveform generator =====================
// Realistic-ish PQRST generator producing a scrolling buffer of points.
function makeEcgGenerator(){
  let t = 0;
  const beatLength = 45; // samples per beat
  return function next(){
    const phase = t % beatLength;
    let v = 0;
    // baseline noise
    v += (Math.random() - 0.5) * 0.03;
    // P wave
    v += 0.12 * Math.exp(-Math.pow(phase - 8, 2) / 6);
    // QRS complex
    v += -0.15 * Math.exp(-Math.pow(phase - 17, 2) / 1.2);
    v += 1.0 * Math.exp(-Math.pow(phase - 19, 2) / 1.0);
    v += -0.25 * Math.exp(-Math.pow(phase - 21, 2) / 1.5);
    // T wave
    v += 0.25 * Math.exp(-Math.pow(phase - 32, 2) / 20);
    t++;
    return v;
  };
}

function setupEcgCanvas(canvas, opts = {}){
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const color = opts.color || '#22c55e';
  const grid = opts.grid !== false;
  let buffer = [];
  const gen = makeEcgGenerator();

  function resize(){
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = (opts.height || rect.height || 70) * dpr;
    canvas.style.height = (opts.height || rect.height || 70) + 'px';
    const points = Math.floor(rect.width / 2);
    buffer = new Array(points).fill(0);
  }
  resize();
  window.addEventListener('resize', resize);

  function draw(){
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0,0,w,h);
    if (grid){
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.lineWidth = 1;
      const step = 16 * dpr;
      for (let x=0; x<w; x+=step){ ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,h); ctx.stroke(); }
      for (let y=0; y<h; y+=step){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke(); }
    }
    buffer.push(gen());
    buffer.shift();
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2 * dpr;
    ctx.shadowColor = color;
    ctx.shadowBlur = 6;
    const midY = h * 0.6;
    const scaleY = h * 0.4;
    buffer.forEach((v, i) => {
      const x = (i / buffer.length) * w;
      const y = midY - v * scaleY;
      i === 0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
    });
    ctx.stroke();
    requestAnimationFrame(draw);
  }
  draw();
}

// hero background ECG (subtle, big)
const heroCanvas = document.getElementById('heroEcgBg');
if (heroCanvas){
  function resizeHero(){
    heroCanvas.width = heroCanvas.parentElement.offsetWidth;
    heroCanvas.height = heroCanvas.parentElement.offsetHeight;
  }
  resizeHero();
  window.addEventListener('resize', resizeHero);
  const ctx = heroCanvas.getContext('2d');
  const gen = makeEcgGenerator();
  let buf = new Array(300).fill(0);
  function drawHero(){
    const w = heroCanvas.width, h = heroCanvas.height;
    ctx.clearRect(0,0,w,h);
    buf.push(gen()); buf.shift();
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(96,165,250,0.6)';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#3B82F6';
    ctx.shadowBlur = 12;
    const midY = h * 0.55, scaleY = h * 0.18;
    buf.forEach((v,i) => {
      const x = (i/buf.length) * w;
      const y = midY - v * scaleY;
      i===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
    });
    ctx.stroke();
    requestAnimationFrame(drawHero);
  }
  drawHero();
}

// dashboard widget ECG
const ecgWaveCanvas = document.getElementById('ecgWave');
if (ecgWaveCanvas) setupEcgCanvas(ecgWaveCanvas, { color:'#22c55e', height:70, grid:true });

// pulse sine wave
const pulseCanvas = document.getElementById('pulseWave');
if (pulseCanvas){
  const ctx = pulseCanvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  function resizePulse(){
    const rect = pulseCanvas.getBoundingClientRect();
    pulseCanvas.width = rect.width * dpr;
    pulseCanvas.height = 50 * dpr;
  }
  resizePulse();
  window.addEventListener('resize', resizePulse);
  let phase = 0;
  function drawPulse(){
    const w = pulseCanvas.width, h = pulseCanvas.height;
    ctx.clearRect(0,0,w,h);
    ctx.beginPath();
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 2*dpr;
    ctx.shadowColor = '#3B82F6';
    ctx.shadowBlur = 6;
    for (let x=0; x<w; x++){
      const y = h/2 + Math.sin((x*0.04) + phase) * (h*0.32) * Math.sin(phase*0.3+0.5);
      x===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
    }
    ctx.stroke();
    phase += 0.12;
    requestAnimationFrame(drawPulse);
  }
  drawPulse();
}

// ===================== Heart rate random updater =====================
const hrNum = document.getElementById('hrNum');
if (hrNum){
  setInterval(() => {
    const bpm = Math.floor(68 + Math.random() * 24); // 68-92
    hrNum.textContent = bpm;
  }, 2000);
}

// ===================== Signal quality ring =====================
const sigRing = document.getElementById('sigRing');
const sigNum = document.getElementById('sigNum');
if (sigRing){
  const CIRC = 2 * Math.PI * 42; // ~264
  function updateSignal(){
    const val = Math.floor(90 + Math.random() * 10); // 90-100
    const offset = CIRC - (val/100) * CIRC;
    sigRing.style.strokeDashoffset = offset;
    sigNum.textContent = val;
  }
  updateSignal();
  setInterval(updateSignal, 2500);
}

// ===================== Last updated ticker =====================
const lastUpdated = document.getElementById('lastUpdated');
if (lastUpdated){
  let secs = 0;
  setInterval(() => {
    secs++;
    lastUpdated.textContent = secs + 's ago';
  }, 1000);
}

// ===================== Contact form (no backend) =====================
const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');
contactForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  formNote.textContent = 'Thanks! Your message has been recorded (demo — no backend connected).';
  contactForm.reset();
  setTimeout(() => formNote.textContent = '', 5000);
});

setActiveLink();
