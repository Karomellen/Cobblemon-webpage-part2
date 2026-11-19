// Pixel hearts for the top bar. `full` of `total` are red, the rest are empty.
const SHAPE = ['.##.##.', '#######', '#######', '.#####.', '..###..', '...#...']

function Heart({ full }) {
  return (
    <svg className="heart" viewBox="0 0 7 6" aria-hidden="true">
      {SHAPE.flatMap((row, y) =>
        [...row].map((c, x) =>
          c === '#' ? <rect key={`${x}-${y}`} x={x} y={y} width="1.02" height="1.02" fill={full ? 'var(--red)' : 'var(--muted)'} /> : null,
        ),
      )}
    </svg>
  )
}

export default function Hearts({ full = 2, total = 3 }) {
  return (
    <span className="hearts">
      {Array.from({ length: total }, (_, i) => (
        <Heart key={i} full={i < full} />
      ))}
    </span>
  )
}
