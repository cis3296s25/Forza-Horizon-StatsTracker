import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';  // Import useNavigate for redirection
import Table from '../components/Table/Table';
import Nav from '../components/navLog';
import Footer from '../components/footer';
import "../styles/statsPage.css";
import { useGetUserStatsQuery } from '../redux/apis/stats'; 
import toast from 'react-hot-toast';

function StatsPage() {
    const { username } = useParams();
    const navigate = useNavigate();
    
    const { data, error, isLoading } = useGetUserStatsQuery(username);
    console.log("Data from API:", data); // Log the data received from the API

    useEffect(() => {
        if (error && error.status === 403) {
            toast.error("Good try to hack in to other peoples page but, Please log in.");
            localStorage.removeItem('jwtToken');
            navigate(`/profile`);
        }
    }, [error, navigate]);

    if (isLoading) {
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
                <h1>Stats</h1>
                <Table
                    list={[data?.stats]} // Wrap the stats object in an array if needed
                    colNames={['victories', 'numberofCarsOwned', 'garageValue', 'timeDriven', 'mostValuableCar', 'totalWinnningsinCR', 
                        'favoriteCar', 'longestSkillChain', 'distanceDrivenInMiles', 'longestJump', 'topSpeed', 'biggestAir']}
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
            </div>
            <Footer />
        </div>
    );
}

export default StatsPage;
