import React from 'react';
import loadingGif from '../assets/forzaImgs/loading.gif'; // Adjust the path as necessary

const Loader = () => {
  return (
    <>
      <div className="loader-container">
        <img className="loader" src={loadingGif} alt="Loading..." />
      </div>
    </>
  );
};

export default Loader;

// Styles (CSS-in-JS after export)
const styles = `
  .loader-container {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color:black;
    height: 100vh; /* Full screen height to center the loader */
  }

  .loader {
    width: auto;  /* Adjust size of your GIF */
    height: auto; /* Adjust size of your GIF */
  }
`;

// Injecting styles into the document
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
