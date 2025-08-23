// Tile background switcher
(function () {
  const tiles = [
    "assets/tiles/tile1.png",
    "assets/tiles/tile2.jpg",
    "assets/tiles/tile3.jpg",
    "assets/tiles/tile4.jpg",
    "assets/tiles/tile5.jpg",
    "assets/tiles/tile6.jpg",
  ];

  const btn = document.getElementById("tile-toggle");
  const root = document.body; // or document.documentElement
  const STORAGE_KEY = "quarziteTileIndex";

  function applyTile(index) {
    const tile = tiles[index] || tiles[0];
    root.style.backgroundImage = `url("${tile}")`;
    root.style.backgroundRepeat = "repeat";
    root.style.backgroundPosition = "0 0";
    root.style.backgroundSize = "auto";
  }

  function loadTile() {
    let idx = parseInt(localStorage.getItem(STORAGE_KEY), 10);
    if (isNaN(idx) || idx < 0 || idx >= tiles.length) idx = 0;
    applyTile(idx);
    return idx;
  }

  function saveTile(idx) {
    localStorage.setItem(STORAGE_KEY, idx);
  }

  document.addEventListener("DOMContentLoaded", () => {
    let current = loadTile();

    if (btn) {
      btn.addEventListener("click", () => {
        current = (current + 1) % tiles.length; // wrap around
        applyTile(current);
        saveTile(current);
      });
    }
  });
})();