/**
 * LinkedIn Image Blocker – content.js
 *
 * Strategy: replace src with a placeholder SVG data URL.
 * Single unified debounced MutationObserver to avoid scroll errors.
 */

// ── Allowlist config — add paths here to disable all blocking ────────────────
const ALLOWED_PATHS = [
  '/learning',
  '/company/',
  '/notifications/'
];

const ALLOWED_PROFILES = [
  '/in/yangshun/',
  '/in/gergelyorosz/',
  '/in/andrenader/',
  '/in/annie-murray-a42701143/',
  '/in/austenmc/',
  '/in/addyosmani/',
  '/in/prashant-yadav-lb/',
  '/in/akshaymarch7/'
];
function isAllowedPage() {
  const path = window.location.pathname.replace(/\/$/, '') + '/'; // normalize: always trailing slash
  if (ALLOWED_PATHS.some(p => path.startsWith(p))) return true;
  if (ALLOWED_PROFILES.some(p => path.startsWith(p))) return true;
  return false;
}

// ── Constants ─────────────────────────────────────────────────────────────────
const LICDN_PATTERN = /licdn\.com\/(dms|media)/i;

const PLACEHOLDER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#d6d6d6"/><circle cx="50" cy="38" r="17" fill="#a0a0a0"/><ellipse cx="50" cy="85" rx="28" ry="20" fill="#a0a0a0"/></svg>`;

const PLACEHOLDER_DATA_URL =
    'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(PLACEHOLDER_SVG);

const WATCHED_ATTRS = ['src', 'data-delayed-url', 'data-ghost-url', 'data-src', 'style'];

// ── Core functions ────────────────────────────────────────────────────────────
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

  img.style.removeProperty('visibility');
  img.style.removeProperty('opacity');
  img.style.setProperty('display', 'block', 'important');
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

  const bgEls = root.querySelectorAll ? root.querySelectorAll('[style*="licdn.com"]') : [];
  for (const el of bgEls) blockBackgroundImages(el);

  const svgImages = root.querySelectorAll
      ? root.querySelectorAll('svg image[href*="licdn.com"], svg image[xlink\\:href*="licdn.com"]')
      : [];
  for (const el of svgImages) {
    el.removeAttribute('href');
    el.removeAttribute('xlink:href');
  }
}

function hidePromotedPosts(root) {
  const els = root.querySelectorAll ? root.querySelectorAll('p, span') : [];
  for (const el of els) {
    if (el.textContent.trim().startsWith('Promoted')) {
      const listItem = el.closest('[role="listitem"]');
      if (listItem) listItem.style.setProperty('display', 'none', 'important');
    }
  }
}

function removeVideos(root) {
  const videos = root.querySelectorAll ? root.querySelectorAll('video') : [];
  for (const v of videos) {
    v.pause();
    v.src = '';
    v.load();
  }
}

function removeAdIframes(root) {
  const sections = root.querySelectorAll
      ? root.querySelectorAll('section.ad-banner-container')
      : [];
  for (const el of sections) el.style.setProperty('display', 'none', 'important');

  const footers = root.querySelectorAll
      ? root.querySelectorAll('footer:not([role="presentation"]):not(.msg-form__footer)')
      : [];
  for (const el of footers) el.remove();
}

function observeLazyImages(root) {
  const imgs = root.querySelectorAll ? root.querySelectorAll('img.lazy-image') : [];
  for (const img of imgs) intersectionObserver.observe(img);
}

// ── IntersectionObserver for lazy images ─────────────────────────────────────
const intersectionObserver = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      const img = entry.target;
      if (isLinkedInImage(img)) replaceWithPlaceholder(img);
    }
  }
});

// ── Block video playback ──────────────────────────────────────────────────────
document.addEventListener('play', (e) => {
  if (window.location.pathname.startsWith('/learning')) return;
  if (e.target.tagName === 'VIDEO') {
    e.target.pause();
    e.target.src = '';
    e.target.load();
  }
}, true);

// ── Unified observer ──────────────────────────────────────────────────────────
let debounceTimer;

const unifiedObserver = new MutationObserver((mutations) => {
  // Process newly added nodes immediately — images load from cache in <50ms
  for (const mut of mutations) {
    if (mut.type === 'childList') {
      for (const node of mut.addedNodes) {
        if (node.nodeType !== 1) continue;
        processNode(node);
        removeVideos(node);
        removeAdIframes(node);
      }
    }
  }

  // Debounce attribute changes and promoted-post scanning (heavier work)
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    for (const mut of mutations) {
      if (mut.type === 'childList') {
        for (const node of mut.addedNodes) {
          if (node.nodeType !== 1) continue;
          observeLazyImages(node);
          hidePromotedPosts(node);
        }
      } else if (mut.type === 'attributes') {
        const el = mut.target;
        if (el.tagName === 'IMG' && isLinkedInImage(el)) {
          el.__liBlocked = false;
          replaceWithPlaceholder(el);
        }
        if (el.tagName !== 'IMG') blockBackgroundImages(el);
      }
    }
  }, 50);
});

// ── Start blocking or skip if allowed page ────────────────────────────────────
function startBlocking() {
  processNode(document.documentElement);
  hidePromotedPosts(document.documentElement);
  removeVideos(document.documentElement);
  removeAdIframes(document.documentElement);
  observeLazyImages(document.documentElement);

  unifiedObserver.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: WATCHED_ATTRS,
  });
}

if (!isAllowedPage()) {
  startBlocking();
}

// ── SPA navigation — reload on boundary cross ─────────────────────────────────
let lastPath = window.location.pathname;
let sessionAllowed = isAllowedPage(); // tracks if current "session" started from an allowed page

function normalizePath(path) {
  return path.replace(/\/$/, '') + '/';
}

function isEffectivelyAllowed(path) {
  const p = normalizePath(path);
  if (ALLOWED_PATHS.some(a => p.startsWith(a))) return true;
  if (ALLOWED_PROFILES.some(a => p.startsWith(a))) return true;
  if (sessionAllowed && p.startsWith('/feed/update/')) return true;
  return false;
}

setInterval(() => {
  const currentPath = window.location.pathname;
  if (currentPath !== lastPath) {
    const wasAllowed = isEffectivelyAllowed(lastPath);
    lastPath = currentPath;

    // Update session context — once you leave allowed territory (not via feed/update), reset
    if (!normalizePath(currentPath).startsWith('/feed/update/')) {
      const np = normalizePath(currentPath);
      sessionAllowed = ALLOWED_PATHS.some(p => np.startsWith(p)) ||
          ALLOWED_PROFILES.some(p => np.startsWith(p));
    }

    const isNowAllowed = isEffectivelyAllowed(currentPath);

    if (wasAllowed && !isNowAllowed) {
      startBlocking();
    } else if (!wasAllowed && isNowAllowed) {
      unifiedObserver.disconnect();
      window.location.reload();
    }
  }
}, 500);