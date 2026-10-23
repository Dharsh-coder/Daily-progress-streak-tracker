
import { useState } from 'react'
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import Home from './pages/Home'
import LogActivity from './pages/LogActivity'
import ActivityRecords from './pages/ActivityRecords'
import './App.css'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <BrowserRouter>
      <div className={`app-layout ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
        <aside className="sidebar">
          <div className="brand">
            <button
              className="sidebar-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
              title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              {sidebarOpen ? '☰' : '☰'}
            </button>

            {sidebarOpen && (
              <span>
                <span className="brand-fire">🔥</span>
                Progress<span className="brand-accent">Tracker</span>
              </span>
            )}
          </div>

          <nav className="sidebar-nav">
            <NavLink to="/" end className="nav-link" title="Home">
              <span className="nav-icon">⌂</span>
              {sidebarOpen && <span>Home</span>}
            </NavLink>

            <NavLink to="/log-activity" className="nav-link" title="Log Activity">
              <span className="nav-icon">✎</span>
              {sidebarOpen && <span>Log Activity</span>}
            </NavLink>

            <NavLink to="/records" className="nav-link" title="Activity Records">
              <span className="nav-icon">▤</span>
              {sidebarOpen && <span>Activity Records</span>}
            </NavLink>
          </nav>
        </aside>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/log-activity" element={<LogActivity />} />
            <Route path="/records" element={<ActivityRecords />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
