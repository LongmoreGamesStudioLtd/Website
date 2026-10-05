/* ===== Static nav styling ===== */
(function () {
  const nav = document.querySelector('nav');
  if (!nav) return;
  nav.classList.remove('scrolled');
})();

/* ===== Treat Time screenshot rotation ===== */
(function () {
  const shots = document.querySelectorAll('#treatTimeShots img');
  if (shots.length < 2) return;

  let current = 0;

  function render() {
    shots.forEach((shot, i) => {
      const offset = (i - current + shots.length) % shots.length;
      shot.classList.toggle('is-active', offset === 0);
      shot.classList.toggle('is-next', offset === 1);
      shot.classList.toggle('is-prev', offset === shots.length - 1);
    });
  }

  render();
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  setInterval(() => {
    current = (current + 1) % shots.length;
    render();
  }, 3500);
})();

/* ===== Mobile fading menu overlay ===== */
(function () {
  const toggle = document.getElementById('menuToggle');
  const overlay = document.getElementById('menuOverlay');
  if (!toggle || !overlay) return;

  function setOpen(isOpen) {
    toggle.classList.toggle('active', isOpen);
    overlay.classList.toggle('active', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    overlay.setAttribute('aria-hidden', String(!isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  toggle.addEventListener('click', () => setOpen(!overlay.classList.contains('active')));
  overlay.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });
  window.addEventListener('resize', () => { if (window.innerWidth > 600) setOpen(false); });
})();

/* ===== Mouse-driven hero logo morph ===== */
(function () {
  const logo = document.querySelector('.hero-brand-heading');
  if (!logo) return;

  function updateLogoMorph(event) {
    if (event.pointerType === 'touch') return;

    const bounds = logo.getBoundingClientRect();
    const normalizedX = Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width - 0.5) * 2));
    const normalizedY = Math.max(-1, Math.min(1, ((event.clientY - bounds.top) / bounds.height - 0.5) * 2));
    const scaleX = 1 - Math.abs(normalizedX) * 0.12 + Math.abs(normalizedY) * 0.035;
    const scaleY = 1 - Math.abs(normalizedY) * 0.12 + Math.abs(normalizedX) * 0.035;

    logo.style.setProperty('--logo-origin', `${((normalizedX + 1) * 50).toFixed(1)}% ${((normalizedY + 1) * 50).toFixed(1)}%`);
    logo.style.setProperty('--logo-scale-x', scaleX.toFixed(3));
    logo.style.setProperty('--logo-scale-y', scaleY.toFixed(3));
    logo.style.setProperty('--logo-rotation', `${(normalizedX * 3).toFixed(2)}deg`);
    logo.classList.add('is-morphing');
  }

  logo.addEventListener('pointerenter', updateLogoMorph);
  logo.addEventListener('pointermove', updateLogoMorph);
  logo.addEventListener('pointerleave', () => logo.classList.remove('is-morphing'));
})();

