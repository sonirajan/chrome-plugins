function injectStyles() {
    if (document.getElementById('yhoo-style-fix')) return;
    const style = document.createElement('style');
    style.id = 'yhoo-style-fix';
    style.textContent = `
    /* little more dark fonts for subject and email of unread messages */ 
    li:has([id^="unread-message-status"]) * {
      font-weight: 900 !important;
      font-size: 16px;
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

injectStyles();
fixLayout();

new MutationObserver(() => {
    injectStyles();
    fixLayout();
}).observe(document.body, {
    childList: true,
    subtree: true,
});