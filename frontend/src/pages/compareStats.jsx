import React, { useState } from 'react';
import "../styles/CompareStats.css";
import Nav from '../components/nav';
import CompareTable from '../components/Table/comparisonTable';
import Footer from '../components/footer';
import { searchAPI } from '../redux/apis/user';




const CompareStats = () => {
  const[inputName, setInputName] = useState('');
   const[userStats, setUserStats] = useState({});
   const [error,setError] = useState('');

  const handleCompare = async () =>{
    const username = inputName.trim();
  

if(!username){
  setError("Please enter a username.");
  return;
}

if(userStats[username]){
  setError(`"Already displaying stats for "${username}".`)
  return;
}


/*Gonna user the fetching api
try{
const res = await search(inputName)
}catch(Error){

}
*/
}




const playerNames = Object.keys(userStats);

return (  
<div className="compare-stats-container">   

<Nav/>

<div className = "main-content">
  <div className = "contents-of-compare">

<h1>COMPARE STATS</h1>
  
<div className = "search-section">
<input 
type ="text" 
className = "username-input"
placeholder="Enter a UserName for Comparison"
value={inputName}
onChange= {(e) => setInputName(e.target.value)} />

<button className = "compare-btn" onClick = {handleCompare}>COMPARE</button>

 </div>

 {error && <p className="error-msg">{error} </p>}

{playerNames.length > 0 &&(

<div className = "stats-table">
<CompareTable
colNames = {['victories' , 'garageValue', 'topSpeed']}
colNameMap={{
  victories: '# of victories',
  garageValue: 'Garage Value',
  topSpeed: 'Top Speed'
}}
players={playerNames}
stats={userStats}
/>
   </div>
)}
</div>
  </div>

  <Footer />

 </div>

  )
}

export default CompareStats;