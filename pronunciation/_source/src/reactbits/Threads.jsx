// Adapted from React Bits — Threads (ogl). Flowing lines, like voices.
// Changes: configurable line count, pixel ratio capped at 1, paused when off-screen,
// a single still frame for reduced motion.
import React, { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle, Color } from 'ogl';

const vertexShader = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;
const fragmentShader = (lines, width) => `#define LINE_COUNT ${lines}
#define LINE_WIDTH ${width.toFixed(1)}

precision highp float;

uniform float iTime;
uniform vec3 iResolution;
uniform vec3 uColor;
uniform float uAmplitude;
uniform float uDistance;
uniform vec2 uMouse;

#define PI 3.1415926538

const int u_line_count = LINE_COUNT;
const float u_line_width = LINE_WIDTH;
const float u_line_blur = 10.0;

float Perlin2D(vec2 P) {
    vec2 Pi = floor(P);
    vec4 Pf_Pfmin1 = P.xyxy - vec4(Pi, Pi + 1.0);
    vec4 Pt = vec4(Pi.xy, Pi.xy + 1.0);
    Pt = Pt - floor(Pt * (1.0 / 71.0)) * 71.0;
    Pt += vec2(26.0, 161.0).xyxy;
    Pt *= Pt;
    Pt = Pt.xzxz * Pt.yyww;
    vec4 hash_x = fract(Pt * (1.0 / 951.135664));
    vec4 hash_y = fract(Pt * (1.0 / 642.949883));
    vec4 grad_x = hash_x - 0.49999;
    vec4 grad_y = hash_y - 0.49999;
    vec4 grad_results = inversesqrt(grad_x * grad_x + grad_y * grad_y)
        * (grad_x * Pf_Pfmin1.xzxz + grad_y * Pf_Pfmin1.yyww);
    grad_results *= 1.4142135623730950;
    vec2 blend = Pf_Pfmin1.xy * Pf_Pfmin1.xy * Pf_Pfmin1.xy
               * (Pf_Pfmin1.xy * (Pf_Pfmin1.xy * 6.0 - 15.0) + 10.0);
    vec4 blend2 = vec4(blend, vec2(1.0 - blend));
    return dot(grad_results, blend2.zxzx * blend2.wwyy);
}

float pixel(float count, vec2 resolution) {
    return (1.0 / max(resolution.x, resolution.y)) * count;
}

float lineFn(vec2 st, float width, float perc, float offset, vec2 mouse, float time, float amplitude, float distance) {
    float split_offset = (perc * 0.4);
    float split_point = 0.1 + split_offset;

    float amplitude_normal = smoothstep(split_point, 0.7, st.x);
    float amplitude_strength = 0.5;
    float finalAmplitude = amplitude_normal * amplitude_strength
                           * amplitude * (1.0 + (mouse.y - 0.5) * 0.2);

    float time_scaled = time / 10.0 + (mouse.x - 0.5) * 1.0;
    float blur = smoothstep(split_point, split_point + 0.05, st.x) * perc;

    float xnoise = mix(
        Perlin2D(vec2(time_scaled, st.x + perc) * 2.5),
        Perlin2D(vec2(time_scaled, st.x + time_scaled) * 3.5) / 1.5,
        st.x * 0.3
    );

    float y = 0.5 + (perc - 0.5) * distance + xnoise / 2.0 * finalAmplitude;

    float line_start = smoothstep(
        y + (width / 2.0) + (u_line_blur * pixel(1.0, iResolution.xy) * blur),
        y,
        st.y
    );

    float line_end = smoothstep(
        y,
        y - (width / 2.0) - (u_line_blur * pixel(1.0, iResolution.xy) * blur),
        st.y
    );

    return clamp(
        (line_start - line_end) * (1.0 - smoothstep(0.0, 1.0, pow(perc, 0.3))),
        0.0,
        1.0
    );
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution.xy;

    float line_strength = 1.0;
    for (int i = 0; i < u_line_count; i++) {
        float p = float(i) / float(u_line_count);
        line_strength *= (1.0 - lineFn(
            uv,
            u_line_width * pixel(1.0, iResolution.xy) * (1.0 - p),
            p,
            (PI * 1.0) * p,
            uMouse,
            iTime,
            uAmplitude,
            uDistance
        ));
    }

    float colorVal = 1.0 - line_strength;
    fragColor = vec4(uColor * colorVal, colorVal);
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
`;

export default function Threads({ color = [0.06, 0.24, 0.13], amplitude = 1, distance = 0, lines = 24, lineWidth = 6, interactive = true, className = '' }) {
  const ref = useRef(null);
  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let renderer;
    try { renderer = new Renderer({ alpha: true, dpr: 1, antialias: false }); } catch (e) { return; }
    const gl = renderer.gl;
    if (!gl) return;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    container.appendChild(gl.canvas);
    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader(lines, lineWidth),
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new Color(1, 1, 1) },
        uColor: { value: new Color(...color) },
        uAmplitude: { value: amplitude },
        uDistance: { value: distance },
        uMouse: { value: new Float32Array([0.5, 0.5]) }
      }
    });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });
    const resize = () => {
      const w = container.clientWidth, h = container.clientHeight;
      renderer.setSize(w, h);
      program.uniforms.iResolution.value.r = w;
      program.uniforms.iResolution.value.g = h;
      program.uniforms.iResolution.value.b = w / Math.max(1, h);
    };
    const ro = new ResizeObserver(resize); ro.observe(container); resize();
    let cur = [0.5, 0.5], tgt = [0.5, 0.5];
    const mm = (e) => { const r = container.getBoundingClientRect(); tgt = [(e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height]; };
    if (interactive) window.addEventListener('pointermove', mm);
    let raf = 0, visible = true, t0 = performance.now();
    const io = new IntersectionObserver(es => { visible = es[0].isIntersecting; if (visible && !raf && !reduce) raf = requestAnimationFrame(loop); });
    io.observe(container);
    function frame(t) {
      cur[0] += 0.04 * (tgt[0] - cur[0]); cur[1] += 0.04 * (tgt[1] - cur[1]);
      program.uniforms.uMouse.value[0] = cur[0]; program.uniforms.uMouse.value[1] = cur[1];
      program.uniforms.iTime.value = (t - t0) * 0.001 + 12;
      renderer.render({ scene: mesh });
    }
    function loop(t) {
      raf = 0;
      if (!visible || document.hidden) return;
      frame(t);
      raf = requestAnimationFrame(loop);
    }
    if (reduce) frame(performance.now()); else raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf); io.disconnect(); ro.disconnect();
      if (interactive) window.removeEventListener('pointermove', mm);
      if (container.contains(gl.canvas)) container.removeChild(gl.canvas);
      const ext = gl.getExtension('WEBGL_lose_context'); if (ext) ext.loseContext();
    };
  }, []);
  return <div ref={ref} className={`threads ${className}`} aria-hidden="true" />;
}
