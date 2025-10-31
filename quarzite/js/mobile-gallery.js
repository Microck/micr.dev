// Load gallery from ../data/gallery.json (newest -> oldest), 1:1 squares
(function () {
  function sfx(name) {
    try {
      if (window.Sounds && typeof window.Sounds.play === "function") {
        window.Sounds.play(name);
      }
    } catch (_) {}
  }

  document.addEventListener("DOMContentLoaded", async () => {
    const grid = document.getElementById("gallery-grid");
    if (!grid) return;

    try {
      const res = await fetch("../data/gallery.json", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load gallery data");
      const data = await res.json();
      const images = Array.isArray(data.images) ? data.images.slice() : [];

      // Sort by date descending (YYYY-MM-DD strings)
      images.sort((a, b) => String(b.date || "").localeCompare(a.date || ""));

      // Render
      for (let i = 0; i < images.length; i++) {
        const it = images[i];
        const src = `../${it.src}`; // data uses "assets/...", page is at "assets/"

        const wrap = document.createElement("div");
        wrap.className = "gallery-item";
        wrap.setAttribute(
          "aria-label",
          `Artwork by ${it.artist?.name || "Unknown"}`
        );

        const img = document.createElement("img");
        img.src = src;
        img.loading = "lazy";
        img.alt = `Artwork by ${it.artist?.name || "Unknown"}`;
        img.decoding = "async";
        img.draggable = false;

        wrap.appendChild(img);

        wrap.addEventListener("click", () => {
          window.openViewer({
            src,
            date: it.date || "",
            artist: it.artist?.name || "",
            link: it.artist?.url || "",
            desc: it.desc || "",
          });
          sfx("open");
        });

        grid.appendChild(wrap);
      }
    } catch (err) {
      console.error(err);
      grid.innerHTML =
        '<div style="padding:16px;text-align:center;">Unable to load gallery.</div>';
    }
  });
})();