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
  "Should I kill myself or have a cup of coffee?", // Albert Camus, *The Myth of Sisyphus* (1942)
  "The moment you stop fighting for what you believe in is the moment they take it away.",
  "Black is modest and arrogant at the same time. Black is lazy and easy - but mysterious. But above all black says this: I don’t bother you - don’t bother me.", // Yohji Yamamoto (1983)
  "You are alone, and below the stage the seats are empty. The theatre is dark. Why do you keep acting?", // Charles Bukowski, *Love is a Dog from Hell* (1977)
  "For every push, there is a pull. A consequence.", // Brandon Sanderson, *Mistborn* (2006)
  "I became such a good swimmer that nobody thought to check if I was drowning.",
  "And the only true justice was to let those dominant jackals feed on you. Survive off you.", // *Moral Orel* (Season 3, 2008)
  "Despite everything, it's still you.", // Toby Fox, *Undertale* (2015)
  "Can you recall the last time someone looked at you and actually saw you? Not the mask, not the role, not the noise you put up to keep the room comfortable? That’s why you keep ending up here, feeling unseen in a crowded room.",
  "And what does that leave? A life where you’re crowded but hollow. Where every conversation feels like static. Where you go home at night with the sick realization that no one, not one person, knows the thoughts that keep you awake. You could disappear tomorrow, and they would only remember the outline you left behind, not the person who carried it.",
  "This world is rotten, and those who are making it rot deserve to die.", // Light Yagami, *Death Note* (2003)
  "I cannot make you understand. I cannot make anyone understand what is happening inside me. I cannot even explain it to myself.", // Franz Kafka, *The Metamorphosis* (1915)
  "Above all, avoid falsehood, every kind of falsehood, especially falseness to yourself.", // Fyodor Dostoevsky, *The Brothers Karamazov* (1880)
  "Your worst sin is that you have destroyed and betrayed yourself for nothing.", // Fyodor Dostoevsky, *Crime and Punishment* (1866)
  "You didn't crawl through hell just to stop at the gates.",
  "The time will pass anyways.",
  "Comparison is the thief of joy.", // Theodore Roosevelt (1900s)
  "I’m the human embodiment of the sunk cost fallacy.",
  "He did it well. He had to do it well. Some whispered about a supernatural skill on his part, that he was too talented for a fourteen-year-old boy. That infuriated him. It turned sweat into luck. Szeth hated that they thought he was something special. He wasn’t.", // Brandon Sanderson, *Wind and Truth: Stormlight Archive Book 5* (2024)
  "To go wrong in one's own way is better than to go right in someone else's.", // Fyodor Dostoevsky, *Crime and Punishment* (1866)
  "What do you do when there is an evil you cannot defeat by just means? Do you stain your hands with evil to destroy evil? Or do you remain steadfastly just and righteous even if it means surrendering to evil?", // Lelouch vi Britannia, *Code Geass* (2006)
  "You can't change the world without getting your hands dirty.", // Lelouch vi Britannia, *Code Geass* (2006)
  "And those who were seen dancing were thought to be insane by those who could not hear the music.", // Friedrich Nietzsche, *Thus Spoke Zarathustra* (1885)
  "I stopped explaining myself, because no matter what I said, people only heard what they wanted. I'm done giving pieces of my life; if you wanted to know me, you would.",
  "Perhaps my only real expertise, my only talent, is to endure beyond the endurable. I have built a body that will not burn.",
  "- Detention is so boring.<br>+ Make a drawing! That’s what I do!<br>- But we’re not allowed to have paper!<br>+ Who needs paper? Draw on the desk!<br>- Um… isn’t that vandalizing school property?<br>+ Your heart’s not really in this, is it?", // Lincoln Peirce, *Big Nate* (1991)
  "No no no no no no no no no no No no NO no, no no no no Nonono no no NO no No no no no no no No NO NO NO, no no no no Nonono no no NO no No no no no no no no no no no No nooo NO no, no no no no Nonono no no NO no", // glass beach, “bedroom community” (2019)
  "What saved me is the idea of suicide. Without the idea of suicide I would have surely killed myself. What allowed me to keep on living was knowing I had this option, always in sight. But really, without it I could have never endured life. the impression of being stuck down here. For me the idea of suicide is linked with the idea of freedom. With this idea, I could bear anything because everything depends on me.", // Emil Cioran, *The Trouble with Being Born* (1973)
  "Only optimists commit suicide, optimists who no longer succeed at being optimists. The others, having no reason to live, why would they have any to die?", // Emil Cioran, *The Trouble with Being Born* (1973)
  "You know what a loser is? A real loser is somebody that is so afraid of not winning, they don't even try. Now, you're trying, right?", // *Little Miss Sunshine* (2006)
  "All animals are equal but some animals are more equal than others.", // George Orwell, *Animal Farm* (1945)
  "I know you. I know what you were, what you are. People don't change. You have regrets. And I'm telling you: don't bother. What's the point? You're just gonna keep hurting people. This is what you do. You hurt people, over and over and over. And then there's this show of remorse. I know you don't think it's a show. I don't doubt your emotions are real. But what's the point of all the sad faces and the gnashing of teeth? If you're not going to change your behavior — and you won't — why don't you skip the whole exercise? In the end, you're going to hurt everyone around you. You can't help it. So stop apologizing and accept it.", // Chuck McGill, *Better Call Saul* (Season 3, 2017)
  "One day, you're gonna wake up, eat your breakfast, brush your teeth, go about your business. And sooner or later, you're gonna realize you haven't thought about it. None of it. And that's the moment you realize you can forget. When you know that's possible, it all gets easier." // Mike Ehrmantraut, *Better Call Saul* (Season 2, 2016)
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