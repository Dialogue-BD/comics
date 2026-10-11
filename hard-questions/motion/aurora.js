/* Aurora backdrop — a vanilla WebGL port of React Bits' <Aurora /> background
   (reactbits.dev, MIT + Commons Clause; original uses React + OGL). Rewritten
   without React or OGL so the activity stays a no-build static page.
   Colours ease between "moods" (hope, worry, wonder) set by the motion
   timeline; the canvas renders at reduced resolution because the light is
   soft anyway, which keeps it cheap on classroom phones. */

const VERT = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;
const FRAG = `precision highp float;
uniform float uTime;uniform float uAmp;uniform float uBlend;uniform vec2 uRes;
uniform vec3 uC0;uniform vec3 uC1;uniform vec3 uC2;
vec3 permute(vec3 x){return mod(((x*34.0)+1.0)*x,289.0);}
float snoise(vec2 v){
  const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
  vec2 i=floor(v+dot(v,C.yy));vec2 x0=v-i+dot(i,C.xx);
  vec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);
  vec4 x12=x0.xyxy+C.xxzz;x12.xy-=i1;i=mod(i,289.0);
  vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));
  vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0);
  m=m*m;m=m*m;
  vec3 x=2.0*fract(p*C.www)-1.0;vec3 h=abs(x)-0.5;vec3 ox=floor(x+0.5);vec3 a0=x-ox;
  m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);
  vec3 g;g.x=a0.x*x0.x+h.x*x0.y;g.yz=a0.yz*x12.xz+h.yz*x12.yw;
  return 130.0*dot(m,g);
}
vec3 ramp(float f){return f<.5?mix(uC0,uC1,f*2.):mix(uC1,uC2,(f-.5)*2.);}
void main(){
  vec2 uv=gl_FragCoord.xy/uRes;
  vec3 col=ramp(uv.x);
  float h=snoise(vec2(uv.x*2.0+uTime*0.1,uTime*0.25))*0.5*uAmp;
  h=exp(h);h=(uv.y*2.0-h+0.2);
  float intensity=0.6*h;
  float a=smoothstep(0.2-uBlend*0.5,0.2+uBlend*0.5,intensity);
  gl_FragColor=vec4(intensity*col*a,a);
}`;

const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255);

export const MOODS = {
  calm: ['#1f6b45', '#8fb27f', '#2c6a43'],
  hope: ['#3d8a5a', '#e7c178', '#8fb27f'],
  worry: ['#6b3a2a', '#df8466', '#3d5a40'],
  wonder: ['#2a5d7a', '#a5e3c6', '#e7c178'],
  warm: ['#b9924f', '#f0a3a0', '#e7c178']
};

export function createAurora(canvas, { amplitude = 1.0, blend = .55, scale = .5 } = {}) {
  let gl = null;
  try { gl = canvas.getContext('webgl', { premultipliedAlpha: true, alpha: true, antialias: false }); } catch {}
  const state = { colors: MOODS.calm.map(hex), target: MOODS.calm.map(hex), time: 0, running: false, raf: 0, last: 0 };
  if (!gl) { canvas.classList.add('no-webgl'); return { setMood() {}, start() {}, stop() {}, frame() {}, ok: false }; }
  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
  const prog = gl.createProgram();
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG)); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { canvas.classList.add('no-webgl'); return { setMood() {}, start() {}, stop() {}, frame() {}, ok: false }; }
  gl.useProgram(prog);
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = n => gl.getUniformLocation(prog, n);
  const u = { time: U('uTime'), amp: U('uAmp'), blend: U('uBlend'), res: U('uRes'), c: [U('uC0'), U('uC1'), U('uC2')] };
  gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

  function resize() {
    const r = canvas.getBoundingClientRect();
    const w = Math.max(2, Math.round(r.width * scale)), h = Math.max(2, Math.round(r.height * scale));
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    gl.viewport(0, 0, w, h);
  }
  function draw() {
    resize();
    for (let i = 0; i < 3; i++) for (let k = 0; k < 3; k++) state.colors[i][k] += (state.target[i][k] - state.colors[i][k]) * .04;
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(u.time, state.time); gl.uniform1f(u.amp, amplitude); gl.uniform1f(u.blend, blend);
    gl.uniform2f(u.res, canvas.width, canvas.height);
    state.colors.forEach((c, i) => gl.uniform3f(u.c[i], c[0], c[1], c[2]));
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
  function loop(now) {
    const dt = Math.min(.05, (now - (state.last || now)) / 1000); state.last = now;
    state.time += dt * .55;
    draw();
    if (state.running) state.raf = requestAnimationFrame(loop);
  }
  const visible = new IntersectionObserver(([e]) => { if (e.isIntersecting && state.wanted) api.start(); else if (!e.isIntersecting) { state.running = false; cancelAnimationFrame(state.raf); } });
  visible.observe(canvas);
  const api = {
    ok: true,
    setMood(name, instant = false) { const m = MOODS[name] || MOODS.calm; state.target = m.map(hex); if (instant) state.colors = state.target.map(c => [...c]); if (!state.running) draw(); },
    start() { state.wanted = true; if (state.running) return; state.running = true; state.last = 0; state.raf = requestAnimationFrame(loop); },
    stop() { state.wanted = false; state.running = false; cancelAnimationFrame(state.raf); draw(); },
    frame() { draw(); }
  };
  draw();
  return api;
}