/* ===== Button Mouse-Tracking Spotlight Glow ===== */
(function () {
  function attachGlow(btn) {
    btn.addEventListener('mousemove', function (e) {
      const rect = btn.getBoundingClientRect();
      btn.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
      btn.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    });
  }

  const glossySelector = '.cta-btn, .btn';

  // Attach to all current buttons and any added later (e.g. in modals)
  document.querySelectorAll(glossySelector).forEach(attachGlow);

  // Also catch dynamically inserted buttons
  const observer = new MutationObserver(mutations => {
    mutations.forEach(m => m.addedNodes.forEach(node => {
      if (node.nodeType !== 1) return;
      if (node.matches && node.matches(glossySelector)) attachGlow(node);
      node.querySelectorAll && node.querySelectorAll(glossySelector).forEach(attachGlow);
    }));
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();

/* ===== Static homepage sections only ===== */
(function () {
  const hero = document.querySelector('.banner');
  if (hero) {
    hero.style.clipPath = 'none';
    hero.style.opacity = '1';
  }
})();

/* ===== Collapsible Toggle Functionality ===== */
function toggleCollapsible(header) {
  const content = header.nextElementSibling;
  
  header.classList.toggle('active');
  content.classList.toggle('active');
  
  if (content.classList.contains('active')) {
    content.style.maxHeight = content.scrollHeight + 'px';
  } else {
    content.style.maxHeight = '0';
  }
}

/* ===== Featured Carousel Navigation ===== */
let featuredIndex = 0;
let featuredAutoPlay;

function moveFeaturedCarousel(dir) {
  const slides = document.querySelectorAll('.carousel-slide');
  if (!slides.length) return;
  featuredIndex += dir;
  if (featuredIndex < 0) featuredIndex = slides.length - 1;
  if (featuredIndex >= slides.length) featuredIndex = 0;
  updateFeaturedCarousel();
  resetFeaturedAutoPlay();
}

function goToFeaturedSlide(index) {
  featuredIndex = index;
  updateFeaturedCarousel();
  resetFeaturedAutoPlay();
}

function updateFeaturedCarousel() {
  const slides = document.querySelectorAll('.carousel-slide');
  const track = document.getElementById('carouselTrack');
  if (!slides.length || !track) return;

  // Each slide is 60% + 2% margin = 62% per slide on desktop
  // We want the active slide centered, so offset = (index * slideWidth) - centering
  const slideWidth = slides[0].offsetWidth + parseFloat(getComputedStyle(slides[0]).marginLeft) * 2;
  const viewportWidth = track.parentElement.offsetWidth;
  const offset = (featuredIndex * slideWidth) - (viewportWidth / 2) + (slideWidth / 2);
  
  track.style.transform = `translateX(-${offset}px)`;

  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === featuredIndex);
  });

  // Update dots
  document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === featuredIndex);
  });
}

function resetFeaturedAutoPlay() {
  clearInterval(featuredAutoPlay);
  featuredAutoPlay = setInterval(() => {
    featuredIndex = (featuredIndex + 1) % document.querySelectorAll('.carousel-slide').length;
    updateFeaturedCarousel();
  }, 5000);
}

/* ===== Journey Carousel Navigation ===== */
let journeyCarouselIndex = 0;

function moveJourneyCarousel(direction) {
  const items = document.querySelectorAll('.journey-carousel-item');
  
  if (!items.length) return;
  
  journeyCarouselIndex += direction;
  
  if (journeyCarouselIndex < 0) {
    journeyCarouselIndex = items.length - 1;
  } else if (journeyCarouselIndex >= items.length) {
    journeyCarouselIndex = 0;
  }
  
  updateJourneyCarouselPosition(items);
}

function updateJourneyCarouselPosition(items) {
  items.forEach((item) => {
    item.classList.remove('active');
  });
  items[journeyCarouselIndex].classList.add('active');
  
  const prevIndex = journeyCarouselIndex === 0 ? items.length - 1 : journeyCarouselIndex - 1;
  const nextIndex = (journeyCarouselIndex + 1) % items.length;
  
  const orderedItems = [
    items[prevIndex],
    items[journeyCarouselIndex], 
    items[nextIndex]
  ];
  
  orderedItems.forEach((item, visIndex) => {
    item.style.order = visIndex;
  });
  
  items.forEach((item, index) => {
    if (![prevIndex, journeyCarouselIndex, nextIndex].includes(index)) {
      item.style.order = 999;
      item.style.display = 'none';
    } else {
      item.style.display = 'flex';
    }
  });
}

// Initialize carousels
document.addEventListener('DOMContentLoaded', () => {
  // Featured carousel
  const slides = document.querySelectorAll('.carousel-slide');
  const dotsContainer = document.getElementById('carouselDots');
  if (slides.length > 0 && dotsContainer) {
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      dot.onclick = () => goToFeaturedSlide(i);
      dotsContainer.appendChild(dot);
    });
    slides[0].classList.add('active');
    updateFeaturedCarousel();
    resetFeaturedAutoPlay();
  }

  // Touch/swipe support
  const viewport = document.querySelector('.carousel-viewport');
  if (viewport) {
    let startX = 0;
    viewport.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
    viewport.addEventListener('touchend', (e) => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) moveFeaturedCarousel(diff > 0 ? 1 : -1);
    }, { passive: true });
  }

  // Recalculate on resize
  window.addEventListener('resize', () => {
    const s = document.querySelectorAll('.carousel-slide');
    if (s.length) updateFeaturedCarousel();
  });

  // Journey carousel
  const journeyItems = document.querySelectorAll('.journey-carousel-item');
  if (journeyItems.length > 0) {
    journeyCarouselIndex = 0;
    updateJourneyCarouselPosition(journeyItems);
    setTimeout(() => {
      moveJourneyCarousel(1);
    }, 50);
  }
});

