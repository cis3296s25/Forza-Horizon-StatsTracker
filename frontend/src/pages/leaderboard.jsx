import React, { useEffect, useState } from 'react';
import Nav from '../components/nav';
import Footer from '../components/footer';
import Table from '../components/Table/Table';
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
        <div>Error loading leaderboard: {error.message}</div>
        <Footer />
      </div>
    );
  }

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
              userName: 'Username',
              victories: 'Victories',
              distanceDrivenInMiles: 'Total Distance Driven (Miles)',
              numberofCarsOwned: '# of Cars Owned',
            }}
          />
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Leaderboard;
