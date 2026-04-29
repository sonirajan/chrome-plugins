function injectStyles() {
    if (document.getElementById('yhoo-style-fix')) return;
    const style = document.createElement('style');
    style.id = 'yhoo-style-fix';
    style.textContent = `
    /* little more dark fonts for subject and email of unread messages */
    #Atom .u_elT {
      font-weight: 900;
    }

    /* add 15px margin on right of middle main mail content container */
    [data-test-id="novation-main-content"] {
      margin-right: 15px !important;
    }

    /* remove ad section */
    section.fo_Z1Gyd3M.b_n.P_1AjgO4.Y_2vDXFj.c2a1BVy_F.cYeoTE_BB.cYeoRt_FT.c2a1BW5_0.o_h.D_F.ek_BB.ab_FT[data-test-id] {
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