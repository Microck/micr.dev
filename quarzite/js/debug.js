// js/debug.js
// Debug mode: resize grips + coordinate labels + Copy CSS
(function () {
  const grips = ["nw", "n", "ne", "e", "se", "s", "sw", "w"];
  let enabled = false;

  function px(n) {
    return Math.round(Number.parseFloat(n || "0"));
  }

  function getStyles(el) {
    const r = el.getBoundingClientRect();
    const c = document.getElementById("desktop").getBoundingClientRect();
    return {
      left: px(r.left - c.left),
      top: px(r.top - c.top),
      width: px(r.width),
      height: px(r.height),
    };
  }

  function updateLabel(el) {
    const lbl = el.querySelector(".dbg-label");
    if (!lbl) return;
    const s = getStyles(el);
    lbl.textContent = `L:${s.left} T:${s.top} W:${s.width} H:${s.height}`;
  }

  function addGrips(el) {
    if (!el) return;
    if (el.querySelector(".dbg-label")) return; // already added

    const label = document.createElement("div");
    label.className = "dbg-label";
    el.appendChild(label);
    updateLabel(el);

    grips.forEach((dir) => {
      const g = document.createElement("div");
      g.className = `dbg-grip dbg-${dir}`;
      g.dataset.dir = dir;
      g.addEventListener("mousedown", startResize);
      el.appendChild(g);
    });

    el.addEventListener("mousemove", () => updateLabel(el));
    el.addEventListener("mouseup", () => updateLabel(el));
  }

  function removeGrips(el) {
    if (!el) return;
    el.querySelectorAll(".dbg-grip,.dbg-label").forEach((n) => n.remove());
  }

  function startResize(e) {
    e.preventDefault();
    e.stopPropagation();

    const el = e.currentTarget.parentElement;
    const dir = e.currentTarget.dataset.dir;
    const s0 = getStyles(el);
    const x0 = e.clientX;
    const y0 = e.clientY;

    function onMove(ev) {
      let dx = ev.clientX - x0;
      let dy = ev.clientY - y0;

      let left = s0.left;
      let top = s0.top;
      let width = s0.width;
      let height = s0.height;

      if (dir.includes("e")) width = s0.width + dx;
      if (dir.includes("s")) height = s0.height + dy;
      if (dir.includes("w")) {
        width = s0.width - dx;
        left = s0.left + dx;
      }
      if (dir.includes("n")) {
        height = s0.height - dy;
        top = s0.top + dy;
      }

      width = Math.max(20, width);
      height = Math.max(20, height);

      el.style.left = left + "px";
      el.style.top = top + "px";
      el.style.width = width + "px";
      el.style.height = height + "px";

      updateLabel(el);
    }

    function onUp() {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);

      // persist logo layout for current filename if applicable
      if (el.classList && el.classList.contains("logo")) {
        const img = document.getElementById("logo-img");
        if (img && img.src) {
          const name = img.src.split("/").pop();
          const layout = getStyles(el);
          try {
            const map = JSON.parse(localStorage.getItem("quarziteLogoLayouts") || "{}");
            map[name] = layout;
            localStorage.setItem("quarziteLogoLayouts", JSON.stringify(map));
          } catch (err) {
            console.warn("Failed to save logo layout", err);
          }
        }
      }
    }

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }

  function collectLayout() {
    const wins = Array.from(document.querySelectorAll(".app-window"));
    const out = {};
    wins.forEach((w) => (out[w.id] = getStyles(w)));
    const logo = document.querySelector(".logo");
    if (logo) out.logo = getStyles(logo);
    return out;
  }

  function toCssVars(layout) {
    let css = ":root {\n";
    Object.entries(layout).forEach(([id, s]) => {
      const p = id.replace(/^win-/, "");
      css += `  --${p}-left: ${s.left}px;\n`;
      css += `  --${p}-top: ${s.top}px;\n`;
      css += `  --${p}-width: ${s.width}px;\n`;
      css += `  --${p}-height: ${s.height}px;\n`;
    });
    css += "}\n";
    return css;
  }

  async function copyLayout() {
    const css = toCssVars(collectLayout());
    try {
      await navigator.clipboard.writeText(css);
      alert("Layout copied to clipboard.\nPaste into css/main.css :root");
    } catch {
      console.log(css);
      alert("Copy failed. Check console for CSS output.");
    }
  }

  function enable() {
    if (enabled) return;
    enabled = true;
    document.body.classList.add("debug-mode");
    document.querySelectorAll(".app-window").forEach(addGrips);

    // Enable logo interaction & grips
    const logo = document.querySelector(".logo");
    if (logo) {
      // allow pointer events on the logo container so grips and dragging work
      logo.style.pointerEvents = "auto";
      logo.classList.add("resizing");
      addGrips(logo);

      // make logo draggable (use container as handle)
      if (!logo.dataset.debugDraggable) {
        const desktop = document.getElementById("desktop");
        try {
          AppDrag.makeDraggable(logo, logo, desktop);
          logo.dataset.debugDraggable = "1";
        } catch (e) {
          // AppDrag not available — ignore
        }
      }

      // ensure logo-img fills container during debug so resize is visible
      const logoImg = logo.querySelector(".logo-img");
      if (logoImg && !logoImg.dataset._origWidth) {
        logoImg.dataset._origWidth = logoImg.style.width || "";
        logoImg.dataset._origHeight = logoImg.style.height || "";
        logoImg.dataset._origObjectFit = logoImg.style.objectFit || "";
        logoImg.style.width = "100%";
        logoImg.style.height = "100%";
        logoImg.style.objectFit = "contain";
      }
    }
  }

  function disable() {
    if (!enabled) return;
    enabled = false;
    document.body.classList.remove("debug-mode");
    document.querySelectorAll(".app-window").forEach(removeGrips);

    const logo = document.querySelector(".logo");
    if (logo) {
      removeGrips(logo);
      // prevent accidental interaction when not in debug mode
      logo.style.pointerEvents = "none";
      logo.classList.remove("resizing");

      // restore logo-img original sizing
      const logoImg = logo.querySelector(".logo-img");
      if (logoImg) {
        logoImg.style.width = logoImg.dataset._origWidth || "";
        logoImg.style.height = logoImg.dataset._origHeight || "";
        logoImg.style.objectFit = logoImg.dataset._origObjectFit || "";
        delete logoImg.dataset._origWidth;
        delete logoImg.dataset._origHeight;
        delete logoImg.dataset._origObjectFit;
      }
    }
  }

  function toggle() {
    enabled ? disable() : enable();
  }

  document.addEventListener("DOMContentLoaded", () => {
    const dbgToggle = document.getElementById("debug-toggle");
    if (dbgToggle) dbgToggle.addEventListener("click", toggle);
    const copyCssBtn = document.getElementById("copy-css");
    if (copyCssBtn) copyCssBtn.addEventListener("click", copyLayout);
  });

  window.Win98Debug = { enable, disable, toggle };
})();