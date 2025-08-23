// Warning popup + intercept title-bar controls
(function () {
  let backdrop, modal, msgEl, okBtn, closeBtn;

  function setup() {
    backdrop = document.getElementById("warning-backdrop");
    modal = document.getElementById("warning");
    msgEl = document.getElementById("warning-message");
    okBtn = document.getElementById("warning-ok");
    closeBtn = modal.querySelector(
      '.title-bar-controls button[aria-label="Close"]'
    );

    okBtn.addEventListener("click", close);
    closeBtn.addEventListener("click", close);
    modal.addEventListener("keydown", (e) => {
      if (e.key === "Escape" || e.key === "Enter") close();
    });
  }

  function getMessage() {
    return (
      "You can move windows; but minimizing, maximizing or closing isn’t allowed. " +
      "Some windows can be resized."
    );
  }

  function open(message) {
    if (!modal) setup();
    msgEl.textContent = message || getMessage();
    backdrop.hidden = false;
    modal.hidden = false;
    okBtn.focus();
  }

  function close() {
    backdrop.hidden = true;
    modal.hidden = true;
  }

  function attachControls(root, { exclude = [] } = {}) {
    const excludeSet = new Set(exclude);

    function shouldSkip(el) {
      const win = el.closest(".app-window");
      return win && excludeSet.has(win.id);
    }

    // Intercept title-bar buttons
    root
      .querySelectorAll(".app-window .title-bar-controls button")
      .forEach((btn) => {
        btn.addEventListener("click", (e) => {
          if (shouldSkip(btn)) return; // allow normal behavior
          e.preventDefault();
          e.stopPropagation();
          open(getMessage());
        });
      });

    // Intercept double-click on title bar
    root.querySelectorAll(".app-window .title-bar").forEach((bar) => {
      bar.addEventListener("dblclick", (e) => {
        if (shouldSkip(bar)) return;
        e.preventDefault();
        open(getMessage());
      });
    });
  }

  window.AppWarning = { open, close, attachControls };
})();