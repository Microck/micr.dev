(() => {
  const OPT_OUT_KEY = "resWarn:optOut";
  const TARGET_W = 1920;
  const TOLERANCE_W = 50; // width-only tolerance
  const USE_RESIZE_RECHECK = false; // initial load only

  const storage = {
    get(key) {
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    set(key, val) {
      try {
        localStorage.setItem(key, val);
      } catch {
        /* ignore */
      }
    },
  };

  function isCompatible() {
    const w = window.innerWidth;
    return Math.abs(w - TARGET_W) <= TOLERANCE_W;
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

    const msg = document.getElementById("res-warning-message");
    if (msg) {
      msg.textContent =
        "Non-optimized width detected. For the best experience, set your " +
        "browser zoom to around 50–80% or use a 1920 px-wide window/display.";
    }

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
      localStorage.setItem(OPT_OUT_KEY, "1");
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
          localStorage.getItem(OPT_OUT_KEY) !== "1" &&
          !isCompatible() &&
          document.getElementById("res-warning").hidden
        ) {
          show();
        }
      });
    }
  }

  function maybeShowOnStart() {
    if (localStorage.getItem(OPT_OUT_KEY) === "1") return;

    // Skip if the site already redirected to mobile.
    const isMobile =
      /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    if (isMobile) return;

    if (!isCompatible()) show();
  }

  document.addEventListener("DOMContentLoaded", () => {
    wire();
    maybeShowOnStart();
  });
})();