import numpy as np, subprocess, sys, os
FS = 24000
def rd(p):
    raw = subprocess.run(["ffmpeg","-nostdin","-v","error","-i",p,"-f","f32le","-ar",str(FS),"-ac","1","-"],
                         capture_output=True).stdout
    return np.frombuffer(raw, dtype="<f4").astype(np.float64)
def wr(p, x, br="96k"):
    x = np.clip(x, -1, 1).astype("<f4").tobytes()
    subprocess.run(["ffmpeg","-nostdin","-v","error","-y","-f","f32le","-ar",str(FS),"-ac","1",
                    "-i","-","-codec:a","libmp3lame","-b:a",br,p], input=x, check=True)

def fftshape(x, curve):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1/FS)
    return np.fft.irfft(X*curve(f), n=len(x))
def noise(n, rng): return rng.standard_normal(n)
def band(n, rng, lo, hi, slope=0.0):
    def c(f):
        g = np.ones_like(f)
        g *= 1/(1+(f/max(hi,1))**4)                  # gentle LP
        g *= (f/max(lo,1))**2/(1+(f/max(lo,1))**2)   # gentle HP
        with np.errstate(divide="ignore"): g *= np.where(f>0,(f+1.0)**slope,0)
        return g
    return fftshape(noise(n,rng), c)
def hum(n, f0, harms=(1,2,3), amps=(1,.45,.2), rng=None):
    t = np.arange(n)/FS; y = np.zeros(n)
    for h,a in zip(harms,amps):
        y += a*np.sin(2*np.pi*f0*h*t + (rng.random() if rng is not None else 0)*6.28)
    return y
def slowmod(n, rng, hz, depth):
    env = band(n, rng, .05, max(hz,.1))
    env /= (np.abs(env).max()+1e-9)
    return 1.0 + depth*env
def babble(n, rng, syl=3.8):
    b = band(n, rng, 250, 2200, slope=-0.3)
    e = np.abs(band(n, rng, .3, syl)); e /= (e.max()+1e-9)
    return b*(0.25+0.75*e)
def sparse(n, rng, per_min, dur_ms, lo, hi, jitter=True):
    y = np.zeros(n); k = max(int(per_min*(n/FS)/60), 0)
    L = int(FS*dur_ms/1000)
    for _ in range(k):
        s = rng.integers(0, max(n-L,1))
        ev = band(L, rng, lo, hi)*np.exp(-np.linspace(0,6,L))
        y[s:s+L] += ev*(0.6+0.4*rng.random() if jitter else 1)
    return y
def birds(n, rng, per_min=14):
    y = np.zeros(n); k = int(per_min*(n/FS)/60)
    for _ in range(k):
        L = int(FS*rng.uniform(.07,.18)); s = rng.integers(0,max(n-L,1))
        t = np.arange(L)/FS; f0 = rng.uniform(2400,4200)
        ch = np.sin(2*np.pi*(f0*t + rng.uniform(-900,900)*t*t/ (L/FS)))
        y[s:s+L] += ch*np.hanning(L)*rng.uniform(.5,1.0)
    return y
def fan(n, rng, blade=11.0):
    b = band(n, rng, 90, 1400)
    t = np.arange(n)/FS
    return b*(1+0.16*np.sin(2*np.pi*blade*t))
def rms(x): return float(np.sqrt(np.mean(x**2))+1e-12)
def speech_rms(x, fs=FS):
    w = int(fs*0.03); f = x[:len(x)//w*w].reshape(-1,w)
    e = np.sqrt((f**2).mean(1)); thr = np.percentile(e, 70)
    v = e[e>=thr]
    return float(v.mean()) if len(v) else rms(x)

def bed(n, rng, recipe):
    out = np.zeros(n)
    for kind, db, *rest in recipe:
        if   kind=="air":      c = band(n, rng, 30, 700, -0.4)
        elif kind=="presence": c = band(n, rng, 20, 9000, -0.5)
        elif kind=="fluoro":   c = hum(n, 120, (1,2,3), (1,.5,.25), rng) + .25*band(n,rng,2000,7000)
        elif kind=="mains":    c = hum(n, 60, (1,2), (1,.4), rng)
        elif kind=="rumble":   c = band(n, rng, 20, 180, -0.8)
        elif kind=="babble":   c = babble(n, rng)
        elif kind=="fan":      c = fan(n, rng, rest[0] if rest else 11.0)
        elif kind=="dish":     c = band(n,rng,180,2000)*slowmod(n,rng,.35,.5) + .3*band(n,rng,2500,6000)
        elif kind=="wind":     c = band(n, rng, 25, 500, -0.6)*slowmod(n,rng,.18,.7)
        elif kind=="birds":    c = birds(n, rng)
        elif kind=="clatter":  c = sparse(n, rng, rest[0] if rest else 8, 130, 900, 5000)
        elif kind=="door":     c = sparse(n, rng, 2, 320, 80, 900)
        elif kind=="keys":     c = sparse(n, rng, 40, 45, 1500, 6000)
        elif kind=="radio":    c = babble(n, rng, 3.0); c = fftshape(c, lambda f: 1/(1+(f/1100)**6)*(f/400)**2/(1+(f/400)**2))
        else: continue
        c = c/(rms(c)+1e-12)
        out += c*(10**(db/20))
    return out
