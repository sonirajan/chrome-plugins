/**
 * LinkedIn Image Blocker – content.js v2
 *
 * Strategy: replace src with a placeholder SVG data URL.
 * This works everywhere (feed, messaging, search, profile)
 * because the <img> element stays in the DOM at its natural size.
 */

const LICDN_PATTERN = /licdn\.com\/(dms|media|aero-v1\/sc\/h)/i;

// Gray circle + white person silhouette — works at any size
const PLACEHOLDER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#d6d6d6"/><circle cx="50" cy="38" r="17" fill="#a0a0a0"/><ellipse cx="50" cy="85" rx="28" ry="20" fill="#a0a0a0"/></svg>`;

const PLACEHOLDER_DATA_URL =
  'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(PLACEHOLDER_SVG);

const WATCHED_ATTRS = ['src', 'data-delayed-url', 'data-ghost-url', 'data-src', 'style'];

function isLinkedInImage(img) {
  return (
      LICDN_PATTERN.test(img.getAttribute('src') || '') ||
      LICDN_PATTERN.test(img.getAttribute('data-delayed-url') || '') ||
      LICDN_PATTERN.test(img.getAttribute('data-ghost-url') || '') ||
      LICDN_PATTERN.test(img.getAttribute('data-src') || '') ||
      img.classList.contains('ghost-person')
  );
}

function replaceWithPlaceholder(img) {
  if (img.__liBlocked) return;
  img.__liBlocked = true;

  img.setAttribute('src', PLACEHOLDER_DATA_URL);
  img.removeAttribute('data-delayed-url');
  img.removeAttribute('data-ghost-url');
  img.removeAttribute('data-src');
  img.removeAttribute('srcset');

  // Ensure visibility (override any CSS hiding)
  img.style.removeProperty('visibility');
  img.style.removeProperty('opacity');
  img.style.setProperty('display', 'block', 'important');

  // Intercept LinkedIn JS trying to re-set src back to CDN
  const descriptor = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
  if (descriptor) {
    Object.defineProperty(img, 'src', {
      get: () => PLACEHOLDER_DATA_URL,
      set: (val) => {
        if (LICDN_PATTERN.test(val)) return; // silently drop CDN urls
        descriptor.set.call(img, val);
      },
      configurable: true,
    });
  }
}

function blockBackgroundImages(el) {
  const style = el.getAttribute('style') || '';
  if (LICDN_PATTERN.test(style)) {
    el.style.setProperty('background-image', 'none', 'important');
    el.style.setProperty('background-color', '#d6d6d6', 'important');
  }
}

function processNode(root) {
  if (!root || root.nodeType !== 1) return;

  const imgs = root.tagName === 'IMG'
    ? [root]
    : Array.from(root.querySelectorAll('img'));

  for (const img of imgs) {
    if (isLinkedInImage(img)) replaceWithPlaceholder(img);
  }

  const bgEls = root.querySelectorAll
    ? root.querySelectorAll('[style*="licdn.com"]')
    : [];
  for (const el of bgEls) blockBackgroundImages(el);

  const svgImages = root.querySelectorAll ? root.querySelectorAll('svg image[href*="licdn.com"], svg image[xlink\\:href*="licdn.com"]') : [];
  for (const el of svgImages) {
    el.removeAttribute('href');
    el.removeAttribute('xlink:href');
  }
}

// Run on initial DOM
processNode(document.documentElement);

// Watch for dynamic changes (SPA nav, lazy load, infinite scroll)
const observer = new MutationObserver((mutations) => {
  for (const mut of mutations) {
    if (mut.type === 'childList') {
      for (const node of mut.addedNodes) processNode(node);
    } else if (mut.type === 'attributes') {
      const el = mut.target;
      if (el.tagName === 'IMG' && isLinkedInImage(el)) replaceWithPlaceholder(el);
      if (el.tagName !== 'IMG') blockBackgroundImages(el);
    }
  }
});

observer.observe(document.documentElement, {
  childList: true,
  subtree: true,
  attributes: true,
  attributeFilter: WATCHED_ATTRS,
});

// ── Hide promoted feed items ──────────────────────────────────────────────────
function hidePromotedPosts(root) {
  const els = root.querySelectorAll ? root.querySelectorAll('p, span') : [];
  for (const el of els) {
    if (el.textContent.trim().startsWith('Promoted')) {
      const listItem = el.closest('[role="listitem"]');
      if (listItem) listItem.style.setProperty('display', 'none', 'important');
    }
  }
}

hidePromotedPosts(document.documentElement);

const promoObserver = new MutationObserver((mutations) => {
  for (const mut of mutations) {
    for (const node of mut.addedNodes) {
      if (node.nodeType === 1) hidePromotedPosts(node);
    }
  }
});

promoObserver.observe(document.documentElement, { childList: true, subtree: true });


// ── Remove feed videos ───────────────────────────────────────────────────────
function removeVideos(root) {
  const videos = root.querySelectorAll ? root.querySelectorAll('video') : [];
  for (const v of videos) {
    v.pause();
    v.src = '';
    v.load();
  }
}

removeVideos(document.documentElement);

const videoObserver = new MutationObserver((mutations) => {
  for (const mut of mutations) {
    for (const node of mut.addedNodes) {
      if (node.nodeType === 1) removeVideos(node);
    }
  }
});

videoObserver.observe(document.documentElement, { childList: true, subtree: true });

// ── Block video playback via event interception ───────────────────────────────
document.addEventListener('play', (e) => {
  if (e.target.tagName === 'VIDEO') {
    e.target.pause();
    e.target.src = '';
    e.target.load();
  }
}, true);