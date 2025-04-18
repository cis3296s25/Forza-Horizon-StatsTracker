import React from 'react';
import { useEffect,useState } from 'react';
import "../styles/profile.css";
import Nav from '../components/nav';
import Footer from '../components/footer';
import { useLoginMutation } from '../redux/apis/user';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

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
  
      if (res.data) {

        localStorage.setItem('jwtToken', res.data.token);

        toast.success(res.data.message || "Login successful");
        setGamertag("");
        setPassword("");
        navigate(`/user/${gamertag}`);
      } else if (res.error) {
        const errorMessage = res.error.data?.message || "Login failed";
        toast.error(errorMessage);
        setGamertag("");
        setPassword("");
      }
    } catch (error) {
      toast.error("There was an error logging in. Please try again later.");
    }
  };
    return (
      <div className="profile-mainContainer">
        <Nav />
        <div className="login-container">
          <input type="text" placeholder="Enter Gamertag" className="login-input" value = {gamertag} 
          onChange={(e) => setGamertag(e.target.value)} required/>

          <input type="password" placeholder="Enter Password" className="login-input" value = {password}
          onChange={(e) => setPassword(e.target.value)} required />
          <button className = "forgetPassowrd-button" onClick={() => navigate("/forgot-password")}>Forgot Password</button>
          <button className="login-button" onClick={loginFunction} disabled={isLoading}> {isLoading ? "Signing In..." : "SIGN IN"}</button>
        </div>
        <Footer />
      </div>
    );
  }
  
  export default Profile;