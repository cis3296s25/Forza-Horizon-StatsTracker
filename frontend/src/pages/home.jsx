import React from 'react';
import { useEffect,useState } from 'react';
import "../styles/home.css";
import Nav from '../components/nav';


const home = () => {
    {/*}
    const [count, setCount] = useState(0)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch("http://localhost:5000/")
    .then((response) => response.json())
    .then((data) => {
      setUsers(data)
      setLoading(false)
    
    })
    .catch((error) => {
      console.error("Error Fetching Data", error)
      setLoading(false)
    });
  },[])
  
  const searchGamertag = async () => {
    if (!gamertag.trim()) {
      alert('Please enter a gamertag')
      return
    }

    setIsLoading(true)
    
    setTimeout(() => {

      const mockData = {
        gamertag: gamertag,
        stats: {
          races: Math.floor(Math.random() * 1000),
          wins: Math.floor(Math.random() * 300),
          totalDistance: Math.floor(Math.random() * 50000),
          carsOwned: Math.floor(Math.random() * 100)
        }
      }
      
      setPlayerStats(mockData)
      setIsLoading(false)
    }, 800)
  }
  
  */}
  return (
    <div>
    <div className="forza-app">
      <main className="forza-main">
        <div 
          className="hero-section"
        >
                  <Nav/>
          <h1>FORZA HORIZON 5 STATS</h1>
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Enter Gamertag" 
            />
            <button>Search</button>
          </div>
        </div>
      </main>
      
     {/*} <footer className="forza-footer">
        <p>© 2025 Forza Horizon 5 Stats</p>
      </footer>*/}
    </div>
    </div>
  )
}

export default home;
