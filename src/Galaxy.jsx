import { Color, Mesh, Program, Renderer, Triangle } from 'ogl';
import { useEffect, useRef } from 'react';

// Shader simplificado y optimizado
const vertexShader = `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0, 1);
}
`;

const fragmentShader = `
precision highp float;
uniform float uTime;
uniform vec3 uResolution;
uniform float uStarSpeed;
uniform vec2 uMouse;
uniform float uGlowIntensity;

varying vec2 vUv;

// Función de ruido aleatorio
float Hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

// Dibuja una estrella individual
float Star(vec2 uv, float flare) {
  float d = length(uv);
  // Reducimos el brillo base para evitar la "luz blanca" excesiva
  float m = (0.02 * uGlowIntensity) / d; 
  float rays = max(0.0, 1.0 - abs(uv.x * uv.y * 1000.0));
  m += rays * flare;
  uv *= mat2(0.707, -0.707, 0.707, 0.707);
  rays = max(0.0, 1.0 - abs(uv.x * uv.y * 1000.0));
  m += rays * 0.3 * flare;
  m *= smoothstep(1.0, 0.2, d);
  return m;
}

vec3 StarLayer(vec2 uv) {
  vec3 col = vec3(0.0);
  vec2 gv = fract(uv) - 0.5;
  vec2 id = floor(uv);
  
  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 offset = vec2(float(x), float(y));
      float n = Hash21(id + offset);
      float size = fract(n * 345.32);
      float star = Star(gv - offset - vec2(n, fract(n * 34.0)) + 0.5, smoothstep(0.9, 1.0, size));
      
      // Color más definido (Violeta/Azul/Rosa) y menos blanco
      vec3 color = sin(vec3(0.2, 0.3, 0.9) * fract(n * 2345.2) * 123.2) * 0.5 + 0.5;
      color = color * vec3(0.8, 0.6, 1.0); 
      
      col += star * size * color;
    }
  }
  return col;
}

void main() {
  vec2 uv = (vUv - 0.5) * uResolution.xy / uResolution.y;
  vec2 mouse = (uMouse - 0.5) * 0.2; // Suavizar movimiento mouse
  uv += mouse; 
  
  vec3 col = vec3(0.0);
  float t = uTime * 0.02; // Velocidad reducida para menos mareo
  
  // Reducimos a 3 capas para mejorar rendimiento (anti-lag)
  for (float i = 0.0; i < 1.0; i += 1.0/3.0) {
    float depth = fract(i + t);
    float scale = mix(20.0, 0.5, depth);
    float fade = depth * smoothstep(1.0, 0.9, depth);
    col += StarLayer(uv * scale + i * 453.2) * fade;
  }

  // Cálculo de transparencia corregido para evitar el cuadro blanco
  float alpha = length(col);
  alpha = smoothstep(0.0, 0.1, alpha); // Recorte de negro
  
  gl_FragColor = vec4(col, alpha);
}
`;

export default function Galaxy({ mouseInteraction = true }) {
  const ctnDom = useRef(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const ctn = ctnDom.current;
    if (!ctn) return;

    // IMPORTANTE: dpr: 1 evita el LAG en pantallas retina/4k
    const renderer = new Renderer({
      alpha: true,
      dpr: 1,
      premultipliedAlpha: false
    });

    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0); // Fondo totalmente transparente
    ctn.appendChild(gl.canvas);

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new Color(0, 0, 0) },
        uMouse: { value: new Float32Array([0.5, 0.5]) },
        uGlowIntensity: { value: 1.0 }, // Intensidad ajustada
        uStarSpeed: { value: 0.2 },
      },
      transparent: true
    });

    const mesh = new Mesh(gl, { geometry, program });

    function resize() {
      if (!ctn) return;
      const width = ctn.offsetWidth;
      const height = ctn.offsetHeight;
      renderer.setSize(width, height);
      program.uniforms.uResolution.value.set(width, height, 1);
    }
    window.addEventListener('resize', resize);
    resize();

    let animateId;
    function update(t) {
      animateId = requestAnimationFrame(update);
      program.uniforms.uTime.value = t * 0.001;

      // Suavizado del mouse (Lerp)
      const currentX = program.uniforms.uMouse.value[0];
      const currentY = program.uniforms.uMouse.value[1];
      program.uniforms.uMouse.value[0] += (mouseRef.current.x - currentX) * 0.05;
      program.uniforms.uMouse.value[1] += (mouseRef.current.y - currentY) * 0.05;

      renderer.render({ scene: mesh });
    }
    animateId = requestAnimationFrame(update);

    function onMove(e) {
      const x = e.clientX / window.innerWidth;
      const y = 1.0 - (e.clientY / window.innerHeight);
      mouseRef.current = { x, y };
    }

    if (mouseInteraction) {
      window.addEventListener('mousemove', onMove);
    }

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(animateId);
      if (ctn && gl.canvas) ctn.removeChild(gl.canvas);
    };
  }, [mouseInteraction]);

  return <div ref={ctnDom} style={{ width: '100%', height: '100%' }} />;
}