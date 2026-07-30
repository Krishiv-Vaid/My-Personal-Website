const boot = document.querySelector('#boot');
const entrance = document.querySelector('#entrance');
const site = document.querySelector('#site');
const typed = document.querySelector('#typed');
const enter = document.querySelector('#enter');
const skip = document.querySelector('#skip');
const scene = document.querySelector('.scene');
const mobileSceneQuery = window.matchMedia('(max-width: 700px)');

function updateSceneFraming(event) {
  if (!scene) return;
  scene.setAttribute(
    'preserveAspectRatio',
    event.matches ? 'xMidYMid meet' : 'xMidYMid slice'
  );
}

updateSceneFraming(mobileSceneQuery);

if (mobileSceneQuery.addEventListener) {
  mobileSceneQuery.addEventListener('change', updateSceneFraming);
} else {
  mobileSceneQuery.addListener(updateSceneFraming);
}

const lines = [
  'welcome, terminal.',
  '',
  '> locating krish.vaid ... found.',
  '> loading mathematics, robotics, physics, and code ...',
  '> opening my small corner of the internet :D ...',
  ''
];

let cancelled = false;
let transitioning = false;
let heroTyped = false;

const sleep = milliseconds => new Promise(resolve => window.setTimeout(resolve, milliseconds));

async function typeIntro() {
  for (const line of lines) {
    for (const character of line) {
      if (cancelled) return;
      typed.textContent += character;
      await sleep(19 + Math.random() * 15);
    }
    typed.textContent += '\n';
    await sleep(line ? 105 : 55);
  }

  enter.hidden = false;
  enter.focus();
}

async function typeHero() {
  if (heroTyped) return;
  heroTyped = true;

  const target = 'Hi, I’m Krish :D !!';
  const element = document.querySelector('#hello');
  element.textContent = '';

  for (const character of target) {
    element.textContent += character;
    await sleep(54);
  }
}

function clickSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(165, context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(115, context.currentTime + 0.055);
    gain.gain.setValueAtTime(0.028, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.07);

    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.075);
  } catch (_) {
    // Audio is decorative; the transition should continue if it is unavailable.
  }
}

function revealSite() {
  entrance.classList.remove('active');
  entrance.setAttribute('aria-hidden', 'true');
  site.hidden = false;
  requestAnimationFrame(() => site.classList.add('visible'));
  typeHero();
}

function beginEntrance() {
  if (transitioning) return;
  transitioning = true;
  cancelled = true;
  clickSound();

  boot.style.display = 'none';
  entrance.classList.add('active');
  entrance.setAttribute('aria-hidden', 'false');
  window.setTimeout(revealSite, 2550);
}

function skipAll() {
  if (transitioning) return;
  transitioning = true;
  cancelled = true;

  boot.style.display = 'none';
  entrance.classList.remove('active');
  site.hidden = false;
  document.querySelector('#hello').textContent = 'Hi, I’m Krish :D !!';
  heroTyped = true;
  requestAnimationFrame(() => site.classList.add('visible'));
}

enter.addEventListener('click', beginEntrance);
skip.addEventListener('click', skipAll);
document.addEventListener('keydown', event => {
  if (event.key === 'Enter' && !enter.hidden && boot.style.display !== 'none') {
    beginEntrance();
  }
});

typeIntro();
