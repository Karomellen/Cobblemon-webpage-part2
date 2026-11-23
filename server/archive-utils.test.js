import test from 'node:test'
import assert from 'node:assert/strict'
import { getImageFormat, isAllowedImageSize, isValidArchiveDate } from './archive-utils.js'

test('accepts real calendar dates and rejects malformed dates', () => {
  assert.equal(isValidArchiveDate('2024-02-29'), true)
  assert.equal(isValidArchiveDate('2025-02-29'), false)
  assert.equal(isValidArchiveDate('2025-2-09'), false)
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
