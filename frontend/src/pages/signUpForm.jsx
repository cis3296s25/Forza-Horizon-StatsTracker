import React, { useState, useEffect, useRef } from 'react';
import "../styles/signupform.css";
import Nav from '../components/nav';
import Footer from '../components/footer';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaQuestionCircle } from "react-icons/fa";
import toast from 'react-hot-toast';
import { useSignupMutation } from '../redux/apis/user';

const SignupForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [signup, { isLoading }] = useSignupMutation();

  const { gamertag, password,email, selectedPlatform, gameId } = location.state || {};

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    if (!gamertag || !password || !selectedPlatform) {
      toast.error("Good try, but your attempt failed.");
      navigate("/signup");
    }
  }, [gamertag, password, selectedPlatform, navigate]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.slice(0, 2 - images.length); // limit to 2

    if (validFiles.length === 0) return;

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });

    setImages((prev) => [...prev, ...validFiles]);
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const resetImages = () => {
    setImages([]);
    setImagePreviews([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // reset file input
    }
  };

  const handleSubmit = async () => {
    if (images.length !== 2) {
      return toast.error("Please upload exactly 2 images.");
    }

    const formData = new FormData();
    formData.append("userName", gamertag);
    formData.append("password", password);
    formData.append("platform", selectedPlatform);
    if (gameId) formData.append("gameId", gameId);
    formData.append("email", email);

    images.forEach((image) => {
      formData.append("images", image);
    });
    try {
      const response = await signup(formData);

      if ("data" in response) {
        toast.success("User signed up successfully!");
        navigate("/profile");
      } else {
        toast.error(response.error?.data?.message || "Signup failed.");
      }
    } catch (error) {
      toast.error("Unexpected error during signup.");
      console.error(error);
    }
  };
  return (
    <div className="signup-mainContainer">
      <Nav />
      <div className="signUpForm-Container">
        <h2 style={{ textAlign: "center"}}>Upload Driver Stats Screenshots
          <span className="platform-tooltip-wrapper">
            <FaQuestionCircle className="platform-tooltip-icon" />
            <div className="platform-tooltip-content" style={{fontSize: "14px"}}>
              <p>Upload 2 screenshots of your driver stats.</p>
              <p>First login to the Game</p>
              <p>Then go to the stats page.</p>
              <p>Take screenshots of General tab stats.</p>
              <p>Then Take a sceenshot of Records tab next to the Discovery tab stats</p>
              <p>Make sure the images are clear and legible.</p>
              <p>Click on the images to remove them.</p>
              <p>Click "Submit" when you're ready.</p>
              <p>Click "Reset" to clear your selections.</p>
            </div>
          </span>
        </h2>

        <div style={{ textAlign: "center"}}>
        <label
          htmlFor="image-upload"
          style={{
            display: "inline-block",
            padding: "0px 12px",
            backgroundColor: "#4CAF50",
            color: "white",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = "#45a049"}
          onMouseLeave={(e) => e.target.style.backgroundColor = "#4CAF50"}
        >
          📁 Choose Images
        </label>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          multiple
          style={{ display: "none" }}
          onChange={handleImageChange}
          ref={fileInputRef}
        />
      </div>


        {/* Image Preview */}
        {imagePreviews.length > 0 && (
          <div className="image-box" style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap", marginBottom: "20px", marginTop: "30px" }}>
            {imagePreviews.map((preview, idx) => (
              <div key={idx} style={{ position: "relative" }}>
                <img
                  src={preview}
                  alt={`Upload Preview ${idx + 1}`}
                  style={{ width: "200px", height: "auto", borderRadius: "8px", boxShadow: "0 0 10px #000" }}
                />
                <button
                  onClick={() => removeImage(idx)}
                  style={{
                    position: "absolute",
                    top: "-10px",
                    right: "-10px",
                    backgroundColor: "red",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: "25px",
                    height: "25px",
                    cursor: "pointer",
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        <div style={{ textAlign: "center", marginTop: "20px", display:"flex" }}>
        <button
          className="signup-button"
          onClick={handleSubmit}
          disabled={images.length < 2 || isLoading}
        >
          {isLoading ? "Submitting..." : "Submit"}
        </button>
          <button
            className="signup-button"
            style={{ marginLeft: "10px" }}
            onClick={resetImages}
            disabled={images.length === 0}
          >
            Reset
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SignupForm;
