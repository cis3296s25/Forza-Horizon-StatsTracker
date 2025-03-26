import React, {useState} from 'react';
import "../styles/signup.css";
import Nav from '../components/nav';
import Footer from '../components/footer';
import { useSignupMutation } from '../redux/apis/user';
import toast from 'react-hot-toast';
const Signup = () => {

  const [gamertag, setGamertag] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [platformId, setPlatformId] = useState("");  
  const [signup, {isLoading}] = useSignupMutation();

  const handlePlatformChange = (e) => {
    setSelectedPlatform(e.target.value);
    setPlatformId("");
  };

  const signupFunction = (e) => {
    if (e) e.preventDefault();

    // checks for balid inputs
    if (!gamertag) {
      toast.error("Gamertag is required");
      return;
    }

    if (!password) {
      toast.error("Password is required");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!selectedPlatform) {
      toast.error("Please select a platform");
      return;
    }

    if ((selectedPlatform === 'steam' || selectedPlatform === 'xbox') && !platformId) {
      toast.error(`Please enter your ${selectedPlatform} ID`);
      return;
    }

    //signup page
    //used .then to say what should happen and in all other cases errprs 
    signup({
      userName: gamertag,
      password: password,
      platform: selectedPlatform,
      platformId: platformId || null
    })
    .then((res) => {
      if ("data" in res) {
        toast.success("Successfully signed up");
        // resets the fielcs once signed in
        setGamertag("");
        setPassword("");
        setConfirmPassword("");
        setSelectedPlatform("");
        setPlatformId("");
      } else {
        toast.error("Signup failed. Please try again.");
      }
    })
    
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
