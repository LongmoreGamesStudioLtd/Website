/* Fade-ins, lightbox, social embeds, tester form */
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Fade in on scroll
  const targets = document.querySelectorAll('.section-heading, .game-card, .game-details, .story-split, .contact-wrapper, .social-grid, .tester-note, .tester-form');
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    targets.forEach(t => { t.classList.add('fade-in'); io.observe(t); });
  }

  // Screenshot lightbox
  const shots = document.querySelectorAll('.shot');
  if (shots.length) {
    const lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.innerHTML = '<img alt="">';
    document.body.appendChild(lb);
    const img = lb.querySelector('img');
    const close = () => lb.classList.remove('open');
    shots.forEach(s => s.addEventListener('click', () => {
      img.src = s.dataset.full;
      img.alt = s.querySelector('img').alt;
      lb.classList.add('open');
    }));
    lb.addEventListener('click', close);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  }

  // Social video previews
  document.querySelectorAll('.social-card').forEach(card => {
    const url = (card.dataset.url || '').trim();
    if (!url) { card.textContent = 'Video coming soon'; return; }
    let m;
    if ((m = url.match(/youtube\.com\/shorts\/([\w-]+)/) || url.match(/youtu\.be\/([\w-]+)/))) {
      card.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + m[1] + '" title="YouTube Short" allowfullscreen loading="lazy" allow="encrypted-media; picture-in-picture"></iframe>';
    } else if ((m = url.match(/tiktok\.com\/.*\/video\/(\d+)/))) {
      const base = 'https://www.tiktok.com/player/v1/' + m[1] + '?music_info=1&description=1';
      card.innerHTML = '<iframe src="' + base + '" title="TikTok video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>';
      const frame = card.querySelector('iframe');
      if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        let playing = false;
        new IntersectionObserver(entries => {
          const on = entries[0].intersectionRatio >= 0.6;
          if (on === playing) return;
          playing = on;
          // Reloading the player with/without autoplay starts it muted when visible and stops it when scrolled away
          frame.src = on ? base + '&autoplay=1&muted=1' : base;
        }, { threshold: [0, 0.6] }).observe(card);
      }
    } else if (/\.(mp4|webm)$/i.test(url)) {
      card.innerHTML = '<video src="' + encodeURI(url) + '" controls playsinline preload="metadata"></video>';
    } else {
      card.innerHTML = '<a href="' + encodeURI(url) + '" target="_blank" rel="noopener">Watch video</a>';
    }
  });

  // Tester form (AJAX submit to Formspree, which emails the owner)
  const form = document.getElementById('testerForm');
  if (form) {
    const status = document.getElementById('testerStatus');
    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (form.querySelector('[name="_gotcha"]').value) return;
      status.textContent = 'Sending...';
      try {
        const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
        if (!res.ok) throw new Error();
        form.reset();
        status.textContent = 'Thanks! You are on the tester list. We will be in touch.';
      } catch {
        status.textContent = 'Something went wrong. Please try again or use the contact form.';
      }
    });
  }
})();
