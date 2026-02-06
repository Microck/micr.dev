// ==========================================================
// ZIP‑BASED ASCII ANIMATION LOADER (fflate)
// ==========================================================

import {
  unzipSync,
  strFromU8,
} from "https://cdn.jsdelivr.net/npm/fflate/esm/browser.js";

const ZIP_PATH = "./assets/frames.zip";
const totalFrames = 6572;
const fps = 30;
const indent = "        ";

let FRAME_MAP = null;
let zipReady = false;

// ---- Load ZIP once ----
async function loadZip() {
  if (zipReady) return;

  const res = await fetch(ZIP_PATH);
  const buf = new Uint8Array(await res.arrayBuffer());

  FRAME_MAP = unzipSync(buf);
  zipReady = true;

  console.log(
    "(ASCII ZIP extracted:",
    Object.keys(FRAME_MAP).length,
    "frames)"
  );
}

// ---- Get frame text ----
async function getFrame(idx) {
  if (!zipReady) await loadZip();

  const name = "out" + idx.toString().padStart(4, "0") + ".jpg.txt";
  const entry = FRAME_MAP[name];
  if (!entry) return null;

  return strFromU8(entry);
}

// Dummy (ZIP removes need for network preloading)
async function preloadFrames() { return; }

// ==========================================================
// ANIMATION LOGIC
// ==========================================================

let frameIndex = 1;
let interval = null;
let stopFlag = false;

window.addEventListener("blur", () => {
  if (!interval) return;

  stopFlag = true;
  clearInterval(interval);
  interval = null;

  if (window.eggAudio) {
    window.eggAudio.pause();
    window.eggAudio.currentTime = 0;
  }

  setTimeout(() => {
    console.clear();
    intro();
  }, 200);
});

// ★ UPDATED — nothing restarts automatically on focus
window.addEventListener("focus", () => {
  console.log("(animation paused — tab re-focused)");
});

function softClear() {
  console.log("\n");
}

// ==========================================================
// PLAYBACK
// ==========================================================

async function playAscii() {
  if (interval) return;
  stopFlag = false;
  frameIndex = 1;

  await preloadFrames();

  let firstFrame = true;

  interval = setInterval(async () => {
    if (stopFlag || frameIndex > totalFrames) {
      clearInterval(interval);
      interval = null;

      setTimeout(() => {
        console.log(
          "\n\n" +
            "【Touhou】Bad Apple!! Gameboy 8-bit ver. by 檜風呂\n" +
            "https://www.nicovideo.jp/watch/sm8954478\n"
        );
      }, 1000);

      return;
    }

    const frame = await getFrame(frameIndex);
    if (frame) {
      // ★ UPDATED — delay audio by 0.5s after frame 1
      if (firstFrame) {
        firstFrame = false;
        requestAnimationFrame(() => {
          if (window.playEggAudio)
            setTimeout(() => window.playEggAudio(), 700);
        });
      }

      console.log(
        "\n".repeat(25) + indent + frame.replace(/\n/g, "\n" + indent)
      );
    }

    frameIndex++;
  }, 1000 / fps);
}

// ==========================================================
// INTRO + PUBLIC API
// ==========================================================

function intro() {
  console.log(
    "\n" +
      `
_____________________________________________________________________/\\\\\\_______________________________        
 ____________________________________________________________________\\/\\\\\\_______________________________       
  ______________________/\\\\\\__________________________________________\\/\\\\\\_______________________________      
   ____/\\\\\\\\\\__/\\\\\\\\\\___\\///______/\\\\\\\\\\\\\\\\__/\\\\/\\\\\\\\\\\\\\_______________\\/\\\\\\______/\\\\\\\\\\\\\\\\___/\\\\\\____/\\\\\\_     
    __/\\\\\\///\\\\\\\\\\///\\\\\\__/\\\\\\___/\\\\\\//////__\\/\\\\\\/////\\\\\\_________/\\\\\\\\\\\\\\\\\\____/\\\\\\/////\\\\\\_\\//\\\\\\__/\\\\\\__    
     _\\/\\\\\\_\\//\\\\\\__\\/\\\\\\_\\/\\\\\\__/\\\\\\_________\\/\\\\\\___\\///_________/\\\\\\////\\\\\\___/\\\\\\\\\\\\\\\\\\\\\\___\\//\\\\\\/\\\\\\___   
      _\\/\\\\\\__\\/\\\\\\__\\/\\\\\\_\\/\\\\\\_\\//\\\\\\________\\/\\\\\\_______________\\/\\\\\\__\\/\\\\\\__\\//\\\\///////_____\\//\\\\\\\\\\____  
       _\\/\\\\\\__\\/\\\\\\__\\/\\\\\\_\\/\\\\\\__\\///\\\\\\\\\\\\\\\\_\\/\\\\\\__________/\\\\\\_\\//\\\\\\\\\\\\\\/\\\\__\\//\\\\\\\\\\\\\\\\\\\\____\\//\\\\\\_____ 
        _\\///___\\///___\\///__\\///_____\\////////__\\///__________\\///___\\///////\\//____\\//////////______\\///______

        whether you are a curious explorer or a developer tinkering with my website,
        you've found this easter egg! your efforts won't go to waste.
        type "makeLove()" and press enter :)
		
												       and don't forget to ★ the repo: github.com/Microck/micr.dev
`
  );
}

function makeLove() {
  console.log("\nnot war?");
  setTimeout(() => {
    playAscii();
  }, 500);
}

window.makeLove = makeLove;
intro();

// ==========================================================
// AUDIO HANDLER
// ==========================================================

const eggAudio = new Audio("./assets/run.ogg");
eggAudio.preload = "auto";
eggAudio.volume = 0.25;

window.playEggAudio = function () {
  eggAudio.currentTime = 0;
  eggAudio.play();
};
