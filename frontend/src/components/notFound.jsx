// components/NotFound.js
import React from 'react';
import Nav from './nav';
import Footer from './footer';

const NotFound = () => {
  return (
    <div>
      <Nav />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <h1 style={{ textAlign: "center" }}>404 - Page Not Found</h1>
      <h5 style={{ textAlign: "center" }}>The page you are looking for doesn't exist.</h5>
      <h5 style={{ textAlign: "center" }}>Click on the logo to go to home page</h5>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <Footer />
    </div>
  );
}

export default NotFound;