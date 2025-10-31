// Top-level tabs + inner info tabs, with safe sound triggers
(function () {
  function sfx(name) {
    try {
      // Attempt to use existing site sound system if present
      if (window.Sounds && typeof window.Sounds.play === "function") {
        window.Sounds.play(name);
      } else if (
        window.SFX &&
        typeof window.SFX.play === "function" /* optional */
      ) {
        window.SFX.play(name);
      }
    } catch (_) {
      /* no-op */
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    // Main tabs
    const tabBtns = document.querySelectorAll(".tab-btn");
    const tabContents = document.querySelectorAll(".tab-content");

    tabBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.tab;

        tabBtns.forEach((b) => {
          const active = b === btn;
          b.classList.toggle("active", active);
          b.setAttribute("aria-selected", String(active));
        });

        tabContents.forEach((pane) => {
          pane.classList.toggle("active", pane.id === `tab-${id}`);
        });

        sfx("click");
      });
    });

    // Info inner tabs (same markup as PC)
    const infoTabs = document.querySelectorAll('.info-tabs [role="tab"]');
    const infoPanels = document.querySelectorAll(
      '.info-tabs [role="tabpanel"]'
    );

    infoTabs.forEach((tab) => {
      tab.addEventListener("click", (e) => {
        e.preventDefault();
        const target = tab.querySelector("a");
        if (!target) return;

        const id = target.getAttribute("href").slice(1);

        infoTabs.forEach((t) => t.setAttribute("aria-selected", "false"));
        tab.setAttribute("aria-selected", "true");

        infoPanels.forEach((panel) => {
          panel.hidden = panel.id !== id;
        });

        sfx("click");
      });
    });
  });
})();