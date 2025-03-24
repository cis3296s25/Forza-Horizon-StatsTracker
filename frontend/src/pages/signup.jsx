import React from 'react';
import "../styles/signup.css";
import Nav from '../components/nav';

function Signup() {
  return (
    <div className="signup-mainContainer">
      <Nav />
      <div className="signup-container">
        <input type="text" placeholder="ENTER GAMER TAG" className="signup-input" />
        <input type="password" placeholder="CREATE A PASSWORD" className="signup-input" />
        <input type="password" placeholder="RE-ENTER PASSWORD" className="signup-input" />

        <div className="platform-options">
          <label><input type="radio" name="platform" /> STEAM</label>
          <label><input type="radio" name="platform" /> XBOX</label>
          <label><input type="radio" name="platform" /> MANUAL</label>
        </div>

        <button className="signup-button">SIGN UP</button>
      </div>
    </div>
  );
}

export default Signup;
