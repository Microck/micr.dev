// Main tab navigation (Gallery/Info)
document.addEventListener("DOMContentLoaded", () => {
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetTab = btn.dataset.tab;

      // Update buttons
      tabBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // Update content
      tabContents.forEach((content) => {
        if (content.id === `tab-${targetTab}`) {
          content.classList.add("active");
        } else {
          content.classList.remove("active");
        }
      });
    });
  });

  // Info sub-tabs (Intro/Appearance/Personality/Extra)
  const infoTabs = document.querySelectorAll('.info-tabs [role="tab"]');
  const infoPanels = document.querySelectorAll('.info-tabs [role="tabpanel"]');

  infoTabs.forEach((tab) => {
    tab.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = tab.querySelector("a").getAttribute("href").slice(1);

      // Update tabs
      infoTabs.forEach((t) => t.setAttribute("aria-selected", "false"));
      tab.setAttribute("aria-selected", "true");

      // Update panels
      infoPanels.forEach((panel) => {
        if (panel.id === targetId) {
          panel.hidden = false;
        } else {
          panel.hidden = true;
        }
      });
    });
  });
});