import React, { useState } from 'react';
import "../styles/deleteProfile.css";
import Nav from '../components/nav';
import Footer from '../components/footer';
import { useNavigate } from 'react-router-dom';

const Delete = () => {
  const deleteProf = async () => {
      //delete profile and exit
  }
  const cancelDelete = async () => {
    //Exit to previous page
}

  return (
    <div className="deleteProfileContainer">
        <Nav />
        <div className="deleteProfileContent">
            <h3>Are you sure you want to delete your profile?</h3>
            <button className="deleteButton" onClick={deleteProf}>Yes</button>
            <button className="deleteButton" onClick={cancelDelete}>No</button>
        </div>
        <Footer />
    </div>
  );
};

export default Delete;
