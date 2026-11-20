







import { writeFileSync } from 'node:fs'
import { deflateSync, crc32 } from 'node:zlib'

const W = 384
const H = 600
const SCALE = 4
const HORIZON = 165
const SEA_END = 179
const OUT = new URL('../public/images/background-hd.png', import.meta.url)
const SEED = 7

const C = {
  sky: ['#74c6f5', '#86cef6', '#a2daf8', '#c2e7fa', '#e0f3fc', '#f4fbfe'],
  cloud: '#ffffff',
  cloudShade: '#e2dcf5',
  cloudDark: '#c4b8e6',
  foam: '#ffffff',
  seaTop: '#86a8f0',
  sea: '#6a8ee6',
  seaDeep: '#5d7fdc',
  glint: '#bfeee6',
  grassEdge: '#a8dc5c',
  grassEdge2: '#90c95a',
  grassMid: '#86b866',
  grass: '#7fac71',
  tuftDark: '#6c9a62',
  tuftLight: '#9fc58c',
}

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
const px = new Uint8Array(W * H * 3)
const wrap = (x) => ((x % W) + W) % W
function set(x, y, color) {
  if (y < 0 || y >= H) return
  const i = (y * W + wrap(x)) * 3
  const [r, g, b] = hex(color)
  px[i] = r
  px[i + 1] = g
  px[i + 2] = b
}

let s = SEED
const rand = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32)

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16)
const dither = (x, y, t) => t > BAYER[(y % 4) * 4 + (wrap(x) % 4)]

function gradientRows(y0, y1, stops) {
  for (let y = y0; y < y1; y++) {
    let k = 0
    while (k < stops.length - 2 && y >= stops[k + 1][0]) k++
    const [ya, ca] = stops[k]
    const [yb, cb] = stops[k + 1]
    const t = Math.min(1, Math.max(0, (y - ya) / (yb - ya)))
    for (let x = 0; x < W; x++) set(x, y, dither(x, y, t) ? cb : ca)
  }
}

const dxWrap = (a, b) => {
  const d = Math.abs(a - b) % W
  return Math.min(d, W - d)
}

gradientRows(0, HORIZON, [
  [0, C.sky[0]],
  [70, C.sky[0]],
  [105, C.sky[1]],
  [128, C.sky[2]],
  [145, C.sky[3]],
  [156, C.sky[4]],
  [HORIZON, C.sky[5]],
])


function cloud(cx, baseY, size) {
  const puffs = []
  const n = 3 + Math.floor(size / 5)
  for (let i = 0; i < n; i++) {
    const t = n === 1 ? 0.5 : i / (n - 1)
    const r = size * (0.45 + 0.4 * Math.sin(Math.PI * t)) * (0.85 + rand() * 0.3)
    puffs.push({ x: cx + (t - 0.5) * size * 2.2, y: baseY - r * 0.75, r })
  }
  const minX = Math.floor(cx - size * 2)
  const maxX = Math.ceil(cx + size * 2)
  const minY = Math.floor(baseY - size * 2)
  for (let y = minY; y <= baseY; y++) {
    for (let x = minX; x <= maxX; x++) {
      let best = null
      for (const p of puffs) {
        const dx = dxWrap(x, p.x) * Math.sign(x - p.x || 1)
        const dy = y - p.y
        const depth = p.r - Math.hypot(dx, dy)
        if (depth >= 0 && (!best || depth > best.depth)) best = { depth, nx: dx / p.r, ny: dy / p.r }
      }
      if (!best) continue
      const light = best.nx * 0.35 + best.ny * 0.85
      let color = C.cloud
      if (y >= baseY - 1 || light > 0.72) color = C.cloudDark
      else if (y >= baseY - 3 || light > 0.45) color = dither(x, y, 0.5) && light < 0.55 ? C.cloud : C.cloudShade
      set(x, y, color)
    }
  }
}

function puff(cx, y, len) {
  for (let x = 0; x < len; x++) set(cx + x, y, C.cloud)
  for (let x = 1; x < len - 1; x++) set(cx + x, y - 1, C.cloud)
  for (let x = 0; x < len; x++) set(cx + x, y + 1, C.cloudShade)
}