/* ===== Slideshow Functionality ===== */
let slideIndex = 1;

function changeSlide(n) {
  showSlide(slideIndex += n);
}

function currentSlide(n) {
  showSlide(slideIndex = n);
}

function showSlide(n) {
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  
  if (!slides.length) return;
  
  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }
  
  slides.forEach(slide => {
    slide.style.display = 'none';
  });
  
  dots.forEach(dot => {
    dot.classList.remove('active');
  });
  
  slides[slideIndex - 1].style.display = 'block';
  dots[slideIndex - 1].classList.add('active');
}

// Initialize slideshow
document.addEventListener('DOMContentLoaded', () => {
  showSlide(slideIndex);
});

// Auto-advance slideshow every 5 seconds
setInterval(() => {
  changeSlide(1);
}, 5000);

/* ===== CAROUSEL - OPTIMAL INFINITE LOOP ===== */
(() => {
  const carousels = document.querySelectorAll('.carousel-container');
  
  carousels.forEach(carousel => {
    const track = carousel.querySelector('.carousel-track');
    if (!track) return;

    const originalItems = Array.from(track.querySelectorAll('.carousel-item'));
    const itemCount = originalItems.length;
    if (itemCount === 0) return;

    // Clone items twice for seamless looping
    originalItems.forEach(item => {
      track.appendChild(item.cloneNode(true));
    });
    originalItems.forEach(item => {
      track.appendChild(item.cloneNode(true));
    });

    const itemWidth = 500;
    const gap = 32;
    const itemDistance = itemWidth + gap;
    const singleLoopDistance = itemCount * itemDistance;
    const totalDistance = singleLoopDistance * 3;

    let scrollPosition = 0;
    let isDragging = false;
    let startX = 0;
    let startScrollLeft = 0;
    let isAutoRotating = true;
    let velocity = 0;
    const smoothSpeed = 8;
    const friction = 0.88;

    // Update transform
    const updateTransform = () => {
      track.style.transform = `translateX(-${scrollPosition}px)`;
    };

    // Animation with proper looping
    const animate = () => {
      if (!isDragging) {
        if (isAutoRotating) {
          scrollPosition += smoothSpeed / 60;
        } else if (Math.abs(velocity) > 0.1) {
          scrollPosition += velocity;
          velocity *= friction;
        }

        // When we've scrolled 2x the loop distance, reset to start
        if (scrollPosition >= singleLoopDistance * 2) {
          scrollPosition = 0;
          track.style.transition = 'none';
        }
      }
      
      updateTransform();
      requestAnimationFrame(animate);
    };

    const stopAutoRotate = () => {
      isAutoRotating = false;
      setTimeout(() => {
        isAutoRotating = true;
      }, 8000);
    };

    // Mouse drag
    track.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.pageX - carousel.offsetLeft;
      startScrollLeft = scrollPosition;
      track.style.cursor = 'grabbing';
      track.style.transition = 'none';
      isAutoRotating = false;
      velocity = 0;
    });

    let lastX = 0;
    let lastTime = 0;

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;

      const now = Date.now();
      const x = e.pageX - carousel.offsetLeft;
      const walk = (x - startX) * 1.5;
      scrollPosition = startScrollLeft - walk;

      // Clamp to valid range
      scrollPosition = Math.max(0, Math.min(scrollPosition, totalDistance));
      
      updateTransform();
      
      if (lastTime > 0) {
        velocity = (lastX - x) * 0.08;
      }
      
      lastX = x;
      lastTime = now;
    });

    document.addEventListener('mouseup', () => {
      if (!isDragging) return;
      isDragging = false;
      track.style.cursor = 'grab';
      track.style.transition = 'transform 0.3s ease-out';
      lastTime = 0;
      stopAutoRotate();
    });

    // Touch support
    track.addEventListener('touchstart', (e) => {
      isDragging = true;
      startX = e.touches[0].pageX - carousel.offsetLeft;
      startScrollLeft = scrollPosition;
      track.style.transition = 'none';
      isAutoRotating = false;
      velocity = 0;
      lastTime = 0;
    });

    document.addEventListener('touchmove', (e) => {
      if (!isDragging) return;

      const now = Date.now();
      const x = e.touches[0].pageX - carousel.offsetLeft;
      const walk = (x - startX) * 1.5;
      scrollPosition = startScrollLeft - walk;

      scrollPosition = Math.max(0, Math.min(scrollPosition, totalDistance));
      
      updateTransform();
      
      if (lastTime > 0) {
        velocity = (lastX - x) * 0.08;
      }
      
      lastX = x;
      lastTime = now;
    });

    document.addEventListener('touchend', () => {
      if (!isDragging) return;
      isDragging = false;
      track.style.transition = 'transform 0.3s ease-out';
      track.style.cursor = 'grab';
      lastTime = 0;
      stopAutoRotate();
    });

    track.style.cursor = 'grab';
    animate();
  });
})();

