/* ===== PAGE TRANSITION SYSTEM ===== */

(() => {
  let isTransitioning = false;
  
  // Page titles for transition display
  const pageTitles = {
    'index.html': 'Home',
    'portfolio.html': 'Portfolio',
    'blog.html': 'Blog',
    'freelance.html': 'Freelance'
  };
  
  // Get the page name from current URL
  function getCurrentPage() {
    const path = window.location.pathname;
    return path.substring(path.lastIndexOf('/') + 1) || 'index.html';
  }
  
  // Get title from link href
  function getTitleFromHref(href) {
    // Extract just the filename
    const filename = href.split('/').pop() || 'index.html';
    return pageTitles[filename] || 'Jack Longmore';
  }
  
  // Trigger page transition
  function triggerTransition(href, title) {
    if (isTransitioning) return;
    isTransitioning = true;
    
    const overlay = document.querySelector('.page-transition');
    const titleElement = document.getElementById('transition-text');
    
    // Set title
    titleElement.textContent = title;
    
    // Add transitioning state to delay page animations
    document.body.classList.add('transitioning');
    
    // Add active class to start animation
    overlay.classList.add('active');
    
    // After swipe + title animation completes (500ms), start exit and navigate
    setTimeout(() => {
      // Start fading out immediately
      overlay.classList.add('exiting');
      
      // Navigate while fade is in progress (after 1.5s, giving page time to load)
      setTimeout(() => {
        window.location.href = href;
      }, 1500);
    }, 500);
  }
  
  // Intercept all internal navigation links
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    
    if (!link) return;
    
    const href = link.getAttribute('href');
    
    // Check if it's an internal navigation link (not anchor, not external, not mailto)
    if (href && 
        (href.startsWith('index.html') || 
        href === '/' ||
        href.endsWith('portfolio.html') || 
        href.endsWith('blog.html') || 
        href.endsWith('freelance.html'))) {
      
      // Only prevent default if we're actually navigating (not on same page)
      const currentPage = getCurrentPage();
      const targetPage = href.split('/').pop() || 'index.html';
      
      if (currentPage !== targetPage) {
        e.preventDefault();
        const title = getTitleFromHref(href);
        triggerTransition(href, title);
      }
    }
  });
  
  // Initialize - reset transition state on page load
  window.addEventListener('load', () => {
    const overlay = document.querySelector('.page-transition');
    if (overlay) {
      overlay.classList.remove('active', 'exiting');
    }
    isTransitioning = false;
    document.body.classList.remove('transitioning');
  });
})();
