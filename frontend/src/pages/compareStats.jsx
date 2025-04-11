import React, { useState,useEffect } from 'react';
import "../styles/CompareStats.css";
import Nav from '../components/nav';
import Footer from '../components/footer';
import CompareTable from '../components/Table/comparisonTable';
import { toast } from "react-hot-toast";
import { useLazyGetCompareStatsQuery } from '../redux/apis/stats';
import { useGetUsersListQuery } from '../redux/apis/user';

const CompareStats = () => {
  const [inputName1, setInputName1] = useState('');
  const [inputName2, setInputName2] = useState('');
  const [userStats, setUserStats] = useState({});
  const [suggestions, setSuggestions] = useState([]);


  const { data: fullUserListData } = useGetUsersListQuery("", {
    skip: false, // Never skip this query, always fetch the full list first
  });
  // useGetCompareStatsQuery now takes userName1 and userName2 as arguments
  //const { data, error, isLoading } = useGetCompareStatsQuery({ userName1: inputName1, userName2: inputName2 });
const[triggerCompareStats, {data,error,isLoading}] = useLazyGetCompareStatsQuery();


    useEffect(() => {
      if (fullUserListData && fullUserListData.users) {
        setSuggestions(fullUserListData.users); // Set the full user list
      } else {
        setSuggestions([]);
      }
    }, [fullUserListData]);

    // Filter suggestions based on user input
    useEffect(() => {
      if (inputName1.trim() || inputName2.trim()) {
        // Filter suggestions when either inputName1 or inputName2 changes
        const filteredSuggestions = fullUserListData.users.filter(user =>
          user.userName.toLowerCase().includes(inputName1.toLowerCase()) || 
          user.userName.toLowerCase().includes(inputName2.toLowerCase())
        );
        setSuggestions(filteredSuggestions);
      }
    }, [inputName1, inputName2, fullUserListData]);

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
              list="user-suggestions-1"
              value={inputName1}
              onChange={(e) => setInputName1(e.target.value)}
            />
            <datalist id="user-suggestions-1">
              {suggestions.map((user, index) => (
                <option key={index} value={user.userName} />
              ))}
            </datalist>

            <input
              type="text"
              className="username-input"
              placeholder="Enter the second username"
              list="user-suggestions-2"
              value={inputName2}
              onChange={(e) => setInputName2(e.target.value)}
            />
            <datalist id="user-suggestions-2">
              {suggestions.map((user, index) => (
                <option key={index} value={user.userName} />
              ))}
            </datalist>
            <button className="compare-btn" onClick={handleCompare}>COMPARE</button>
          </div>

          {isLoading && <p>Loading...</p>}

          {playerNames.length > 0 && (
            <div className="stats-table">
              <CompareTable
                colNames={['victories', 'garageValue', 'topSpeed']}
                colNameMap={{
                  victories: '# of victories',
                  garageValue: 'Garage Value (in CR)',
                  topSpeed: 'Top Speed (MPH)'
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
