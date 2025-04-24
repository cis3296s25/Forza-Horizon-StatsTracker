import React, { useState } from 'react';
import "../styles/forgotPassword.css";
import Nav from '../components/nav';
import Footer from '../components/footer';
import toast from 'react-hot-toast';
import emails from '../assets/forzaImgs/email.jpg';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleResetRequest = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER}/api/userAccount/request-reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Reset link sent to your email.");
        setEmail("");
      } else {
        toast.error(data.message || "Failed to send reset link.");
      }
    } catch (err) {
      toast.error("Something went wrong. Try again later.");
    }
  };

  return (
    <div className="forget-mainContainer">
      <Nav />
      <div className="forget-container">
        <h2>Forgot Password</h2>
        <div className="input-wrapper">
        <input
          type="email"
          placeholder="Enter your account email"
          className="forgot-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
         <img src={emails} alt="Account Logo" className="account-logo" />
        </div>
        <button className="forgot-button" onClick={handleResetRequest}>
          Send Reset Link
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default ForgotPassword;