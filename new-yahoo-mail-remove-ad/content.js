function injectStyles() {
    if (document.getElementById('yhoo-style-fix')) return;
    const style = document.createElement('style');
    style.id = 'yhoo-style-fix';
    style.textContent = `
    /* little more dark fonts for subject and email of unread messages */ 
    li:has([id^="unread-message-status"]) * {
      font-weight: 900 !important;
    }

    /* add 15px margin on right of middle main mail content container */
    [data-test-id="novation-main-content"] {
      margin-right: 15px !important;
    }

    /* remove ad section */
    [data-test-id="novation-right-rail"] {
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