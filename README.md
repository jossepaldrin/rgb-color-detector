# Detect the RGB Color from a Webcam

Click anywhere on a live webcam feed to see the RGB value, hex code, and
closest matching color name at that pixel. Ships in two forms:
1. A CLI script (OpenCV window)
2. A browser-only app (no backend) — publicly hosted and shareable

## Live Demo
**https://jossepaldrin.github.io/rgb-color-detector/**

Click "Start Camera," grant permission, then click anywhere on the video.
Runs entirely in your browser — your camera feed never leaves your device.

## How it works
1. Capture webcam frames.
2. On click, read the pixel color at that screen position.
3. Compute the closest match against a built-in list of named colors using
   simple Euclidean distance in RGB space.
4. Display the color name, RGB values, and hex code.

## Option 1: CLI (Python, local webcam window)
```bash
python -m venv venv
venv\Scripts\activate      # Windows
pip install -r requirements.txt
python main.py
```
Click anywhere on the video window to sample a color. Press `q` to quit.

## Option 2: Browser-only app (no backend, publicly hosted)
Everything runs client-side in JavaScript — webcam capture, pixel
sampling, and color-name matching. No model to download, unlike the other
projects in this portfolio, so it's the simplest to test and deploy.

To run locally before deploying changes:
```bash
cd docs
python -m http.server 8000
```
Open http://localhost:8000 (camera access needs `http(s)://`, not `file://`).

To deploy: push `docs/` to the `master` branch, then enable GitHub Pages
(Settings → Pages → Deploy from branch → `master` / `docs`).

## Project structure
```
rgb-color-detector/
├── main.py              # CLI entry point (OpenCV window)
├── docs/                 # browser-only app (GitHub Pages)
│   ├── index.html
│   ├── style.css
│   └── script.js
├── requirements.txt
└── README.md
```

## Notes
- The built-in color-name list covers ~40 common colors — not exhaustive,
  but enough for a reasonable match on most everyday objects.
- Lighting affects readings significantly — the same object can register
  different RGB values under warm vs. cool lighting.
