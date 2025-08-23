// Volume + Animation controls
(function () {
  const STORAGE_KEY = "quarziteVolume";
  const volumeBtn = document.getElementById("volume-toggle");
  const volumeIcon = document.getElementById("volume-icon");
  const volumePopup = document.getElementById("volume-popup");
  const volumeSlider = document.getElementById("volume-slider");

  const animBtn = document.getElementById("anim-toggle");
  const body = document.body;

  // --- Volume ---
  function applyVolume(vol) {
    window.AppVolume = vol;
    localStorage.setItem(STORAGE_KEY, vol);

    if (vol <= 0) {
      volumeIcon.src = "assets/icons/loudspeaker_muted-0.png";
    } else {
      volumeIcon.src = "assets/icons/loudspeaker_rays-0.png";
    }
  }

  function loadVolume() {
    let vol = parseInt(localStorage.getItem(STORAGE_KEY), 10);
    if (isNaN(vol)) vol = 100;
    volumeSlider.value = vol;
    applyVolume(vol);
    return vol;
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (volumeBtn && volumeSlider) {
      loadVolume();

      volumeBtn.addEventListener("click", () => {
        volumePopup.hidden = !volumePopup.hidden;

        if (!volumePopup.hidden) {
          // Align popup vertically with the volume button
          const rect = volumeBtn.getBoundingClientRect();
          const desktopRect = document
            .getElementById("desktop")
            .getBoundingClientRect();

          // Center popup with the button
          const offsetFromBottom =
            desktopRect.bottom -
            (rect.top + rect.height / 2) -
            volumePopup.offsetHeight / 2;

          volumePopup.style.bottom = `${offsetFromBottom}px`;
        }
      });

      volumeSlider.addEventListener("input", () => {
        applyVolume(parseInt(volumeSlider.value, 10));
      });
    }

    // --- Animation toggle ---
    if (animBtn) {
      let paused = false;
      animBtn.addEventListener("click", () => {
        paused = !paused;
        if (paused) {
          body.style.animation = "none"; // stop bg drift
        } else {
          body.style.animation = ""; // restore CSS animation
        }
      });
    }
  });
})();