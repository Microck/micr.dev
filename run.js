// ===== CONFIG =====
const asciiFolder = "./assets";
const totalFrames = 6572;
const fps = 30;
const indent = "        "; // 8 spaces before each animation frame
// ==================

// ===== Preload Buffer Config =====
const preloadCount = fps * 2; // 2-second buffer
const frameCache = new Map();

// ===== Adaptive Preloader (auto throttle) =====
let avgLoadTime = 50; // initial estimate (ms per frame)
const targetBufferTime = 2000; // aim for 2s total buffer load
let concurrentFetches = 4; // starting parallel fetches
let tabActive = true; // track tab focus

// Pause preloading when tab not active
window.addEventListener("blur", () => (tabActive = false));
window.addEventListener("focus", () => (tabActive = true));

async function preloadFrames(startIndex) {
  const end = Math.min(startIndex + preloadCount, totalFrames);
  let active = 0;
  const queue = [];

  async function loadFrame(i) {
    active++;
    const start = performance.now();
    await getFrame(i);
    const duration = performance.now() - start;
    avgLoadTime = 0.8 * avgLoadTime + 0.2 * duration; // exponential smoothing
    active--;
  }

  for (let i = startIndex; i < end; i++) queue.push(i);

  while (queue.length > 0 && tabActive) {
    if (active < concurrentFetches) {
      const i = queue.shift();
      loadFrame(i);
    } else {
      await new Promise((r) => setTimeout(r, 10)); // brief pause
    }
  }

  // Adjust concurrency based on observed speed
  const estTime = (preloadCount * avgLoadTime) / concurrentFetches;
  if (estTime > targetBufferTime && concurrentFetches > 2) concurrentFetches--;
  else if (estTime < targetBufferTime / 2 && concurrentFetches < 10)
    concurrentFetches++;
}

// ===============================================

let frameIndex = 1;
let interval = null;
let stopFlag = false;

function softClear(lines = 0) {
  console.log("\n".repeat("0"));
}

async function getFrame(idx) {
  if (frameCache.has(idx)) return frameCache.get(idx);

  const path = `${asciiFolder}/out${idx.toString().padStart(4, "0")}.jpg.txt`;
  try {
    const res = await fetch(path);
    const text = await res.text();
    frameCache.set(idx, text);
    return text;
  } catch {
    return null;
  }
}

async function playAscii() {
  if (interval) return;
  stopFlag = false;
  frameIndex = 1;

  await preloadFrames(frameIndex); // preload initial buffer

  interval = setInterval(async () => {
    if (stopFlag || frameIndex > totalFrames) {
      clearInterval(interval);
      interval = null;
      return;
    }

    const frame = await getFrame(frameIndex);
    if (frame) {
      console.log(
        "\n".repeat(25) + indent + frame.replace(/\n/g, "\n" + indent)
      );
    }

    preloadFrames(frameIndex + 1); // keep preloading ahead
    frameIndex++;
  }, 1000 / fps);
}

function intro() {
  console.log(
    "\n".repeat(1) +
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
  console.log("\n".repeat(1) + "not war?");
  setTimeout(() => {
    if (window.playEggAudio) window.playEggAudio(); // play preloaded run.ogg @ 50% volume
    playAscii();
  }, 2000);
}

// expose function
window.makeLove = makeLove;

// run intro
intro();