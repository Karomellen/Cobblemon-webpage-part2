import test from 'node:test'
import assert from 'node:assert/strict'
import { getImageFormat, isAllowedImageSize, parseArchiveDate } from './archive-utils.js'

test('parses valid DD/MM/YYYY dates and rejects malformed dates', () => {
  assert.equal(parseArchiveDate('29/02/2024'), '2024-02-29')
  assert.equal(parseArchiveDate('29/02/2025'), null)
  assert.equal(parseArchiveDate('9/02/2025'), null)
  assert.equal(parseArchiveDate('31/04/2025'), null)
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
