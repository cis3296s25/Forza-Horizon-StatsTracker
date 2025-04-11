import React, { useState,useEffect } from 'react';
import "../styles/home.css";
import Nav from '../components/nav';
import Footer from '../components/footer';
import toast from "react-hot-toast";
import { useSearchMutation } from '../redux/apis/user';
import { useGetUsersListQuery } from '../redux/apis/user';

const Home = () => {
  const [gamertag, setGamertag] = useState('');
  const [noUserFound, setNoUserFound] = useState(false);
  const [UserFound, setUserFound] = useState(false);
  const [userStats, setUserStats] = useState(null)
  const [suggestions, setSuggestions] = useState([]);

  const [search, { isLoading }] = useSearchMutation();
  const { data: userListData } = useGetUsersListQuery(gamertag, {
    skip: false,
  });
  

  useEffect(() => {
    if (userListData && userListData.users) {
      setSuggestions(userListData.users);
    } else {
      setSuggestions([]);
    }
  }, [userListData]);


  const searchGamertag = async (e) => {
    if (e) e.preventDefault();

    if (!gamertag.trim()) {
      toast.error("Please enter a valid gamertag");
      return;
    }

    try {
      const res = await search({ userName: gamertag });

      if (res.data) {
        toast.success(res.data.message || "User found");
        setUserFound(true);
        setNoUserFound(false); // Reset the no user found state
          const platforms = res.data.platform.charAt(0).toUpperCase() + res.data.platform.slice(1).toLowerCase();
        setUserStats({
          userName: res.data.userName,
          platform:platforms,
          timeDriven: res.data.userStats.timeDriven,
          numberofCarsOwned: res.data.userStats.numberofCarsOwned,
          garageValue: res.data.userStats.garageValue,
          distanceDrivenInMiles: res.data.userStats.distanceDrivenInMiles,
          level: res.data.level,
        });
        setSuggestions([]); 
      } else if (res.error) {
        const errorMessage = res.error.data?.message || "User not found";
        toast.error(errorMessage);
        setUserFound(false);
        setNoUserFound(true);
        setSuggestions([]);
        setGamertag("");
      }
    } catch (error) {
      toast.error("There was an error searching for the user. Try again later.");
      console.error("Error searching gamertag:", error);
      setGamertag("");
      setNoUserFound(true);
      setSuggestions([]);
    }
  };
  return (
    <div>
      <div className="forza-app">
        <main className="forza-main">
          <div className="hero-section">
            <Nav />
            <h1>FORZA HORIZON 5 STATS</h1>
            <div className="search-bar">
              <input
                type="text"
                value={gamertag}
                onChange={(e) => setGamertag(e.target.value)}
                placeholder="Enter Gamertag"
                list="user-suggestions"
              />
              <datalist id="user-suggestions">
                {suggestions.map((user, index) => (
                  <option key={index} value={user.userName} />
                ))}
              </datalist>

              <button onClick={searchGamertag} disabled={isLoading}>Search</button>
            </div>

           {UserFound && (
            <div className="user-box">
              <h2>{userStats.userName}</h2>
              <div className="platform-level">
                  <p className='boxes'><strong>Platform:</strong>{userStats.platform}</p>
                  {userStats.platform === "Xbox" && (<p className='boxes' style={{fontSize:"20px"}}><strong>Game Score:</strong>{userStats.level}</p>
                  )}
                  {userStats.platform === "Steam" && (<p className='boxes'><strong>Level:</strong>{userStats.level}</p>
                  )}
                  {userStats.platform === "Manually" && (<p className='boxes'><strong>Level:</strong>{userStats.level}</p>)}
                </div>
              <div className="time-cars">
                <div className="time-car-box">
                  <strong className="colors">Time Driven</strong>
                  <p className='boxe'>{userStats.timeDriven}</p>
                  <br/>
                </div>
                <div className="time-car-box">
                  <strong className="colors">Cars Owned</strong>
                  <p className='boxe'>{userStats.numberofCarsOwned}</p>
                </div>
              </div>
              <div className="garage-miles">
                <div className="garage-mile-box">
                  <br/>
                  <strong className="colors">Garage Value</strong>
                  <p className='boxe'>{userStats.garageValue}</p>
                  <br/>
                </div>
                <div className="garage-mile-box">
                  <br/>
                  <strong className="colors">Miles Driven</strong>
                  <p className='boxe'>{userStats.distanceDrivenInMiles}</p>
                </div>
              </div>
            </div>
          )}
            {noUserFound && (
              <div className="no-user-box">
                <h2>No User Found</h2>
                <h3>PLEASE ENTER A VALID ACCOUNT</h3>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default Home;
