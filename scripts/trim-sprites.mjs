// Makes tightly cropped copies of the Pokémon sprites (empty transparent border removed),
// so they can be sized and placed precisely in CSS.
// Run: node scripts/trim-sprites.mjs
// Reads public/images/<name>.png, writes public/images/sprites/<name>.png. Originals are untouched.
// Supports 8-bit RGBA PNGs (what most sprite downloads are).

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { crc32, deflateSync, inflateSync } from 'node:zlib'

const SPRITES = ['pikachu', 'rowlet', 'furret', 'mudkip', 'oshawott']
const IN = new URL('../public/images/', import.meta.url)
const OUT = new URL('../public/images/sprites/', import.meta.url)

function decode(buf) {
  let o = 8
  let ihdr
  const idat = []
  while (o < buf.length) {
    const len = buf.readUInt32BE(o)
    const type = buf.toString('ascii', o + 4, o + 8)
    const data = buf.subarray(o + 8, o + 8 + len)
    if (type === 'IHDR') ihdr = data
    if (type === 'IDAT') idat.push(data)
    o += 12 + len
  }
  const w = ihdr.readUInt32BE(0)
  const h = ihdr.readUInt32BE(4)
  if (ihdr[8] !== 8 || ihdr[9] !== 6 || ihdr[12] !== 0) throw new Error('only 8-bit RGBA, non-interlaced PNGs are supported')
  const stride = w * 4
  const raw = inflateSync(Buffer.concat(idat))
  const px = Buffer.alloc(stride * h)
  for (let y = 0; y < h; y++) {
    const filter = raw[y * (stride + 1)]
    for (let x = 0; x < stride; x++) {
      const r = raw[y * (stride + 1) + 1 + x]
      const a = x >= 4 ? px[y * stride + x - 4] : 0
      const b = y ? px[(y - 1) * stride + x] : 0
      const c = x >= 4 && y ? px[(y - 1) * stride + x - 4] : 0
      let v = r
      if (filter === 1) v = r + a
      else if (filter === 2) v = r + b
      else if (filter === 3) v = r + ((a + b) >> 1)
      else if (filter === 4) {
        const p = a + b - c
        const pa = Math.abs(p - a)
        const pb = Math.abs(p - b)
        const pc = Math.abs(p - c)
        v = r + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c)
      }
      px[y * stride + x] = v & 255
    }
  }
  return { w, h, px }
}

function encode(w, h, px) {
  const stride = w * 4
  const raw = Buffer.alloc((stride + 1) * h)
  for (let y = 0; y < h; y++) px.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride)
  const chunk = (type, data) => {
    const len = Buffer.alloc(4)
    len.writeUInt32BE(data.length)
    const body = Buffer.concat([Buffer.from(type), data])
    const crc = Buffer.alloc(4)
    crc.writeUInt32BE(crc32(body))
    return Buffer.concat([len, body, crc])
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(w, 0)
  ihdr.writeUInt32BE(h, 4)
  ihdr[8] = 8
  ihdr[9] = 6
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

mkdirSync(OUT, { recursive: true })
for (const name of SPRITES) {
  const { w, h, px } = decode(readFileSync(new URL(`${name}.png`, IN)))
  let x0 = w, y0 = h, x1 = -1, y1 = -1
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++)
      if (px[(y * w + x) * 4 + 3] > 16) {
        x0 = Math.min(x0, x); x1 = Math.max(x1, x)
        y0 = Math.min(y0, y); y1 = Math.max(y1, y)
      }
  const cw = x1 - x0 + 1
  const ch = y1 - y0 + 1
  const out = Buffer.alloc(cw * ch * 4)
  for (let y = 0; y < ch; y++) px.copy(out, y * cw * 4, ((y + y0) * w + x0) * 4, ((y + y0) * w + x1 + 1) * 4)
  writeFileSync(new URL(`${name}.png`, OUT), encode(cw, ch, out))
  console.log(`${name}: ${w}x${h} -> ${cw}x${ch}`)
}
