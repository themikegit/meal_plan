#!/usr/bin/env node
import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, "..", "public", "icons");

const BG = "#f5ead8";
const FG = "#8c491a";

const baseSvg = (size, padding) => {
  const radius = Math.round(size * 0.22);
  const stroke = Math.max(6, Math.round(size * 0.06));
  const inner = size - padding * 2;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="${BG}"/>
  <g transform="translate(${padding}, ${padding})">
    <circle cx="${inner / 2}" cy="${inner / 2}" r="${inner / 2 - stroke / 2}" fill="none" stroke="${FG}" stroke-width="${stroke}"/>
    <text x="50%" y="56%" text-anchor="middle" dominant-baseline="middle"
          font-family="Georgia, 'Times New Roman', serif"
          font-size="${Math.round(inner * 0.52)}" font-weight="700"
          fill="${FG}">M</text>
  </g>
</svg>`;
};

async function render(size, padding, filename) {
  const svg = baseSvg(size, padding);
  const out = resolve(outDir, filename);
  await sharp(Buffer.from(svg)).png().toFile(out);
  console.log(`wrote ${out}`);
}

await mkdir(outDir, { recursive: true });
await Promise.all([
  render(192, 18, "icon-192.png"),
  render(512, 48, "icon-512.png"),
  // maskable needs a larger safe zone (inner ~80%)
  render(512, 96, "icon-maskable-512.png"),
  render(180, 18, "apple-touch-icon.png"),
  render(32, 4, "favicon-32.png"),
]);
