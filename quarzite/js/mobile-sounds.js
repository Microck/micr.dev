// Use the same files as desktop, but with a base that works from assets/mobile.html
(function () {
  const base = "w98sounds/"; // relative to assets/mobile.html

  const files = {
    chord: "CHORD.mp3",
    recycle: "RECYCLE.mp3",
    click: "windows-98-click.wav",
    hideBar: "windows-98-hide-bar.wav",
    microsoft: "The Microsoft Sound.mp3",
  };

  function play(name) {
    const f = files[name];
    if (!f) return;
    const a = new Audio(base + f);
    a.volume = (window.AppVolume ?? 100) / 100;
    a.play().catch(() => {});
  }

  window.W98 = window.W98 || {};
  window.W98.play = play;
})();