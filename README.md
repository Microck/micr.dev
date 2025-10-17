# micr.dev
![portfolio](https://github.com/user-attachments/assets/1ec0295e-3ea7-4a8c-961d-9bcf9ca4d1eb)

a small [3d portfolio site](https://micr.dev) made with [spline](https://spline.design).  
looks cool, runs smooth... *if* your browser’s hardware acceleration is on.  
(if it’s not… well, that’s where the next part comes in)

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

tooltip text is handled entirely in css using `content: attr(data-tooltip)` for hover states, and the layout runs on a single grid rule: `grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));`

that one line makes the page automatically responsive without a single media query.  
it’s a simple system, but it behaves more like a tiny single-page app than a traditional static webpage. content is completely separate from design, so it’s easy to grow, maintain, or redesign whenever i want.

---

# micr.dev/quarzite
<img width="1899" height="953" alt="Screenshot_1316" src="https://github.com/user-attachments/assets/ceb2403f-74f3-43fb-8eec-49eb4db99ab3" />

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

oh, and don’t forget neko. the small [neko cursor cat](https://en.wikipedia.org/wiki/Neko_(software)) quietly lives on the desktop, waiting to be clicked awake. it doesn’t do much on its own.

---

# micr.dev/microkeebs
<img width="1899" height="953" alt="Screenshot_1316" src="https://github.com/user-attachments/assets/c5cab624-7b15-4969-8996-3087c7e60623" />

[**micr.dev/microkeebs**](https://micr.dev/microkeebs) is a complete system built to catalog, display, and rank my mechanical keyboards. it’s fully structured: every card, every filter, and every ranking is generated from data files, not static html. what looks like a simple gallery is an organized design + data layer that scales as the collection grows.

the main **builds page** shows all keyboards in a responsive grid. you can switch between `all`, `mx`, and `ec`, sort by **newest** or **oldest**, and optionally toggle **timestamps** (ex. _DD/MM/YYYY_) or **build info** (ex. _cherry mx blacks_ or _lubed and silenced_). theme switches between light and dark via a small react context and persists to localStorage.

each keyboard card links to its own page with a predictable **url structure**:
1. base: `https://micr.dev/microkeebs/#/builds/{slug}`
2. slug is the lowercase, hyphenated title
3. if a model has multiple distinct builds, the path appends a counter in chronological order: `/{slug}/1`, `/{slug}/2`, `/{slug}/3`  
  the unsuffixed path resolves to the first build of that title

examples:
- geonworks f1-8x v2 (dry cherry mx2a browns)  
  https://micr.dev/microkeebs/#/builds/geonworks-f1-8x-v2
- 2007 hhkb pro 2 (lubed & silenced)  
  https://micr.dev/microkeebs/#/builds/2007-hhkb-pro-2
- tgr jane v2 ce (multiple builds)  
  https://micr.dev/microkeebs/#/builds/tgr-jane-v2-ce/1  
  https://micr.dev/microkeebs/#/builds/tgr-jane-v2-ce/2

each build page has a large **image carousel** with thumbnails, a **sound test embed**, and a clean **specs list**. fields are consistent across boards: `keyboard`, `switches` or `domes`, `lube`, `films`, `springs`, `plate`, `mount`, `stabilizers`, `pcb`, `artisans` or `notes`. empty or “-” values are hidden to keep it readable.

the ranking view is split into categories: *all*, *look*,*sound*, *feel*, *mechanical*, and *electrocapacitive*. the source of truth for this is a single `rankings.json` file. it’s a simple system: each category **is just an array of youtube video ids**. the app reads those ids, finds the matching keyboard in `builds.json`, and renders the list in order. no complex logic, just a map. if i want to change the rankings, i just reorder the ids in that file.

the site runs on a simple `hash-based router`. all navigation, from the gallery to a specific build page, is handled by listening for changes in the url after the `#`. the rules for slugs live in `utils/slugUtils.ts`. a `slugify` function turns keyboard titles into clean, lowercase urls. if a board has multiple builds, the script sorts them by date and assigns a number, like `/tgr-jane-v2-ce/1` and `/tgr-jane-v2-ce/2`. it keeps the links stable and predictable.

the data pipeline is **semi‑automated**:

1. a node script connects to the youtube api using a key and two playlist ids *(one for `mx`, one for `ec`)*  
2. it fetches all video metadata, cleans up the titles, parses the description for specs, downloads the highest‑res thumbnail, and writes everything to `builds.json`  
3. two small python scripts handle image management:  
 → one converts everything to lossless webp for performance  
 → the other deletes the original file once the webp version is confirmed to exist

`builds.json` is the catalog. each item includes `id` (youtube id), `title`, `youtubeTitle`, `category` (mx or ec), `timestamp`, `images[]`, `youtubeUrl`, and `specs{}`. build info under the card title is derived from the video title with small heuristics. for `ec` it recognizes “lubed and silenced”, “lubed”, and “stock”. for `mx` it grabs everything after “ with ” (also handles “ con ” for spanish titles), including “dry”, “unlubed”, etc.

the design itself is built with `tailwind`, using `consolas` for body text and `share tech mono` for titles. animations are handled with a few custom css classes for fades, slides, and a soft float on the ranking numbers. the gold, silver, and bronze gradients for the top three ranks are just a small touch to make the lists feel a bit more special.
the theme toggle is a simple react context that writes `light` or `dark` to `localStorage`, so your choice is remembered. there’s also a small notice for mobile users that stores its dismissed state in `localStorage` so it doesn’t reappear. images are served from `public/images/{videoId}/`, with components showing a loading skeleton and a placeholder if an asset fails to load.

the whole system is designed to be easy to maintain. to add a new build, i just upload the video to the right youtube playlist and run the node script. to change the rankings, i just edit the `rankings.json` file. the ui takes care of the rest. the result is a semi-automated archive that stays consistent. clean and easy to browse.

---

# micr.dev/wip
<img width="1919" height="395" alt="wip" src="https://github.com/user-attachments/assets/f51d2c95-7b60-4b55-aa04-49168b922dde" />

self-explanatory placeholder me thinks.

---

# license

**© _micr.dev_ 2025 ∷ all rights reserved.**

all code, design, writing, and media assets in this repository are fully owned by me.  
nothing in this repo may be copied, reused, modified, or distributed without my explicit written permission.  
this includes, but is not limited to: text, code structure, layouts, json data, 3d scenes, and all embedded graphics.

commissions and collaborative works remain the property of their respective artists, used here with permission.  

you may view the repository and its contents for personal reference only.  
no other use is authorized.
