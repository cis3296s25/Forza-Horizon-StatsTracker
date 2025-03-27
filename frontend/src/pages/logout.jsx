import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../redux/apis/user';
import toast from 'react-hot-toast';
import Nav from '../components/nav';
import Footer from '../components/footer';
import "../styles/logout.css";

const Logout = () => {
  const navigate = useNavigate();
  const [logout, { isLoading }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      const res = await logout();

      if ("data" in res) {
        // logged out
        toast.success("Logged out successfully");
        
        // redirect back to home but we can also make it login
        navigate('/frontend/src/pages/home.jsx', { replace: true });
      } else {
        //failed to log out
        toast.error("Unable to log out. Please try again.");
      }
    } catch (error) {
  // any other errors
      toast.error("There was an error logging out. Try again later.");
    }
  };

  const handleCancel = () => {
    // Navigate to home page
    navigate('/', { replace: true });
  };

  return (
    <div className="logout-mainContainer">
      <Nav />
      <div className="logout-container">
        <h2>LOGOUT</h2>
        <p>Are you sure you want to log out?</p>
        <div className="logout-buttons">
          <button 
            className="logout-button logout-confirm" 
            onClick={handleLogout}
            disabled={isLoading}
          >
            {isLoading ? 'Logging Out...' : 'LOGOUT'}
          </button>
          <button 
            className="logout-button logout-cancel"
            onClick={handleCancel}
            disabled={isLoading}
          >
            CANCEL
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Logout;
