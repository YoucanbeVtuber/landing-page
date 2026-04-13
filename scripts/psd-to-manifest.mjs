#!/usr/bin/env node
/**
 * psd-to-manifest.mjs
 *
 * Parses a PSD file and generates:
 *   public/landing-preview/manifest.json   — PreviewBundle format
 *   public/landing-preview/assets/<id>.png — per-layer trimmed PNGs
 *   public/landing-preview/assets/original.png
 *   public/landing-preview/assets/composite.png
 *
 * Usage:
 *   node scripts/psd-to-manifest.mjs ./path/to/character.psd
 *   npm run psd-to-manifest -- ./character.psd
 */

import { readFileSync, mkdirSync } from "fs";
import { resolve, basename } from "path";
import sharp from "sharp";

// ESM import for @webtoon/psd
const { default: Psd } = await import("@webtoon/psd");

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------
const psdArg = process.argv[2];
if (!psdArg) {
  console.error("Usage: node scripts/psd-to-manifest.mjs <path-to-psd>");
  process.exit(1);
}

const psdPath = resolve(psdArg);
const outDir = resolve("public/landing-preview");
const assetsDir = resolve(outDir, "assets");
mkdirSync(assetsDir, { recursive: true });

console.log(`\nParsing ${basename(psdPath)} …`);
const buffer = readFileSync(psdPath);
const psd = Psd.parse(buffer.buffer);

console.log(`  Canvas: ${psd.width} × ${psd.height}`);

// ---------------------------------------------------------------------------
// Walk PSD tree
// ---------------------------------------------------------------------------

/**
 * Slugify a name to a safe filesystem + manifest id segment.
 * "Face Base" → "face_base", "レイヤー1" → stays as-is (non-ASCII ok for id)
 */
function slugify(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^\w\-./]/g, "");
}

/**
 * Recursively walk psd.children.
 * Returns a flat array of layer descriptors in document order
 * (topmost PS panel layer first → highest zIndex).
 */
function walkLayers(nodes, folderStack = []) {
  const results = [];
  for (const node of nodes) {
    if (node.type === "Group") {
      const nextStack = [...folderStack, node.name];
      if (node.children) {
        results.push(...walkLayers(node.children, nextStack));
      }
    } else if (node.type === "Layer") {
      results.push({ layer: node, folderStack: [...folderStack] });
    }
    // "Psd" type won't appear inside children
  }
  return results;
}

const allEntries = walkLayers(psd.children ?? []);
const totalLayers = allEntries.length;
console.log(`  Layers: ${totalLayers}`);

// ---------------------------------------------------------------------------
// Process each layer
// ---------------------------------------------------------------------------

/**
 * Build a unique id for a layer.
 * Uses folderStack segments + layer name, slugified.
 * e.g. ["Character","Face"] + "Blush_L" → "character_face_blush_l"
 */
function buildLayerId(folderStack, layerName) {
  const parts = [...folderStack, layerName].map(slugify).filter(Boolean);
  return parts.join("_") || slugify(layerName) || "layer";
}

/**
 * Ensure the id is unique in the given Set by appending _2, _3, …
 */
function deduplicateId(id, usedIds) {
  if (!usedIds.has(id)) {
    usedIds.add(id);
    return id;
  }
  let n = 2;
  while (usedIds.has(`${id}_${n}`)) n++;
  const unique = `${id}_${n}`;
  usedIds.add(unique);
  return unique;
}

const usedIds = new Set();
const manifestLayers = [];

