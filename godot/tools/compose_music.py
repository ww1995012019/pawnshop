"""Compose the game's original background music and stingers.

Everything is synthesised here from oscillators and noise: no samples, no
third-party material. Filters and reverb are applied in the frequency domain
over the whole loop (circular), so every track loops without a seam.

Run: python3 godot/tools/compose_music.py
Writes godot/assets/music/*.ogg
"""
from pathlib import Path
import subprocess
import numpy as np

SR = 44100
OUT = Path(__file__).resolve().parents[1] / "assets" / "music"
rng = np.random.default_rng(9)


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def env(n, a=0.005, d=0.3, s=0.0, r=0.05, hold=None):
    """Attack / exponential decay toward sustain / release, n samples."""
    t = np.arange(n) / SR
    e = np.where(t < a, t / max(a, 1e-6), s + (1 - s) * np.exp(-(t - a) / max(d, 1e-6)))
    if hold is not None:
        rel = t > hold
        e[rel] *= np.exp(-(t[rel] - hold) / max(r, 1e-6))
    return e


def place(buf, sig, start, pan=0.0):
    """Add a mono signal into a stereo loop buffer, wrapping at the end."""
    n = len(sig)
    idx = (np.arange(n) + int(start)) % buf.shape[1]
    l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    np.add.at(buf[0], idx, sig * l)
    np.add.at(buf[1], idx, sig * r)


def spectral(buf, fn):
    """Apply a frequency response fn(freqs) to a looping buffer (circular)."""
    f = np.fft.rfftfreq(buf.shape[1], 1 / SR)
    return np.fft.irfft(np.fft.rfft(buf, axis=1) * fn(f), n=buf.shape[1], axis=1)


def lowpass(buf, fc, order=2):
    return spectral(buf, lambda f: 1 / np.sqrt(1 + (f / fc) ** (2 * order)))


def highpass(buf, fc, order=2):
    return spectral(buf, lambda f: 1 / np.sqrt(1 + (fc / np.maximum(f, 1e-3)) ** (2 * order)))


def reverb(buf, seconds=2.4, mix=0.25, tone=5000):
    """Circular convolution with a decaying stereo noise tail: seamless."""
    n = buf.shape[1]
    m = min(n, int(seconds * SR))
    t = np.arange(m) / SR
    ir = np.zeros((2, n))
    for c in range(2):
        tail = rng.standard_normal(m) * np.exp(-t * 6.9 / seconds)
        ir[c, :m] = tail
    ir = lowpass(ir, tone, 1)
    ir /= np.sqrt((ir ** 2).sum(axis=1, keepdims=True))
    wet = np.fft.irfft(np.fft.rfft(buf, axis=1) * np.fft.rfft(ir, axis=1), n=n, axis=1)
    return buf * (1 - mix) + wet * mix * 1.6


# ---------------------------------------------------------------- voices

def epiano(note, dur, vel=0.5):
    n = int((dur + 1.2) * SR)
    t = np.arange(n) / SR
    f = midi(note)
    mod_env = np.exp(-t * 7)
    mod = np.sin(2 * np.pi * f * t) * (1.6 * mod_env + 0.25)
    tone = np.sin(2 * np.pi * f * t + mod) + 0.25 * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t * 3)
    trem = 1 + 0.08 * np.sin(2 * np.pi * 4.8 * t)
    return tone * env(n, 0.004, 1.1, 0.0, 0.25, hold=dur) * trem * vel


def pad(note, dur, vel=0.25, detune=0.12):
    n = int((dur + 2.0) * SR)
    t = np.arange(n) / SR
    s = np.zeros(n)
    for d in (-detune, 0.0, detune):
        f = midi(note + d)
        ph = (f * t) % 1.0
        s += 2 * ph - 1  # saw
    a = np.clip(t / 1.2, 0, 1)
    rel = np.where(t > dur, np.exp(-(t - dur) / 0.9), 1.0)
    return s / 3 * a * rel * vel


def bass(note, dur, vel=0.6):
    n = int((dur + 0.2) * SR)
    t = np.arange(n) / SR
    f = midi(note)
    s = np.tanh(1.6 * (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(4 * np.pi * f * t)))
    return s * env(n, 0.006, 0.6, 0.35, 0.08, hold=dur) * vel


def pluck(note, dur=0.6, vel=0.35, bright=1.0):
    n = int((dur + 0.4) * SR)
    t = np.arange(n) / SR
    f = midi(note)
    s = sum(np.sin(2 * np.pi * f * k * t) * np.exp(-t * (3 + k * 2.5 / bright)) / k for k in range(1, 7))
    return s * env(n, 0.002, 0.5, 0.0) * vel


