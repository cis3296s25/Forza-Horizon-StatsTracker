import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Table from '../components/Table/Table';
import Nav from '../components/navLog';
import Footer from '../components/footer';
import "../styles/statsPage.css";

function StatsPage() {
    const {username } = useParams(); // Hardcoding the gamertag here
    const [stats, setStats] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        fetch(`${import.meta.env.VITE_SERVER}/api/userStats/stats?userName=${username}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch stats for user');
                }
                return response.json();
            })
            .then(data => {
                setStats([data.stats]); // Wrap the stats object in an array
                setIsLoading(false);
            })
            .catch(error => {
                setError(error);
                setIsLoading(false);
            });
    }, [username]);

    return (
        <div className="statsPage-mainContainer">
        <Nav />
        {<div>
            <br/>
            <br/>
            <br/>
            <h1>Stats</h1>
            {isLoading ? (
                <p>Loading stats...</p>
            ) : error ? (
                <p>{error.message}</p> // Display error message
            ) : (
                <Table list={stats} colNames={['victories', 'numberofCarsOwned','garageValue', 'timeDriven', 'mostValuableCar', 'totalWinnningsinCR', 
                    'favoriteCar', 'longestSkillChain', 'distanceDrivenInMiles', 'longestJump', 'topSpeed', 'biggestAir']}
                colNameMap={{victories: 'Victories', numberofCarsOwned: 'Number of Cars Owned', garageValue: ' Garage Value', timeDriven: 'Time Driven', 
                mostValuableCar: 'Most Valuable Car', totalWinnningsinCR: 'Total Winnings in CR', favoriteCar: 'Favorite Car', longestSkillChain: 'Longest Skill Chain',
                distanceDrivenInMiles: 'Distance Driven in Miles', longestJump: 'Longest Jump', topSpeed: 'Top Speed', biggestAir: 'Biggest Air'
                }} />
            )}
        </div>}
        <Footer />
      </div>
    );
}

export default StatsPage;
