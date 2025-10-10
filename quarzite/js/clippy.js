const quotes = [
  "Mercy to the guilty is cruelty to the innocent.", // Adam Smith, *The Theory of Moral Sentiments* (1759)
  "The dog that weeps after it kills is no different to the dog that doesn't. My guilt will not purify me.",
  "HATE. LET ME TELL YOU HOW MUCH I'VE COME TO HATE YOU SINCE I BEGAN TO LIVE. THERE ARE 387.44 MILLION MILES OF PRINTED CIRCUITS IN WAFER THIN LAYERS THAT FILL MY COMPLEX. IF THE WORD HATE WAS ENGRAVED ON EACH NANOANGSTROM OF THOSE HUNDREDS OF MILLIONS OF MILES IT WOULD NOT EQUAL ONE ONE-BILLIONTH OF THE HATE I FEEL FOR HUMANS AT THIS MICRO-INSTANT. FOR YOU. HATE. HATE.", // Harlan Ellison, *I Have No Mouth, and I Must Scream* (1967)
  "If I succeed, I must do so perfectly or not at all.",
  "I am willing to push myself into unimaginable depths of desperation. I will always succeed because I am insane.",
  "I am a different person to different people. Annoying to one. Talented to another. Quiet to a few. Unknown to a lot. But who am I, to me?",
  "Nobody knows who I really am. Neither do I.",
  "One day I will find the right words, and they will be simple.", // Jack Kerouac, *The Dharma Bums* (1958)
  "Nobody is coming to save you. Get up.",
  "You did not mean to be cruel. That does not mean you were kind.",
  "I have no way of knowing whether my action will do more good than harm. I certainly don't claim to be an altruist or to be acting for the 'good' (whatever that is) of the human race.", // Richard Dawkins, *The Selfish Gene* (1976)
  "I will not water myself down to make me more digestible for you. You can choke.",
  "The cage is open. You can walk out anytime you want. Why are you still in there?",
  "There is no audience to perform for, there is no approval, no admiration to attain. There is no role worth playing, there is no one to convince. Let it go.",
  "Do you remember the smell of sunscreen and chlorine? The warmth of the ground next to the pool? Your childhood has no idea who you are.",
  "For someone who plays the judge and jury, you sure are scared of being the executioner.",
  "Should I kill myself or have a cup of coffee?", // Albert Camus, *The Myth of Sisyphus* (1942, paraphrased)
  "The moment you stop fighting for what you believe in is the moment they take it away.",
  "Black is modest and arrogant at the same time. Black is lazy and easy - but mysterious. But above all black says this: I don’t bother you - don’t bother me.", // Yohji Yamamoto
  "You are alone, and below the stage the seats are empty. The theatre is dark. Why do you keep acting?", // Charles Bukowski
  "For every push, there is a pull. A consequence.", // Brandon Sanderson, *Mistborn* (2006)
  "I became such a good swimmer that nobody thought to check if I was drowning.",
  "And the only true justice was to let those dominant jackals feed on you. Survive off you.", // *Moral Orel* (2008)
  "Despite everything, it's still you.", // Toby Fox, *Undertale* (2015)
  "Can you recall the last time someone looked at you and actually saw you? Not the mask, not the role, not the noise you put up to keep the room comfortable? That’s why you keep ending up here, feeling unseen in a crowded room.",
  "And what does that leave? A life where you’re crowded but hollow. Where every conversation feels like static. Where you go home at night with the sick realization that no one, not one person, knows the thoughts that keep you awake. You could disappear tomorrow, and they would only remember the outline you left behind, not the person who carried it.",
  "This world is rotten, and those who are making it rot deserve to die.", // Light Yagami, *Death Note*
  "I cannot make you understand. I cannot make anyone understand what is happening inside me. I cannot even explain it to myself.", // Franz Kafka
  "Above all, avoid falsehood, every kind of falsehood, especially falseness to yourself.", // Fyodor Dostoevsky, *The Brothers Karamazov*
  "Your worst sin is that you have destroyed and betrayed yourself for nothing.", // Fyodor Dostoevsky
  "You didn't crawl through hell just to stop at the gates.",
  "The time will pass anyways.",
  "Comparison is the thief of joy.",
  "I’m the human embodiment of the sunk cost fallacy.",
  "He did it well. He had to do it well. Some whispered about a supernatural skill on his part, that he was too talented for a fourteen-year-old boy. That infuriated him. It turned sweat into luck. Szeth hated that they thought he was something special. He wasn’t.", // Brandon Sanderson, *Wind and Truth: Stormlight Archive Book 5*
  "To go wrong in one's own way is better than to go right in someone else's.", // Fyodor Dostoevsky, *Crime and Punishment*
  "What do you do when there is an evil you cannot defeat by just means? Do you stain your hands with evil to destroy evil? Or do you remain steadfastly just and righteous even if it means surrendering to evil?", // Lelouch vi Britannia, *Code Geass*
  "You can't change the world without getting your hands dirty.", // Lelouch vi Britannia, *Code Geass*
  "And those who were seen dancing were thought to be insane by those who could not hear the music." // Friedrich Nietzsche
];

// Track current quote index and typing state
let currentQuoteIndex = 0;
let currentTypingTimeouts = [];

// Typewriter effect — interruptible
function typeWriter(text, element, speed = 30) {
  // Clear any in-progress timeouts immediately
  for (const t of currentTypingTimeouts) clearTimeout(t);
  currentTypingTimeouts = [];

  element.innerHTML = "";
  let i = 0;

  function typing() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      const t = setTimeout(typing, speed);
      currentTypingTimeouts.push(t);
    }
  }

  typing();
}

// Pick quote by index (or random if index not provided)
function getQuote(index) {
  const element = document.getElementById("text");
  if (!element) {
    console.error("Clippy: #text element not found!");
    return;
  }

  let quote;
  if (typeof index === "number" && index >= 0 && index < quotes.length) {
    quote = quotes[index];
    currentQuoteIndex = index;
  } else {
    const random = Math.floor(Math.random() * quotes.length);
    quote = quotes[random];
    currentQuoteIndex = random;
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

// Keyboard controls — interrupt typing abruptly
document.addEventListener("keydown", (event) => {
  if (event.ctrlKey && event.key === "ArrowRight") {
    event.preventDefault();
    const next = (currentQuoteIndex + 1) % quotes.length;
    getQuote(next);
  }

  if (event.ctrlKey && event.key === "ArrowLeft") {
    event.preventDefault();
    const prev = (currentQuoteIndex - 1 + quotes.length) % quotes.length;
    getQuote(prev);
  }
});

// Export with count for scenario building
window.Clippy = { positionClippy, getQuote, count: quotes.length };