import { useState } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import Intro from './components/Intro.jsx'
import Layout from './components/Layout.jsx'
import Landing from './pages/Landing.jsx'
import Announcements from './pages/Announcements.jsx'
import Archive from './pages/Archive.jsx'
import Rules from './pages/Rules.jsx'
import Support from './pages/Support.jsx'

export default function App() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  // Kept in memory only, so every page load (refresh) starts with the intro.
  const [introDone, setIntroDone] = useState(false)

  if (!introDone) {
    const finishIntro = () => {
      setIntroDone(true)
      if (pathname === '/') navigate('/home', { replace: true })
    }
    return <Intro onDone={finishIntro} />
  }

  return (
    <Routes>
      {/* Reached through the footer's "Replay intro" link */}
      <Route path="/" element={<Intro onDone={() => navigate('/home')} />} />
      <Route element={<Layout />}>
        <Route path="/home" element={<Landing />} />
        <Route path="/announcements" element={<Announcements />} />
        <Route path="/archive" element={<Archive />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/support" element={<Support />} />
      </Route>
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  )
}