for (let i = 0; i < allEntries.length; i++) {
  const { layer, folderStack } = allEntries[i];

  // Skip adjustment layers and other layers with no pixel data (width/height = 0)
  if (layer.width === 0 || layer.height === 0) {
    console.log(`  [skip] ${layer.name} (no pixel data)`);
    continue;
  }

  const rawId = buildLayerId(folderStack, layer.name);
  const id = deduplicateId(rawId, usedIds);
  const folderPath = folderStack.length > 0 ? folderStack.join("/") : null;
  // zIndex: topmost PS layer (index 0) gets the highest value
  const zIndex = totalLayers - i;

  process.stdout.write(`  [${i + 1}/${totalLayers}] ${layer.name} `);

  // Composite the full-canvas RGBA (handles clipping masks automatically)
  let rgba;
  try {
    rgba = await layer.composite(false, true);
  } catch (err) {
    console.log(`→ skipped (${err.message})`);
    continue;
  }

  // Extract the layer's bounding box from the full-canvas buffer
  const { top, left, width, height } = layer;

  // Clamp to canvas bounds (paranoia)
  const x0 = Math.max(0, left);
  const y0 = Math.max(0, top);
  const x1 = Math.min(psd.width, left + width);
  const y1 = Math.min(psd.height, top + height);
  const extractW = x1 - x0;
  const extractH = y1 - y0;

  if (extractW <= 0 || extractH <= 0) {
    console.log(`→ skipped (out of canvas)`);
    continue;
  }

  const assetFilename = `${id}.png`;
  const assetPath = `./assets/${assetFilename}`;

  await sharp(Buffer.from(rgba), {
    raw: { width: psd.width, height: psd.height, channels: 4 },
  })
    .extract({ left: x0, top: y0, width: extractW, height: extractH })
    .png({ compressionLevel: 9 })
    .toFile(resolve(assetsDir, assetFilename));

  console.log(`→ ${assetFilename}`);

  manifestLayers.push({
    id,
    name: layer.name,
    assetPath,
    zIndex,
    visibleByDefault: !layer.isHidden,
    group: folderStack[folderStack.length - 1] ?? null,
    folderPath,
    blendMode: "normal",
    placementBounds: { x: x0, y: y0, width: extractW, height: extractH },
  });
}

// ---------------------------------------------------------------------------
// original.png — full merged image
// ---------------------------------------------------------------------------
console.log("\n  Generating original.png …");
const originalRgba = await psd.composite();
await sharp(Buffer.from(originalRgba), {
  raw: { width: psd.width, height: psd.height, channels: 4 },
})
  .png({ compressionLevel: 9 })
  .toFile(resolve(assetsDir, "original.png"));

// ---------------------------------------------------------------------------
// composite.png — visible layers only (same as original for most PSDs)
// ---------------------------------------------------------------------------
// For now, composite.png === original.png (full psd.composite already respects
// layer visibility flags internally). Copy by re-writing the same data.
console.log("  Generating composite.png …");
await sharp(Buffer.from(originalRgba), {
  raw: { width: psd.width, height: psd.height, channels: 4 },
})
  .png({ compressionLevel: 9 })
  .toFile(resolve(assetsDir, "composite.png"));

// ---------------------------------------------------------------------------
// manifest.json
// ---------------------------------------------------------------------------
const now = new Date().toISOString();
const jobId = `psd-${Date.now()}`;

const manifest = {
  format: "livingcel-preview-bundle",
  version: 1,
  source: {
    jobId,
    taskId: jobId,
    title: basename(psdArg, ".psd"),
  },
  manifest: {
    summary: {
      jobId,
      taskId: jobId,
      title: basename(psdArg, ".psd"),
      status: "preview_ready",
      createdAt: now,
    },
    canvasSize: [psd.width, psd.height],
    originalAssetPath: "./assets/original.png",
    compositeAssetPath: "./assets/composite.png",
    layers: manifestLayers,
  },
};

const manifestPath = resolve(outDir, "manifest.json");
import { writeFileSync } from "fs";
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), "utf-8");

console.log(`\nDone.`);
console.log(`  Layers exported : ${manifestLayers.length}`);
console.log(`  manifest.json   : ${manifestPath}`);
console.log(`\nRun 'npm run dev' and open the Layer Logic section to preview.\n`);
