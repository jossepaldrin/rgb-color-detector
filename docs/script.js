// A modest built-in set of common named colors (RGB order), enough for a
// reasonable "closest color name" match without an external dataset file.
const NAMED_COLORS = {
  Black: [0, 0, 0], White: [255, 255, 255], Red: [255, 0, 0],
  Lime: [0, 255, 0], Blue: [0, 0, 255], Yellow: [255, 255, 0],
  Cyan: [0, 255, 255], Magenta: [255, 0, 255], Silver: [192, 192, 192],
  Gray: [128, 128, 128], Maroon: [128, 0, 0], Olive: [128, 128, 0],
  Green: [0, 128, 0], Purple: [128, 0, 128], Teal: [0, 128, 128],
  Navy: [0, 0, 128], Orange: [255, 165, 0], Pink: [255, 192, 203],
  Brown: [165, 42, 42], Gold: [255, 215, 0], Beige: [245, 245, 220],
  Coral: [255, 127, 80], Salmon: [250, 128, 114], Khaki: [240, 230, 140],
  Turquoise: [64, 224, 208], Violet: [238, 130, 238], Indigo: [75, 0, 130],
  Chocolate: [210, 105, 30], Crimson: [220, 20, 60], SkyBlue: [135, 206, 235],
  SlateGray: [112, 128, 144], Tan: [210, 180, 140], Plum: [221, 160, 221],
  Orchid: [218, 112, 214], SteelBlue: [70, 130, 180], Sienna: [160, 82, 45],
  DarkGreen: [0, 100, 0], LightGreen: [144, 238, 144], HotPink: [255, 105, 180],
};

function closestColorName(r, g, b) {
  let bestName = null;
  let bestDist = Infinity;
  for (const [name, [cr, cg, cb]] of Object.entries(NAMED_COLORS)) {
    const dist = (cr - r) ** 2 + (cg - g) ** 2 + (cb - b) ** 2;
    if (dist < bestDist) {
      bestDist = dist;
      bestName = name;
    }
  }
  return bestName;
}

function toHex(r, g, b) {
  return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("").toUpperCase();
}

const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startBtn");
const banner = document.getElementById("banner");
const resultCard = document.getElementById("resultCard");
const swatch = document.getElementById("swatch");
const colorNameEl = document.getElementById("colorName");
const colorValuesEl = document.getElementById("colorValues");

let running = false;

function drawLoop() {
  if (!running) return;

  const w = video.videoWidth;
  const h = video.videoHeight;
  if (w > 0 && h > 0) {
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    // draw mirrored, so what the user sees matches a normal selfie view,
    // and click coordinates map directly onto the same pixels we sample
    ctx.save();
    ctx.translate(w, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, w, h);
    ctx.restore();
  }
  requestAnimationFrame(drawLoop);
}

async function start() {
  startBtn.disabled = true;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 640, height: 480 },
      audio: false,
    });
    video.srcObject = stream;
    await new Promise((resolve) => (video.onloadedmetadata = resolve));
    await video.play();

    running = true;
    banner.textContent = "Click anywhere on the video to sample a color";
    requestAnimationFrame(drawLoop);
  } catch (err) {
    console.error(err);
    banner.textContent = "Error: " + err.message;
    startBtn.disabled = false;
  }
}

canvas.addEventListener("click", (event) => {
  if (!running) return;

  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const x = Math.floor((event.clientX - rect.left) * scaleX);
  const y = Math.floor((event.clientY - rect.top) * scaleY);

  const pixel = ctx.getImageData(x, y, 1, 1).data;
  const [r, g, b] = pixel;

  const name = closestColorName(r, g, b);
  const hex = toHex(r, g, b);

  swatch.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
  colorNameEl.textContent = name;
  colorValuesEl.textContent = `RGB(${r}, ${g}, ${b})  ${hex}`;
  resultCard.classList.remove("hidden");
});

startBtn.addEventListener("click", start);
