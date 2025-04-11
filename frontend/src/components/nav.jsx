import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "../styles/nav.css";
import Logo from '../assets/forzaImgs/forzaLogo.png';
import Profile from '../assets/forzaImgs/profileLogo.png'; 
import Leaderboard from '../assets/forzaImgs/leaderboardLogo.png';
import Compare from "../assets/forzaImgs/compareIcon.png";

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
              <Link to ="/signup">
                SignUp
              </Link>
            </li>
          </ul>
        </nav>
      </header>
    </div>
  );
};

export default NavBar;
