function getDots(
  leftText,
  rightText,
  availableWidth,
  leftFont,
  rightFont,
  dotFont
) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  ctx.font = leftFont;
  const leftWidth = ctx.measureText(leftText).width;

  ctx.font = rightFont;
  const rightWidth = ctx.measureText(rightText).width;

  ctx.font = dotFont;
  const dotWidth = ctx.measureText(".").width;

  const dotsNeeded = Math.max(
    1,
    Math.floor((availableWidth - leftWidth - rightWidth) / dotWidth)
  );

  return ".".repeat(dotsNeeded);
}

function debounce(fn, delay = 150) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
}

function waitForFonts() {
  if (!document.fonts?.ready) {
    return Promise.resolve();
  }
  return document.fonts.ready.catch(() => {});
}

function waitForImage(img) {
  if (!img) {
    return Promise.resolve();
  }
  if (img.complete) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    img.addEventListener("load", resolve, { once: true });
    img.addEventListener("error", resolve, { once: true });
  });
}

async function fetchData() {
  const res = await fetch("data.json", { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to load data.json: ${res.status}`);
  }
  return res.json();
}

function syncReadyState() {
  const body = document.body;
  if (
    body.classList.contains("content-ready") &&
    body.classList.contains("hero-ready")
  ) {
    body.classList.remove("is-loading");
  }
}

function showLoadError() {
  const content = document.getElementById("content");
  if (!content) return;

  content.innerHTML = `
    <div class="category">
      <div class="category-title">Status</div>
      <div>Couldn’t load this page right now. Refresh and try again.</div>
    </div>
  `;

  document.body.classList.add("content-ready");
  syncReadyState();
}

let savedData = null;

document.addEventListener("DOMContentLoaded", async () => {
  const heroImg = document.querySelector(".hero-img");

  waitForImage(heroImg).then(() => {
    document.body.classList.add("hero-ready");
    syncReadyState();
  });

  try {
    await waitForFonts();
    savedData = await fetchData();
    render(savedData);

    const onResize = debounce(() => {
      if (savedData) render(savedData);
    }, 150);
    window.addEventListener("resize", onResize, { passive: true });

    document.body.classList.add("content-ready");
    syncReadyState();
  } catch (error) {
    console.error("About page failed to initialize:", error);
    showLoadError();
  }
});

function render(data) {
  const content = document.getElementById("content");
  if (!content) return;

  content.innerHTML = "";

  for (const [category, details] of Object.entries(data)) {
    const section = document.createElement("div");
    section.classList.add("category", category);

    const leftCol = document.querySelector(".left-column");
    const styles = window.getComputedStyle(leftCol);
    const paddingLeft = parseInt(styles.paddingLeft, 10);
    const paddingRight = parseInt(styles.paddingRight, 10);
    const availableWidth = leftCol.clientWidth - paddingLeft - paddingRight;
    const defaultFont = `${styles.fontSize} ${styles.fontFamily}`;

    if (details.type === "intro") {
      const introPara = document.createElement("div");
      introPara.classList.add("intro-text");

      const firstLine = document.createElement("div");
      firstLine.classList.add("intro-header");

      const leftSpan = document.createElement("span");
      leftSpan.textContent = "MICROCK";

      const rightSpan = document.createElement("span");
      rightSpan.textContent = "he/him";

      firstLine.appendChild(leftSpan);
      firstLine.appendChild(rightSpan);

      const rest = document.createElement("div");
      rest.classList.add("intro-body");
      rest.textContent = details.text
        .replace(
          "MICROCK                                                                          he/him",
          ""
        )
        .trim();

      introPara.appendChild(firstLine);
      introPara.appendChild(rest);
      section.appendChild(introPara);
      content.appendChild(section);
      continue;
    }

    if (details.type === "lastUpdated") {
      const lastUpdatedDiv = document.createElement("div");
      lastUpdatedDiv.classList.add("last-updated");
      lastUpdatedDiv.textContent = details.text;
      section.appendChild(lastUpdatedDiv);
      content.appendChild(section);
      continue;
    }

    if (details.type === "T") {
      details.items.sort((a, b) => a.year - b.year);
    }

    if (details.type === "R" && details.items.length === 1) {
      section.classList.add("inline-category");
      const titleText = details.displayName || category;
      const valueText = details.items[0].title || details.items[0].name;
      const dots = getDots(
        titleText,
        valueText,
        availableWidth,
        defaultFont,
        defaultFont,
        defaultFont
      );
      const inline = document.createElement("div");
      inline.classList.add("item");
      inline.style.whiteSpace = "nowrap";
      inline.innerHTML = `<span>${titleText}</span>${dots}${valueText}`;
      section.appendChild(inline);
      content.appendChild(section);
      continue;
    }

    const title = document.createElement("div");
    title.classList.add("category-title");
    title.textContent = details.displayName || category;
    section.appendChild(title);

    if (details.type === "designerImages") {
      const grid = document.createElement("div");
      grid.classList.add("designer-grid");
      details.items.forEach((item) => {
        let element;
        if (item.image && item.image.trim() !== "") {
          element = document.createElement("img");
          element.src = "images/" + item.image;
          element.alt = item.name;
          element.setAttribute("data-label", item.name);
        } else {
          element = document.createElement("div");
          element.classList.add("placeholder");
          element.textContent = item.name;
          element.setAttribute("data-label", item.name);
        }
        grid.appendChild(element);
      });
      section.appendChild(grid);
    } else if (details.type === "colours") {
      const swatchWidth = 14;
      details.items.forEach((item) => {
        const hex = item.title;
        const dots = getDots(
          hex,
          "",
          availableWidth - swatchWidth,
          defaultFont,
          defaultFont,
          defaultFont
        );
        const row = document.createElement("div");
        row.classList.add("item");
        row.style.whiteSpace = "nowrap";

        const text = document.createElement("span");
        text.textContent = `${hex}${dots}`;

        const swatch = document.createElement("div");
        swatch.classList.add("color-swatch");
        swatch.style.backgroundColor = hex;

        row.appendChild(text);
        row.appendChild(swatch);
        section.appendChild(row);
      });
    } else if (details.type === "fonts") {
      details.items.forEach((item) => {
        const row = document.createElement("div");
        row.classList.add("item");
        row.style.whiteSpace = "nowrap";

        const dots = getDots(
          item.title,
          item.right,
          availableWidth,
          defaultFont,
          defaultFont,
          defaultFont
        );

        row.textContent = `${item.title}${dots}${item.right}`;
        section.appendChild(row);
      });
    } else if (details.type === "runways") {
      details.items.forEach((item) => {
        const dots = getDots(
          item.runway,
          item.designer,
          availableWidth,
          defaultFont,
          defaultFont,
          defaultFont
        );
        const row = document.createElement("div");
        row.classList.add("item", "runway-item");
        row.textContent = `${item.runway}${dots}${item.designer}`;
        section.appendChild(row);
      });
    } else if (details.type === "P") {
      const gridContainer = document.createElement("div");
      gridContainer.classList.add("p-grid-container", `${category}-grid`);

      details.items.forEach((item) => {
        let contentEl;
        if (item.image && item.image.trim() !== "") {
          contentEl = document.createElement("img");
          contentEl.src = "images/" + item.image;
          contentEl.alt = item.name;
          contentEl.setAttribute("data-label", item.name);
        } else {
          contentEl = document.createElement("div");
          contentEl.classList.add("placeholder");
          contentEl.textContent = "Placeholder";
          contentEl.setAttribute("data-label", item.name || "Placeholder");
        }

        if (item.spotify) {
          const link = document.createElement("a");
          link.href = item.spotify;
          link.target = "_blank";
          link.rel = "noopener noreferrer";
          link.style.cursor = "pointer";
          link.appendChild(contentEl);
          gridContainer.appendChild(link);
        } else {
          gridContainer.appendChild(contentEl);
        }
      });
      section.appendChild(gridContainer);
    } else if (details.type === "T") {
      details.items.forEach((item) => {
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("item");
        itemDiv.style.whiteSpace = "nowrap";
        if (item.year) {
          const titleText = item.title || item.name;
          const dots = getDots(
            titleText,
            String(item.year),
            availableWidth,
            defaultFont,
            defaultFont,
            defaultFont
          );
          itemDiv.innerHTML = `${titleText}${dots}${item.year}`;
        } else {
          itemDiv.textContent = item.title || item.name;
        }
        section.appendChild(itemDiv);
      });
    } else if (details.type === "R") {
      details.items.forEach((item) => {
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("item");

        const clickableUrl = item.spotify || item.link;

        if (item.right) {
          const dots = getDots(
            item.title,
            item.right,
            availableWidth,
            defaultFont,
            defaultFont,
            defaultFont
          );
          if (clickableUrl) {
            const link = document.createElement("a");
            link.href = clickableUrl;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.textContent = `${item.title}${dots}${item.right}`;
            link.style.cursor = "pointer";
            link.style.textDecoration = "none";
            link.style.color = "inherit";
            itemDiv.appendChild(link);
          } else {
            itemDiv.textContent = `${item.title}${dots}${item.right}`;
          }
        } else if (clickableUrl) {
          const link = document.createElement("a");
          link.href = clickableUrl;
          link.target = "_blank";
          link.rel = "noopener noreferrer";
          link.textContent = item.title || item.name;
          link.style.cursor = "pointer";
          link.style.textDecoration = "none";
          link.style.color = "inherit";
          itemDiv.appendChild(link);
        } else {
          itemDiv.textContent = item.title || item.name;
        }

        section.appendChild(itemDiv);
      });
    }

    content.appendChild(section);
  }

  let customCursor = document.querySelector(".custom-cursor");
  if (!customCursor) {
    customCursor = document.createElement("div");
    customCursor.classList.add("custom-cursor");
    document.body.appendChild(customCursor);

    document.addEventListener("mousemove", (e) => {
      if (customCursor.style.display === "block") {
        customCursor.style.left = e.clientX + 10 + "px";
        customCursor.style.top = e.clientY + 10 + "px";
      }
    });
  }

  const hoverTargets = document.querySelectorAll(
    ".p-grid-container img, .p-grid-container .placeholder, " +
      ".designer-grid img, .designer-grid .placeholder"
  );

  hoverTargets.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      const label =
        el.getAttribute("data-label") || el.alt || el.textContent || "";
      customCursor.textContent = label;
      customCursor.style.display = "block";
    });

    el.addEventListener("mouseleave", () => {
      customCursor.style.display = "none";
      customCursor.textContent = "";
    });
  });
}
