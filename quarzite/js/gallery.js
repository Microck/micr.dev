// Gallery: load images and open viewer window with metadata
// - Sorts newest → oldest
// - Popup title updates only the .title-label (preserves icon)
// - Date formatted in English
// - Opens at L:1017, T:107
// - Window width locks to the IMAGE width (not text), capped to viewport
// - Text wraps inside the window; description can contain HTML
(function () {
  let images = [];
  let strip;
  let viewer;
  let viewerImg;
  let viewerMeta;
  let viewerDesc;

  const px = (v) => Math.max(0, parseFloat(v || 0));

  function normalize(item) {
    if (typeof item === "string") return { src: item };
    return item || {};
  }

  function formatDate(value) {
    if (!value) return null;
    const d = new Date(value);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
    return value; // already formatted
  }

  function buildSlot(imgObj, i) {
    const slot = document.createElement("div");
    slot.className = "slot";
    slot.dataset.index = String(i);

    const img = document.createElement("img");
    img.loading = "lazy";
    img.src = imgObj.src;
    img.alt = imgObj.title || `Image ${i + 1}`;
    slot.appendChild(img);

    return slot;
  }

  function bringToFront(win) {
    const wins = Array.from(document.querySelectorAll(".app-window"));
    const top = wins.reduce((m, w) => {
      const z = parseInt(getComputedStyle(w).zIndex || "0", 10);
      return Math.max(m, isNaN(z) ? 0 : z);
    }, 0);
    win.style.zIndex = String(top + 1);
  }

  // Ensure title-bar has <img.title-icon> and <span.title-label>
  function ensureTitleStructure(win) {
    const tb = win.querySelector(".title-bar-text");
    if (!tb) return;

    // Add icon if missing
    if (!tb.querySelector(".title-icon")) {
      const img = document.createElement("img");
      img.className = "title-icon";
      img.alt = "";
      img.src = "assets/icons/favicon-96x96.png"; // gallery popup icon
      tb.prepend(img);
    }

    // Ensure a span.title-label exists and contains the text
    if (!tb.querySelector(".title-label")) {
      const label = document.createElement("span");
      label.className = "title-label";

      // Move non-icon child nodes into label (text nodes / other nodes)
      const nodes = Array.from(tb.childNodes).filter((n) => {
        return !(n.nodeType === 1 && n.classList && n.classList.contains("title-icon"));
      });
      nodes.forEach((n) => label.appendChild(n));
      tb.appendChild(label);
    }
  }

  function ensureViewer() {
    if (viewer) return viewer;

    // Prefer existing DOM element if present (keeps icon from index.html)
    viewer = document.getElementById("win-viewer");
    let created = false;
    if (!viewer) {
      created = true;
      viewer = document.createElement("div");
      viewer.className = "window app-window";
      viewer.id = "win-viewer";
      viewer.setAttribute("data-title", "Viewer");
      viewer.innerHTML = `
      <div class="title-bar">
        <div class="title-bar-text">
          <img src="assets/icons/favicon-96x96.png" class="title-icon" alt="" />
          <span class="title-label">Image Viewer</span>
        </div>
        <div class="title-bar-controls">
          <button aria-label="Minimize"></button>
          <button aria-label="Maximize"></button>
          <button aria-label="Close"></button>
        </div>
      </div>
      <div class="window-body viewer-body">
        <figure class="viewer-figure">
          <img id="viewer-img" alt="" />
        </figure>
        <div class="viewer-meta" id="viewer-meta"></div>
        <div class="viewer-desc" id="viewer-desc" hidden></div>
      </div>
    `;
      const desktop = document.getElementById("desktop");
      desktop.appendChild(viewer);
    }

    // ensure the title structure exists (in case index.html had partial content)
    ensureTitleStructure(viewer);

    // cache elements
    viewerImg = viewer.querySelector("#viewer-img");
    viewerMeta = viewer.querySelector("#viewer-meta");
    viewerDesc = viewer.querySelector("#viewer-desc");

    // Avoid adding listeners twice
    if (!viewer.dataset.galleryInit) {
      const controls = viewer.querySelector(".title-bar-controls");
      const minBtn = controls.querySelector('button[aria-label="Minimize"]');
      const closeBtn = controls.querySelector('button[aria-label="Close"]');
      const maxBtn = controls.querySelector('button[aria-label="Maximize"]');

      const close = () => {
        viewer.hidden = true;
      };

      minBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        close();
      });
      closeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        close();
      });
      maxBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        // no-op for now
      });

      // ESC to close (on focused viewer)
      viewer.addEventListener("keydown", (e) => {
        if (e.key === "Escape") close();
      });

      // Draggable
      AppDrag.makeDraggable(
        viewer,
        viewer.querySelector(".title-bar"),
        document.getElementById("desktop")
      );

      // Raise on focus
      viewer.addEventListener("mousedown", () => bringToFront(viewer));
      viewer.addEventListener("touchstart", () => bringToFront(viewer));

      // Recalculate width on viewport resize if visible
      const onResize = () => {
        if (!viewer.hidden && viewerImg?.naturalWidth) {
          adjustToImageWidth();
        }
      };
      window.addEventListener("resize", onResize);

      viewer.dataset.galleryInit = "1";
    }

    return viewer;
  }

  // Lock window width to the image width (not the text), capped to viewport.
  function adjustToImageWidth() {
    if (!viewer || !viewerImg || !viewerImg.naturalWidth) return;
    const toDesignPx =
      window.AppLayout && typeof window.AppLayout.toDesignPx === "function"
        ? window.AppLayout.toDesignPx
        : (value) => value;

    const wb = viewer.querySelector(".window-body");
    const fig = viewer.querySelector(".viewer-figure");

    // Window border L+R
    const winBorderLR = viewer.offsetWidth - viewer.clientWidth;

    // Paddings/borders that sit left+right of the image
    const csWB = getComputedStyle(wb);
    const bodyLR = px(csWB.paddingLeft) + px(csWB.paddingRight);

    const csFig = getComputedStyle(fig);
    const figLR =
      px(csFig.paddingLeft) +
      px(csFig.paddingRight) +
      px(csFig.borderLeftWidth) +
      px(csFig.borderRightWidth);

    // Total horizontal chrome around the image
    const extras = winBorderLR + bodyLR + figLR;

    // Image natural size
    const imgW = viewerImg.naturalWidth;
    const imgH = Math.max(1, viewerImg.naturalHeight);

    // Caps by viewport: width (90vw) and height (image max-height: 70vh)
    const maxViewerW = Math.floor(toDesignPx(window.innerWidth * 0.9));
    const maxImgWByVW = Math.max(120, maxViewerW - extras);
    const maxImgWByVH = Math.floor(
      toDesignPx(window.innerHeight * 0.7) * (imgW / imgH)
    );

    const targetImgW = Math.max(120, Math.min(imgW, maxImgWByVW, maxImgWByVH));
    const targetViewerW = Math.round(targetImgW + extras);

    viewer.style.width = targetViewerW + "px";
    viewer.style.height = "auto"; // let height adapt to image + text
  }

  function openViewer(imgObj) {
    ensureViewer();

    // set only the title label (preserve icon)
    const titleLabel = viewer.querySelector(".title-label");
    const artistName = imgObj.artist?.name || "Unknown Artist";
    if (titleLabel) titleLabel.textContent = artistName;
    else viewer.querySelector(".title-bar-text").textContent = artistName; // fallback

    // Meta line: "November 29, 2024 - by artist"
    const dateText = formatDate(imgObj.date);
    let metaLine = "";
    if (dateText) metaLine += dateText;
    if (artistName) {
      const artistUrl = imgObj.artist?.url;
      if (artistUrl) {
        metaLine += ` - by <a href="${artistUrl}" target="_blank" rel="noopener noreferrer">${artistName}</a>`;
      } else {
        metaLine += ` - by ${artistName}`;
      }
    }
    viewerMeta.innerHTML = metaLine;

    // Description (allow HTML for links)
    if (imgObj.desc) {
      viewerDesc.innerHTML = imgObj.desc;
      viewerDesc.hidden = false;
    } else {
      viewerDesc.hidden = true;
      viewerDesc.innerHTML = "";
    }

    // Fixed spawn location
    viewer.style.left = "1017px";
    viewer.style.top = "107px";

    // Prepare width adjustment BEFORE setting src (handles cached images)
    const runAdjust = () => requestAnimationFrame(adjustToImageWidth);
    viewerImg.onload = runAdjust;
    viewerImg.onerror = runAdjust;

    // Set image src
    viewerImg.src = imgObj.src || "";

    // If already loaded from cache, adjust immediately
    if (viewerImg.complete && viewerImg.naturalWidth) {
      runAdjust();
    }

    // Show and bring to front
    viewer.hidden = false;
    bringToFront(viewer);

    // Focus for ESC handling
    viewer.tabIndex = -1;
    viewer.focus();
  }

  async function load() {
    strip = document.getElementById("gallery-strip");
    if (!strip) return;

    try {
      const res = await fetch("data/gallery.json", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      // Normalize + sort by date (newest → oldest)
      images = (data.images || [])
        .map(normalize)
        .sort((a, b) => {
          if (!a.date) return 1;
          if (!b.date) return -1;
          return new Date(b.date) - new Date(a.date);
        });

      strip.innerHTML = "";
      images.forEach((imgObj, i) => {
        const slot = buildSlot(imgObj, i);
        strip.appendChild(slot);
      });

      // Click to open viewer
      strip.addEventListener("click", (e) => {
        const slot = e.target.closest(".slot");
        if (!slot) return;
        const idx = Number(slot.dataset.index || "-1");
        if (idx >= 0 && idx < images.length) {
          openViewer(images[idx]);
        }
      });
    } catch (e) {
      console.error("Failed to load gallery.json", e);
    }
  }

  document.addEventListener("DOMContentLoaded", load);

  // Optional export
  window.GalleryViewer = { open: openViewer };
})();
