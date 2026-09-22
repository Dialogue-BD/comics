import sys, os, zlib, numpy as np
sys.path.insert(0, os.path.expanduser("~/amb"))
from amb import *
from scenes import SCENES

SRC, DST, KEYS, SUFFIX = sys.argv[1], sys.argv[2], sys.argv[3].split(","), sys.argv[4]
os.makedirs(DST, exist_ok=True)
print(f"{'file':<34}{'speech':>8}{'bed':>8}{'2-5kHz SNR':>12}")
for k in KEYS:
    p = os.path.join(SRC, k + ".mp3")
    if not os.path.exists(p): print("missing", p); continue
    x = rd(p); n = len(x)
    rng = np.random.default_rng(zlib.crc32(k.encode()))  # stable across processes
    b = bed(n, rng, SCENES[k])
    b = fftshape(b, lambda f: 1/(1+(f/3200)**4))          # keep consonant band clear
    b *= speech_rms(x)                                     # recipe dB are relative to speech
    f = int(FS*0.5); ramp = np.ones(n)
    ramp[:f] = np.linspace(0,1,f); ramp[-f:] = np.linspace(1,0,f)
    b *= ramp
    y = x + b
    pk = np.abs(y).max()
    if pk > 0.97: y *= 0.97/pk
    wr(os.path.join(DST, k + SUFFIX + ".mp3"), y)
    # consonant-band SNR: how much headroom the speech keeps where intelligibility lives
    def bandrms(sig):
        S = np.fft.rfft(sig); fr = np.fft.rfftfreq(len(sig),1/FS)
        m = (fr>=2000)&(fr<=5000)
        return float(np.sqrt(np.mean(np.abs(S[m])**2))+1e-12)
    snr = 20*np.log10(bandrms(x)/bandrms(b))
    print(f"{k:<34}{20*np.log10(speech_rms(x)):>7.1f}dB{20*np.log10(rms(b)):>7.1f}dB{snr:>10.1f}dB")
