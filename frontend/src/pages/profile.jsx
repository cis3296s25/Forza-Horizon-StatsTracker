import React from 'react';
import { useEffect,useState } from 'react';
import "../styles/profile.css";
import Nav from '../components/nav';
import Footer from '../components/footer';
import { useLoginMutation } from '../redux/apis/user';
import toast from 'react-hot-toast';
import { useNavigate,Link } from 'react-router-dom';
import ProfileImg from '../assets/forzaImgs/profileLogo.png';
import lockImg from '../assets/forzaImgs/lock.png';

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
        setGamertag("");
        setPassword("");
        navigate(`/user/${gamertag}`);
      } else if (res.error) {
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
          <h2 style={{fontWeight:"bold"}}>LOG-IN</h2>
          <div className="input-wrapper">
            <input
              type="text"
              placeholder="Enter Gamertag"
              className="login-input"
              value={gamertag}
              onChange={(e) => setGamertag(e.target.value)}
              required
            />
            <img src={ProfileImg} alt="Account Logo" className="account-logo" />
          </div>
          <div className="input-wrapper">
            <input
              type="password"
              placeholder="Enter Password"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <img src={lockImg} alt="Password Lock" className="account-logo" />
          </div>
          <Link to="../forgot-password" style={{color:"rgb(31, 8, 135)", marginTop:"10px"}}>Forgot Password?</Link>
          <button className="login-button" onClick={loginFunction} disabled={isLoading}> {isLoading ? "Signing In..." : "SIGN IN"}</button>
          <Link to="../signup" style={{color:"rgb(31, 8, 135)",marginTop:"10px"}}> Don't Have an account? Sign-Up Here</Link>
        </div>
        <Footer />
      </div>
    );
  }
  
  export default Profile;