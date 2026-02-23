/**
 * CRT Effect Integration for micr.dev
 */

import { CRTEffect } from './crt-effect.js';

let crtEffect = null;

function createToggleButton(crt) {
  const existing = document.getElementById('crt-toggle-button');
  if (existing) return;

  const button = document.createElement('button');
  button.id = 'crt-toggle-button';
  button.type = 'button';
  button.title = 'Toggle CRT effect';
  button.setAttribute('aria-label', 'Toggle CRT effect');
  button.innerHTML = `
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
      <rect x="3.5" y="4.5" width="17" height="11.5" rx="1.8" ry="1.8" fill="none" stroke="currentColor" stroke-width="1.5"/>
      <path d="M8 19h8M10.5 16.5v2.5M13.5 16.5v2.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
      <path d="M6.3 8.2h11.4M6.3 10.2h11.4M6.3 12.2h11.4" stroke="currentColor" stroke-width="1" stroke-linecap="round" opacity="0.75"/>
    </svg>
  `;
  button.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    z-index: 10000;
    width: 28px;
    height: 28px;
    border: 1px solid rgba(255, 255, 255, 0.55);
    border-radius: 999px;
    background: rgba(0, 0, 0, 0.45);
    color: rgba(255, 255, 255, 0.82);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    opacity: 0.32;
    transition: opacity 140ms ease, background 140ms ease, color 140ms ease;
    padding: 0;
  `;

  const syncVisual = () => {
    if (crt.enabled) {
      button.style.opacity = '0.32';
      button.style.background = 'rgba(0, 0, 0, 0.45)';
      button.style.color = 'rgba(255, 255, 255, 0.82)';
    } else {
      button.style.opacity = '0.52';
      button.style.background = 'rgba(20, 0, 0, 0.65)';
      button.style.color = 'rgba(255, 160, 160, 0.95)';
    }
  };

  button.addEventListener('mouseenter', () => {
    button.style.opacity = crt.enabled ? '0.56' : '0.70';
  });

  button.addEventListener('mouseleave', () => {
    syncVisual();
  });

  button.addEventListener('click', () => {
    crt.toggle();
    syncVisual();
  });

  syncVisual();
  document.body.appendChild(button);
}

export function initCRTEffect(canvas) {
  if (crtEffect) {
    console.warn('CRT effect already initialized');
    return crtEffect;
  }

  crtEffect = new CRTEffect(canvas, {
    scanlineIntensity: 0.40,
    scanlineCount: 730,
    barrelDistortion: 0.22,
    crtZoom: 0.82,
    fitStrength: 0.82,
    keystoneFit: 0.06,
    borderCutoff: 0.0,
    keystoneX: 0.0,
    keystoneY: 0.0,
    vignetteIntensity: 0.65,
    chromaticAberration: 0.002,
    moireStrength: 1.0,
    noiseIntensity: 0.10,
    staticSpeed: 10.0,
    staticContrast: 1.0,
    curveAmount: 0.08,
    brightness: 1.15,
    contrast: 1.08,
    saturation: 1.05
  });

  crtEffect.start();
  createToggleButton(crtEffect);

  window.crtEffect = crtEffect;
  window.toggleCRT = () => crtEffect.toggle();

  console.log('%cCRT Effect enabled', 'color: #33ff66; font-family: monospace;');

  return crtEffect;
}
