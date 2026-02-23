/**
 * CRT Effect for micr.dev
 * WebGL post-processing with proper click-through
 */

export class CRTEffect {
  constructor(sourceCanvas, options = {}) {
    this.sourceCanvas = sourceCanvas;
    this.options = {
      scanlineIntensity: options.scanlineIntensity ?? 0.40,
      scanlineCount: options.scanlineCount ?? 730,
      barrelDistortion: options.barrelDistortion ?? 0.22,
      keystoneX: options.keystoneX ?? 0.0,
      keystoneY: options.keystoneY ?? 0.0,
      crtZoom: options.crtZoom ?? 0.82,
      fitStrength: options.fitStrength ?? 0.82,
      keystoneFit: options.keystoneFit ?? 0.06,
      borderCutoff: options.borderCutoff ?? 0.0,
      vignetteIntensity: options.vignetteIntensity ?? 0.65,
      chromaticAberration: options.chromaticAberration ?? 0.002,
      moireStrength: options.moireStrength ?? 1.0,
      noiseIntensity: options.noiseIntensity ?? 0.10,
      staticSpeed: options.staticSpeed ?? 10.0,
      staticContrast: options.staticContrast ?? 1.0,
      brightness: options.brightness ?? 1.15,
      contrast: options.contrast ?? 1.08,
      saturation: options.saturation ?? 1.05,
      curveAmount: options.curveAmount ?? 0.08,
      ...options
    };

    this.enabled = true;
    this.time = 0;
    
    this.init();
  }

  init() {
    this.createCopyCanvas();
    this.createWebGLCanvas();
    this.createShaders();
    this.setupGeometry();
    this.resize();
    
    window.addEventListener('resize', () => this.resize());
    
    this.lastTime = performance.now();
    this.render();
    
    console.log('%c🖥️ CRT Effect enabled', 'color: #33ff66;');
  }

  createCopyCanvas() {
    this.copyCanvas = document.createElement('canvas');
    this.copyCtx = this.copyCanvas.getContext('2d');
  }

  createWebGLCanvas() {
    this.glCanvas = document.createElement('canvas');
    this.glCanvas.id = 'crt-output';
    this.glCanvas.style.cssText = `
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 9999;
    `;
    
    this.gl = this.glCanvas.getContext('webgl2', {
      alpha: false,
      antialias: false,
      preserveDrawingBuffer: false
    });
    
    if (!this.gl) {
      this.gl = this.glCanvas.getContext('webgl', {
        alpha: false,
        antialias: false
      });
    }
    
    if (!this.gl) {
      throw new Error('WebGL not supported');
    }
    
    this.webgl2 = this.gl instanceof WebGL2RenderingContext;
    document.body.appendChild(this.glCanvas);
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    
    this.glCanvas.width = Math.floor(w * dpr);
    this.glCanvas.height = Math.floor(h * dpr);
    this.gl.viewport(0, 0, this.glCanvas.width, this.glCanvas.height);
    this.resolution = [this.glCanvas.width, this.glCanvas.height];
    
    this.sourceCanvas.style.width = w + 'px';
    this.sourceCanvas.style.height = h + 'px';
  }

