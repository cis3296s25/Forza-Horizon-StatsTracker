import React, { useEffect, useState } from 'react';
import Nav from '../components/nav';
import Footer from '../components/footer';
import "../styles/leaderboard.css"; 
import { useGetAllUserStatsQuery } from '../redux/apis/stats'; 
import LeaderBoardTable from '../components/Table/leaderboardTable';


function Leaderboard() {
  const { data, error, isLoading } = useGetAllUserStatsQuery(); 
  const [sortedStats, setSortedStats] = useState([]);

  useEffect(() => {
    console.log("Leaderboard data:", data); // 🔍 log the full object
    if (data) {
      const sorted = [...data].sort((a, b) => b.victories - a.victories);    
      setSortedStats(sorted);
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="leaderboard-mainContainer">
        <Nav />
        <div className="load-leaderboard">Loading leaderboard...</div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="leaderboard-mainContainer">
        <Nav />
        <div className="load-leaderboard">Error loading leaderboard: {error.message}</div>
        <Footer />
      </div>
    );
  }

  const top3 = sortedStats.slice(0, 3);


  return (
    <div className="leaderboard-mainContainer">
      <Nav />
      <div>
        <br />
        <br />
        <br />
        <h1>Leaderboard</h1>
        {sortedStats.length > 0 && (
          <LeaderBoardTable
            list={sortedStats}
            colNames={['userName', 'victories', 'distanceDrivenInMiles', 'numberofCarsOwned']}
            colNameMap={{
              userName: 'GamerTag',
              victories: 'Victories',
              distanceDrivenInMiles: 'Total Distance Driven (Miles)',
              numberofCarsOwned: '# of Cars Owned',
            }}
          />
        )}
      </div>
      <div className="leaderboard-podium">
        {top3.length > 0 ? (
          top3.map((player, idx) => (
            <div key={idx} className={`podium-position position-${idx + 1}`}>
              <h2>{player.userName}</h2> {/* Only displaying userName */}
            </div>
          ))
        ) : (
          <h2>No players available</h2>
        )}
      </div>


      <Footer />
    </div>
  );
}

export default Leaderboard;
