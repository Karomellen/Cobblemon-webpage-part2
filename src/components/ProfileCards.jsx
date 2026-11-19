import { PROFILES } from '../config.js'

// Discord contacts. Without a url the handle is shown as plain text.
export default function ProfileCards() {
  return (
    <div className="grid grid-profiles">
      {PROFILES.map((p) => (
        <article key={p.handle} className="card pixel profile">
          <div className="avatar pixel">AVATAR</div>
          <div>
            <h3 className="handle">{p.handle}</h3>
            <p className="muted">{p.role}</p>
            {p.url && (
              <a className="btn pixel" href={p.url} target="_blank" rel="noreferrer">
                Discord profile
              </a>
            )}
          </div>
        </article>
      ))}
    </div>
  )
}
