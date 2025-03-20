import React, { useState } from 'react';
import "../styles/nav.css";
import Logo from '../assets/forzaImgs/forzaLogo.png';
import Profile from '../assets/forzaImgs/profileLogo.png'; 
import Leaderboard from '../assets/forzaImgs/leaderboardLogo.png';
import Car from '../assets/forzaImgs/carLogo.png';
import Map from '../assets/forzaImgs/mapLogo.png';

const NavBar = () => {
  const [isHovered, setIsHovered] = useState(false);

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
            <img src={Logo} alt="Logo" className="logo" />
          </div>

          {/* Navigation Links */}
          <ul className="nav-links">
            <li>
              <a href="#">
                <img src={Profile} alt="Profile" className="nav-icon" />
                Profile
              </a>
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
          </ul>
        </nav>
      </header>
    </div>
  );
};

export default NavBar;
