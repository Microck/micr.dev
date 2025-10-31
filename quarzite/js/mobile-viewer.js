// 98.css viewer modal with meta + desc + W98 sounds and author title
(function () {
  function sfx() {
    try {
      if (window.W98 && typeof window.W98.play === "function") {
        window.W98.play("click");
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
    const viewerTitle = document.getElementById("viewer-title");

    function openViewer(payload) {
      if (!payload) return;

      const artist = (payload.artist || "").trim();
      const url = (payload.link || "").trim();
      const date = (payload.date || "").trim();

      viewerImg.src = payload.src || "";
      viewerImg.alt = artist ? `Artwork by ${artist}` : "Artwork";

      // Title: show author's name (fallback to default)
      viewerTitle.textContent = artist || "Image Viewer";

      // Meta
      const parts = [];
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
      sfx();
    }

    window.openViewer = openViewer;

    closeBtn.addEventListener("click", closeViewer);
    backdrop.addEventListener("click", closeViewer);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !modal.hidden) closeViewer();
    });
  });
})();