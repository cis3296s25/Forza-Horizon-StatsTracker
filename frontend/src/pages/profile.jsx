import React from 'react';
import { useEffect,useState } from 'react';
import "../styles/profile.css";
import Nav from '../components/nav';
import { useLoginMutation } from 


function Profile() {
    const [gamertag, setGamertag] = useState('');
      const [password, setPassword] = useState('');
  
  const [login, {isLoading}] = useLoginMutation();
  
   const loginFunction =  async (e) => {
    if (e) e.preventDefault();
  
    try {
      const res = await login({
        userName: gamertag,
        password: password
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
  }
    return (
      <div className="profile-mainContainer">
        <Nav />
        <div className="login-container">
          <input type="text" placeholder="ENTER GAMER TAG" className="login-input" value = {gamertag} 
          onChange={(e) => setGamertag(e.target.value)}
          placeholder = "Enter Gamertage"/>

          <input type="password" placeholder="ENTER PASSWORD" className="login-input" value = {password}
          onChange={(e) => setPassword(e.target.value)} />
          <button className="login-button" onClick={loginFunction}>SIGN IN</button>
        </div>
      </div>
    );
  }
  
  export default Profile;

