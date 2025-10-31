// Mobile sound system: uses assets/w98sounds like desktop.
// Exposes window.Sounds.play(name). Tries wav -> mp3 -> ogg.
(function () {
  const BASE = "../assets/w98sounds/";
  const PREFERRED = ["wav", "mp3", "ogg"];
  const MAP = {
    click: ["click", "select", "menu"],
    open: ["open", "maximize", "start"],
    close: ["close", "minimize", "stop"],
    hover: ["hover", "select"],
    error: ["error", "ding"],
  };

  const canType = (ext) => {
    const a = document.createElement("audio");
    const mime =
      ext === "wav"
        ? "audio/wav"
        : ext === "mp3"
        ? "audio/mpeg"
        : "audio/ogg";
    return !!a.canPlayType && a.canPlayType(mime) !== "";
  };

  const pickSrc = (name) => {
    const candidates = MAP[name] || [name];
    for (const key of candidates) {
      for (const ext of PREFERRED) {
        if (!canType(ext)) continue;
        // We can't verify file presence here; try to load on demand.
        return `${BASE}${key}.${ext}`;
      }
    }
    return "";
  };

  const cache = new Map();
  function getAudio(name) {
    let entry = cache.get(name);
    if (!entry) {
      entry = { src: pickSrc(name) };
      cache.set(name, entry);
    }
    return entry;
  }

  // Unlock iOS/Android media
  let unlocked = false;
  const unlock = () => {
    if (unlocked) return;
    unlocked = true;
    // Warm up by creating a silent audio
    try {
      const a = new Audio();
      a.muted = true;
      a.play().catch(() => {});
    } catch (_) {}
    window.removeEventListener("pointerdown", unlock, { capture: true });
    window.removeEventListener("touchstart", unlock, { capture: true });
    window.removeEventListener("mousedown", unlock, { capture: true });
  };
  window.addEventListener("pointerdown", unlock, { capture: true });
  window.addEventListener("touchstart", unlock, { capture: true });
  window.addEventListener("mousedown", unlock, { capture: true });

  window.Sounds = {
    play(name) {
      try {
        const entry = getAudio(name);
        if (!entry.src) return;
        const a = new Audio(entry.src);
        a.volume = 0.6;
        a.play().catch(() => {});
      } catch (_) {}
    },
  };
})();