import React, { useState } from 'react';
import "../styles/signup.css";
import Nav from '../components/nav';
import Footer from '../components/footer';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Signup = () => {
  const [gamertag, setGamertag] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [gameId, setGameId] = useState("");
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
          state: { gamertag, password, selectedPlatform, gameId },
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
          </label>
          <label>
            <input 
              type="radio" 
              name="platform" 
              value="xbox" 
              checked={selectedPlatform === 'xbox'} 
              onChange={(e) => setSelectedPlatform(e.target.value)} 
            /> XBOX
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