def bell(note, vel=0.3, length=2.5):
    n = int(length * SR)
    t = np.arange(n) / SR
    f = midi(note)
    parts = [(1.0, 1.0, 1.4), (2.0, 0.5, 2.2), (2.76, 0.35, 3.0), (5.4, 0.2, 5.0), (8.93, 0.1, 8.0)]
    s = sum(a * np.sin(2 * np.pi * f * r * t) * np.exp(-t * d) for r, a, d in parts)
    return s * env(n, 0.002, 9.0) * vel


def hat(vel=0.12, length=0.07):
    n = int(length * SR)
    s = rng.standard_normal(n) * np.exp(-np.arange(n) / SR / (length / 4))
    return np.diff(np.concatenate([[0], s])) * vel  # crude highpass


def kick(vel=0.6):
    n = int(0.35 * SR)
    t = np.arange(n) / SR
    f = 48 + 70 * np.exp(-t * 28)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9) * vel


def ping(note, vel=0.12):
    n = int(1.6 * SR)
    t = np.arange(n) / SR
    f = midi(note)
    s = np.sin(2 * np.pi * f * t) + 0.5 * np.sin(2 * np.pi * f * 2.41 * t) * np.exp(-t * 3)
    return s * np.exp(-t * 2.5) * vel


def crackle(buf, density=9, vel=0.04):
    n = buf.shape[1]
    k = int(n / SR * density)
    pos = rng.integers(0, n, k)
    for c in range(2):
        np.add.at(buf[c], pos, rng.standard_normal(k) * vel)


def finish(buf, peak=0.8):
    buf = buf - buf.mean(axis=1, keepdims=True)
    buf = np.tanh(buf / (np.abs(buf).max() + 1e-9) * 1.4) / np.tanh(1.4)
    return buf * peak


def write(name, buf, quality=5):
    OUT.mkdir(parents=True, exist_ok=True)
    pcm = (np.clip(buf.T, -1, 1) * 32767).astype("<i2").tobytes()
    path = OUT / f"{name}.ogg"
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-f", "s16le", "-ar", str(SR), "-ac", "2",
                    "-i", "-", "-c:a", "libvorbis", "-q:a", str(quality), str(path)], input=pcm, check=True)
    print(f"{path.name}: {buf.shape[1] / SR:.1f}s, {path.stat().st_size // 1024} KB")


# ---------------------------------------------------------------- tracks

