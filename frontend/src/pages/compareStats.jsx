import React, { useState,useEffect } from 'react';
import "../styles/CompareStats.css";
import Nav from '../components/nav';
import CompareTable from '../components/Table/comparisonTable';
import Footer from '../components/footer';
import { toast } from "react-hot-toast";
import { useLazyGetCompareStatsQuery } from '../redux/apis/stats';

const CompareStats = () => {
  const [inputName1, setInputName1] = useState('');
  const [inputName2, setInputName2] = useState('');
  const [userStats, setUserStats] = useState({});


  // useGetCompareStatsQuery now takes userName1 and userName2 as arguments
  //const { data, error, isLoading } = useGetCompareStatsQuery({ userName1: inputName1, userName2: inputName2 });
const[triggerCompareStats, {data,error,isLoading}] = useLazyGetCompareStatsQuery();
  const handleCompare = async () => {
    const username1 = inputName1.trim();
    const username2 = inputName2.trim();

    // Check if both usernames are entered
    if (!username1 || !username2) {
      toast.error("Please enter both usernames.");
      return;
    }

    // Check if both usernames are the same
    if (username1.toLowerCase() === username2.toLowerCase()) {
      toast.error("Both usernames must be different.");
      return;
    }

    // Check if stats are already fetched for the users
    if (userStats[username1] && userStats[username2]) {
      toast.error("Stats for both users are already displayed.");
      return;
    }

    try{
      await triggerCompareStats({userName1: username1, userName2: username2});
    }
    catch{
      toast.error("Failed to fetch stats.")
    }

    // If stats are not fetched yet, the hook will automatically fetch the data
  };

  // Effect to handle the result from the API (success or error)
  useEffect(() => {
    if (data) {
      const statsData = data.users.reduce((acc, userStat) => {
        acc[userStat.userName] = userStat.stats;
        return acc;
      }, {});
      setUserStats(statsData);
    }

    if (error) {
      toast.error(error.message || "Error fetching stats.");
    }
  }, [data, error]);

  const playerNames = Object.keys(userStats);

  return (
    <div className="compare-stats-container">
      <Nav />

      <div className="main-content">
        <div className="contents-of-compare">
          <h1>COMPARE STATS</h1>

          <div className="search-section">
            <input
              type="text"
              className="username-input"
              placeholder="Enter the first username"
              value={inputName1}
              onChange={(e) => setInputName1(e.target.value)}
            />
            <input
              type="text"
              className="username-input"
              placeholder="Enter the second username"
              value={inputName2}
              onChange={(e) => setInputName2(e.target.value)}
            />
            <button className="compare-btn" onClick={handleCompare}>COMPARE</button>
          </div>

          {isLoading && <p>Loading...</p>}

          {playerNames.length > 0 && (
            <div className="stats-table">
              <CompareTable
                colNames={['victories', 'garageValue', 'topSpeed']}
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
  );
};

export default CompareStats;
