import React, { useState, useEffect } from 'react'; // Import useEffect here
import "../styles/signup.css";
import Nav from '../components/nav';
import Footer from '../components/footer';
import { useLocation } from 'react-router-dom';
import { useSignupMutation } from '../redux/apis/user';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { FaQuestionCircle } from "react-icons/fa";

const SignupForm = () => {
  const location = useLocation();
  const { gamertag, email, password, selectedPlatform, gameId } = location.state || {};
  
  const [victories, setVictories] = useState('');
  const [numberofCarsOwned, setNumberOfCarsOwned] = useState('');
  const [garageValue, setGarageValue] = useState('');
  

  const [timeDriven, setTimeDriven] = useState('');
  const [mostValuableCar, setMostValuableCar] = useState('');
  const [totalWinnningsinCR, setTotalWinningsinCR] = useState('');
  const [favoriteCar, setFavoriteCar] = useState('');
  const [longestSkillChain, setLongestSkillChain] = useState('');
  const [distanceDrivenInMiles, setDistanceDrivenInMiles] = useState('');
  const [longestJump, setLongestJump] = useState('');
  const [topSpeed, setTopSpeed] = useState('');
  const [biggestAir, setBiggestAir] = useState('');

const [signup, { isLoading }] = useSignupMutation();
const navigate = useNavigate();

  useEffect(() => {
    if (!gamertag || !password || !selectedPlatform) {
      toast.error("Good Try but your attempt failed");
      navigate("/signup", { state: {} });
    }
  }, [gamertag, password, selectedPlatform, navigate]);
  
  const handleSubmit = async () => {
    if (!victories || !numberofCarsOwned || !garageValue) {
      return toast.error("All fields must be filled out.");
  }

  try {
    const userStats = {
      userName: gamertag,
      email,
      victories: parseInt(victories),
      numberofCarsOwned: parseInt(numberofCarsOwned),
      garageValue,
      timeDriven,
      mostValuableCar,
      totalWinnningsinCR: totalWinnningsinCR ? parseInt(totalWinnningsinCR) : undefined,
      favoriteCar,
      longestSkillChain,
      distanceDrivenInMiles: distanceDrivenInMiles ? parseInt(distanceDrivenInMiles) : undefined,
      longestJump: longestJump ? parseInt(longestJump) : undefined,
      topSpeed: topSpeed ? parseInt(topSpeed) : undefined,
      biggestAir
    };

    const response = await signup({
      userName: gamertag,
      password,
      platform: selectedPlatform,
      gameId: gameId || null,
      ...userStats
    });

    if ("data" in response) {
      toast.success("Signup successful!");
      navigate("/");
    } else {
      toast.error(response.error?.data?.message || "Signup failed. Please try again. Invalid Input.");
    }
  } catch (error) {
    toast.error("An unexpected error occurred.");
    navigate("/signup", { state: {} });
  }
};

return (
  <div className="signup-mainContainer">
    <Nav />
    <div className="signup-container" style={{color: "white"}}>
      <h2 style={{textAlign: "center", marginBottom: "5px"}}>Driver Statistics</h2>
      
      <table style={{width: "100%", borderCollapse: "separate", borderSpacing: "30px"}}>
        <tbody>
          {/* Row 1 */}
          <tr>
            <td>
              <label style={{fontWeight:"700", display: "block", textAlign: "center", marginBottom: "8px"}}>Number Of Victories  
                <span className="platform-tooltip-wrapper">
                          <FaQuestionCircle className="platform-tooltip-icon" />
                          <div className="platform-tooltip-content">
                            <p>This stats can be found under general third row, first column</p>
                          </div>
                  </span>
                </label>
              <input
                type="number"
                id="numVictories"
                value={victories}
                className="signup-input" 
                placeholder='100'
                onChange={(e) => setVictories(e.target.value)}
                style={{width: "100%", display: "block"}}
              />
            </td>
            <td>
              <label style={{fontWeight:"700", display: "block", textAlign: "center", marginBottom: "8px"}}>Number of Cars Owned
                <span className="platform-tooltip-wrapper">
                    <FaQuestionCircle className="platform-tooltip-icon" />
                    <div className="platform-tooltip-content">
                      <p>This stats can be found under general first row, fourth column</p>
                    </div>
                </span>
              </label>
              <input
                type="number"
                id="numCars"
                value={numberofCarsOwned}
                className="signup-input"
                placeholder='100' 
                onChange={(e) => setNumberOfCarsOwned(e.target.value)}
                style={{width: "100%", display: "block"}}
              />
            </td>
            <td>
              <label style={{fontWeight:"700", display: "block", textAlign: "center", marginBottom: "8px"}}>Garage Value
              <span className="platform-tooltip-wrapper">
                    <FaQuestionCircle className="platform-tooltip-icon" />
                    <div className="platform-tooltip-content">
                      <p>This stats can be found under general third row, fifth column</p>
                    </div>
                </span>
              </label>
              <input
                type="text"
                id="garageVal"
                value={garageValue}
                className="signup-input" 
                placeholder='10,000 Cr'
                onChange={(e) => setGarageValue(e.target.value)}
                style={{width: "100%", display: "block"}}
              />
            </td>
          </tr>
          
          {/* Row 2 */}
          <tr>
            <td>
              <label style={{fontWeight:"700", display: "block", textAlign: "center", marginBottom: "8px"}}>Time Driven
              <span className="platform-tooltip-wrapper">
                    <FaQuestionCircle className="platform-tooltip-icon" />
                    <div className="platform-tooltip-content">
                      <p>This stats can be found under general first row, first column</p>
                    </div>
                </span>
              </label>
              <input
                type="text"
                value={timeDriven}
                className="signup-input"
                placeholder='100 hours'
                onChange={(e) => setTimeDriven(e.target.value)}
                style={{width: "100%", display: "block"}}
              />
            </td>
            <td>
              <label style={{fontWeight:"700", display: "block", textAlign: "center", marginBottom: "8px"}}>Most Valuable Car
              <span className="platform-tooltip-wrapper">
                    <FaQuestionCircle className="platform-tooltip-icon" />
                    <div className="platform-tooltip-content">
                      <p>This stats can be found under general first row, fifth column</p>
                    </div>
                </span>
              </label>
              <input
                type="text"
                value={mostValuableCar}
                className="signup-input"
                placeholder='Ferrari F40'
                onChange={(e) => setMostValuableCar(e.target.value)}
                style={{width: "100%", display: "block"}}
              />
            </td>
            <td>
              <label style={{fontWeight:"700", display: "block", textAlign: "center", marginBottom: "8px"}}>Total Winnings
              <span className="platform-tooltip-wrapper">
                    <FaQuestionCircle className="platform-tooltip-icon" />
                    <div className="platform-tooltip-content">
                      <p>This stats can be found under general second row, second column</p>
                    </div>
                </span>
              </label>
              <input
                type="number"
                value={totalWinnningsinCR}
                className="signup-input"
                placeholder='500000'
                onChange={(e) => setTotalWinningsinCR(e.target.value)}
                style={{width: "100%", display: "block"}}
              />
            </td>
          </tr>
          
          {/* Row 3 */}
          <tr>
            <td>
              <label style={{fontWeight:"700", display: "block", textAlign: "center", marginBottom: "8px"}}>Favorite Car
              <span className="platform-tooltip-wrapper">
                    <FaQuestionCircle className="platform-tooltip-icon" />
                    <div className="platform-tooltip-content">
                      <p>This stats can be found under general second row, fourth column</p>
                    </div>
                </span>
              </label>
              <input
                type="text"
                value={favoriteCar}
                className="signup-input"
                placeholder='Porsche 911 GT3'
                onChange={(e) => setFavoriteCar(e.target.value)}
                style={{width: "100%", display: "block"}}
              />
            </td>
            <td>
              <label style={{fontWeight:"700", display: "block", textAlign: "center", marginBottom: "8px"}}>Longest Skill Chain
              <span className="platform-tooltip-wrapper">
                    <FaQuestionCircle className="platform-tooltip-icon" />
                    <div className="platform-tooltip-content">
                      <p>This stats can be found next to the discovery tab which is Records second row, second column</p>
                    </div>
                </span>
              </label>
              <input
                type="text"
                value={longestSkillChain}
                className="signup-input"
                placeholder='05:10'
                onChange={(e) => setLongestSkillChain(e.target.value)}
                style={{width: "100%", display: "block"}}
              />
            </td>
            <td>
              <label style={{fontWeight:"700", display: "block", textAlign: "center", marginBottom: "8px"}}>Distance Driven (Miles)
              <span className="platform-tooltip-wrapper">
                    <FaQuestionCircle className="platform-tooltip-icon" />
                    <div className="platform-tooltip-content">
                    <p>This stats can be found next to the discovery tab which is Records second row, third column</p>
                    </div>
                </span>
              </label>
              <input
                type="number"
                value={distanceDrivenInMiles}
                className="signup-input"
                placeholder='1000'
                onChange={(e) => setDistanceDrivenInMiles(e.target.value)}
                style={{width: "100%", display: "block"}}
              />
            </td>
          </tr>
          
          {/* Row 4 */}
          <tr>
            <td>
              <label style={{fontWeight:"700", display: "block", textAlign: "center", marginBottom: "8px"}}>Longest Jump (Feet)
              <span className="platform-tooltip-wrapper">
                    <FaQuestionCircle className="platform-tooltip-icon" />
                    <div className="platform-tooltip-content">
                    <p>This stats can be found next to the discovery tab which is Records second row, fourth column</p>
                    </div>
                </span>
              </label>
              <input
                type="number"
                value={longestJump}
                className="signup-input"
                placeholder='500'
                onChange={(e) => setLongestJump(e.target.value)}
                style={{width: "100%", display: "block"}}
              />
            </td>
            <td>
              <label style={{fontWeight:"700", display: "block", textAlign: "center", marginBottom: "8px"}}>Top Speed (MPH)
              <span className="platform-tooltip-wrapper">
                    <FaQuestionCircle className="platform-tooltip-icon" />
                    <div className="platform-tooltip-content">
                    <p>This stats can be found next to the discovery tab which is Records third row, second column</p>
                    </div>
                </span>
              </label>
              <input
                type="number"
                value={topSpeed}
                className="signup-input"
                placeholder='250'
                onChange={(e) => setTopSpeed(e.target.value)}
                style={{width: "100%", display: "block"}}
              />
            </td>
            <td>
              <label style={{fontWeight:"700", display: "block", textAlign: "center", marginBottom: "8px"}}>Biggest Air
              <span className="platform-tooltip-wrapper">
                    <FaQuestionCircle className="platform-tooltip-icon" />
                    <div className="platform-tooltip-content">
                    <p>This stats can be found next to the discovery tab which is Records third row, third column</p>
                    </div>
                </span>
              </label>
              <input
                type="text"
                value={biggestAir}
                className="signup-input"
                placeholder='100 feet'
                onChange={(e) => setBiggestAir(e.target.value)}
                style={{width: "100%", display: "block"}}
              />
            </td>
          </tr>
        </tbody>
      </table>
      
      <div style={{textAlign: "center", marginTop: "20px"}}>
        <button className="signup-button" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Signing Up..." : "Submit"}
        </button>
      </div>
    </div>
    <Footer />
  </div>
);
}

export default SignupForm;