def shop():
    """Counter: a lazy lo-fi groove for the shop floor. 84 BPM, 16 bars."""
    bpm, bars = 84, 16
    beat = 60 / bpm
    n = int(bars * 4 * beat * SR)
    keys, low, drums = np.zeros((2, n)), np.zeros((2, n)), np.zeros((2, n))
    # ii-V-I-vi in C with colour tones, two bars each
    prog = [(50, [62, 65, 69, 72, 76]), (43, [59, 62, 65, 69, 76]), (48, [59, 64, 67, 71, 74]), (45, [60, 64, 67, 71, 72])]
    for bar in range(bars):
        root, chord = prog[(bar // 2) % 4]
        t0 = bar * 4 * beat
        # comped chords: a push on beat 1 and an off-beat stab
        for off, dur, v in ((0, 1.6, 0.42), (2.5, 0.9, 0.3)):
            for i, nn in enumerate(chord):
                place(keys, epiano(nn, dur * beat, v * (0.9 if i else 1.0)), (t0 + (off + i * 0.012) * beat) * SR, pan=-0.3 + 0.15 * i)
        place(low, bass(root - 12, 1.7 * beat), t0 * SR)
        place(low, bass(root - 12 + (7 if bar % 2 else 12), 0.8 * beat, 0.45), (t0 + 2.5 * beat) * SR)
        for b in range(4):
            place(drums, kick(0.55 if b in (0, 2) else 0.0), (t0 + b * beat) * SR)
            for sw in (0, 0.62):  # swung eighths
                place(drums, hat(0.09 if sw else 0.13), (t0 + (b + sw) * beat) * SR, pan=0.35)
    # a sparse melody on the second half
    mel = [76, 74, 72, 69, 71, 72, 74, 67]
    for i, nn in enumerate(mel):
        place(keys, bell(nn + 12, 0.07, 2.0), (8 * 4 * beat + i * 4 * beat + 1.5 * beat) * SR, pan=0.4)
    keys = lowpass(keys, 3200)
    drums = lowpass(highpass(drums, 60), 7000)
    crackle(drums, 10, 0.03)
    mix = keys + 0.9 * lowpass(low, 900) + 0.55 * drums
    return finish(reverb(mix, 2.2, 0.22, 4200), 0.62)


def workbench():
    """Inspection / repair: a patient arpeggio over a held pad. 96 BPM."""
    bpm, bars = 96, 16
    beat = 60 / bpm
    n = int(bars * 4 * beat * SR)
    arp, pads, low = np.zeros((2, n)), np.zeros((2, n)), np.zeros((2, n))
    prog = [[57, 60, 64, 67], [53, 57, 60, 64], [55, 59, 62, 66], [52, 55, 59, 62]]
    pattern = [0, 2, 1, 3, 2, 1, 3, 2]
    for bar in range(bars):
        chord = prog[(bar // 4) % 4] if bar < 8 else prog[(bar // 2) % 4]
        t0 = bar * 4 * beat
        for i, k in enumerate(pattern):
            nn = chord[k] + (12 if (i == 6 and bar % 2) else 0)
            place(arp, pluck(nn + 12, 0.45, 0.22 if i % 2 else 0.3), (t0 + i * 0.5 * beat) * SR, pan=-0.4 + 0.1 * k)
        if bar % 2 == 0:
            for nn in chord:
                place(pads, pad(nn, 7.6 * beat, 0.1), t0 * SR, pan=0.2)
            place(low, bass(chord[0] - 24, 7.5 * beat, 0.4), t0 * SR)
        place(low, ping(chord[2] + 24, 0.05), (t0 + 3.25 * beat) * SR)
    mix = lowpass(arp, 4200) + lowpass(pads, 1600) + lowpass(low, 700)
    return finish(reverb(mix, 3.0, 0.3, 3500), 0.55)


def storeroom():
    """Warehouse / orders: cold air, a slow drone and distant metal."""
    seconds = 48
    n = seconds * SR
    drone, metal = np.zeros((2, n)), np.zeros((2, n))
    chords = [[45, 52, 57, 60], [41, 48, 53, 57], [43, 50, 55, 58], [40, 47, 52, 55]]
    for i, ch in enumerate(chords):
        for nn in ch:
            place(drone, pad(nn, 11.0, 0.12, 0.08), i * 12 * SR, pan=rng.uniform(-0.5, 0.5))
    for k in range(18):
        nn = int(rng.choice([69, 72, 76, 79, 81, 84]))
        place(metal, ping(nn, rng.uniform(0.03, 0.07)), rng.uniform(0, seconds) * SR, pan=rng.uniform(-0.8, 0.8))
    air = rng.standard_normal((2, n)) * 0.05
    air = lowpass(highpass(air, 200), 900)
    mix = lowpass(drone, 1100) + metal + air
    return finish(reverb(mix, 4.5, 0.4, 3000), 0.5)


def ledger():
    """Day end: a small music-box tune for counting the till. 70 BPM."""
    bpm, bars = 70, 8
    beat = 60 / bpm
    n = int(bars * 4 * beat * SR)
    box, keys = np.zeros((2, n)), np.zeros((2, n))
    prog = [(48, [60, 64, 67]), (45, [57, 60, 64]), (41, [57, 60, 65]), (43, [55, 59, 62])]
    melody = [72, 74, 76, 79, 76, 74, 72, 69, 72, 74, 76, 72, 74, 71, 67, 0,
              72, 74, 76, 79, 81, 79, 76, 74, 72, 76, 74, 72, 71, 72, 0, 0]
    for bar in range(bars):
        root, chord = prog[bar % 4]
        t0 = bar * 4 * beat
        for nn in chord:
            place(keys, epiano(nn, 3.6 * beat, 0.22), t0 * SR, pan=-0.2)
        place(keys, bass(root - 12, 3.6 * beat, 0.3), t0 * SR)
        for i in range(4):
            nn = melody[(bar * 4 + i) % len(melody)]
            if nn:
                place(box, bell(nn + 12, 0.16, 2.2), (t0 + i * beat) * SR, pan=0.25)
    mix = lowpass(keys, 2400) + lowpass(box, 6500)
    return finish(reverb(mix, 2.8, 0.3, 4000), 0.55)


def stinger(notes, gap=0.11, length=2.6, vel=0.3, pad_root=None):
    n = int(length * SR)
    buf = np.zeros((2, n + SR))
    for i, nn in enumerate(notes):
        place(buf, bell(nn, vel, 2.2), (i * gap) * SR, pan=-0.3 + 0.6 * i / max(1, len(notes) - 1))
    if pad_root is not None:
        for nn in (pad_root, pad_root + 7, pad_root + 12):
            place(buf, pad(nn, 1.2, 0.08), 0)
    buf = buf[:, :n]
    fade = np.ones(n)
    fade[-int(0.4 * SR):] = np.linspace(1, 0, int(0.4 * SR))
    return finish(reverb(lowpass(buf, 6000), 1.8, 0.25) * fade, 0.6)


if __name__ == "__main__":
    write("shop", shop())
    write("workbench", workbench())
    write("storeroom", storeroom())
    write("ledger", ledger())
    write("sting_open", stinger([72, 76, 79, 84], 0.1, 2.6, 0.3, 48))
    write("sting_deal", stinger([84, 88, 91], 0.07, 1.6, 0.25))
    write("sting_close", stinger([79, 76, 72, 67], 0.16, 3.0, 0.28, 43))
