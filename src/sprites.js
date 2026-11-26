
const EXT = { mudkip: 'webp', raichu: 'webp', sprigatito: 'webp' }

export const spriteSrc = (name) => `/sprites/${name}.${EXT[name] ?? 'png'}`