/* ===== Sidebar Navigation Active State ===== */
(() => {
  const sidebarLinks = document.querySelectorAll('.sidebar a');
  
  window.addEventListener('scroll', () => {
    let current = '';
    
    sidebarLinks.forEach(link => {
      const section = document.querySelector(link.getAttribute('href'));
      if (section && section.offsetTop <= window.scrollY + 100) {
        current = link.getAttribute('href');
      }
    });

    sidebarLinks.forEach(link => {
      link.classList.remove('active');
    });

    if (current) {
      document.querySelector(`.sidebar a[href="${current}"]`)?.classList.add('active');
    }
  });
})();

/* ===== Card Fade Reveal on Scroll ===== */
(() => {
  const cards = document.querySelectorAll('.card, .fade-item, .gallery-item, .featured-card, .stat-card, .carousel-item');
  if (!cards.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });

  cards.forEach(card => observer.observe(card));
})();

/* ===== Parallax on Cards (No Preview Follower) ===== */
(() => {
  const projectCards = document.querySelectorAll('.project-card');
  
  if (!projectCards.length) return;

  // Scroll-based parallax ONLY on Games & YouTube sections
  const gamesSection = document.getElementById('games');
  const youtubeSection = document.getElementById('youtube');
  
  window.addEventListener('scroll', () => {
    projectCards.forEach(card => {
      // Only apply parallax if card is in Games or YouTube section
      const isInGamesSection = gamesSection && gamesSection.contains(card);
      const isInYoutubeSection = youtubeSection && youtubeSection.contains(card);
      
      if (!isInGamesSection && !isInYoutubeSection) return;
      
      const cardRect = card.getBoundingClientRect();
      const cardCenter = cardRect.top + cardRect.height / 2;
      const screenCenter = window.innerHeight / 2;
      const distance = screenCenter - cardCenter;
      
      // Apply parallax to images within card
      const imgs = card.querySelectorAll('img, .youtube-video');
      imgs.forEach(el => {
        const parallaxAmount = distance * 0.15;
        el.style.transform = `translateY(${parallaxAmount}px)`;
      });
    });
  });
})();

/* ===== Scroll indicator ===== */
document.querySelector('.scroll-indicator')?.addEventListener('click', () => {
  document.querySelector('section')?.scrollIntoView({ behavior: 'smooth' });
});

/* ===== Smart Video Autoplay on Scroll ===== */
(() => {
  // Disable autoplay on mobile devices
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                   window.matchMedia('(max-width: 768px)').matches;
  
  if (isMobile) {
    // Remove autoplay attribute from all videos on mobile
    const videos = document.querySelectorAll('video[autoplay]');
    videos.forEach(video => {
      video.removeAttribute('autoplay');
      video.pause();
    });
    return;
  }
  
  const videos = document.querySelectorAll('video[autoplay]');
  if (!videos.length) return;

  const videoAutoplayObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target;
      
      if (entry.isIntersecting) {
        // Video is visible - play it
        video.play().catch(err => {
          // Autoplay may be blocked, that's ok
          console.log('Video autoplay prevented:', err);
        });
      } else {
        // Video is not visible - pause it
        video.pause();
      }
    });
  }, { threshold: 0.25 }); // Trigger when 25% of video is visible

  videos.forEach(video => videoAutoplayObserver.observe(video));
})();
