import React from 'react';
import "../styles/CompareStats.css";
import race from '../assets/forzaImgs/mclaren.jpg';
import{ useState } from 'react';

const CompareStats = () => {
  const[userName, setUserName] = useState('');

  const handleChange = (event) =>{
    setUserName(event.target.value);
  }

  return (
    
<div
  
className="compare-stats-container"
    
style = {{backgroundImage: `url(${race})`, 
backgroundSize: 'cover',
backgroundPosition: 'center',
backgroundRepeat: 'no-repeat', 
height: '100vh',
width: '100%',
display: 'flex',
justifyContent: 'flex-start',
alignItems: 'flex-start',
padding: '1rem'
}} >   

<div className = "contents-of-compare">
  <h1>COMPARE STATS</h1>

  <div className = "search-contents">
<input 
type ="text" 
className = "username-input"
placeholder="Enter a UserName to Compare With"
onChange={handleChange}
/>
<button className = "compare-btn">COMPARE</button>
    </div>
</div>


 </div>
  )
}

export default CompareStats;