# micr.dev
![portfolio](https://github.com/user-attachments/assets/1ec0295e-3ea7-4a8c-961d-9bcf9ca4d1eb)

a small [3d portfolio site](https://micr.dev) made with [spline](https://spline.design).  
looks cool, runs smooth... *if* your browser’s hardware acceleration is on.  
(if it’s not… well, that’s where the next part comes in.)

---

# micr.dev/tree
![chrome-capture-2025-08-23](https://github.com/user-attachments/assets/e2543240-0c2b-4825-bd31-b7e091c76c34)

here’s [micr.dev/tree](https://micr.dev/tree), a minimal landing page linking to all my other pages.  
basically an index.

i made it because a lot of people thought the 3d site froze or crashed before realizing it just needed a few extra seconds.  
this solves that. one link, no waiting.

---

# micr.dev/about
<img width="1843" height="983" alt="Screenshot_1325" src="https://github.com/user-attachments/assets/b0be87e9-e013-48db-94c0-17dfb1037adb" />

i’ve always had terrible passive recall; stuff like “what films inspire me?” or “what fragrance was that again?” just disappears.  
so i made [micr.dev/about](https://micr.dev/about). part portfolio, part personal archive.

the design pulls heavy inspiration from aphex twin’s *[syro](https://en.wikipedia.org/wiki/Syro)* album art.  
side by side it’s pretty obvious. i fell in love with its minimalism, clean type, and neutral greens. so i decided to make my own version.

the page starts with a short intro (name, pronouns, quick overview),  
then lists what i enjoy → series, anime, films, games, art styles, fashion, fonts, music, and random entries at the end.  
some are images, some are links that open in new tabs.  
hover tooltips show a black label with the item name, clean and readable.

the “syro cd” artwork got replaced with a full-body commission of my character **[quarzite](https://micr.dev/quarzite)**, drawn by [@masarapmaruya](https://twitter.com/masarapmaruya).  

all data is neatly organized into a `.json` file, so i can update stuff easily.  
font used: **DecimaMono**, same as the *syro* cover.

under the hood, the page is almost entirely data-driven. the main file, `index.html`, is more of a skeleton; mostly empty except for a few containers like `<div class="grid-container">`.  
when the page loads, `script.js` fetches the contents of `data.json` asynchronously and uses `document.createElement()` to generate every entry on the fly. nothing is hardcoded. it loops through each section in the data and maps properties like `image`, `link`, and `name` to actual html attributes.  

tooltip text is handled entirely in css using `content: attr(data-tooltip)` for hover states, and the layout runs on a single grid rule:

```css
grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
```

that one line makes the page automatically responsive without a single media query.  
it’s a simple system, but it behaves more like a tiny single-page app than a traditional static webpage. content is completely separate from design, so it’s easy to grow, maintain, or redesign whenever i want.

---

# micr.dev/quarzite
![chrome-capture-2025-08-23 (3)](https://github.com/user-attachments/assets/ceb2403f-74f3-43fb-8eec-49eb4db99ab3)

i created [quarzite](https://micr.dev/quarzite) in +-2022, a sort-of digital version of myself for online spaces.  
i slowly collected art and commissions but never had a good place to show them off.  
that changed when i came across [dimden’s oc gallery](https://dimden.dev/gallery/) in early 2025.

the simplicity of that site hit me, i wanted to recreate that same vibe.  
something that didn’t outshine the art, but still had interactivity and charm.

i almost went full *neocities y2k*, but honestly, i didn’t have the hours & patience for that level of detail.  
then i discovered [98.css](https://jdan.github.io/98.css): that sealed the deal.

everything on the page is built from simple html components styled by it:  
`<div class="window">`, `<div class="title-bar">`, and `<div class="window-body">` form the base structure.  
each window is draggable, resizable, and layered using a small custom javascript file. internally, the script tracks one shared variable called `highestZ`. each time you click a window, its z-index updates to match that new number, keeping the active one on top. the drag behavior uses the standard `mousedown`, `mousemove`, and `mouseup` cycle: the script grabs your starting cursor position, calculates the offsets while moving, and updates the window coordinates in real time. letting go of the mouse ends the drag cleanly.  

a separate section of the code handles window content and randomness. when the page loads, the script runs a tiny randomizer that decides what fills the bottom right window. sometimes it’s a [clippy](https://en.wikipedia.org/wiki/Office_Assistant) quote, sometimes a notepad, and sometimes a small embedded [jspaint](https://jspaint.app/) session. more than **40 different scenarios** are possible:

* 35+ clippy quotes  
* 8 notepad layouts  
* 1 paint window *(3/30 chance of appearing)*  

sound design comes from [howler.js](https://howlerjs.com/), giving each action (opening, clicking, closing...) a small audio response. it’s subtle but makes everything feel tactile.

design-wise, the gallery follows a simple structure: `200x200px` thumbnails you can click to open a popup with more info. each one includes artist names, dates, and sometimes small trivia about how or why i commissioned that piece. there’s also an “information” window that describes quarzite’s character in more detail.

then there’s the tiny [neko cursor cat](https://en.wikipedia.org/wiki/Neko_(software)). the script behind it loops every few milliseconds, switching sprite frames depending on what it’s doing. it checks your cursor’s position and follows it when you click to wake it up, or idles when the mouse is still. it’s simple, but it adds the illusion of a little companion quietly existing on your desktop.

oh, and don’t forget neko. the small [neko cursor cat](https://en.wikipedia.org/wiki/Neko_(software)) quietly lives on the desktop, waiting to be clicked awake. it doesn’t do much on its own.

---

# micr.dev/microkeebs
<img width="1899" height="953" alt="Screenshot_1316" src="https://github.com/user-attachments/assets/c5cab624-7b15-4969-8996-3087c7e60623" />

[wip](https://micr.dev/microkeebs) → a work-in-progress section about my custom keyboards webpage.

---

# micr.dev/wip
[screenshot]

self-explanatory placeholder.

---

# license

**© [micr.dev](https://micr.dev) 2025 ∷ all rights reserved.**

all code, design, writing, and media assets in this repository are fully owned by me.  
nothing in this repo may be copied, reused, modified, or distributed without my explicit written permission.  
this includes, but is not limited to: text, code structure, layouts, json data, 3d scenes, and all embedded graphics.

commissions and collaborative works remain the property of their respective artists, used here with permission.  

you may view the repository and its contents for personal reference only.  
no other use is authorized.
