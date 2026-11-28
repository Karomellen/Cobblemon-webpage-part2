export const MAX_IMAGE_BYTES = 8 * 1024 * 1024

export function isAllowedImageSize(size) {
  return Number.isSafeInteger(size) && size >= 0 && size <= MAX_IMAGE_BYTES
}

export function formatArchiveDate(value) {
  const [year, month, day] = value.split('-')
  return `${day}/${month}/${year}`
}

export function getImageFormat(bytes) {
  if (
    bytes.length >= 8 &&
    bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  ) {
    return { extension: 'png', contentType: 'image/png' }
  }
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return { extension: 'jpg', contentType: 'image/jpeg' }
  }
  if (
    bytes.length >= 12 &&
    bytes.toString('ascii', 0, 4) === 'RIFF' &&
    bytes.toString('ascii', 8, 12) === 'WEBP'
  ) {
    return { extension: 'webp', contentType: 'image/webp' }
  }
  return null
}
