import React, { useState } from 'react';
import "../styles/signup.css";
import Nav from '../components/nav';
import Footer from '../components/footer';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaQuestionCircle } from "react-icons/fa";

const Signup = () => {
  const [gamertag, setGamertag] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [gameId, setGameId] = useState("");
  const [email, setEmail] = useState('');

  const navigate = useNavigate();
      const handleNext = (e) => {
        e.preventDefault();
    
        if (!gamertag || !password || password !== confirmPassword || !selectedPlatform) {
          toast.error("Please fill out all fields correctly.");
          return;
      }
  
      if ((selectedPlatform === 'steam' || selectedPlatform === 'xbox') && !gameId) {
          toast.error(`Please enter your ${selectedPlatform} ID.`);
          return;
      }
    
        navigate('/signup-stats', {
          state: { gamertag, email, password, selectedPlatform, gameId },
        });
      };

  return (
    <div className="signup-mainContainer">
      <Nav />
      <div className="signup-container">
        <input 
          type="text" 
          placeholder="ENTER GAMER TAG" 
          className="signup-input" 
          value={gamertag} 
          onChange={(e) => setGamertag(e.target.value)} 
        />
        <input 
          type="text" 
          placeholder="ENTER EMAIL ADDRESS" 
          className="signup-input" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
        <input 
          type="password" 
          placeholder="CREATE A PASSWORD" 
          className="signup-input" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
        <input 
          type="password" 
          placeholder="RE-ENTER PASSWORD" 
          className="signup-input" 
          value={confirmPassword} 
          onChange={(e) => setConfirmPassword(e.target.value)} 
        />

        <div className="platform-options">
        <label>
          <input 
            type="radio" 
            name="platform" 
            value="steam" 
            checked={selectedPlatform === 'steam'} 
            onChange={(e) => setSelectedPlatform(e.target.value)} 
          /> STEAM
          <span className="platform-tooltip-wrapper">
            <FaQuestionCircle className="platform-tooltip-icon" />
            <div className="platform-tooltip-content">
              <h2 style={{textAlign:"center"}}>It will only work if you have Forza Horizon 5</h2>
              <p style={{ textAlign: 'center' }}>To get your Steam ID</p>
              <li>Open the Steam App</li>
              <li>Click on your profile name in the top right corner</li>
              <li>Click on "View Profile"</li>
              <li>Click on the "Edit Profile" button</li>
              <li>Click on the "Privacy Settings" tab</li>
              <li>Click on My Profile</li>
              <li>Change the setting to "Public"</li>
              <li>Scroll down to the "Game Details" section</li>
              <li>Change the setting to "Public"</li>
              <li>Click on the "Save Changes" button</li>
              <li>Click on "View Profile"</li>
              <li>Click on the "Account Details" button</li>
              <li> Copy the Steam Id under your account</li>
              <li>Now go back to our website</li>
              <li>Select the Steam button</li>
              <li>Paste the Steam Id into the "Enter Steam ID"</li>
            </div>
          </span>
        </label>
          <label>
            <input 
              type="radio" 
              name="platform" 
              value="xbox" 
              checked={selectedPlatform === 'xbox'} 
              onChange={(e) => setSelectedPlatform(e.target.value)} 
            /> XBOX
            <span className="platform-tooltip-wrapper">
            <FaQuestionCircle className="platform-tooltip-icon" />
            <div className="platform-tooltip-content">
            <h2 style={{textAlign:"center"}}>It will only work if you have Forza Horizon 5</h2>
              <p style={{ textAlign: 'center' }}>To get your Xbox XUID.</p>
              <li> Please vist this website in a new tab <Link to="https://www.cxkes.me/xbox/xuid" target="_blank" style={{color:"white"}}>https://www.cxkes.me/xbox/xuid</Link></li>
              <li>Write your xbox username in the given box</li>
              <li>Click on the check button "Look Up"</li>
              <li>It will not show you, your Xbox account stats</li>
              <li>Click on the copy icon next to the XUID (DEC) or copy it manually</li>
              <li>Now go back to our website</li>
              <li>Select the Xbox button</li>
              <li>Paste your XUID in the Enter Xbox Id</li>
              <li>Click on the Next Step button</li>
            </div>
          </span>
          </label>
          <label>
            <input 
              type="radio" 
              name="platform" 
              value="manually" 
              checked={selectedPlatform === 'manually'} 
              onChange={(e) => setSelectedPlatform(e.target.value)} 
            /> Manually
          </label>
        </div>

        {selectedPlatform === 'steam' && (
  <input 
    type="text" 
    placeholder="ENTER STEAM ID" 
    className="signup-input" 
    value={gameId} // Correct gameId value
    onChange={(e) => setGameId(e.target.value)} // Fix here
  />
)}

        
{selectedPlatform === 'xbox' && (
  <input 
    type="text" 
    placeholder="ENTER XBOX ID" 
    className="signup-input" 
    value={gameId} // Correct gameId value
    onChange={(e) => setGameId(e.target.value)} // Fix here
  />
)}
        <button className="signup-button" onClick={handleNext}>
          Next Step
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default Signup;
