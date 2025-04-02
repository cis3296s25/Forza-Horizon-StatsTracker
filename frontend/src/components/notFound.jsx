import React from 'react'
import Nav from './nav';
import Footer from './footer';
import "../styles/notFound.css";
import CurryFail from '../assets/forzaImgs/curry.png';


const NotFound = () => {
  return (
    <div className="page-container">
    <Nav />
    
    <div className ="not-found-content">
      <h1 style={{textAlign:"center"}}>404 - Page Not Found</h1>
      <h5 style={{textAlign:"center"}}>The page you are looking for doesn't exist.</h5>
      <h5 style={{textAlign:"center"}}>Click on the Forza logo in the top left to go to home page</h5>
      <img src= {CurryFail} alt="Fail" style={{maxWidth:'400px', marginTop: '1rem'}}
      />
      </div>
    <Footer/>
    </div> 
  )
}

export default NotFound
