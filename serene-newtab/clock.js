const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const TODAY_TEXT = "Pause. Are you working on your #1 priority?";

const DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December'];

function pad(n) { return String(n).padStart(2, '0'); }

function tick() {
  const now = new Date();
  const h24 = now.getHours();
  const ampm = h24 >= 12 ? 'PM' : 'AM';
  const h12 = h24 % 12 || 12;
  timeEl.innerHTML = h12 + ':' + pad(now.getMinutes()) + ' <span class="ampm">' + ampm + '</span>';
  dateEl.textContent = DAYS[now.getDay()] + ', ' + MONTHS[now.getMonth()] + ' ' + now.getDate();
  document.getElementById('today-text').textContent = TODAY_TEXT;
}

tick();
setInterval(tick, 1000);