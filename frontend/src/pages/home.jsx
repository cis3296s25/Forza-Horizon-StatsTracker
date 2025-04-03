import React, { useState } from 'react';
import "../styles/home.css";
import Nav from '../components/nav';
import Footer from '../components/footer';
import toast from "react-hot-toast";
import { useSearchMutation } from '../redux/apis/user';


const home = () => {
  const [gamertag, setGamertag] = useState('');

const [search, {isLoading}] = useSearchMutation();

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
      setGamertag(""); 
    } else if (res.error) {

      const errorMessage = res.error.data?.message || "User not found";
      toast.error(errorMessage);
      setGamertag("");
    }
  } catch (error) {
    toast.error("There was an error searching for the user. Try again later.");
    console.error("Error searching gamertag:", error);
    setGamertag("");
  }
};


  return (
    <div>
    <div className="forza-app">
      <main className="forza-main">
        <div 
          className="hero-section"
        >
                  <Nav/>
          <h1>FORZA HORIZON 5 STATS</h1>
          <div className="search-bar">
            <input 
              type="text" 
              value={gamertag}
              onChange={(e) => setGamertag(e.target.value)}
              placeholder="Enter Gamertag"
            />
            <button onClick={searchGamertag} disabled={isLoading}>Search</button>
          </div>
        </div>
      </main>
      <Footer/>
    </div>
    </div>
  )
}

export default home;