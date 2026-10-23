/* Numerology LP: keep the floating buttons out of the hero, and move the pain-card rail on phones. */
(() => {
  'use strict';
  const set = () => document.body.classList.toggle('n-top', scrollY < 480);
  set(); addEventListener('scroll', set, { passive: true });
})();
/* Birth-date tool: root number (mulank) from the day, destiny number (bhagyank) from every digit of the full date, each reduced to 1-9.
   Planet names follow the Lo Shu grid shown on the page. Nothing leaves the browser. */
(() => {
  'use strict';
  const box = document.querySelector('[data-calc]');
  if (!box) return;
  const P = { 1: 'Sun', 2: 'Moon', 3: 'Jupiter', 4: 'Rahu', 5: 'Mercury', 6: 'Venus', 7: 'Ketu', 8: 'Shani', 9: 'Mangal' };
  const red = (n) => { while (n > 9) n = String(n).split('').reduce((a, d) => a + Number(d), 0); return n; };
  const form = box.querySelector('form'), inp = box.querySelector('input'), out = box.querySelector('.n-calc-out'), err = box.querySelector('.n-calc-err');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const v = inp.value;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) { err.textContent = 'Please choose your birth date.'; inp.focus(); return; }
    err.textContent = '';
    const [y, m, d] = v.split('-');
    const mul = red(Number(d));
    const bh = red((d + m + y).split('').reduce((a, c) => a + Number(c), 0));
    const bm = box.querySelector('[data-mul]'), bb = box.querySelector('[data-bh]');
    box.querySelector('[data-mulp]').textContent = P[mul]; box.querySelector('[data-bhp]').textContent = P[bh];
    /* Colours and day by ruling planet (traditional Vedic associations). Colours: mulank first, then bhagyank, up to four. Day: from the mulank. */
    const C = { 1: [['Gold', '#D4A63A'], ['Orange', '#E8822E'], ['Yellow', '#F2C94C'], ['Copper', '#B5693A']],
      2: [['White', '#FFFFFF'], ['Cream', '#F3E6C8'], ['Silver', '#C9CED6'], ['Light green', '#A8D5A2']],
      3: [['Yellow', '#F2C94C'], ['Saffron', '#F4A23A'], ['Purple', '#7A4E9B'], ['Pink', '#E79AB4']],
      4: [['Grey', '#8E9196'], ['Electric blue', '#2F6FE0'], ['Khaki', '#B9A97A'], ['Light blue', '#9CC3E8']],
      5: [['Green', '#3D9A5B'], ['Light green', '#A8D5A2'], ['Light grey', '#C7CACE'], ['White', '#FFFFFF']],
      6: [['White', '#FFFFFF'], ['Pink', '#E79AB4'], ['Light blue', '#9CC3E8'], ['Cream', '#F3E6C8']],
      7: [['Light yellow', '#F6E7A1'], ['Light green', '#A8D5A2'], ['White', '#FFFFFF'], ['Grey', '#8E9196']],
      8: [['Dark blue', '#23396B'], ['Black', '#1C1C1C'], ['Purple', '#5B3A7A'], ['Dark grey', '#4A4D52']],
      9: [['Red', '#C7372F'], ['Maroon', '#7A1F2B'], ['Coral', '#EE7A62'], ['Pink', '#E79AB4']] };
    const D = { 1: 'Sunday', 2: 'Monday', 3: 'Thursday', 4: 'Saturday', 5: 'Wednesday', 6: 'Friday', 7: 'Monday', 8: 'Saturday', 9: 'Tuesday' };
    const cols = [];
    [...C[mul], ...C[bh]].forEach(([n, c]) => { if (cols.length < 4 && !cols.some((x) => x[0] === n)) cols.push([n, c]); });
    box.querySelector('[data-cols]').innerHTML = cols.map(([n, c]) => `<li><i style="background:${c}"></i>${n}</li>`).join('');
    box.querySelector('[data-day]').textContent = D[mul];
    box.querySelector('[data-dayfrom]').textContent = 'Ruled by ' + P[mul] + ', your mulank planet';
    out.hidden = false; box.classList.add('is-done');
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { bm.textContent = mul; bb.textContent = bh; }
    else {
      /* the two numbers roll through 1 to 9 before they settle */
      let t = 0; bm.classList.add('is-rolling'); bb.classList.add('is-rolling');
      const roll = setInterval(() => {
        t++; bm.textContent = (t % 9) + 1; bb.textContent = ((t + 4) % 9) + 1;
        if (t > 12) { clearInterval(roll); bm.textContent = mul; bb.textContent = bh; bm.classList.remove('is-rolling'); bb.classList.remove('is-rolling'); }
      }, 60);
    }
    out.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    document.querySelectorAll('.na-grid span').forEach((s) => s.classList.toggle('is-hit', [mul, bh].includes(parseInt(s.textContent, 10))));
    window.dataLayer?.push({ event: 'numerology_tool', root_number: mul, destiny_number: bh });
  });
})();
/* Option tiles: tapping anywhere on a tile opens the form with that topic chosen. */
document.querySelectorAll('.no-grid li').forEach((li) => li.addEventListener('click', (e) => { if (!e.target.closest('a')) li.querySelector('.no-go')?.click(); }));
/* Floating buttons step aside while the birth-date tool is on screen (they covered the date box). */
(() => {
  /* also step aside over the tiles, the promises and the questions, where they covered text and buttons */
  const seen = new Set();
  const io = new IntersectionObserver((es) => { es.forEach((e) => (e.isIntersecting ? seen.add(e.target) : seen.delete(e.target))); document.body.classList.toggle('n-calc-in-view', seen.size > 0); }, { threshold: 0.2 });
  document.querySelectorAll('.n-calc, .no-grid, .nw-cards, .fq2-list, .n-creds').forEach((el) => io.observe(el));
})();
/* Motion: steps light up in turn; promises fade in; pain-card rail moves on phones like the Brainology cards. */
(() => {
  'use strict';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const steps = [...document.querySelectorAll('.na-steps li')];
  if (steps.length) {
    let i = 0, vis = false;
    new IntersectionObserver((es) => { vis = es[0].isIntersecting; }, { threshold: 0.4 }).observe(steps[0].parentElement);
    const lit = () => steps.forEach((s, k) => s.classList.toggle('is-lit', k === i));
    lit();
    if (!reduce) setInterval(() => { if (vis) { i = (i + 1) % steps.length; lit(); } }, 1800);
  }
  const nw = document.querySelector('.nw-cards');
  if (nw) new IntersectionObserver((es, o) => { if (es[0].isIntersecting) { nw.classList.add('is-in'); o.disconnect(); } }, { threshold: 0.25 }).observe(nw);
  const rail = document.querySelector('.nq-cards');
  if (rail && !reduce) {
    let paused = 0, vis = false;
    ['pointerdown', 'touchstart', 'wheel'].forEach((ev) => rail.addEventListener(ev, () => { paused = Date.now() + 8000; }, { passive: true }));
    new IntersectionObserver((es) => { vis = es[0].isIntersecting; }, { threshold: 0.6 }).observe(rail);
    setInterval(() => {
      if (!vis || Date.now() < paused || rail.scrollWidth <= rail.clientWidth + 4) return;
      const x = rail.scrollLeft, kids = [...rail.children];
      const next = kids.find((c) => c.offsetLeft - rail.offsetLeft > x + 8);
      const end = x + rail.clientWidth >= rail.scrollWidth - 8;
      rail.scrollTo({ left: end || !next ? 0 : next.offsetLeft - rail.offsetLeft - (rail.clientWidth - next.clientWidth) / 2, behavior: 'smooth' });
    }, 7000);
  }
})();
