document.addEventListener("DOMContentLoaded", () => {
  const backdrop = document.getElementById("viewer-backdrop");
  const modal = document.getElementById("viewer-modal");
  const closeBtn = document.getElementById("viewer-close");
  const viewerImg = document.getElementById("viewer-img");
  const viewerMeta = document.getElementById("viewer-meta");
  const viewerDesc = document.getElementById("viewer-desc");

  // Open viewer
  window.openViewer = (img) => {
    viewerImg.src = img.src;
    viewerImg.alt = `Artwork by ${img.artist}`;

    // Meta info
    let metaHTML = "";
    if (img.artist && img.artist !== "unknown" && img.artist !== "-") {
      if (img.link) {
        metaHTML = `By <a href="${img.link}" target="_blank" rel="noopener">${img.artist}</a>`;
      } else {
        metaHTML = `By ${img.artist}`;
      }

      if (img.date) {
        metaHTML += ` • ${img.date}`;
      }

      viewerMeta.innerHTML = metaHTML;
      viewerMeta.hidden = false;
    } else {
      viewerMeta.hidden = true;
    }

    // Description
    if (img.desc) {
      viewerDesc.innerHTML = img.desc;
      viewerDesc.hidden = false;
    } else {
      viewerDesc.hidden = true;
    }

    backdrop.hidden = false;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
  };

  // Close viewer
  const closeViewer = () => {
    backdrop.hidden = true;
    modal.hidden = true;
    document.body.style.overflow = "";
  };

  closeBtn.addEventListener("click", closeViewer);
  backdrop.addEventListener("click", closeViewer);
});