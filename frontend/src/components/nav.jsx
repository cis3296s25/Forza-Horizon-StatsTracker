import React, { useState } from 'react';
import "../styles/nav.css";

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
            <img src="src/forzaImgs/forzaLogo.png" alt="Logo" className="logo" />
          </div>

          {/* Navigation Links */}
          <ul className="nav-links">
            <li>
              <a href="#">
                <img src="src/forzaImgs/profileLogo.png" alt="Profile" className="nav-icon" />
                Profile
              </a>
            </li>
            <li>
              <a href="#">
                <img src="src/forzaImgs/leaderboardLogo.png" alt="Leaderboards" className="nav-icon" />
                Leaderboards
              </a>
            </li>
            <li>
              <a href="#">
                <img src="src/forzaImgs/carLogo.png" alt="Cars" className="nav-icon" />
                Cars
              </a>
            </li>
            <li>
              <a href="#">
                <img src="src/forzaImgs/mapLogo.png" alt="Map" className="nav-icon" />
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
