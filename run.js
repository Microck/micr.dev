// ===== CONFIG =====
const asciiFolder = "./assets";
const totalFrames = 6572;
const fps = 30;
const indent = "        "; // 8 spaces before each animation frame
// ==================

let frameIndex = 1;
let interval = null;
let stopFlag = false;

function softClear(lines = 0) {
  console.log("\n".repeat("0"));
}

async function getFrame(idx) {
  const path = `${asciiFolder}/out${idx.toString().padStart(4, "0")}.jpg.txt`;
  try {
    const res = await fetch(path);
    return await res.text();
  } catch {
    return null;
  }
}

async function playAscii() {
  if (interval) return;
  stopFlag = false;
  frameIndex = 1;

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
  console.log("\n".repeat(1) + "        not war?");
  setTimeout(() => {
    playAscii();
  }, 2000);
}

// expose function
window.makeLove = makeLove;

// run intro
intro();