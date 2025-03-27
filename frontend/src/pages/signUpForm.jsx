import React, {useState} from 'react';
import "../styles/signupform.css";
import Nav from '../components/nav';
import Footer from '../components/footer';

const SignupForm = () => {

  const [selectedPlatform, setSelectedPlatform] = useState("");
  
  const handlePlatformChange = (e) => {
    setSelectedPlatform(e.target.value);
  };

  return (
    <div className="signup-mainContainer">
      <Nav />
      <div className="signUpForm-Container">
        <form>
          <label for="numVictories">Number Of Victories</label><br/>
          <input type="number" id="numVictories" name="numVictories"/><br/>
          <label for="numCars">Number of Cars Owned</label><br/>
          <input type="number" id="numCars" name="numCars"/><br/>
          <label for="garageVal">Garage Value</label><br/>
          <input type="number" id="garageVal" name="garageVal"/><br/>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default SignupForm;
