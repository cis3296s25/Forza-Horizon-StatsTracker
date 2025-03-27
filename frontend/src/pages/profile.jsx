import React from 'react';
import { useEffect,useState } from 'react';
import "../styles/profile.css";
import Nav from '../components/nav';
import Footer from '../components/footer';
import { useLoginMutation } from '../redux/apis/user';
import toast from 'react-hot-toast';
import { Navigate, useNavigate } from 'react-router-dom';

 const Profile = () => {
    const [gamertag, setGamertag] = useState('');
    const [password, setPassword] = useState('');
    const [login, {isLoading}] = useLoginMutation();
    const navigate = useNavigate();
  
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
        setPassword("");
        navigate(`/user/${gamertag}`);
      } else {
        toast.error("User not found");
        setGamertag("");
        setPassword("");
        navigate("/");
      }
    } catch (error) {
      toast.error("There was an error searching for the user. Try again later.");
      setGamertag("");
      setPassword("");
    }
  };
    return (
      <div className="profile-mainContainer">
        <Nav />
        <div className="login-container">
          <input type="text" placeholder="Enter Gamertag" className="login-input" value = {gamertag} 
          onChange={(e) => setGamertag(e.target.value)}/>

          <input type="password" placeholder="Enter Password" className="login-input" value = {password}
          onChange={(e) => setPassword(e.target.value)} />
          <button className="login-button" onClick={loginFunction} disabled={isLoading}>SIGN IN</button>
        </div>
        <Footer />
      </div>
    );
  }
  
  export default Profile;