(() => {
  const OPT_OUT_KEY = "resWarn:optOut";
  const TARGET = { w: 1920, h: 1080 };
  // ±50 px for both width and height
  const TOLERANCE = { w: 50, h: 50 };
  // Initial load only (no resize re-check)
  const USE_RESIZE_RECHECK = false;

  const storage = {
    get(key) {
      try {
        return localStorage.getItem(key);
      } catch (_) {
        return null;
      }
    },
    set(key, val) {
      try {
        localStorage.setItem(key, val);
      } catch (_) {
        /* ignore */
      }
    },
  };

  function isCompatible() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const wOk = Math.abs(w - TARGET.w) <= TOLERANCE.w;
    const hOk = Math.abs(h - TARGET.h) <= TOLERANCE.h;
    return wOk && hOk;
  }

  function updateCurrent() {
    const el = document.getElementById("res-current");
    if (!el) return;
    el.textContent = `${window.innerWidth}×${window.innerHeight}`;
  }

  function show() {
    const backdrop = document.getElementById("res-warning-backdrop");
    const modal = document.getElementById("res-warning");
    if (!backdrop || !modal) return;

    updateCurrent();
    backdrop.hidden = false;
    modal.hidden = false;

    const ok = document.getElementById("res-accept");
    if (ok) ok.focus();
  }

  function hide() {
    const backdrop = document.getElementById("res-warning-backdrop");
    const modal = document.getElementById("res-warning");
    if (!backdrop || !modal) return;

    backdrop.hidden = true;
    modal.hidden = true;
  }

  function accept() {
    const cb = document.getElementById("res-dont-remind");
    if (cb && cb.checked) {
      storage.set(OPT_OUT_KEY, "1");
    }
    hide();
  }

  function wire() {
    const ok = document.getElementById("res-accept");
    if (ok) ok.addEventListener("click", accept);

    const closeBtn = document.querySelector(
      '#res-warning .title-bar-controls button[aria-label="Close"]'
    );
    if (closeBtn) closeBtn.addEventListener("click", accept);

    document.addEventListener("keydown", (e) => {
      const modal = document.getElementById("res-warning");
      if (!modal || modal.hidden) return;
      if (e.key === "Escape" || e.key === "Enter") accept();
    });

    if (USE_RESIZE_RECHECK) {
      window.addEventListener("resize", () => {
        updateCurrent();
        if (
          storage.get(OPT_OUT_KEY) !== "1" &&
          !isCompatible() &&
          document.getElementById("res-warning").hidden
        ) {
          show();
        }
      });
    }
  }

  function maybeShowOnStart() {
    if (storage.get(OPT_OUT_KEY) === "1") return;
    if (!isCompatible()) show();
  }

  document.addEventListener("DOMContentLoaded", () => {
    wire();
    maybeShowOnStart();
  });
})();