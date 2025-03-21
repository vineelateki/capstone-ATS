import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink, useNavigate } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';
import Login from './components/Login/Login';
import UserProfile from './components/UserProfile/UserProfile';
import SignUp from './components/Signup/SignUp';
import { UserProvider, UserContext } from '../src/context/UserContext';
import './App.css'; // Import global styles

const App = () => {
  return (
    <UserProvider>
      <Router>
        <div className="app">
          <Nav />
          <div className="content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/profiles" element={<UserProfile />} />
            </Routes>
          </div>
        </div>
      </Router>
    </UserProvider>
  );
};

const Nav = () => {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <NavLink to="/" className="nav-logo">Agile Tracking Sytem</NavLink>
        <ul className="nav-links">
          <li><NavLink to="/" activeClassName="active">Dashboard</NavLink></li>
          {user ? (
            <>
              <li><NavLink to="/profiles" activeClassName="active">Profiles</NavLink></li>
              <li><button className="logout-btn" onClick={handleLogout}>Logout</button></li>
            </>
          ) : (
            <>
              <li><NavLink to="/login" activeClassName="active">Login</NavLink></li>
              <li><NavLink to="/signup" activeClassName="active">Sign Up</NavLink></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default App;
