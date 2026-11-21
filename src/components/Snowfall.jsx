const SNOWFLAKES = Array.from({ length: 90 }, () => ({
  left: `${Math.random() * 100}%`,
  size: `${1 + Math.random() * 4}px`,
  opacity: 0.25 + Math.random() * 0.55,
  duration: `${12 + Math.random() * 14}s`,
  delay: `${-Math.random() * 26}s`,
  drift: `${-18 + Math.random() * 36}px`,
}))

export default function Snowfall() {
  return (
    <div className="snow-field" aria-hidden="true">
      {SNOWFLAKES.map((flake, index) => (
        <i
          className="snowflake"
          key={index}
          style={{
            left: flake.left,
            width: flake.size,
            height: flake.size,
            opacity: flake.opacity,
            animationDuration: flake.duration,
            animationDelay: flake.delay,
            '--snow-drift': flake.drift,
          }}
        />
      ))}
    </div>
  )
}
