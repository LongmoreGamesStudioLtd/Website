# Page Transition Testing Guide

## What was implemented:

### 1. **Page Transition Overlay** (HTML)
- Added a `<div class="page-transition">` element to all pages (index.html, portfolio.html, blog.html, freelance.html)
- Contains:
  - `.transition-swipe` - The animated background that slides in
  - `.transition-title` - Title display element

### 2. **Transition Animations** (CSS - transition.css)
- **Swipe Effect**: Background slides in from right (100% → 0%) with green-to-dark gradient
- **Title Reveal**: Title fades in and scales up (0.8 → 1) during swipe
- **Fade Out**: Entire overlay fades out after sequence completes
- **Spring Easing**: Uses cubic-bezier(0.34, 1.56, 0.64, 1) for bouncy feel

### 3. **Navigation Interception** (JavaScript - transition.js)
- Intercepts all internal navigation link clicks
- Checks if target page differs from current page
- Triggers animation sequence:
  1. Add `.active` class (swipe + title)
  2. Wait 1000ms
  3. Add `.exiting` class (swipe out + fade)
  4. Navigate after 300ms more (total 1.3 seconds)

## How to Test:

### Test 1: Home → Portfolio
1. Open `index.html` in browser
2. Click "Portfolio" in navigation
3. You should see:
   - Green swipe slide in from right
   - "PORTFOLIO" title appears and scales
   - Swipe slides out to left
   - Overlay fades out
   - Portfolio page loads

### Test 2: Portfolio → Blog
1. From portfolio page, click "Blog"
2. Same animation plays
3. "BLOG" title displays during swipe

### Test 3: Blog → Freelance
1. From blog page, click "Freelance"
2. Animation plays
3. "FREELANCE" title displays

### Test 4: Any page → Home
1. Click "Home" (Jack Longmore logo or Home nav link)
2. Animation plays
3. "HOME" title displays

## Animation Timeline:

- 0ms: Swipe starts sliding in (700ms duration)
- 100ms: Title starts fading in (800ms duration with 0.1s delay)
- 700ms: Swipe finishes
- 800ms: Title finishes fade-in
- 1000ms: Swipe starts sliding out (600ms duration with 0.3s delay = total 900ms)
- 1300ms: Navigation occurs (300ms after exiting starts)
- 1500ms+: Page load completes, overlay resets

## Features:

✅ Smooth bouncy animations (spring easing)
✅ Title displays correctly for each page
✅ Prevents duplicate transitions (isTransitioning flag)
✅ Only triggers for different pages (not same page)
✅ Resets state on page load
✅ Works with all navigation links
✅ Responsive font sizes (3.5rem desktop, 2rem mobile)
✅ Prevents external links and anchor links from triggering

## Browser Compatibility:

- Works in all modern browsers (Chrome, Firefox, Edge, Safari)
- Uses standard CSS animations and transforms
- No dependencies on jQuery or other libraries
- Falls back gracefully if JavaScript disabled

## Files Modified/Created:

- **transition.css** (NEW) - All animation styles
- **transition.js** (NEW) - Navigation interception logic
- **index.html** - Added overlay, CSS/JS links
- **portfolio.html** - Added overlay, CSS/JS links
- **blog.html** - Added overlay, CSS/JS links, updated nav structure
- **freelance.html** - Added overlay, CSS/JS links, updated nav structure
