import React, {useState} from 'react';
import { useUpdateUserStatsMutation } from '../redux/apis/stats';
import "../styles/updateStats.css";


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



return(
  <div className='updateStatsPage-mainContainer'>

    <form onSubmit={handleSubmit} className="updateStatsForm">
      <div className ="form-grid">
    <label>
      Top Speed:
      <input type = "number" name ="topSpeed" value ={formData.topSpeed || ""} placeholder='100' onChange = {handleChange}/>
    </label>
    <label>
        Victories:
        <input type = "number" name ="victories" value = {formData.victories || ""} placeholder='100' onChange = {handleChange}/>
    </label>
    <label>
        Numbers of Cars Owned:
               <input type = "number" name ="Number of Cars Owned" value = {formData.numberofCarsOwned || ""} placeholder='100' onChange = {handleChange}/>
    </label>

     <label>
       GarageValue
         <input type = "text" name ="Garage Value" value = {formData.garageValue || ""} placeholder='100000' onChange = {handleChange}/>
    </label>

     <label>
        Time Driven
         <input type = "text" name ="Time Driven" value = {formData.timeDriven || ""} placeholder='40hrs'onChange = {handleChange}/>
    </label>
     <label>
        Most Valuable Car
         <input type = "text" name ="Most Valuable Car" value = {formData.mostValuableCar || ""} placeholder='2005 Ford GT'onChange = {handleChange}/>
    </label>
     <label>
        Total Winnings
         <input type = "number" name ="Total Winnings" value = {formData.totalWinningsinCR || ""} placeholder='10000000' onChange = {handleChange}/>
    </label>
     <label>
       Favorite Car
         <input type = "text" name ="Favorite Car" value = {formData.favoriteCar|| ""} placeholder='2021 BMW M3' onChange = {handleChange}/>
    </label>
     <label>
       Longest Skill Chain
         <input type = "text" name ="Longest Skill Chain" value = {formData.longestSkillChain || ""} placeholder='05:00' onChange = {handleChange}/>
    </label>
     <label>
        Distance Driven In Miles
         <input type = "number" name ="Distance Driven in Miles" value = {formData.distanceDrivenInMiles || ""}  placeholder='1000' onChange = {handleChange}/>
    </label>
     <label>
        Longest Jump in Feet
         <input type = "number" name ="Longest Jump in Feet" value = {formData.longestJump || ""}  placeholder='1000' onChange = {handleChange}/>
    </label>
     <label>
       Biggest Air in Seconds
         <input type = "text" name ="Biggest Air in Seconds" value = {formData.biggestAir || ""}   placeholder='4'onChange = {handleChange}/>
    </label>
    </div>



    <button type = "submit" disabled={isLoading}> {isLoading ? "Updating...": "Update Your Stats"}</button>
    {message && <p>{message}</p>}
    {error && <p style={{color: 'red'}}>An error occured.</p>}
    </form>
    </div>
   )
   
}
export default UpdateStatsPage;