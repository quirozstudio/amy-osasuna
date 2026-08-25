import './style.css';
import './mystery.css';
import './crest.css';
import './final.css';
import './player-profile.css';

// El cántico de El Sadar pertenece exclusivamente a la intro. La interacción inicial
// permite reproducirlo respetando las restricciones de autoplay de los navegadores.
const experience = { introAudio: new URL('../Somos un equipo valiente y luchador Osasuna.mp4', import.meta.url).href };
let introAudio;

const players = [
  { photo: new URL('../img/bretones.webp', import.meta.url).href, number: '23', name: 'Abel Bretones', role: 'Defensa', source: 'https://www.osasuna.es/plantilla' },
  { photo: new URL('../img/catena.webp', import.meta.url).href, number: '24', name: 'Alejandro Catena', role: 'Defensa', source: 'https://www.osasuna.es/plantilla' },
  { photo: new URL('../img/dubasin.webp', import.meta.url).href, number: '21', name: 'Jonathan Dubasin', role: 'Delantero', source: 'https://www.osasuna.es/plantilla' },
  { photo: new URL('../img/raul.webp', import.meta.url).href, number: '9', name: 'Raúl García de Haro', role: 'Delantero', source: 'https://www.osasuna.es/raul-garcia-2026' },
  { photo: new URL('../img/ruben.garci.webp', import.meta.url).href, number: '14', name: 'Rubén García', role: 'Medio', source: 'https://www.osasuna.es/ruben-garcia-2026' },
  { photo: new URL('../img/kike garcia.webp', import.meta.url).href, number: '11', name: 'Kike Barja', role: 'Delantero', source: 'https://www.osasuna.es/kike-barja-2026' },
  { photo: new URL('../img/moro.webp', import.meta.url).href, number: '18', name: 'Raúl Moro', role: 'Delantero', source: 'https://www.osasuna.es/osasuna-ficha-a-raul-moro' }
];

document.querySelector('#playerCards').innerHTML = players.map((p, i) => `
  <article class="player-card reveal" style="--i:${i}">
    <div class="card-number" aria-hidden="true">${p.number}</div>
    <div class="card-photo"><img src="${p.photo}" alt="Amy con ${p.name}" loading="lazy"></div>
    <div class="card-info">
      <span>El encuentro</span>
      <h3>${p.name}</h3>
      <dl class="player-profile" aria-label="Ficha de ${p.name}">
        <div><dt>Dorsal</dt><dd>${p.number}</dd></div>
        <div><dt>Posición</dt><dd>${p.role}</dd></div>
        <div><dt>Club</dt><dd>CA Osasuna</dd></div>
      </dl>
      <a href="${p.source}" target="_blank" rel="noreferrer">Ver ficha oficial ↗</a>
    </div>
    <div class="card-edge">AMY / EL SADAR / 2026</div>
  </article>`).join('');

const intro = document.querySelector('#intro');
const enter = document.querySelector('#enter');
const skip = document.querySelector('#skipIntro');
let introTimer;
let introFadeTimer;
let introFadeFrame;

function fadeIntroAudio(duration = 4000) {
  if (!introAudio || introAudio.paused) return;
  cancelAnimationFrame(introFadeFrame);
  const initialVolume = introAudio.volume;
  const startedAt = performance.now();

  const fade = (now) => {
    const progress = Math.min(1, (now - startedAt) / duration);
    introAudio.volume = initialVolume * (1 - progress);
    if (progress < 1) {
      introFadeFrame = requestAnimationFrame(fade);
      return;
    }
    introAudio.pause();
    introAudio.currentTime = 0;
  };

  introFadeFrame = requestAnimationFrame(fade);
}

function finishIntro({ skipped = false } = {}) {
  clearTimeout(introTimer);
  if (skipped) {
    clearTimeout(introFadeTimer);
    fadeIntroAudio(850);
  }
  intro.classList.add('is-finished');
  document.body.classList.remove('intro-open');
  setTimeout(() => { intro.hidden = true; }, 900);
}
function startIntro() {
  intro.classList.add('is-playing');
  enter.setAttribute('disabled', '');
  introAudio = new Audio(experience.introAudio);
  introAudio.volume = .9;
  introAudio.play().catch(() => {});
  introFadeTimer = setTimeout(() => fadeIntroAudio(5000), 15000);
  introTimer = setTimeout(finishIntro, 11800);
}
enter.addEventListener('click', startIntro);
skip.addEventListener('click', () => finishIntro({ skipped: true }));
document.body.classList.add('intro-open');

const canvas = document.querySelector('#energy');
const ctx = canvas.getContext('2d');
let particles = [];
function sizeCanvas() { canvas.width = innerWidth * devicePixelRatio; canvas.height = innerHeight * devicePixelRatio; ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0); }
function seed() { particles = Array.from({length: Math.min(90, Math.floor(innerWidth/6))}, () => ({x:Math.random()*innerWidth,y:innerHeight*(.25+Math.random()*.6),vx:(Math.random()-.5)*.55,vy:-.2-Math.random()*1.4,r:.4+Math.random()*1.8,a:.15+Math.random()*.65})); }
function draw() { ctx.clearRect(0,0,innerWidth,innerHeight); for (const p of particles) { p.x+=p.vx;p.y+=p.vy;if(p.y<0){p.y=innerHeight;p.x=Math.random()*innerWidth} ctx.fillStyle=`rgba(220,0,28,${p.a})`;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill(); } requestAnimationFrame(draw); }
sizeCanvas(); seed(); draw(); addEventListener('resize',()=>{sizeCanvas();seed()});

const observer = new IntersectionObserver(entries => entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('in'); }), {threshold:.12});
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

addEventListener('scroll', () => document.documentElement.style.setProperty('--scroll', `${scrollY}px`), {passive:true});
