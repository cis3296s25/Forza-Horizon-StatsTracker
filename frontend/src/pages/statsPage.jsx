import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Table from '../components/Table/Table';
import Nav from '../components/nav';
import Footer from '../components/footer';
import "../styles/statsPage.css";

function StatsPage() {
    const {gamertag} = useParams(); // Hardcoding the gamertag here
    const [stats, setStats] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        //fetch(`http://localhost:3000/api/user-stats/${gamertag}`)
        fetch('http://localhost:3000/api/userAccount/stats?userName=Tirth%20Patel')
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
    }, [gamertag]);

    return (
        <div className="statsPage-mainContainer">
        <Nav />
        {<div>
            <h1>Stats</h1>
            {isLoading ? (
                <p>Loading stats...</p>
            ) : error ? (
                <p>{error.message}</p> // Display error message
            ) : (
                <Table list={stats} colNames={['userName','garageValue', 'numberofCarsOwned']}
                colNameMap={{userName: 'UserName', garageValue: ' Garage Value', numberofCarsOwned: 'Number of Cars Owned'}} />
            )}
        </div>}
        <Footer />
      </div>
    );
}

export default StatsPage;
