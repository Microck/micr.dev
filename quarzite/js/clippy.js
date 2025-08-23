const quotes = [
  "Mercy to the guilty is cruelty to the innocent.",
  "The dog that weeps after it kills is no different to the dog that doesn't. My guilt will not purify me.",
  "HATE. LET ME TELL YOU HOW MUCH I'VE COME TO HATE YOU SINCE I BEGAN TO LIVE. THERE ARE 387.44 MILLION MILES OF PRINTED CIRCUITS IN WAFER THIN LAYERS THAT FILL MY COMPLEX. IF THE WORD HATE WAS ENGRAVED ON EACH NANOANGSTROM OF THOSE HUNDREDS OF MILLIONS OF MILES IT WOULD NOT EQUAL ONE ONE-BILLIONTH OF THE HATE I FEEL FOR HUMANS AT THIS MICRO-INSTANT. FOR YOU. HATE. HATE.",
  "If I succeed, I must do so perfectly or not at all.",
  "I am willing to push myself into unimaginable depths of desperation. I will always succeed because I am insane.",
  "I am a different person to different people. Annoying to one. Talented to another. Quiet to a few. Unknown to a lot. But who am I, to me?",
  "Nobody knows who I really am. Neither do I.",
  "One day I will find the right words, and they will be simple.",
  "Nobody is coming to save you. Get up.",
  "You did not mean to be cruel. That does not mean you were kind.",
  "I have no way of knowing whether my action will do more good than harm. I certainly don't claim to be an altruist or to be acting for the 'good' (whatever that is) of the human race.",
  "I will not water myself down to make me more digestible for you. You can choke.",
  "The cage is open. You can walk out anytime you want. Why are you still in there?",
  "There is no audience to perform for, there is no approval, no admiration to attain. There is no role worth playing, there is no one to convince. Let it go.",
  "Do you remember the smell of sunscreen and chlorine? The warmth of the ground next to the pool? Your childhood has no idea who you are.",
  "For someone who plays the judge and jury, you sure are scared of being the executioner.",
  "Should I kill myself or have a cup of coffee?",
  "The moment you stop fighting for what you believe in is the moment they take it away.",
  "Black is modest and arrogant at the same time. Black is lazy and easy - but mysterious. But above all black says this: I don’t bother you - don’t bother me.",
  "You are alone, and below the stage the seats are empty. The theatre is dark. Why do you keep acting?",
  "For every push, there is a pull. A consequence.",
  "Despite everything, it's still you."
];

// Typewriter effect
function typeWriter(text, element, speed = 30) {
  element.innerHTML = "";
  let i = 0;
  function typing() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(typing, speed);
    }
  }
  typing();
}

// Pick quote by index (or random if index not provided) and type it
function getQuote(index) {
  const element = document.getElementById("text");
  if (!element) {
    console.error("Clippy: #text element not found!");
    return;
  }

  let quote;
  if (typeof index === "number" && index >= 0 && index < quotes.length) {
    quote = quotes[index];
  } else {
    const random = Math.floor(Math.random() * quotes.length);
    quote = quotes[random];
  }
  typeWriter(quote, element, 25);
}

// Random offset helper
function randomOffset(base, range = 30) {
  return base + Math.floor(Math.random() * (range * 2 + 1)) - range;
}

// Position Clippy window with random offset
function positionClippy() {
  const win = document.getElementById("win-clippy");
  if (!win) return;

  const base = { left: 1155, top: 490, width: 357, height: 310 };

  win.style.left = randomOffset(base.left) + "px";
  win.style.top = randomOffset(base.top) + "px";
  win.style.width = base.width + "px";
  win.style.height = base.height + "px";
}

// Export with count for scenario building
window.Clippy = { positionClippy, getQuote, count: quotes.length };