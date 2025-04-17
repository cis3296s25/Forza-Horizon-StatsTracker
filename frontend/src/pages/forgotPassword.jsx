import React, { useState } from 'react';
import "../styles/profile.css";
import Nav from '../components/nav';
import Footer from '../components/footer';
import toast from 'react-hot-toast';

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
    <div className="profile-mainContainer">
      <Nav />
      <div className="login-container">
        <input
          type="email"
          placeholder="Enter your account email"
          className="login-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button className="login-button" onClick={handleResetRequest}>
          Send Reset Link
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default ForgotPassword;
