const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');

const DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December'];

function pad(n) { return String(n).padStart(2, '0'); }

function tick() {
  const now = new Date();
  timeEl.textContent = pad(now.getHours()) + ':' + pad(now.getMinutes());
  dateEl.textContent = DAYS[now.getDay()] + ', ' + MONTHS[now.getMonth()] + ' ' + now.getDate();
}

tick();
setInterval(tick, 1000);
