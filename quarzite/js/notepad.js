// Notepad: multiple random versions + classic menu + wrapping + random offset
(function () {
  function setFontPx(px) {
    const ta = document.getElementById("notepad-text");
    ta.style.fontSize = px + "px";
    ta.style.lineHeight = px + "px";
    ta.style.fontFamily = '"FixedsysWin98", "Fixedsys", monospace';
  }

  // Force wrapping via inline styles so CSS can't override it
  function applyWrap(isWrap) {
    const ta = document.getElementById("notepad-text");

    // keep classes if you still want them for styling, but inline wins
    ta.classList.remove("notepad-wrap", "notepad-nowrap");
    ta.classList.add(isWrap ? "notepad-wrap" : "notepad-nowrap");

    // hard override wrapping behavior
    ta.style.whiteSpace = isWrap ? "pre-wrap" : "pre";
    ta.style.overflowWrap = isWrap ? "anywhere" : "normal";
    ta.style.wordBreak = isWrap ? "break-word" : "normal";
  }

  // Define all versions
  const versions = [
    {
      name: "ASCII",
      fromFile: "assets/ascii.txt",
      fontSize: 7,
      wrap: false,
      // fixed values from your debug overlay
      window: { left: 1143, top: 497, width: 382, height: 430 },
    },
    {
      name: "Form Report",
      text:
        "Forms FORM-29827281-12:\nTest Assessment Report\n\nThis was a " +
        "triumph.\nI'm making a note here:\nHUGE SUCCESS.",
      fontSize: 18,
      wrap: true,
      window: { left: 1154, top: 479, width: 500, height: 400 },
    },
    {
      name: "Cat Face",
      text: ":3 (in a non-male manipulator type of way)",
      fontSize: 24,
      wrap: true,
      window: { left: 1154, top: 479, width: 500, height: 200 },
    },
    {
      name: "Club Penguin",
      text:
        "hello everybody\n\nwelcome to my tutorial on how to play club " +
        "penguin\n\n" +
        "the first thing you want to do is open up your web browser and " +
        "download from the description club penguin\n\n" +
        "im not going to download it because I already have it\n\n" +
        "thanks for watching make sure to sub and like",
      fontSize: 20,
      wrap: true,
      window: { left: 1154, top: 479, width: 600, height: 350 },
    },
    {
      name: "Tiny Text",
      text: "lol why are you trying to read this",
      fontSize: 6,
      wrap: true,
      window: { left: 1493, top: 740, width: 206, height: 126 },
    },
  ];

  function randomOffset(base, range = 30) {
    return base + Math.floor(Math.random() * (range * 2 + 1)) - range;
  }

  // Pick by index (or random if index not provided)
  async function pickContent(index) {
    const ta = document.getElementById("notepad-text");
    const win = document.getElementById("win-notepad");

    let version;
    if (typeof index === "number" && index >= 0 && index < versions.length) {
      version = versions[index];
    } else {
      version = versions[Math.floor(Math.random() * versions.length)];
    }
    console.log("Chosen version:", version.name);

    // load text (file or inline)
    if (version.fromFile) {
      try {
        const res = await fetch(version.fromFile, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        ta.value = await res.text();
      } catch (err) {
        console.error("Failed to load file", version.fromFile, err);
        ta.value = "[Error loading ASCII file]";
      }
    } else {
      ta.value = version.text;
    }

    // apply font size + wrapping (inline styles)
    setFontPx(version.fontSize);
    applyWrap(version.wrap);

    // window size + position
    if (version.name === "ASCII") {
      win.style.left = version.window.left + "px";
      win.style.top = version.window.top + "px";
      win.style.width = version.window.width + "px";
      win.style.height = version.window.height + "px";
    } else {
      win.style.left = randomOffset(version.window.left) + "px";
      win.style.top = randomOffset(version.window.top) + "px";
      win.style.width = version.window.width + "px";
      win.style.height = version.window.height + "px";
    }
  }

  document.addEventListener("DOMContentLoaded", async () => {
    await pickContent();
  });

  // Export with count for scenario building
  window.Notepad = { pickContent, count: versions.length };
})();