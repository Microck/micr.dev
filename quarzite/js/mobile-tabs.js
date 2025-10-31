// Tabs + audio unlock + SFX wrapper
(function () {
  // Simple SFX fallback via WebAudio if desktop Sounds isn't present
  let ctx = null;
  function ensureCtx() {
    if (ctx) return ctx;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    ctx = new Ctx();
    return ctx;
  }
  function unlockAudio() {
    const c = ensureCtx();
    if (!c) return;
    if (c.state === "suspended") c.resume();
  }
  function beep(freq = 880, dur = 0.04) {
    const c = ensureCtx();
    if (!c) return;
    const t0 = c.currentTime + 0.001;
    const t1 = t0 + dur;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = "square";
    o.frequency.value = freq;
    g.gain.setValueAtTime(0.03, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t1);
    o.connect(g).connect(c.destination);
    o.start(t0);
    o.stop(t1 + 0.01);
  }
  function sfx(name) {
    try {
      if (window.Sounds && typeof window.Sounds.play === "function") {
        window.Sounds.play(name);
        return;
      }
    } catch (_) {}
    // Fallback tones (subtle)
    if (name === "click") beep(1200, 0.035);
    else if (name === "open") beep(900, 0.05);
    else if (name === "close") beep(700, 0.05);
  }

  // Unlock on first interaction (mobile requirement)
  const unlockOnce = () => {
    unlockAudio();
    try {
      if (window.Sounds && typeof window.Sounds.play === "function") {
        window.Sounds.play("click");
      }
    } catch (_) {}
    window.removeEventListener("pointerdown", unlockOnce, { capture: true });
    window.removeEventListener("touchstart", unlockOnce, { capture: true });
    window.removeEventListener("mousedown", unlockOnce, { capture: true });
  };
  window.addEventListener("pointerdown", unlockOnce, { capture: true });
  window.addEventListener("touchstart", unlockOnce, { capture: true });
  window.addEventListener("mousedown", unlockOnce, { capture: true });

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