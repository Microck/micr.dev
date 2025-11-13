// ===== CONFIG =====
const asciiFolder = "./assets";
const totalFrames = 6572;
const fps = 30;
const indent = "        "; // 8 spaces before each animation frame
// ==================

// ===== Preload Buffer Config =====
// ===== Safe Preloader with timeout =====
const preloadCount = fps * 4;
const frameCache = new Map();
const MAX_CONCURRENT_FETCHES = 2;
let currentFetches = 0;
let tabActive = true;

window.addEventListener("blur", () => (tabActive = false));
window.addEventListener("focus", () => (tabActive = true));

async function preloadFrames(startIndex) {
  const end = Math.min(startIndex + preloadCount, totalFrames);
  const attempts = [];

  for (let i = startIndex; i < end; i++) {
    while (currentFetches >= MAX_CONCURRENT_FETCHES && tabActive) {
      await new Promise((r) => setTimeout(r, 25));
    }

    if (!frameCache.has(i)) {
      currentFetches++;
      const p = getFrame(i)
        .catch(() => null)
        .finally(() => currentFetches--);

      attempts.push(
        Promise.race([
          p,
          new Promise((resolve) => setTimeout(() => resolve(null), 2000)), // timeout per frame
        ])
      );

      await new Promise((r) => setTimeout(r, 15));
    }
  }

  await Promise.allSettled(attempts);
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

  // preload small buffer before starting
  await preloadFrames(frameIndex);

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
      // Play audio exactly on first rendered frame
		if (firstFrame) {
		  firstFrame = false;
		  requestAnimationFrame(() => {
			if (window.playEggAudio)
			  setTimeout(() => window.playEggAudio(), 650); // start 0.5 s later
		  });
		}

      console.log(
        "\n".repeat(25) + indent + frame.replace(/\n/g, "\n" + indent)
      );
    }

    preloadFrames(frameIndex + 1); // keep buffering ahead
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
    playAscii(); // animation drives audio precisely on first frame
  }, 500);
}

// expose function
window.makeLove = makeLove;

// run intro
intro();