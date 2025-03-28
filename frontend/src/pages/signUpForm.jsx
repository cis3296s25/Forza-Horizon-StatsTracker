import React, { useState } from 'react';
import "../styles/signup.css";
import Nav from '../components/nav';
import Footer from '../components/footer';
import { useLocation } from 'react-router-dom';
import { useSignupMutation } from '../redux/apis/user';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
const SignupForm = () => {
  const location = useLocation();
  const { gamertag, password, selectedPlatform, gameId } = location.state || {};
  
  const [victories, setVictories] = useState('');
  const [numberofCarsOwned, setNumberOfCarsOwned] = useState('');
  const [garageValue, setGarageValue] = useState('');
  const [signup, { isLoading }] = useSignupMutation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!gamertag || !password || !selectedPlatform) {
      toast.error("Good Try but your attempt failed");
      navigate("/signup", { state: {} });
    }
  }, [gamertag, password, selectedPlatform, navigate]);
  
  const handleSubmit = async (e) => {
    if (!victories || !numberofCarsOwned || !garageValue) {
      return toast.error("All fields must be filled out.");
  }

  try {
    const response = await signup({
        userName: gamertag,
        password,
        platform: selectedPlatform,
        gameId: gameId || null,
        victories: parseInt(victories),
        numberofCarsOwned: parseInt(numberofCarsOwned),
        garageValue,
    });

    if ("data" in response) {
      toast.success("Signup successful!");
      navigate("/");
  } else {
      toast.error(response.error?.data?.message || "Signup failed. Please try again.");
      navigate("/signup", { state: {} });
  }
} catch (error) {
  toast.error("An unexpected error occurred.");
  navigate("/signup", { state: {} });
}
  };

  return (
    <div className="signup-mainContainer">
      <Nav />
      <div className="signup-container">
          <label style={{fontWeight:"700"}}>Number Of Victories</label>
          <input
            type="number"
            id="numVictories"
            value={victories}
            className="signup-input" 
            placeholder='100'
            onChange={(e) => setVictories(e.target.value)}
          />
          <label style={{fontWeight:"700"}}>Number of Cars Owned</label>
          <input
            type="number"
            id="numCars"
            value={numberofCarsOwned}
            className="signup-input"
            placeholder='100' 
            onChange={(e) => setNumberOfCarsOwned(e.target.value)}
          />
          <label style={{fontWeight:"700"}}>Garage Value</label>
          <input
            type="text"
            id="garageVal"
            value={garageValue}
            className="signup-input" 
            placeholder='10,000 Cr'
            onChange={(e) => setGarageValue(e.target.value)}
          />
          <button className="signup-button" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Signing Up..." : "Submit"}
          </button>   
      </div>
      <Footer />
    </div>
  );
}

export default SignupForm;