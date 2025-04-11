import React from 'react';
import "../styles/deleteProfile.css";
import Nav from '../components/nav';
import Footer from '../components/footer';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDeleteUserMutation } from '../redux/apis/user';

const Delete = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userName } = location.state || {};
  const [deleteUser] = useDeleteUserMutation();

  const deleteFunction = async (e) => {
    if (e) e.preventDefault();
    if (!userName) {
      toast.error("No user found to delete.");
      navigate("/");
      return;
    }

    try {
      await deleteUser({ userName });
      toast.success("Profile deleted successfully.");
      navigate("/");
    } catch (err) {
      toast.error("There was an error deleting profile. Please try again.");
    }
  };

  const cancelDelete = () => {
    navigate(`/user/${userName}`);
  };

  return (
    <div className="deleteProfileContainer">
      <Nav />
      <div className="deleteProfileContent">
        <h3>Are you sure you want to delete your profile?</h3>
        <button className="deleteButton" onClick={deleteFunction}>Yes</button>
        <button className="deleteButton" onClick={cancelDelete}>No</button>
      </div>
      <Footer />
    </div>
  );
};

export default Delete;