  createShaders() {
    const gl = this.gl;
    
    const vs = this.webgl2 ? `#version 300 es
      in vec2 a_position;
      in vec2 a_texCoord;
      out vec2 v_texCoord;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_texCoord = a_texCoord;
      }
    ` : `
      attribute vec2 a_position;
      attribute vec2 a_texCoord;
      varying vec2 v_texCoord;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_texCoord = a_texCoord;
      }
    `;

    const fs = this.webgl2 ? `#version 300 es
      precision highp float;
      in vec2 v_texCoord;
      out vec4 fragColor;
      
      uniform sampler2D u_tex;
      uniform float u_barrel;
      uniform float u_keystoneX;
      uniform float u_keystoneY;
      uniform float u_zoom;
      uniform float u_fitStrength;
      uniform float u_keystoneFit;
      uniform float u_borderCutoff;
      uniform float u_vignette;
      uniform float u_scanline;
      uniform float u_scanlineCount;
      uniform float u_chroma;
      uniform float u_moire;
      uniform float u_noise;
      uniform float u_staticSpeed;
      uniform float u_staticContrast;
      uniform float u_brightness;
      uniform float u_contrast;
      uniform float u_saturation;
      uniform float u_curve;
      uniform float u_time;
      
      float rand(vec2 co) {
        return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
      }
      
      vec2 barrel(vec2 uv, float k) {
        vec2 c = uv - 0.5;
        float r2 = dot(c, c);
        float f = 1.0 + r2 * k;
        return c * f + 0.5;
      }

      vec2 keystone(vec2 uv, float kx, float ky) {
        vec2 p = uv - 0.5;
        float sy = 1.0 + p.y * kx;
        float sx = 1.0 + p.x * ky;
        p.x *= sy;
        p.y *= sx;
        return p + 0.5;
      }
      
      void main() {
        float kTotal = u_barrel + u_curve * 0.5;
        float fit = 1.0 + u_fitStrength * max(kTotal, 0.0) + u_keystoneFit * (abs(u_keystoneX) + abs(u_keystoneY));
        vec2 uv = keystone(v_texCoord, u_keystoneX, u_keystoneY);
        uv = (uv - 0.5) / max(u_zoom * fit, 0.01) + 0.5;
        uv = barrel(uv, kTotal);
        vec2 uvBorder = uv;

        uv = clamp(uv, 0.0, 1.0);
        
        vec2 d = uv - 0.5;
        float dist = length(d);
        vec2 dir = dist > 0.0 ? normalize(d) : vec2(0.0);
        
        vec3 col;
        col.r = texture(u_tex, uv + dir * dist * u_chroma).r;
        col.g = texture(u_tex, uv).g;
        col.b = texture(u_tex, uv - dir * dist * u_chroma).b;
        
        float sl = sin(uv.y * u_scanlineCount * 3.14159) * 0.5 + 0.5;
        col *= mix(1.0, sl, u_scanline);
        
        float vig = 1.0 - smoothstep(0.3, 1.0, length(uv - 0.5) * u_vignette);
        col *= vig;
        
        float noisePhase = floor(u_time * max(u_staticSpeed, 0.01) * 24.0);
        float rawNoise = rand(gl_FragCoord.xy + vec2(noisePhase, noisePhase * 0.73));
        float shapedNoise = mix(rawNoise, step(0.5, rawNoise), clamp(u_staticContrast, 0.0, 1.0));
        col += (shapedNoise - 0.5) * u_noise;

        float moire = sin((uv.x + uv.y) * 900.0) * sin((uv.x - uv.y) * 900.0);
        col += moire * u_moire * 0.02;
        
        col = (col - 0.5) * u_contrast + 0.5;
        col *= u_brightness;
        
        float gray = dot(col, vec3(0.299, 0.587, 0.114));
        col = mix(vec3(gray), col, u_saturation);

        float edge = min(min(uvBorder.x, 1.0 - uvBorder.x), min(uvBorder.y, 1.0 - uvBorder.y));
        float border = step(max(u_borderCutoff, 0.0), edge);
        col *= border;
        
        fragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
      }
    ` : `
      precision highp float;
      varying vec2 v_texCoord;
      uniform sampler2D u_tex;
      uniform float u_barrel;
      uniform float u_keystoneX;
      uniform float u_keystoneY;
      uniform float u_zoom;
      uniform float u_fitStrength;
      uniform float u_keystoneFit;
      uniform float u_borderCutoff;
      uniform float u_vignette;
      uniform float u_scanline;
      uniform float u_scanlineCount;
      uniform float u_chroma;
      uniform float u_moire;
      uniform float u_noise;
      uniform float u_staticSpeed;
      uniform float u_staticContrast;
      uniform float u_brightness;
      uniform float u_contrast;
      uniform float u_saturation;
      uniform float u_curve;
      uniform float u_time;
      
      float rand(vec2 co) {
        return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
      }
      
      vec2 barrel(vec2 uv, float k) {
        vec2 c = uv - 0.5;
        return c * (1.0 + dot(c, c) * k) + 0.5;
      }

      vec2 keystone(vec2 uv, float kx, float ky) {
        vec2 p = uv - 0.5;
        float sy = 1.0 + p.y * kx;
        float sx = 1.0 + p.x * ky;
        p.x *= sy;
        p.y *= sx;
        return p + 0.5;
      }
      
      void main() {
        float kTotal = u_barrel + u_curve * 0.5;
        float fit = 1.0 + u_fitStrength * max(kTotal, 0.0) + u_keystoneFit * (abs(u_keystoneX) + abs(u_keystoneY));
        vec2 uv = keystone(v_texCoord, u_keystoneX, u_keystoneY);
        uv = (uv - 0.5) / max(u_zoom * fit, 0.01) + 0.5;
        uv = barrel(uv, kTotal);
        vec2 uvBorder = uv;

        uv = clamp(uv, 0.0, 1.0);
        
        vec2 d = uv - 0.5;
        float dist = length(d);
        vec2 dir = dist > 0.0 ? normalize(d) : vec2(0.0);
        
        vec3 col;
        col.r = texture2D(u_tex, uv + dir * dist * u_chroma).r;
        col.g = texture2D(u_tex, uv).g;
        col.b = texture2D(u_tex, uv - dir * dist * u_chroma).b;
        
        float sl = sin(uv.y * u_scanlineCount * 3.14159) * 0.5 + 0.5;
        col *= mix(1.0, sl, u_scanline);
        
        col *= 1.0 - smoothstep(0.3, 1.0, length(uv - 0.5) * u_vignette);
        
        float noisePhase = floor(u_time * max(u_staticSpeed, 0.01) * 24.0);
        float rawNoise = rand(gl_FragCoord.xy + vec2(noisePhase, noisePhase * 0.73));
        float shapedNoise = mix(rawNoise, step(0.5, rawNoise), clamp(u_staticContrast, 0.0, 1.0));
        col += (shapedNoise - 0.5) * u_noise;

        float moire = sin((uv.x + uv.y) * 900.0) * sin((uv.x - uv.y) * 900.0);
        col += moire * u_moire * 0.02;
        
        col = (col - 0.5) * u_contrast + 0.5;
        col *= u_brightness;
        
        float gray = dot(col, vec3(0.299, 0.587, 0.114));
        col = mix(vec3(gray), col, u_saturation);

        float edge = min(min(uvBorder.x, 1.0 - uvBorder.x), min(uvBorder.y, 1.0 - uvBorder.y));
        float border = step(max(u_borderCutoff, 0.0), edge);
        col *= border;
        
        gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
      }
    `;

    const vShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vShader, vs);
    gl.compileShader(vShader);
    
