/* Vastulogy LP: floating buttons out of the hero, the free direction check, tile taps, motion. */
(() => {
  'use strict';
  const set = () => document.body.classList.toggle('n-top', scrollY < 480);
  set(); addEventListener('scroll', set, { passive: true });
})();
/* Direction check: room + zone of the home -> zone, element or ruler, one placement change.
   Traditional Vastu Purusha associations (corners carry the five elements, the cardinal sides their ruling devta).
   Nothing is stored or sent. */
(() => {
  'use strict';
  const box = document.querySelector('[data-vtool]');
  if (!box) return;
  const Z = {
    N: ['North zone', 'Uttar', 'Devta Kubera · wealth and new openings'],
    NE: ['North-east zone', 'Ishanya', 'Devta Ishana · water · prayer and clarity'],
    E: ['East zone', 'Purva', 'Devta Indra and Surya · light, health, new beginnings'],
    SE: ['South-east zone', 'Agneya', 'Devta Agni · fire · energy, cooking, cash flow'],
    S: ['South zone', 'Dakshin', 'Devta Yama · strength, rest, reputation'],
    SW: ['South-west zone', 'Nairutya', 'Devta Nirriti · earth · stability, the head of the family'],
    W: ['West zone', 'Paschim', 'Devta Varuna · gains and steady results'],
    NW: ['North-west zone', 'Vayavya', 'Devta Vayu · air · movement, guests, support from people'],
    C: ['Centre of the home', 'Brahmasthan', 'Devta Brahma · space · the open heart of the home'],
  };
  const G = 'Supports this room', OK = 'Works, with care', LOOK = 'Worth a closer look';
  /* [verdict, why, one change] per room and zone */
  const T = {
    door: {
      q: 'Which zone is the main door in?',
      good: ['N', 'NE', 'E'], ok: ['W', 'NW'],
      why: { good: 'Most guides welcome a main door here. It lets light and opportunity into the home.', ok: 'Guides accept a door here. How it is kept matters more than the side.', look: 'Guides are careful with a door here. The entrance can still be balanced.' },
      fix: { good: 'Keep the entrance bright, clean and clutter-free, with a clear nameplate.', ok: 'Light the entrance well, keep the threshold clean, and keep shoes away from the door.', look: 'Light the door well, keep it in good repair, and place a heavy plant or object beside it. No change to the wall.' },
    },
    kitchen: {
      q: 'Which zone is the kitchen in?',
      good: ['SE'], ok: ['NW', 'S', 'E'],
      why: { good: 'The south-east is the fire zone. Tradition places the kitchen here first.', ok: 'Many guides accept a kitchen here, with the stove placed with care.', look: 'Fire sits uneasily in this zone. The stove and its placement matter most.' },
      fix: { good: 'Place the stove so you face east while cooking.', ok: 'Move the stove to the south-east corner of the kitchen, and face east while you cook.', look: 'Keep the stove and the sink apart, and move the stove to the kitchen’s south-east corner. No walls touched.' },
    },
    bed: {
      q: 'Which zone is the master bedroom in?',
      good: ['SW'], ok: ['S', 'W'],
      why: { good: 'The south-west carries earth and weight. It suits the head of the family.', ok: 'A bedroom here is widely accepted, and steady for rest.', look: 'Guides prefer the south-west for the main bedroom. The bed can carry that weight for you.' },
      fix: { good: 'Keep the bed against the south or west wall, and sleep with your head to the south.', ok: 'Place the bed in the room’s south-west corner, head to the south or east.', look: 'Move the bed to the room’s south-west, head to the south or east, and keep the centre of the room open.' },
    },
    puja: {
      q: 'Which zone is the puja room in?',
      good: ['NE'], ok: ['E', 'N'],
      why: { good: 'The north-east is held for prayer. This is the place tradition names first.', ok: 'Prayer sits well here, close to the north-east.', look: 'Prayer is placed first in the north-east. A small mandir there can carry it.' },
      fix: { good: 'Keep it clean and light, and light a diya there each morning.', ok: 'Keep the idols facing west or east, and keep the space uncluttered.', look: 'Keep a small mandir in the north-east of the home or of the room, and keep it clean and lit.' },
    },
    desk: {
      q: 'Which way do you face when you sit?',
      good: ['N', 'E', 'NE'], ok: ['W'],
      why: { good: 'Facing north or east is what most guides ask for at work.', ok: 'Facing west is accepted. A steady back behind you matters.', look: 'Guides prefer you face north or east while you work.' },
      fix: { good: 'Keep a solid wall behind you, and the desk clear of clutter.', ok: 'Keep a solid wall behind you. Turn the chair towards north if you can.', look: 'Turn the chair and desk to face north or east, with a solid wall behind you. Nothing to rebuild.' },
    },
    wc: {
      q: 'Which zone is the toilet in?',
      good: ['NW', 'W'], ok: ['S', 'SE'],
      why: { good: 'Tradition accepts a toilet here.', ok: 'Many guides accept a toilet here, kept with care.', look: 'Guides most often mark a toilet here. Ordinary care comes first.' },
      fix: { good: 'Keep it clean and dry, with the door shut.', ok: 'Keep it clean, dry and well aired, with the door shut and the lid down.', look: 'Keep it spotless and dry, the door shut, an exhaust fan running. No demolition needed.' },
    },
  };
  let room = null, dir = null;
  const rooms = [...box.querySelectorAll('[data-room]')], dirs = [...box.querySelectorAll('[data-dir]')];
  const err = box.querySelector('.v-tool-err'), out = box.querySelector('.v-out'), q2 = box.querySelector('[data-q2]');
  const pick = (list, el) => list.forEach((b) => { const on = b === el; b.classList.toggle('is-on', on); b.setAttribute('aria-checked', on); });
  rooms.forEach((b) => b.addEventListener('click', () => {
    room = b.dataset.room; pick(rooms, b); q2.textContent = T[room].q; err.textContent = ''; box.classList.add('has-room');
    /* a desk faces a direction; the centre is not a facing */
    const c = dirs.find((d) => d.dataset.dir === 'C'); c.disabled = room === 'desk';
    if (room === 'desk' && dir === 'C') { dir = null; pick(dirs, null); }
  }));
  dirs.forEach((b) => b.addEventListener('click', () => { dir = b.dataset.dir; pick(dirs, b); err.textContent = ''; }));
  box.querySelector('[data-vgo]').addEventListener('click', () => {
    if (!room) { err.textContent = 'Pick a room first.'; rooms[0].focus(); return; }
    if (!dir) { err.textContent = 'Now tap the zone it sits in.'; dirs[2].focus(); return; }
    const t = T[room], z = Z[dir];
    const k = t.good.includes(dir) ? 'good' : t.ok.includes(dir) ? 'ok' : 'look';
    box.querySelector('[data-zk]').textContent = room === 'desk' ? 'You face ' + z[0].replace(' zone', '').toLowerCase() : z[0];
    box.querySelector('[data-zn]').textContent = z[1];
    box.querySelector('[data-zm]').textContent = z[2];
    const v = box.querySelector('[data-vv]');
    v.textContent = k === 'good' ? G : k === 'ok' ? OK : LOOK; v.dataset.k = k;
    box.querySelector('[data-vw]').textContent = t.why[k];
    box.querySelector('[data-vf]').textContent = t.fix[k];
    const label = rooms.find((b) => b.dataset.room === room).textContent;
    const cta = box.querySelector('.v-tool-cta');
    cta.dataset.pickReason = room === 'desk' ? 'Work desk' : 'Home';
    cta.dataset.pickLabel = `Full Vastu reading after the direction check (${label}, ${z[0].toLowerCase()})`;
    out.hidden = false; box.classList.add('is-done');
    out.classList.remove('is-in'); void out.offsetWidth; out.classList.add('is-in');
    dirs.forEach((b) => b.classList.toggle('is-hit', b.dataset.dir === dir));
    document.querySelectorAll('.v5-plan').forEach((f) => f.classList.add('is-checked'));
    out.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    window.dataLayer?.push({ event: 'vastu_tool', room, zone: dir, verdict: k });
  });
})();
/* Service tiles: tapping anywhere on a tile opens the form with that space chosen. */
document.querySelectorAll('.vs-grid li').forEach((li) => li.addEventListener('click', (e) => { if (!e.target.closest('a')) li.querySelector('.vs-go')?.click(); }));
/* Floating buttons step aside over the tool, tiles, promises and questions. */
(() => {
  const seen = new Set();
  const io = new IntersectionObserver((es) => { es.forEach((e) => (e.isIntersecting ? seen.add(e.target) : seen.delete(e.target))); document.body.classList.toggle('n-calc-in-view', seen.size > 0); }, { threshold: 0.2 });
  document.querySelectorAll('.v-tool, .vs-grid, .wy4-cards, .fq2-list, .mt-facts, .vq-cards').forEach((el) => io.observe(el));
})();
/* Motion: steps light up in turn; promises glow in turn; decision-card rail moves on phones. */
(() => {
  'use strict';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const steps = [...document.querySelectorAll('.v-approach .reading-points li')];
  if (steps.length) {
    let i = 0, vis = false;
    new IntersectionObserver((es) => { vis = es[0].isIntersecting; }, { threshold: 0.4 }).observe(steps[0].parentElement);
    const lit = () => steps.forEach((s, k) => s.classList.toggle('is-lit', k === i));
    lit();
    if (!reduce) setInterval(() => { if (vis) { i = (i + 1) % steps.length; lit(); } }, 1800);
  }
  const wy = document.querySelector('.wy4-cards');
  if (wy) new IntersectionObserver((es, o) => { if (es[0].isIntersecting) { wy.classList.add('is-in'); o.disconnect(); } }, { threshold: 0.25 }).observe(wy);
  const rail = document.querySelector('.vq-cards');
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
