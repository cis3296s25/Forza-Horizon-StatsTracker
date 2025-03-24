import React from 'react';
import { useEffect,useState } from 'react';
import "../styles/profile.css";
import Nav from '../components/nav';


function Profile() {
    return (
      <div className="profile-mainContainer">
        <Nav />
        <div className="login-container">
          <input type="text" placeholder="ENTER GAMER TAG" className="login-input" />
          <input type="password" placeholder="ENTER PASSWORD" className="login-input" />
          <button className="login-button">SIGN IN</button>
        </div>
      </div>
    );
  }
  
  export default Profile;

