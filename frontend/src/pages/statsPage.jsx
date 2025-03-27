import React, { useEffect, useState } from 'react';
import {useParams} from 'react-router-dom';
import Table from '../components/Table/Table';
import Nav from '../components/nav';
import Footer from '../components/footer';
import "../styles/statsPage.css";

function StatsPage() {
    const {gamertag} = useParams(); // gets the gamertag from the URL
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
            }
            )
            .then(data => {
                setStats(data);
                setIsLoading(false);
            })
            .catch(error => {
                setError(error);
                setIsLoading(false);
            });
    }
    , [gamertag]);
            

    return (
        <div className="statsPage-mainContainer">
        <Nav />
        {/**<div>
            <h1>Stats</h1>
            {isLoading ? (
                <p>Loading stats...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <Table list ={stats}/>
            )}
        </div>**/}
        <Footer />
      </div>
    );
}

export default StatsPage;