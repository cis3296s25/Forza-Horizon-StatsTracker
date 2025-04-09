import React, {useState} from 'react';
import { useUpdateUserStatsMutation } from '../redux/apis/stats';


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

    <form onSubmit={handleSubmit}>
    <label>
      Top Speed:
      <input type = "number" name ="topSpeed" value ={formData.topSpeed || ""} onChange = {handleChange}/>
    </label>
    <label>
        Victories:
        <input type = "number" name ="victories" value = {formData.victories || ""} onChange = {handleChange}/>
    </label>
    <label>
        Numbers of Cars Owned:
         <input type = "number" name ="Number of Cars Owned" value = {formData.numberofCarsOwned || ""} onChange = {handleChange}/>
    </label>

     <label>
       GarageValue
         <input type = "text" name ="Garage Value" value = {formData.garageValue || ""} onChange = {handleChange}/>
    </label>

     <label>
        Time Driven
         <input type = "text" name ="Time Driven" value = {formData.timeDriven || ""} onChange = {handleChange}/>
    </label>
     <label>
        Most Valuable Car
         <input type = "text" name ="Most Valuable Car" value = {formData.mostValuableCar || ""} onChange = {handleChange}/>
    </label>
     <label>
        Total Winnings
         <input type = "number" name ="Total Winnings" value = {formData.totalWinningsinCR || ""} onChange = {handleChange}/>
    </label>
     <label>
       Favorite Car
         <input type = "text" name ="Favorite Car" value = {formData.favoriteCar|| ""} onChange = {handleChange}/>
    </label>
     <label>
       Longest Skill Chain
         <input type = "text" name ="Longest Skill Chain" value = {formData.longestSkillChain || ""} onChange = {handleChange}/>
    </label>
     <label>
        Distance Driven In Miles
         <input type = "number" name ="Distance Driven in Miles" value = {formData.distanceDrivenInMiles || ""} onChange = {handleChange}/>
    </label>
     <label>
        Longest Jump
         <input type = "number" name ="Longest Jump" value = {formData.longestJump || ""} onChange = {handleChange}/>
    </label>
     <label>
       Biggest Air
         <input type = "text" name ="Biggest Air" value = {formData.biggestAir || ""} onChange = {handleChange}/>
    </label>



    <button type = "submit" disabled={isLoading}> {isLoading ? "Updating...": "Update Your Stats"}</button>
    {message && <p>{message}</p>}
    {error && <p style={{color: 'red'}}>An error occured.</p>}
    </form>
   )
}
export default UpdateStatsPage;