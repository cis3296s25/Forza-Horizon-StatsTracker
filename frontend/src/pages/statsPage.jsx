import React, { Profiler, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';  // Import useNavigate for redirection
import Table from '../components/Table/Table';
import Nav from '../components/navLog';
import Footer from '../components/footer';
import "../styles/statsPage.css";
import { useGetUserStatsQuery } from '../redux/apis/stats'; 
import { useSearchMutation } from '../redux/apis/user';
import toast from 'react-hot-toast';

function StatsPage() {
    const { username } = useParams();
    const navigate = useNavigate();
    const [search, { isLoading }] = useSearchMutation();
    const [userStats, setUserStats] = useState({});
    const [userFound, setUserFound] = useState(false);
    const [noUserFound, setNoUserFound] = useState(false);

    const { data, error, isLoading: statsLoading } = useGetUserStatsQuery(username);
    console.log("Data from API:", data); // Log the data received from the API

    const handleStats = async () => {
        try {
            navigate('/update-stats-page', { state: { userName: userStats.userName } });
        } catch (error) {
          toast.error("There was an error logging out. Try again later.");
          console.error("Logout error:", error);
        }
    };
    const handleDelete = async () => {
        try {
            navigate('/delete', { state: { userName: userStats.userName } });
        } catch (error) {
          toast.error("There was an error logging out. Try again later.");
          console.error("Logout error:", error);
        }
    };

    // Trigger searchGamertag automatically when the username is available
    useEffect(() => {
        if (username) {
            searchGamertag();  // Call the search function automatically when username is present
        }
    }, [username]);

    // Function to search for a user and update the state
    const searchGamertag = async () => {
        const res = await search({ userName: username });

        if (res.data) {
            console.log(res.data);
            toast.success(res.data.message || "User found");
            setUserFound(true);
            setNoUserFound(false); // Reset the no user found state
            const platforms = res.data.platform.charAt(0).toUpperCase() + res.data.platform.slice(1).toLowerCase();
            setUserStats({
                userName: res.data.userName,
                platform: platforms,
                level: res.data.level,
                profilePic: res.data.profilePic,
            });
        } else if (res.error) {
            const errorMessage = res.error.data?.message || "User not found";
            toast.error(errorMessage);
            setUserFound(false);
            setNoUserFound(true);
        }
    };

    useEffect(() => {
        if (error && error.status === 403) {
            toast.error("Good try to hack in to other peoples page but, Please log in.");
            localStorage.removeItem('jwtToken');
            navigate(`/profile`);
        }
    }, [error, navigate]);

    if (statsLoading || isLoading) {
        return (
            <div className="statsPage-mainContainer">
                <Nav />
                <div>Loading stats...</div>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div className="statsPage-mainContainer">
                <Nav />
                <div>Error: {error.message}</div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="statsPage-mainContainer">
            <Nav />
            <div>
                <br />
                <br />
                <br />
                {/* <h1>Profile</h1> */}
                {userStats && (
                    <div className="user-box-stats">
            
                        <img src={userStats.profilePic} alt="Avatar" className="avatar-profile" />
                        <h2>Welcome, {userStats.userName}</h2>
                        <div className="platform-level">
                            <p className="boxes"><strong>Platform:</strong> {userStats.platform}</p>
                            {userStats.platform === "Xbox" && (<p className='boxes' style={{fontSize:"20px"}}><strong>Game Score:</strong>{userStats.level}</p>
                  )}
                  {userStats.platform === "Steam" && (<p className='boxes'><strong>Level:</strong>{userStats.level}</p>
                  )}
                  {userStats.platform === "Manually" && (<p className='boxes'><strong>Level:</strong>{userStats.level}</p>)}
                        </div>
                        
                        <div className="action-buttons">
                            <button className="edit-button" onClick={handleStats}>Edit Stats</button>
                            <button className="edit-button delete" onClick={handleDelete}>Delete Account</button>
                        </div>
                    </div>
                )}
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />

                <div className="stats-vertical-container">
                    <h1>Stats</h1>
                    {data && data.stats && (
                        <Table
                            list={[data?.stats]} // Wrap the stats object in an array if needed
                            colNames={[
                                'victories', 'numberofCarsOwned', 'garageValue', 'timeDriven', 'mostValuableCar', 'totalWinnningsinCR', 
                                'favoriteCar', 'longestSkillChain', 'distanceDrivenInMiles', 'longestJump', 'topSpeed', 'biggestAir'
                            ]}
                            colNameMap={{
                                victories: 'Victories',
                                numberofCarsOwned: 'Number of Cars Owned',
                                garageValue: ' Garage Value',
                                timeDriven: 'Time Driven',
                                mostValuableCar: 'Most Valuable Car',
                                totalWinnningsinCR: 'Total Winnings in CR',
                                favoriteCar: 'Favorite Car',
                                longestSkillChain: 'Longest Skill Chain',
                                distanceDrivenInMiles: 'Distance Driven in Miles',
                                longestJump: 'Longest Jump',
                                topSpeed: 'Top Speed',
                                biggestAir: 'Biggest Air',
                            }}
                        />
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default StatsPage;
