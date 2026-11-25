import { useState } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import Intro from './components/Intro.jsx'
import Layout from './components/Layout.jsx'
import Snowfall from './components/Snowfall.jsx'
import Landing from './pages/Landing.jsx'
import Announcements from './pages/Announcements.jsx'
import Archive from './pages/Archive.jsx'
import Rules from './pages/Rules.jsx'
import Support from './pages/Support.jsx'
import Installation from './pages/Installation.jsx'

const INTRO_SEEN_KEY = 'cobblemon-intro-seen'

function hasSeenIntro() {
  try {
    return window.localStorage.getItem(INTRO_SEEN_KEY) === 'true'
  } catch (error) {
    console.warn('Could not read intro preference:', error)
    return false
  }
}

function markIntroSeen() {
  try {
    window.localStorage.setItem(INTRO_SEEN_KEY, 'true')
  } catch (error) {
    console.warn('Could not save intro preference:', error)
  }
}

export default function App() {
  const navigate = useNavigate()
  const { pathname, search } = useLocation()
  const replayIntro = new URLSearchParams(search).get('intro') === 'replay'

  const [introDone, setIntroDone] = useState(hasSeenIntro)

  const finishIntro = () => {
    markIntroSeen()
    setIntroDone(true)
    if (pathname === '/' || replayIntro) navigate('/home', { replace: true })
  }

  return (
    <>
      <Snowfall />
      <div className="app-content">
        {!introDone || replayIntro ? (
          <Intro onDone={finishIntro} />
        ) : (
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route element={<Layout />}>
              <Route path="/home" element={<Landing />} />
              <Route path="/announcements" element={<Announcements />} />
              <Route path="/archive" element={<Archive />} />
              <Route path="/rules" element={<Rules />} />
              <Route path="/support" element={<Support />} />
              <Route path="/install" element={<Installation />} />
            </Route>
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        )}
      </div>
    </>
  )
}
