import React from "react";
import "../styles/loadingScreen.css";

const LoadingScreen = () => {
  const text = "FORZA  HORIZON  5";
 window.alert("The Database will be decommisoned following the presentation on Tuesday April 22,2025")
  const wrapLetters = () => {
    return text.split("").map((char, index) => (
      <span key={index} className="letter">{char}</span>
    ));
  };

  return (
    <div className="loading-screen">
      <h1>{wrapLetters()}</h1>
    </div>
  );
};

export default LoadingScreen;
