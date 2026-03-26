import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';

function App() {
  const navItems = [
    { to: '/activities', label: 'Activities' },
    { to: '/leaderboard', label: 'Leaderboard' },
    { to: '/teams', label: 'Teams' },
    { to: '/users', label: 'Users' },
    { to: '/workouts', label: 'Workouts' },
  ];

  return (
    <div className="app-shell py-4">
      <div className="container">
        <div className="card app-hero border-0 mb-4">
          <div className="card-body d-flex align-items-center gap-3 flex-wrap">
            <img
              src="/octofitapp-small.png"
              alt="OctoFit logo"
              className="app-logo"
            />
            <div>
              <h1 className="display-6 fw-bold mb-1 app-title">OctoFit Tracker</h1>
              <p className="mb-0 app-subtitle">
                Fitness insights powered by the OctoFit REST API.
              </p>
            </div>
          </div>
        </div>

        <nav className="navbar navbar-expand-lg octofit-nav rounded-4 px-3 mb-4" aria-label="Main navigation">
          <span className="navbar-brand fw-semibold">Navigation</span>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#octofitNav"
            aria-controls="octofitNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="octofitNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-1">
              {navItems.map((item) => (
                <li className="nav-item" key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `nav-link px-3 rounded-pill ${isActive ? 'active fw-semibold' : ''}`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Navigate to="/activities" replace />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/users" element={<Users />} />
          <Route path="/workouts" element={<Workouts />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
