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
  //const [signup, { isLoading }] = useSignupMutation();

 {/* const signupFunction = async(e) => {
    e.preventDefault(); // Prevent page reload

    // Input validation
    if (!gamertag) return toast.error("Gamertag is required");
    if (!password) return toast.error("Password is required");
    if (password !== confirmPassword) return toast.error("Passwords do not match");
    if (!selectedPlatform) return toast.error("Please select a platform");
    if ((selectedPlatform === 'steam' || selectedPlatform === 'xbox') && !gameId) {
      return toast.error(`Please enter your ${selectedPlatform} Id`);
    }

    try{
      const res = await signup({
        userName: gamertag,
        password: password,
        platform: selectedPlatform,
        gameId: gameId || null,
      });
      if ("data" in res) {
        toast.success("Successfully signed up");
        setGamertag("");
        setPassword("");
        setConfirmPassword("");
        setSelectedPlatform("");
        setGameId("");
      } else {
        toast.error("Signup failed. Either you dont have the game");
        toast.error("Try again later.");
        setGamertag("");
        setPassword("");
        setConfirmPassword("");
        setSelectedPlatform("");
        setGameId("");
      }
    } catch (error) {
        toast.error("Try again later.");
        setGamertag("");
        setPassword("");
        setConfirmPassword("");
        setSelectedPlatform("");
        setGameId("");
        }
      };*/}

      const handleNext = (e) => {
        e.preventDefault();
    
        // Basic validation
        if (!gamertag || !password || password !== confirmPassword) {
        setGamertag("");
        setPassword("");
        setConfirmPassword("");
        setSelectedPlatform("");
        setGameId("");
          return toast.error("Please complete all required fields.");
        }
        if (!selectedPlatform) {
        setGamertag("");
        setPassword("");
        setConfirmPassword("");
        setSelectedPlatform("");
        setGameId("");
          return toast.error("Please select a platform.")};
        if ((selectedPlatform === 'steam' || selectedPlatform === 'xbox') && !gameId) {
        setGamertag("");
        setPassword("");
        setConfirmPassword("");
        setSelectedPlatform("");
        setGameId("");
          return toast.error(`Please enter your ${selectedPlatform} ID.`);
        }
    
        // Pass data to the next page
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

        {/*<button className="signup-button" onClick={signupFunction} disabled={isLoading}>
          {isLoading ? "Signing Up..." : "SIGN UP"}
        </button>*/}
        <button className="signup-button" onClick={handleNext}>
          Next Step
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default Signup;
