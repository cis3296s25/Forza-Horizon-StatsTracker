import React, { useState, useRef } from 'react';
import { useUpdateUserStatsMutation } from '../redux/apis/stats';
import "../styles/updateStatsPage.css";
import NavLog from '../components/navLog';
import { FaQuestionCircle } from "react-icons/fa";
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

function UpdateStatsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);
  const { userName, initialStats } = location.state || {};

  const [formData, setFormData] = useState(initialStats || {});
  const [updateUserStats, { isLoading }] = useUpdateUserStatsMutation();

    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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
    
      try {
        const formDataToSend = new FormData();
        formDataToSend.append("userName", userName);
    
    
        images.forEach((image) => {
          formDataToSend.append("images", image); // must match backend key
        });
        
        console.log(formDataToSend);

        const response = await updateUserStats(formDataToSend).unwrap();
          
        console.log(formDataToSend);

        if(response) {
          toast.success("Images uploaded successfully!");
          resetImages(); // Reset images after successful upload
          navigate(`/user/${userName}`);
          window.location.reload();
        } else {
          toast.error("Failed to upload images. Please try again.");
        }
      } catch (error) {
        console.error(error);
        toast.error(error?.data?.message || "Failed to update stats.");
      }
    };
    
  return (
    <div className="updateStatsPage-mainContainer">
      <NavLog />
      <div className="updateStats-container">
        <button
        type="button"
        className='back-button'
        style={{textAlign: "center", marginBottom: "1rem"}}
        onClick={()=>navigate(-1)}
         >Back</button>
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
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleImageChange}
        />
        </div>
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
          className="submit-button"
          onClick={handleSubmit}
          disabled={images.length < 2}
        >
           {isLoading ? "updating Stats..." : "Update Stats"}
          </button>
          <button
            className="submit-button"
            style={{ marginLeft: "10px" }}
            onClick={resetImages}
            disabled={images.length === 0}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpdateStatsPage;
