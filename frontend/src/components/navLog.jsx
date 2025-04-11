import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../styles/nav.css";
import Logo from '../assets/forzaImgs/forzaLogo.png';
import Profile from '../assets/forzaImgs/profileLogo.png'; 
import Leaderboard from '../assets/forzaImgs/leaderboardLogo.png';
import Compare from '../assets/forzaImgs/compareIcon.png';
import { useLogoutMutation } from '../redux/apis/user';  // Logout API from Redux toolkit
import toast from 'react-hot-toast';

const NavBarLog = () => {
  const [isHovered, setIsHovered] = useState(false);

  const navigate = useNavigate();
  const [logout, { isLoading }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      const res = await logout();

      if (res.data) {
        localStorage.removeItem('jwtToken');
        toast.success(res.data.message || "Logged out successfully");
        navigate('/');
      } else if (res.error) {
        const errorMessage = res.error.data?.message || "Unable to log out. Please try again.";
        toast.error(errorMessage);
      }
    } catch (error) {
      toast.error("There was an error logging out. Try again later.");
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="navBar">
      <header
        className="header"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <nav className={`navbar ${isHovered ? 'show' : ''}`}>
          {/* Logo Section */}
          <div className="logo-container">
            <Link to ="/#">
              <img src={Logo} alt="Logo" className="logo" />
            </Link>
          </div>

          {/* Navigation Links */}
          <ul className="nav-links">
            <li>
              <Link to ="/profile">
                <img src={Profile} alt="Profile" className="nav-icon" />
                Profile
              </Link>
            </li>
            <li>
              <a href="/leaderboard">
                <img src={Leaderboard} alt="Leaderboards" className="nav-icon" />
                Leaderboards
              </a>
            </li>
            <li>
                <img src={Compare} alt="Map" className="nav-icon" />
                <Link to ="/compare-page">
                  Compare Stats
                </Link>
            </li>
            <li>
                <button onClick={handleLogout} disabled={isLoading}>
                {isLoading ? 'Logging Out...' : 'LOGOUT'}
                </button>
            </li>
          </ul>
        </nav>
      </header>
    </div>
  );
};

export default NavBarLog;
