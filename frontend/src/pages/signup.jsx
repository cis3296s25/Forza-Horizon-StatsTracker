import React, {useState} from 'react';
import "../styles/signup.css";
import Nav from '../components/nav';
import Footer from '../components/footer';

const Signup = () => {

  const [selectedPlatform, setSelectedPlatform] = useState("");
  
  const handlePlatformChange = (e) => {
    setSelectedPlatform(e.target.value);
  };

  return (
    <div className="signup-mainContainer">
      <Nav />
      <div className="signup-container">
        <input type="text" placeholder="ENTER GAMER TAG" className="signup-input"  required/>
        <input type="password" placeholder="CREATE A PASSWORD" className="signup-input" required />
        <input type="password" placeholder="RE-ENTER PASSWORD" className="signup-input" required />

        <div className="platform-options">
          <label><input type="radio" name="platform" value ="steam" checked={selectedPlatform=== 'steam'} onChange={handlePlatformChange}/> STEAM</label>
          <label><input type="radio" name="platform" value = "xbox" checked={selectedPlatform === 'xbox'} onChange={handlePlatformChange}/> XBOX</label>
          <label><input type="radio" name="platform" value = "manual" checked={selectedPlatform === 'Manual'} onChange={handlePlatformChange}/> Manual</label>
        </div>

        {selectedPlatform === 'steam' && (
          <input 
            type="text" 
            placeholder="ENTER STEAM ID" 
            className="signup-input" 
            required 
          />
        )}

        {selectedPlatform === 'xbox' && (
          <input 
            type="text" 
            placeholder="ENTER XBOX ID" 
            className="signup-input" 
            required 
          />
        )}
        
        <button className="signup-button">SIGN UP</button>
      </div>
      <Footer />
    </div>
  );
}

export default Signup;
