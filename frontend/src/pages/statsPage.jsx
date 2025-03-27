import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Table from '../components/Table/Table';
import Nav from '../components/nav';
import Footer from '../components/footer';
import "../styles/statsPage.css";

function StatsPage() {
    const gamertag = "Tirth Patel"; // Hardcoding the gamertag here
    const [stats, setStats] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:5000/api/user-stats/${gamertag}`)
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
        {/**<div>
            <h1>Stats</h1>
            {isLoading ? (
                <p>Loading stats...</p>
            ) : error ? (
                <p>{error.message}</p> // Display error message
            ) : (
                <Table list={stats} colNames={['garageValue', 'numberofCarsOwned']} />
            )}
        </div>**/}
        <Footer />
      </div>
    );
}

export default StatsPage;