const bigClouds = [
  [38, 136, 8],
  [172, 132, 11],
  [218, 118, 8],
  [252, 126, 12],
  [292, 140, 9],
  [326, 138, 8],
]
for (const [x, y, size] of bigClouds) cloud(x, y, size)
for (let i = 0; i < 14; i++) {
  puff(Math.floor(rand() * W), 112 + Math.floor(rand() * 40), 3 + Math.floor(rand() * 5))
}

gradientRows(HORIZON, SEA_END, [
  [HORIZON, C.foam],
  [HORIZON + 2, C.seaTop],
  [HORIZON + 5, C.sea],
  [SEA_END, C.seaDeep],
])


const glintX = W * 0.62
const glintY = HORIZON + 4
for (let y = HORIZON + 2; y < SEA_END - 1; y++) {
  for (let x = Math.floor(glintX - 70); x <= glintX + 70; x++) {
    const d = Math.hypot((x - glintX) / 64, (y - glintY) / 7)
    if (d < 1 && dither(x, y, (1 - d) * 1.4)) set(x, y, C.glint)
  }
}
for (let i = 0; i < 10; i++) {
  const y = HORIZON + 3 + Math.floor(rand() * (SEA_END - HORIZON - 5))
  const x = Math.floor(glintX + (rand() - 0.5) * 150)
  const len = 2 + Math.floor(rand() * 5)
  for (let k = 0; k < len; k++) set(x + k, y, C.glint)
}


const edge = (x) =>
  Math.round(
    1.6 * Math.sin((2 * Math.PI * x * 7) / W) +
      1.2 * Math.sin((2 * Math.PI * x * 23) / W + 1) +
      0.9 * Math.sin((2 * Math.PI * x * 61) / W + 2),
  )
gradientRows(SEA_END, H, [
  [SEA_END, C.grassEdge],
  [SEA_END + 6, C.grassEdge],
  [SEA_END + 12, C.grassEdge2],
  [SEA_END + 20, C.grassMid],
  [SEA_END + 32, C.grass],
  [H, C.grass],
])
for (let x = 0; x < W; x++) {
  const top = SEA_END + edge(x) - 1
  for (let y = top; y < SEA_END; y++) set(x, y, C.grassEdge)

  if (x % 3 === 0 && rand() < 0.5) set(x, top - 1, C.grassEdge)
}

const TUFTS = [
  { color: C.tuftDark, rows: ['..#..', '#.#.#', '.###.'] },
  { color: C.tuftLight, rows: ['#...#', '.#.#.'] },
  { color: C.tuftDark, rows: ['#.#', '.#.'] },
]
for (let gy = SEA_END + 30; gy < H - 4; gy += 14) {
  for (let gx = 0; gx < W; gx += 24) {
    const t = TUFTS[Math.floor(rand() * TUFTS.length)]
    const ox = gx + Math.floor(rand() * 18)
    const oy = gy + Math.floor(rand() * 8)
    t.rows.forEach((row, ry) => [...row].forEach((c, rx) => c === '#' && set(ox + rx, oy + ry, t.color)))
  }
}

const OW = W * SCALE
const OH = H * SCALE
const raw = Buffer.alloc((OW * 3 + 1) * OH)
for (let y = 0; y < OH; y++) {
  const row = y * (OW * 3 + 1)
  raw[row] = 0
  for (let x = 0; x < OW; x++) {
    const i = (Math.floor(y / SCALE) * W + Math.floor(x / SCALE)) * 3
    raw[row + 1 + x * 3] = px[i]
    raw[row + 2 + x * 3] = px[i + 1]
    raw[row + 3 + x * 3] = px[i + 2]
  }
}
function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const body = Buffer.concat([Buffer.from(type), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body))
  return Buffer.concat([len, body, crc])
}
const ihdr = Buffer.alloc(13)
ihdr.writeUInt32BE(OW, 0)
ihdr.writeUInt32BE(OH, 4)
ihdr[8] = 8
ihdr[9] = 2
writeFileSync(
  OUT,
  Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]),
)
console.log(`Saved ${OUT.pathname} (${OW}x${OH})`)
