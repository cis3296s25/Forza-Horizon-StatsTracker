import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "../styles/nav.css";
import Logo from '../assets/forzaImgs/forzaLogo.png';
import Profile from '../assets/forzaImgs/profileLogo.png'; 
import Leaderboard from '../assets/forzaImgs/leaderboardLogo.png';
import Car from '../assets/forzaImgs/carLogo.png';
import Map from '../assets/forzaImgs/mapLogo.png';

const NavBarLog = () => {
  const [isHovered, setIsHovered] = useState(false);

  const navigate = useNavigate();
  const [logout, { isLoading }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      const res = await logout();

      if ("data" in res) {
        // logged out
        toast.success("Logged out successfully");
        
        // redirect back to home but we can also make it login
        navigate('/', { replace: true });
      } else {
        //failed to log out
        toast.error("Unable to log out. Please try again.");
      }
    } catch (error) {
  // any other errors
      toast.error("There was an error logging out. Try again later.");
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
              <a href="#">
                <img src={Leaderboard} alt="Leaderboards" className="nav-icon" />
                Leaderboards
              </a>
            </li>
            <li>
              <a href="#">
                <img src={Car} alt="Cars" className="nav-icon" />
                Cars
              </a>
            </li>
            <li>
              <a href="#">
                <img src={Map} alt="Map" className="nav-icon" />
                Map
              </a>
            </li>
            <li>
                <button onClick={handleLogout} disabled={isLoading}>
                {isLoading ? 'Logging Out...' : 'LOGOUT'}
                Log Out
                </button>
            </li>
          </ul>
        </nav>
      </header>
    </div>
  );
};

export default NavBarLog;
