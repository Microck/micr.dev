// Top-level tabs + inner info tabs with W98 sounds
(function () {
  function sfx(name) {
    try {
      if (window.W98 && typeof window.W98.play === "function") {
        window.W98.play("click"); // unify to desktop-style click
      }
    } catch (_) {}
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

    // Info inner tabs
    const infoTabs = document.querySelectorAll('.info-tabs [role="tab"]');
    const infoPanels = document.querySelectorAll(
      '.info-tabs [role="tabpanel"]'
    );

    infoTabs.forEach((tab) => {
      tab.addEventListener("click", (e) => {
        e.preventDefault();
        const a = tab.querySelector("a");
        if (!a) return;
        const id = a.getAttribute("href").slice(1);

        infoTabs.forEach((t) => t.setAttribute("aria-selected", "false"));
        tab.setAttribute("aria-selected", "true");

        infoPanels.forEach((p) => (p.hidden = p.id !== id));

        sfx("click");
      });
    });
  });
})();