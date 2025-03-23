import React, { useState } from 'react';
import "../styles/home.css";
import Nav from '../components/nav';
import Footer from '../components/footer';
import toast from "react-hot-toast";
import { useSearchMutation } from '../redux/apis/user';


const home = () => {
  const [gamertag, setGamertag] = useState('');

const [search, {isLoading}] = useSearchMutation();

const searchGamertag =  async (e) => {
  if (e) e.preventDefault();

  try {
    const res = await search({
      userName: gamertag
    });

    if ("data" in res) {
      toast.success("User found");
      setGamertag("");
    } else {
      toast.error("User not found");
      setGamertag("");
    }
  } catch (error) {
    toast.error("There was an error searching for the user. Try again later.");
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