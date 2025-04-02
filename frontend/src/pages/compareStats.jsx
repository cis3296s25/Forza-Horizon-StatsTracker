import React from 'react';
import "../styles/CompareStats.css";
import race from '../assets/forzaImgs/mclaren.jpg';

const CompareStats = () => {
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
}} 
    >   

  <h1>
    COMPARE STATS
   </h1>
  
   </div>
  )
}

export default CompareStats;