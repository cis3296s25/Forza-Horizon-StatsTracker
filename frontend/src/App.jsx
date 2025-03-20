
import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
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

  const backgroundImage = '/forzaHome.jpg'


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
  return (
    <div className="forza-app">
      <main className="forza-main">
        <div 
          className="hero-section"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <h1>FORZA HORIZON 5 STATS</h1>
          <div className="search-bar">
            <input 
              type="text" 
              value={gamertag}
              onChange={(e) => setGamertag(e.target.value)}
              placeholder="Enter Gamertag" 
              onKeyPress={(e) => e.key === 'Enter' && searchGamertag()}
            />
            <button onClick={searchGamertag}>Search</button>
          </div>
        </div>
        
        {isLoading && (
          <div className="stats-container loading">
            <p>Loading stats...</p>
          </div>
        )}
        
        {playerStats && !isLoading && (
          <div className="stats-container">
            <div className="stats-header">
              <span className="gamertag-display">{playerStats.gamertag}</span>
            </div>
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-title">RACES COMPLETED</span>
                <span className="stat-value">{playerStats.stats.races}</span>
              </div>
              <div className="stat-card">
                <span className="stat-title">WINS</span>
                <span className="stat-value">{playerStats.stats.wins}</span>
              </div>
              <div className="stat-card">
                <span className="stat-title">TOTAL DISTANCE</span>
                <span className="stat-value">{playerStats.stats.totalDistance} km</span>
              </div>
              <div className="stat-card">
                <span className="stat-title">CARS OWNED</span>
                <span className="stat-value">{playerStats.stats.carsOwned}</span>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <footer className="forza-footer">
        <p>© 2025 Forza Horizon 5 Stats</p>
      </footer>
    </div>
  )
}

export default App