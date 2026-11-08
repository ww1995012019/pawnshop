"""Generate the shop terminal's spoken prompts with the MiMo TTS API.

The text of every prompt and the voice description live in
godot/data/voice_lines.json. One reference sample fixes the timbre; every line
is then synthesised with mimo-v2.5-tts-voiceclone so all prompts share the
same voice. Output: godot/assets/voice/<id>.ogg (trimmed, loudness-matched).

The API key is read from the MIMO_API_KEY environment variable and is never
written anywhere.

  # design a few candidate voices to choose from
  MIMO_API_KEY=... python3 godot/tools/make_voice.py design 3
  # render all prompts from the chosen candidate
  MIMO_API_KEY=... python3 godot/tools/make_voice.py render art-source/voice/reference.wav
  # re-render selected prompts only
  MIMO_API_KEY=... python3 godot/tools/make_voice.py render art-source/voice/reference.wav arrive locked
"""
from pathlib import Path
import base64
import io
import json
import os
import subprocess
import sys
import time
import urllib.request
import wave

import numpy as np

ROOT = Path(__file__).resolve().parents[1]
LINES = ROOT / "data" / "voice_lines.json"
OUT = ROOT / "assets" / "voice"
API = "https://api.xiaomimimo.com/v1/chat/completions"
STYLE = "像老式设备的系统播报，语气沉稳清晰，句尾干净收住，不拖音。"


def call(body: dict, tries: int = 4) -> bytes:
    key = os.environ["MIMO_API_KEY"]
    data = json.dumps(body).encode()
    for attempt in range(tries):
        try:
            req = urllib.request.Request(API, data=data, headers={
                "Authorization": "Bearer " + key, "Content-Type": "application/json"})
            with urllib.request.urlopen(req, timeout=180) as r:
                return base64.b64decode(json.load(r)["choices"][0]["message"]["audio"]["data"])
        except Exception as err:  # network hiccup or rate limit: back off and retry
            if attempt == tries - 1:
                raise
            print(f"  retry after {err}")
            time.sleep(2 ** (attempt + 1))
    raise RuntimeError("unreachable")


def design(count: int, spec: dict) -> None:
    out = ROOT.parent / "art-source" / "voice"
    out.mkdir(parents=True, exist_ok=True)
    for i in range(count):
        wav = call({"model": "mimo-v2.5-tts-voicedesign", "audio": {"format": "wav"},
                    "messages": [{"role": "user", "content": spec["voice"]},
                                 {"role": "assistant", "content": spec["lines"]["welcome"] + "早班开始，开门营业。"}]})
        (out / f"candidate_{i + 1}.wav").write_bytes(wav)
        print("wrote", out / f"candidate_{i + 1}.wav")


def tidy(wav_bytes: bytes) -> np.ndarray:
    """Mono float, silence trimmed at both ends, gentle fades, -16 dBFS RMS."""
    with wave.open(io.BytesIO(wav_bytes)) as w:
        rate, ch = w.getframerate(), w.getnchannels()
        a = np.frombuffer(w.readframes(w.getnframes()), dtype="<i2").astype(np.float32) / 32768
    if ch > 1:
        a = a.reshape(-1, ch).mean(axis=1)
    loud = np.flatnonzero(np.abs(a) > 0.02)
    if loud.size:
        a = a[max(0, loud[0] - int(0.03 * rate)): loud[-1] + int(0.12 * rate)]
    fade = int(0.01 * rate)
    a[:fade] *= np.linspace(0, 1, fade)
    a[-fade:] *= np.linspace(1, 0, fade)
    rms = np.sqrt((a ** 2).mean()) + 1e-9
    a = a * (10 ** (-16 / 20) / rms)
    peak = np.abs(a).max()
    if peak > 0.95:
        a *= 0.95 / peak
    return a, rate


def render(reference: Path, only: list[str], spec: dict) -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    mime = "audio/wav" if reference.suffix.lower() == ".wav" else "audio/mpeg"
    voice = f"data:{mime};base64," + base64.b64encode(reference.read_bytes()).decode()
    for vid, text in spec["lines"].items():
        if only and vid not in only:
            continue
        raw = call({"model": "mimo-v2.5-tts-voiceclone", "audio": {"format": "wav", "voice": voice},
                    "messages": [{"role": "user", "content": STYLE}, {"role": "assistant", "content": text}]})
        a, rate = tidy(raw)
        pcm = (np.clip(a, -1, 1) * 32767).astype("<i2").tobytes()
        path = OUT / f"{vid}.ogg"
        subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-f", "s16le", "-ar", str(rate), "-ac", "1",
                        "-i", "-", "-c:a", "libvorbis", "-q:a", "4", str(path)], input=pcm, check=True)
        print(f"{vid:12s} {len(a) / rate:4.1f}s  {text}")


if __name__ == "__main__":
    spec = json.loads(LINES.read_text(encoding="utf-8"))
    if len(sys.argv) >= 2 and sys.argv[1] == "design":
        design(int(sys.argv[2]) if len(sys.argv) > 2 else 3, spec)
    elif len(sys.argv) >= 3 and sys.argv[1] == "render":
        render(Path(sys.argv[2]), sys.argv[3:], spec)
    else:
        print(__doc__)
