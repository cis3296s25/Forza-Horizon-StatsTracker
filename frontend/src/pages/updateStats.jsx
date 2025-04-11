import React, {useState} from 'react';
import { useUpdateUserStatsMutation } from '../redux/apis/stats';
import "../styles/updateStatsPage.css";
import NavLog from '../components/navLog';
import Footer from '../components/footer';
import { FaQuestionCircle} from "react-icons/fa";



function UpdateStatsPage({userName, initialStats}){
const[formData, setFormData] = useState(initialStats || {});
const[message, setMessage] = useState("");
const[updateUserStats, { isLoading, error}] = useUpdateUserStatsMutation();


const handleChange = async(e)=>{
const {name,value} = e.target;
setFormData((prev) =>({...prev, [name]: value}));
}

const handleSubmit = async (e) =>{
    e.preventDefault();
try {
    const updateData = {...formData,userName};
    const res = await updateUserStats(updateData).unwrap();
    setMessage("Stats updated sucessfully");
}catch (err){
    setMessage("Failed to update stats.");
    console.error(err);
 }
}
return (
  <div className="updateStatsPage-mainContainer">
    <NavLog />
    <div className="updateStats-container">
   <form onSubmit ={handleSubmit}>

      <h2 style={{textAlign: "center", marginBottom: "5px"}}>Enter Your Updated Stats Below</h2>
      
      <table style={{width: "100%", borderCollapse: "separate", borderSpacing: "30px"}}>
        <tbody>
          {/* Row 1 */}
          <tr>
            <td>
              <label style={{fontWeight:"700", display: "block", textAlign: "center", marginBottom: "8px"}}>Number Of Victories  
                <span className="platform-tooltip-wrapper">
                          <FaQuestionCircle className="platform-tooltip-icon" />
                          <div className="platform-tooltip-content">
                        
                          </div>
                  </span>
                </label>
              <input
                type="number"
                id="numVictories"
                name="victories"
                value={formData.victories || ""}
                className="updateStats-input" 
                placeholder='100'
                onChange ={handleChange}
                style={{width: "100%", display: "block"}}
              />
            </td>
            <td>
              <label style={{fontWeight:"700", display: "block", textAlign: "center", marginBottom: "8px"}}>Number of Cars Owned
                <span className="platform-tooltip-wrapper">
                    <FaQuestionCircle className="platform-tooltip-icon" />
                    <div className="platform-tooltip-content">
                    
                    </div>
                </span>
              </label>
              <input
                type="number"
                id="numCars"
                 name="numberofCarsOwned"
                value={formData.numberofCarsOwned || ""}
                className="updateStats-input"
                placeholder='100' 
                onChange ={handleChange}

                style={{width: "100%", display: "block"}}
              />
            </td>
            <td>
              <label style={{fontWeight:"700", display: "block", textAlign: "center", marginBottom: "8px"}}>Garage Value
              <span className="platform-tooltip-wrapper">
                    <FaQuestionCircle className="platform-tooltip-icon" />
                    <div className="platform-tooltip-content">
                      
                    </div>
                </span>
              </label>
              <input
                type="text"
                id="garageVal"
                 name="garageValue"
                value={formData.garageValue || ""}
                className="updateStats-input" 
                placeholder='10000 '
                onChange ={handleChange}
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
                    </div>
                </span>
              </label>
              <input
                type="text"
                name="timeDriven"
                value={formData.timeDriven||""}
                className="updateStats-input"
                placeholder='100 hours'
                onChange ={handleChange}
                style={{width: "100%", display: "block"}}
              />
            </td>
            <td>
              <label style={{fontWeight:"700", display: "block", textAlign: "center", marginBottom: "8px"}}>Most Valuable Car
              <span className="platform-tooltip-wrapper">
                    <FaQuestionCircle className="platform-tooltip-icon" />
                    <div className="platform-tooltip-content">
                     
                    </div>
                </span>
              </label>
              <input
                type="text"
                name="mostValuableCar"
                value={formData.mostValuableCar||""}
                className="updateStats-input"
                placeholder='Ferrari F40'
                onChange ={handleChange}
                style={{width: "100%", display: "block"}}
              />
            </td>
            <td>
              <label style={{fontWeight:"700", display: "block", textAlign: "center", marginBottom: "8px"}}>Total Winnings
              <span className="platform-tooltip-wrapper">
                    <FaQuestionCircle className="platform-tooltip-icon" />
                    <div className="platform-tooltip-content">
                      
                    </div>
                </span>
              </label>
              <input
                type="number"
                name = "totalWinningsinCR"
                value={formData.totalWinningsinCR||""}
                className="updateStats-input"
                placeholder='500000'
                onChange ={handleChange}
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
                      
                    </div>
                </span>
              </label>
              <input
                type="text"
                name ="favoriteCar"
                value={formData.favoriteCar||""}
                className="updateStats-input"
                placeholder='Porsche 911 GT3'
                onChange ={handleChange}
                style={{width: "100%", display: "block"}}
              />
            </td>
            <td>
              <label style={{fontWeight:"700", display: "block", textAlign: "center", marginBottom: "8px"}}>Longest Skill Chain
              <span className="platform-tooltip-wrapper">
                    <FaQuestionCircle className="platform-tooltip-icon" />
                    <div className="platform-tooltip-content">
                   
                    </div>
                </span>
              </label>
              <input
                type="text"
                name='longestSkillChain'
                value={formData.longestSkillChain||""}
                className="updateStats-input"
                placeholder='05:10'
                  onChange ={handleChange}
                style={{width: "100%", display: "block"}}
              />
            </td>
            <td>
              <label style={{fontWeight:"700", display: "block", textAlign: "center", marginBottom: "8px"}}>Distance Driven (Miles)
              <span className="platform-tooltip-wrapper">
                    <FaQuestionCircle className="platform-tooltip-icon" />
                    <div className="platform-tooltip-content">
                
                    </div>
                </span>
              </label>
              <input
                type="number"
                name = "distanceDrivenInMiles"
                value={formData.distanceDrivenInMiles || ""}
                className="updateStats-input"
                placeholder='1000'
                  onChange ={handleChange}
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
                   
                    </div>
                </span>
              </label>
              <input
                type="number"
                name="longestJump"
                value={formData.longestJump||""}
                className="updateStats-input"
                placeholder='500'
                  onChange ={handleChange}
                style={{width: "100%", display: "block"}}
              />
            </td>
            <td>
              <label style={{fontWeight:"700", display: "block", textAlign: "center", marginBottom: "8px"}}>Top Speed (MPH)
              <span className="platform-tooltip-wrapper">
                    <FaQuestionCircle className="platform-tooltip-icon" />
                    <div className="platform-tooltip-content">
                   
                    </div>
                </span>
              </label>
              <input
                type="number"
                name="topSpeed"
                value={formData.topSpeed||""}
                className="updateStats-input"
                placeholder='250'
                  onChange ={handleChange}
                style={{width: "100%", display: "block"}}
              />
            </td>
            <td>
              <label style={{fontWeight:"700", display: "block", textAlign: "center", marginBottom: "8px"}}>Biggest Air
              <span className="platform-tooltip-wrapper">
                    <FaQuestionCircle className="platform-tooltip-icon" />
                    <div className="platform-tooltip-content">
                    
                    </div>
                </span>
              </label>
              <input
                type="text"
                name='biggestAir'
                value={formData.biggestAir||""}
                className="updateStats-input"
                placeholder='100 feet'
                  onChange ={handleChange}
                style={{width: "100%", display: "block"}}
              />
            </td>
          </tr>
        </tbody>
      </table>
    
      <div style={{textAlign: "center", marginTop: "2rem"}}>
        <button className="submit-button" type = "submit"disabled={isLoading}>
          {isLoading ? "Updating..." : "Update Your Stats"}
        </button>
        {message && (
          <p className = "form-message">{message}</p>
        )}
      </div>
        </form>
    </div>
  </div>
);
   
}
export default UpdateStatsPage;