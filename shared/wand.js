// Sparkle trail behind the magic-wand cursor (and a small burst on every click or tap).
// Follows the "Magic wand cursor" switch in Settings: no "wand" class on <html>, no sparkles.
(function () {
  if (matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  const COLS = ['#ffd66b', '#6ff7ff', '#ffffff', '#ff8fc0', '#b796ff'], MAX = 48;
  let live = 0, lx = -99, ly = -99, lt = 0;
  const on = () => document.documentElement.classList.contains('wand');
  function spark(x, y, spread) {
    if (live >= MAX || !document.body) return;
    const s = document.createElement('i'), c = COLS[Math.floor(Math.random() * COLS.length)], plus = Math.random() < .5, u = plus ? 2 : (Math.random() < .5 ? 3 : 5);
    s.setAttribute('aria-hidden', 'true');
    s.style.cssText = 'position:fixed;left:' + (x - u / 2) + 'px;top:' + (y - u / 2) + 'px;width:' + u + 'px;height:' + u + 'px;background:' + c +
      ';pointer-events:none;z-index:2147483000;' + (plus ? 'box-shadow:' + u + 'px 0 ' + c + ',-' + u + 'px 0 ' + c + ',0 ' + u + 'px ' + c + ',0 -' + u + 'px ' + c + ';' : '');
    document.body.appendChild(s); live++;
    const dx = (Math.random() - .5) * spread, dy = (Math.random() - .2) * spread + 14, ms = 450 + Math.random() * 400;
    let gone = false; const done = () => { if (gone) return; gone = true; s.remove(); live--; };
    try { s.animate([{ transform: 'translate(0,0) scale(1)', opacity: 1 }, { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(.4)', opacity: 0 }], { duration: ms, easing: 'steps(6)' }).onfinish = done; } catch (e) {}
    setTimeout(done, ms + 80);
  }
  addEventListener('pointermove', e => {
    if (!on()) return;
    const t = performance.now(), d = Math.abs(e.clientX - lx) + Math.abs(e.clientY - ly);
    if (d < 10 || t - lt < 28) return;
    lx = e.clientX; ly = e.clientY; lt = t;
    spark(e.clientX + 2, e.clientY + 2, 16); if (d > 40) spark(e.clientX, e.clientY, 22);
  }, { passive: true });
  addEventListener('pointerdown', e => { if (on()) for (let i = 0; i < 7; i++) spark(e.clientX, e.clientY, 46); }, { passive: true });
})();
