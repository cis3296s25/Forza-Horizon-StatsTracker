import React from 'react';
import "../styles/notFound.css";
import Nav from './nav';
import Footer from './footer';


const NotFound = () => {
  return (
    <div className="notFoud-mainContainer">
      <Nav />
      <div className="not-found-content">
        <h1 className="not-found-title">404 - Not Found</h1>
        <p className="not-found-text">Oops! The page you are looking for does not exist.</p>
      </div>
      <Footer />
    </div>
  );
}


export default NotFound
