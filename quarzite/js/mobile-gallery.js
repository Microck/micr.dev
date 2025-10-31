document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.getElementById("gallery-grid");
  if (!grid) return;

  try {
    // Fetch gallery data from JSON
    const response = await fetch("../data/gallery.json");
    if (!response.ok) throw new Error("Failed to load gallery data");

    const data = await response.json();
    const images = data.images || [];

    // Populate gallery
    images.forEach((img, index) => {
      const item = document.createElement("div");
      item.className = "gallery-item";

      const imgEl = document.createElement("img");
      imgEl.src = `../${img.src}`;
      imgEl.alt = `Artwork by ${img.artist.name}`;
      imgEl.loading = "lazy";

      item.appendChild(imgEl);

      item.addEventListener("click", () => {
        window.openViewer({
          src: `../${img.src}`,
          artist: img.artist.name,
          link: img.artist.url,
          desc: img.desc || "",
          date: img.date,
        });
      });

      grid.appendChild(item);
    });
  } catch (error) {
    console.error("Error loading gallery:", error);
    grid.innerHTML =
      '<p style="padding: 20px; text-align: center;">Failed to load gallery images.</p>';
  }
});