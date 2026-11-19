// Row of toggle buttons. Used for the announcement filter and the archive sort.
export default function Chips({ label, options, value, onChange }) {
  return (
    <div className="chips">
      <span>{label}</span>
      {options.map((o) => (
        <button
          key={o.id}
          className={`chip${value === o.id ? ' active' : ''}`}
          aria-pressed={value === o.id}
          onClick={() => onChange(o.id)}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
