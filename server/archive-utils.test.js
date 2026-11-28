import test from 'node:test'
import assert from 'node:assert/strict'
import { formatArchiveDate, getImageFormat, isAllowedImageSize } from './archive-utils.js'

test('formats ISO archive dates as DD/MM/YYYY', () => {
  assert.equal(formatArchiveDate('2026-11-28'), '28/11/2026')
})

test('recognizes only supported image signatures', () => {
  assert.equal(getImageFormat(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])).contentType, 'image/png')
  assert.equal(getImageFormat(Buffer.from([0xff, 0xd8, 0xff])).contentType, 'image/jpeg')
  assert.equal(getImageFormat(Buffer.from('RIFF0000WEBP')).contentType, 'image/webp')
  assert.equal(getImageFormat(Buffer.from('not an image')), null)
})

test('allows images up to 8 MiB', () => {
  assert.equal(isAllowedImageSize(8 * 1024 * 1024), true)
  assert.equal(isAllowedImageSize(8 * 1024 * 1024 + 1), false)
  assert.equal(isAllowedImageSize(-1), false)
})
