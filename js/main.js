// Дата над заголовком на главной
const sub = document.getElementById('subline');
if (sub && document.querySelector('.page-home')) {
  sub.textContent = new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' });
}

// Тёмная тема
const THEME = 'codetrack-theme';
if (localStorage.getItem(THEME) === 'dark') document.body.classList.add('is-dark');
const darkToggle = document.getElementById('darkToggle');
if (darkToggle) {
  darkToggle.checked = document.body.classList.contains('is-dark');
  darkToggle.addEventListener('change', () => {
    document.body.classList.toggle('is-dark', darkToggle.checked);
    localStorage.setItem(THEME, darkToggle.checked ? 'dark' : 'light');
  });
}

// Кольцо прогресса
const ring = document.querySelector('.ring');
if (ring) {
  const C = 2 * Math.PI * 52;
  const pct = Number(ring.dataset.percent);
  requestAnimationFrame(() => {
    ring.querySelector('.ring__fg').style.strokeDashoffset = C * (1 - pct / 100);
  });
}

// Календарь активности
const heat = document.getElementById('heat');
if (heat) {
  let seed = 11;
  const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  for (let i = 0; i < 35; i++) {
    const r = rnd();
    const level = r < 0.22 ? 0 : r < 0.5 ? 1 : r < 0.78 ? 2 : 3;
    heat.insertAdjacentHTML('beforeend', `<i class="l${level}"></i>`);
  }
}

// Список задач
const list = document.getElementById('taskList');
if (list) {
  const items = [...list.querySelectorAll('.task')];
  const bar = document.getElementById('progressBar');
  const text = document.getElementById('progressText');
  const pctEl = document.getElementById('progressPct');
  const empty = document.getElementById('empty');
  const segs = document.querySelectorAll('.seg');
  let current = 'all';
  const KEY = 'codetrack-tasks';
  const saved = JSON.parse(localStorage.getItem(KEY) || 'null');
  if (saved) items.forEach((t, i) => { t.querySelector('input').checked = !!saved[i]; });

  function render() {
    const done = items.filter(t => t.querySelector('input').checked).length;
    const pct = Math.round(done / items.length * 100);
    let shown = 0;
    items.forEach(t => {
      const isDone = t.querySelector('input').checked;
      t.classList.toggle('is-done', isDone);
      const show = current === 'all' || (current === 'done' ? isDone : !isDone);
      t.hidden = !show;
      if (show) shown++;
    });
    bar.style.width = pct + '%';
    text.textContent = `Выполнено: ${done} из ${items.length}`;
    pctEl.textContent = pct + '%';
    empty.hidden = shown > 0;
    localStorage.setItem(KEY, JSON.stringify(items.map(t => t.querySelector('input').checked)));
  }

  items.forEach(t => t.querySelector('input').addEventListener('change', render));
  segs.forEach(s => s.addEventListener('click', () => {
    current = s.dataset.filter;
    segs.forEach(x => x.classList.toggle('is-active', x === s));
    render();
  }));
  render();
}
