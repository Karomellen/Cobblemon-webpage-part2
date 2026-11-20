// Sprites that aren't .png
const EXT = { mudkip: 'webp', raichu: 'webp', sprigatito: 'webp' }

export const spriteSrc = (name) => `/images/sprites/${name}.${EXT[name] ?? 'png'}`
