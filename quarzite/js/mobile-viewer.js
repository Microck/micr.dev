// 98.css viewer modal with meta + desc, uses site sounds if present
(function () {
  function sfx(name) {
    try {
      if (window.Sounds && typeof window.Sounds.play === "function") {
        window.Sounds.play(name);
      }
    } catch (_) {}
  }

  document.addEventListener("DOMContentLoaded", () => {
    const backdrop = document.getElementById("viewer-backdrop");
    const modal = document.getElementById("viewer-modal");
    const closeBtn = document.getElementById("viewer-close");
    const viewerImg = document.getElementById("viewer-img");
    const viewerMeta = document.getElementById("viewer-meta");
    const viewerDesc = document.getElementById("viewer-desc");

    function openViewer(payload) {
      if (!payload) return;

      viewerImg.src = payload.src || "";
      viewerImg.alt = payload.artist
        ? `Artwork by ${payload.artist}`
        : "Artwork";

      // Meta: "By [link/name] • YYYY-MM-DD"
      const parts = [];
      const artist = (payload.artist || "").trim();
      const url = (payload.link || "").trim();
      const date = (payload.date || "").trim();

      if (artist && artist !== "unknown" && artist !== "-") {
        if (url) {
          parts.push(
            `By <a href="${url}" target="_blank" rel="noopener noreferrer">${artist}</a>`
          );
        } else {
          parts.push(`By ${artist}`);
        }
      }
      if (date) parts.push(date);

      if (parts.length) {
        viewerMeta.innerHTML = parts.join(" • ");
        viewerMeta.hidden = false;
      } else {
        viewerMeta.hidden = true;
      }

      if (payload.desc) {
        // Keep author-provided HTML (e.g., links/strikethrough)
        viewerDesc.innerHTML = payload.desc;
        viewerDesc.hidden = false;
      } else {
        viewerDesc.hidden = true;
      }

      backdrop.hidden = false;
      modal.hidden = false;
      document.body.style.overflow = "hidden";
    }

    function closeViewer() {
      backdrop.hidden = true;
      modal.hidden = true;
      document.body.style.overflow = "";
      sfx("close");
    }

    // Expose open function
    window.openViewer = openViewer;

    // UI events
    closeBtn.addEventListener("click", closeViewer);
    backdrop.addEventListener("click", closeViewer);

    // Escape to close
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !modal.hidden) {
        closeViewer();
      }
    });
  });
})();