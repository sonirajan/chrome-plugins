function injectStyles() {
    if (document.getElementById('yhoo-style-fix')) return;
    const style = document.createElement('style');
    style.id = 'yhoo-style-fix';
    style.textContent = `
    /* little more dark fonts for subject and email of unread messages */ 
    li:has([id^="unread-message-status"]) * {
      font-weight: 900 !important;
      font-size: 16px !important;
    }
    
    li[id^="email-snippet"]:has([id^="unread-message-status"]) * {
      font-weight: 900 !important;
      font-size: 16px !important;
    }

    /* add 15px margin on right of middle main mail content container */
    [data-test-id="novation-main-content"] {
      margin-right: 15px !important;
    }

    /* remove ad section on right of mail */
    [data-test-id="novation-right-rail"] {
      display: none !important;
    }
    
    /* remove ad section on bottom of mail after deleting spam */
    [data-test-id="leaderboard-ad"] {
      display: none !important;
    }
    
    /* removed top bar button that convert to premium user */
    [id="ybar-inserted-content"] {
      display: none !important;
    }
        
    /* hide scrollbar but keep scrolling for left panel with icon only view */
    [data-test-id="novation-left-rail"] {
      scrollbar-width: none !important;
    }
    [data-test-id="novation-left-rail"]::-webkit-scrollbar {
      display: none !important;
    }
    
    /* hide scrollbar but keep scrolling for left panel with icon and name view */
    [data-test-id="navigable-list"] {
      scrollbar-width: none !important;
    }
    [data-test-id="navigable-list"]::-webkit-scrollbar {
      display: none !important;
    }
    
    /* hide cards (mails arrival) at top of multi mail box view (Search view) */
    ul[aria-label="List of SRP-cards search result"] {
      display: none !important;
    }
    
    /* hide Yahoo Home button on top right */
    a[aria-label="Yahoo Home"] {
      display: none !important;
    }
  `;
    document.head.appendChild(style);
}

// Extends middle mail section to fill the empty space left by the removed ad column
function fixLayout() {
    const el = document.getElementById('mail-app-component-container');
    if (el) {
        el.style.setProperty('grid-template-columns', 'min-content minmax(640px, 1fr)', 'important');
    }
}

// Clicking yahoo logo will redirect to both mailbox view
// Note - here accountIds are private to me, but anyone can change url with their mailbox accountIds
function fixYahooLogoLink() {
    const logo = document.getElementById('ybar-logo');
    if (logo) {
        logo.href = 'https://mail.yahoo.com/n/search/accountIds=1&accountIds=40001';
    }
}

// first time opening yahoo mail will redirect to both mailbox view
function redirectToInbox() {
    if (window.location.href.includes('/n/folders/1') && !sessionStorage.getItem('yhoo-redirected')) {
        sessionStorage.setItem('yhoo-redirected', 'true');
        window.location.replace('https://mail.yahoo.com/n/search/accountIds=1&accountIds=40001');
    }
}
let lastUrl = location.href;
redirectToInbox();

// hides inline advertisements in list of emails
function hideInlineAdsInList() {
    document.querySelectorAll('[data-test-id="virtual-list"] ul li').forEach(li => {
        if (li.querySelector('a[href*="taboola.com"]')) {
            const inner = li.querySelector('div');
            if (inner) inner.style.setProperty('display', 'none', 'important');
        }
    });
}

fixYahooLogoLink();
injectStyles();
fixLayout();
hideInlineAdsInList();

new MutationObserver(() => {
    if (location.href !== lastUrl) {
        lastUrl = location.href;
        redirectToInbox();
    }
    injectStyles();
    fixLayout();
    fixYahooLogoLink();
    hideInlineAdsInList();
}).observe(document.body, {
    childList: true,
    subtree: true,
});