const TODAY_TEXT = "Pause. Are you working on your #1 priority?";

const timeEl   = document.getElementById('time');
const dateEl   = document.getElementById('date');
const todayEl  = document.getElementById('today-text');
const bgEl     = document.getElementById('bg');
const wrapEl   = document.getElementById('clock-wrap');

const DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTHS = ['January','February','March','April','May','June',
  'July','August','September','October','November','December'];

function pad(n) { return String(n).padStart(2, '0'); }

function tick() {
  const now  = new Date();
  const h24  = now.getHours();
  const ampm = h24 >= 12 ? 'PM' : 'AM';
  const h12  = h24 % 12 || 12;
  timeEl.innerHTML = h12 + ':' + pad(now.getMinutes()) + ' <span class="ampm">' + ampm + '</span>';
  dateEl.textContent = DAYS[now.getDay()] + ', ' + MONTHS[now.getMonth()] + ' ' + now.getDate();
  todayEl.textContent = TODAY_TEXT;
}

// Pick random image, wait for load, then reveal everything
const totalImages = 13;
const randomNum   = Math.floor(Math.random() * totalImages) + 1;
const imgUrl      = 'imgs/bg' + randomNum + '.jpg';

const preloader   = new Image();
preloader.onload  = () => {
  bgEl.style.backgroundImage = 'url("' + imgUrl + '")';
  tick();
  bgEl.classList.add('ready');
  wrapEl.classList.add('ready');
};

preloader.onerror = () => {
  // show clock even if image fails
  tick();
  wrapEl.classList.add('ready');
};
preloader.src = imgUrl;

setInterval(tick, 1000);