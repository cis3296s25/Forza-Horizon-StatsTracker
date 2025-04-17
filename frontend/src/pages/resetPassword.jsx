import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import "../styles/resetPassword.css";
import Nav from '../components/nav';
import Footer from '../components/footer';
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [token, setToken] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const resetToken = queryParams.get("token");
    if (resetToken) {
      setToken(resetToken);
    } else {
      toast.error("Invalid or missing reset token.");
      navigate("/"); // or redirect somewhere safe
    }
  }, [location, navigate]);

  const handleReset = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER}/api/userAccount/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, confirmPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Password has been reset.");
        setPassword('');
        setConfirmPassword('');
        navigate("/profile"); // back to login
      } else {
        toast.error(data.message || "Reset failed.");
      }
    } catch (err) {
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="reset-mainContainer">
  <Nav />
  <div className="reset-container">
    <input
      type="password"
      placeholder="Enter New Password"
      className="reset-input"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
    />
    <input
      type="password"
      placeholder="Confirm New Password"
      className="reset-input"
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
      required
    />
    <button className="reset-button" onClick={handleReset}>
      Reset Password
    </button>
  </div>
  <Footer />
</div>
  );
};

export default ResetPassword;
