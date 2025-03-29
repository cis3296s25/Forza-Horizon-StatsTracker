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
  
  const handleSubmit = async (e) => {
    if (!victories || !numberofCarsOwned || !garageValue) {
      return toast.error("Please fill in all the fields.");
    }

    const numVictories = parseInt(victories);
    const numCarsOwned = parseInt(numberofCarsOwned);


    try {
      const res = await signup({
        userName: gamertag,
        password: password,
        platform: selectedPlatform,
        gameId: gameId || null,
        victories: numVictories,
        numberofCarsOwned: numCarsOwned,
        garageValue,
      });

      if ("data" in res) {
        toast.success("Signup successful!");
        navigate("/");
      } else {
        victories("");
        numberofCarsOwned("");
        garageValue("");
        toast.error("Signup failed. Please try again later.");
      }
    } catch (error) {
      setVictories("");
      setNumberOfCarsOwned("");
      setGarageValue("");
      toast.error("An error occurred. Please try again.");
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