    const fShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fShader, fs);
    gl.compileShader(fShader);
    
    this.program = gl.createProgram();
    gl.attachShader(this.program, vShader);
    gl.attachShader(this.program, fShader);
    gl.linkProgram(this.program);
    
    this.uniforms = {
      tex: gl.getUniformLocation(this.program, 'u_tex'),
      barrel: gl.getUniformLocation(this.program, 'u_barrel'),
      keystoneX: gl.getUniformLocation(this.program, 'u_keystoneX'),
      keystoneY: gl.getUniformLocation(this.program, 'u_keystoneY'),
      zoom: gl.getUniformLocation(this.program, 'u_zoom'),
      fitStrength: gl.getUniformLocation(this.program, 'u_fitStrength'),
      keystoneFit: gl.getUniformLocation(this.program, 'u_keystoneFit'),
      borderCutoff: gl.getUniformLocation(this.program, 'u_borderCutoff'),
      vignette: gl.getUniformLocation(this.program, 'u_vignette'),
      scanline: gl.getUniformLocation(this.program, 'u_scanline'),
      scanlineCount: gl.getUniformLocation(this.program, 'u_scanlineCount'),
      chroma: gl.getUniformLocation(this.program, 'u_chroma'),
      moire: gl.getUniformLocation(this.program, 'u_moire'),
      noise: gl.getUniformLocation(this.program, 'u_noise'),
      staticSpeed: gl.getUniformLocation(this.program, 'u_staticSpeed'),
      staticContrast: gl.getUniformLocation(this.program, 'u_staticContrast'),
      brightness: gl.getUniformLocation(this.program, 'u_brightness'),
      contrast: gl.getUniformLocation(this.program, 'u_contrast'),
      saturation: gl.getUniformLocation(this.program, 'u_saturation'),
      curve: gl.getUniformLocation(this.program, 'u_curve'),
      time: gl.getUniformLocation(this.program, 'u_time')
    };
    
    this.aPos = gl.getAttribLocation(this.program, 'a_position');
    this.aTex = gl.getAttribLocation(this.program, 'a_texCoord');
  }

  setupGeometry() {
    const gl = this.gl;
    
    // Y-flipped texture coords (1-y) to fix upside-down
    const verts = new Float32Array([
      -1, -1, 0, 1,
       1, -1, 1, 1,
      -1,  1, 0, 0,
       1,  1, 1, 0
    ]);
    
    this.vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
    gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);
    
    this.ibo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0,1,2,2,1,3]), gl.STATIC_DRAW);
    
    this.tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  }

  render() {
    if (!this.enabled) {
      requestAnimationFrame(() => this.render());
      return;
    }
    
    const now = performance.now();
    this.time = now / 1000;
    
    const gl = this.gl;
    const sw = this.sourceCanvas.width;
    const sh = this.sourceCanvas.height;
    
    // Copy source canvas to our 2D canvas
    if (sw > 0 && sh > 0) {
      if (this.copyCanvas.width !== sw || this.copyCanvas.height !== sh) {
        this.copyCanvas.width = sw;
        this.copyCanvas.height = sh;
      }
      this.copyCtx.drawImage(this.sourceCanvas, 0, 0);
      
      // Update texture
      gl.bindTexture(gl.TEXTURE_2D, this.tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.copyCanvas);
    }
    
    // Render
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    gl.useProgram(this.program);
    
    gl.uniform1i(this.uniforms.tex, 0);
    gl.uniform1f(this.uniforms.barrel, this.options.barrelDistortion);
    gl.uniform1f(this.uniforms.keystoneX, this.options.keystoneX);
    gl.uniform1f(this.uniforms.keystoneY, this.options.keystoneY);
    gl.uniform1f(this.uniforms.zoom, this.options.crtZoom);
    gl.uniform1f(this.uniforms.fitStrength, this.options.fitStrength);
    gl.uniform1f(this.uniforms.keystoneFit, this.options.keystoneFit);
    gl.uniform1f(this.uniforms.borderCutoff, this.options.borderCutoff);
    gl.uniform1f(this.uniforms.vignette, this.options.vignetteIntensity);
    gl.uniform1f(this.uniforms.scanline, this.options.scanlineIntensity);
    gl.uniform1f(this.uniforms.scanlineCount, this.options.scanlineCount);
    gl.uniform1f(this.uniforms.chroma, this.options.chromaticAberration);
    gl.uniform1f(this.uniforms.moire, this.options.moireStrength);
    gl.uniform1f(this.uniforms.noise, this.options.noiseIntensity);
    gl.uniform1f(this.uniforms.staticSpeed, this.options.staticSpeed);
    gl.uniform1f(this.uniforms.staticContrast, this.options.staticContrast);
    gl.uniform1f(this.uniforms.brightness, this.options.brightness);
    gl.uniform1f(this.uniforms.contrast, this.options.contrast);
    gl.uniform1f(this.uniforms.saturation, this.options.saturation);
    gl.uniform1f(this.uniforms.curve, this.options.curveAmount);
    gl.uniform1f(this.uniforms.time, this.time);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
    gl.enableVertexAttribArray(this.aPos);
    gl.vertexAttribPointer(this.aPos, 2, gl.FLOAT, false, 16, 0);
    gl.enableVertexAttribArray(this.aTex);
    gl.vertexAttribPointer(this.aTex, 2, gl.FLOAT, false, 16, 8);
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    
    requestAnimationFrame(() => this.render());
  }

  updateOptions(opts) {
    Object.assign(this.options, opts);
  }

  start() {
    this.enabled = true;
    this.glCanvas.style.display = 'block';
  }

  stop() {
    this.enabled = false;
    this.glCanvas.style.display = 'none';
  }

  toggle() {
    if (this.enabled) {
      this.stop();
    } else {
      this.start();
    }
  }

  dispose() {
    this.enabled = false;
    this.glCanvas.remove();
  }
}
