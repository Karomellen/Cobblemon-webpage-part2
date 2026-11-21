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

export default function App() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const [introDone, setIntroDone] = useState(false)

  const finishIntro = () => {
    setIntroDone(true)
    if (pathname === '/') navigate('/home', { replace: true })
  }

  return (
    <>
      <Snowfall />
      <div className="app-content">
        {!introDone ? (
          <Intro onDone={finishIntro} />
        ) : (
          <Routes>
            {}
            <Route path="/" element={<Intro onDone={() => navigate('/home')} />} />
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
