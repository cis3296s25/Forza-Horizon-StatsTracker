import React, { useState } from 'react';
import "../styles/deleteProfile.css";
import Nav from '../components/nav';
import Footer from '../components/footer';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDeleteUserMutation } from '../redux/apis/user';

const Delete = () => {
  const navigate = useNavigate();
  const deleteApi = useDeleteUserMutation();
  const { gamertag } = location.state || {};
  const deleteFunction = async (e) => {
    if (e) e.preventDefault();

    //Delete user from DB
    try {
      const res = await deleteApi({
        userName: gamertag
      });
    }
    catch {
      toast.error("There was an error deleting profile. Please try again.");
    }
    navigate("/#", { state: {} });
  }
  const cancelDelete = async () => {
    navigate("/#", { state: {} });
  }

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
