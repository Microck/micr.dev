/* color helpers */
function hexToRgb(h) {
  h = h.replace('#', '');
  if (h.length === 3) h = h.split('').map(c => c + c).join('');
  const n = parseInt(h, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb(h, s, l) {
  h /= 360; s /= 100; l /= 100;
  if (s === 0) {
    const v = Math.round(l * 255);
    return { r: v, g: v, b: v };
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1; if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const r = hue2rgb(p, q, h + 1 / 3);
  const g = hue2rgb(p, q, h);
  const b = hue2rgb(p, q, h - 1 / 3);
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

function adjustLight(hex, delta) {
  const { r, g, b } = hexToRgb(hex);
  const { h, s, l } = rgbToHsl(r, g, b);
  const nl = Math.max(0, Math.min(100, l + delta));
  const c = hslToRgb(h, s, nl);
  return rgbToHex(c.r, c.g, c.b);
}

/* build an SVG tile and return data URL */
function buildSVG(baseHex, sizePx) {
  const s = Math.max(6, Math.round(sizePx));
  const center = s / 2;
  const gridDark = adjustLight(baseHex, -44);
  const edgeDark = adjustLight(baseHex, -18);
  const cTL = adjustLight(baseHex, 36);
  const cTR = adjustLight(baseHex, 14);
  const cBR = adjustLight(baseHex, -10);
  const cBL = adjustLight(baseHex, 6);

  const sd = Math.max(0.2, s * 0.03);
  const dx = (sd * 1).toFixed(3);
  const dy = (sd * 1).toFixed(3);
  const std = (sd * 1).toFixed(3);

  const svg = (
`<svg xmlns='http://www.w3.org/2000/svg' width='${s}' height='${s}'
 viewBox='0 0 ${s} ${s}'>
  <defs>
    <linearGradient id='gTL' x1='${center}' y1='${center}' x2='1' y2='1'>
      <stop offset='0%' stop-color='${cTL}'/>
      <stop offset='100%' stop-color='${edgeDark}'/>
    </linearGradient>
    <linearGradient id='gTR' x1='${center}' y1='${center}' x2='${s-1}' y2='1'>
      <stop offset='0%' stop-color='${cTR}'/>
      <stop offset='100%' stop-color='${edgeDark}'/>
    </linearGradient>
    <linearGradient id='gBR' x1='${center}' y1='${center}' x2='${s-1}' y2='${s-1}'>
      <stop offset='0%' stop-color='${cBR}'/>
      <stop offset='100%' stop-color='${edgeDark}'/>
    </linearGradient>
    <linearGradient id='gBL' x1='${center}' y1='${center}' x2='1' y2='${s-1}'>
      <stop offset='0%' stop-color='${cBL}'/>
      <stop offset='100%' stop-color='${edgeDark}'/>
    </linearGradient>
    <filter id='f' x='-50%' y='-50%' width='200%' height='200%'>
      <feDropShadow dx='${dx}' dy='${dy}' stdDeviation='${std}'
        flood-color='#000' flood-opacity='0.45'/>
      <feDropShadow dx='-${dx}' dy='-${dy}' stdDeviation='${std}'
        flood-color='#fff' flood-opacity='0.06'/>
    </filter>
  </defs>
  <rect width='${s}' height='${s}' fill='${gridDark}'/>
  <g filter='url(#f)'>
    <polygon points='1,1 ${s-1},1 ${center},${center}' fill='url(#gTL)'/>
    <polygon points='${s-1},1 ${s-1},${s-1} ${center},${center}' fill='url(#gTR)'/>
    <polygon points='${s-1},${s-1} 1,${s-1} ${center},${center}' fill='url(#gBR)'/>
    <polygon points='1,${s-1} 1,1 ${center},${center}' fill='url(#gBL)'/>
  </g>
</svg>`
  );
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

function applyPattern(hex, size) {
  const dataUrl = buildSVG(hex, size);
  document.documentElement.style.setProperty('--pattern', `url("${dataUrl}")`);
  document.documentElement.style.setProperty('--tile-size', `${size}px`);
  const bg = adjustLight(hex, -44);
  document.documentElement.style.setProperty('--bg-color', bg);
}

// fixed settings
const THEME = '#8621E7';
const TILE = 10; // px
applyPattern(THEME, TILE);