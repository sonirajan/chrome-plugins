// ── Configuration ──────────────────────────────
const TOTAL_IMAGES = 27; // only used when USE_UNSPLASH = false and want to shuffle local images
// ───────────────────────────────────────────────

const timeEl  = document.getElementById('time');
const dateEl  = document.getElementById('date');
const quoteEl = document.getElementById('today-text');
const bgEl    = document.getElementById('bg');
const wrapEl  = document.getElementById('clock-wrap');

const DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTHS = ['January','February','March','April','May','June',
  'July','August','September','October','November','December'];

function pad(n) { return String(n).padStart(2, '0'); }

function getNextQuote() {
  let queue = JSON.parse(localStorage.getItem('quoteQueue') || '[]');
  if (queue.length === 0) {
    queue = Array.from({ length: QUOTES.length }, (_, i) => i);
    for (let i = queue.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [queue[i], queue[j]] = [queue[j], queue[i]];
    }
  }
  const next = queue.pop();
  localStorage.setItem('quoteQueue', JSON.stringify(queue));
  return QUOTES[next];
}
const todayQuote = getNextQuote();
quoteEl.textContent = todayQuote;

// ── Task management ──
const taskPlaceholder  = document.getElementById('task-placeholder');
const taskInputWrap    = document.getElementById('task-input-wrap');
const taskInput        = document.getElementById('task-input');
const taskCancel       = document.getElementById('task-cancel');
const taskDisplayWrap  = document.getElementById('task-display-wrap');
const taskDisplayText  = document.getElementById('task-display-text');
const taskClear        = document.getElementById('task-clear');

function showPlaceholder() {
  taskPlaceholder.style.display  = 'block';
  taskInputWrap.style.display    = 'none';
  taskDisplayWrap.style.display  = 'none';
}

function showInput(prefill) {
  taskPlaceholder.style.display  = 'none';
  taskInputWrap.style.display    = 'flex';
  taskDisplayWrap.style.display  = 'none';
  taskInput.value = prefill || '';
  taskInput.focus();
}

function showDisplay(text) {
  taskPlaceholder.style.display  = 'none';
  taskInputWrap.style.display    = 'none';
  taskDisplayWrap.style.display  = 'flex';
  taskDisplayText.textContent    = text;
}

function submitTask() {
  const val = taskInput.value.trim();
  if (val) {
    localStorage.setItem('todayTask', val);
    showDisplay(val);
  } else {
    localStorage.removeItem('todayTask');
    showPlaceholder();
  }
}

// Load saved task on page load
const savedTask = localStorage.getItem('todayTask');
if (savedTask) {
  showDisplay(savedTask);
} else {
  showPlaceholder();
}

// Events
taskPlaceholder.addEventListener('click', () => showInput());
taskDisplayText.addEventListener('click', () => showInput(localStorage.getItem('todayTask')));
taskCancel.addEventListener('click', () => {
  const saved = localStorage.getItem('todayTask');
  saved ? showDisplay(saved) : showPlaceholder();
});
taskClear.addEventListener('click', () => {
  localStorage.removeItem('todayTask');
  showPlaceholder();
});
taskInput.addEventListener('keydown', e => { if (e.key === 'Enter') submitTask(); });
taskInput.addEventListener('blur', submitTask);

function tick() {
  const now  = new Date();
  const h24  = now.getHours();
  const ampm = h24 >= 12 ? 'PM' : 'AM';
  const h12  = h24 % 12 || 12;
  timeEl.innerHTML = h12 + ':' + pad(now.getMinutes()) + '<span class="ampm">' + ampm + '</span>';
  dateEl.textContent = DAYS[now.getDay()] + ', ' + MONTHS[now.getMonth()] + ' ' + now.getDate();
}

// Shuffle images sequentially so all images are shown before repeating
function getNextLocalImage() {
  let queue = JSON.parse(localStorage.getItem('bgQueue') || '[]');
  if (queue.length === 0) {
    // Fisher-Yates shuffle
    queue = Array.from({ length: TOTAL_IMAGES }, (_, i) => i + 1);
    for (let i = queue.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [queue[i], queue[j]] = [queue[j], queue[i]];
    }
  }
  const next = queue.pop();
  localStorage.setItem('bgQueue', JSON.stringify(queue));
  return 'imgs/bg' + next + '.jpg';
}

function showImage(url) {
  const preloader = new Image();
  preloader.onload = () => {
    bgEl.style.backgroundImage = 'url("' + preloader.src + '")';
    bgEl.classList.add('ready');
    wrapEl.classList.add('ready');
    tick();
  };
  preloader.onerror = () => {
    tick();
    wrapEl.classList.add('ready');
  };
  preloader.src = url;
}

async function loadBackground() {
  const useOnline = CONFIG.USE_UNSPLASH &&
      CONFIG.ACCESS_KEY &&
      Math.random() < CONFIG.UNSPLASH_PROBABILITY;

  if (useOnline) {
    try {
      const query = encodeURIComponent(CONFIG.QUERY);
      const res = await fetch('https://api.unsplash.com/photos/random?query=' + query + '&orientation=landscape&client_id=' + CONFIG.ACCESS_KEY);
      if (!res.ok) throw new Error('Unsplash failed: ' + res.status);
      const data = await res.json();
      showImage(data.urls.full);
    } catch (e) {
      console.warn('Unsplash unavailable, falling back to local images.', e);
      showImage(getNextLocalImage());
    }
  } else {
    showImage(getNextLocalImage());
  }
}

loadBackground();
setInterval(tick, 1000);