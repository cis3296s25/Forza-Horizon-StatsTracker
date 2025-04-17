import React, { useEffect } from 'react';

const FreeTierAlert = () => {
  useEffect(() => {
    // Check if the alert has already been shown during this session
    if (!sessionStorage.getItem('alertShown')) {
      window.alert("This site is hosted on Render's free tier. It may take a few seconds to wake up if inactive.");
      sessionStorage.setItem('alertShown', 'true'); // Set a flag in sessionStorage to prevent it from showing again in this session
    }
  }, []);

  return null; // No need to render anything
};

export default FreeTierAlert;
