import React, { useState } from "react";
import axios from "axios";
import { CiCirclePlus } from "react-icons/ci";
import { IoMdCloseCircle } from "react-icons/io";
import { useAuth } from "@/context/AuthContext";

const EditProfileImage = ({ setEditprofile }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const {setUser} = useAuth();
  const [updating, setUpdating] = useState(false);
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage({
        file,
        preview: URL.createObjectURL(file),
      });
    }
  };

  const handleUpdateProfileImage = async () => {
    if (!selectedImage) return;
    setUpdating(true);
    const formData = new FormData();
    formData.append("image", selectedImage.file);
    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        "http://127.0.0.1:8000/api/update-user/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Token ${token}`,
          },
        }
      );
      if (response.status === 200) {
        let userImage = JSON.parse(localStorage.getItem("user"));

        // Ensure user exists before modifying
        if (userImage) {
          userImage.image = response.data.user.image; // Update image field
          localStorage.setItem("user", JSON.stringify(userImage)); // Save back to localStorage
          setUser(userImage);
        }
        setEditprofile(false);
      }
    } catch (error) {
      console.error("Error updating profile image", error);
    }
  };

  return (
    <div className="relative max-w-lg bg-white rounded-lg shadow-lg p-8">
      <IoMdCloseCircle
        className="text-3xl absolute top-0 right-0"
        onClick={() => setEditprofile(false)}
      />
      <div className="flex flex-col gap-4 items-center justify-center">
        <h1 className="text-3xl">Choose Profile Picture</h1>
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
            id="upload-button"
          />
          <label htmlFor="upload-button">
            <button
              className="shadow-lg px-6 py-4 text-xl font-bold bg-blue-400 text-white rounded-lg flex items-center gap-4"
              onClick={() => document.getElementById("upload-button").click()}
            >
              <CiCirclePlus className="text-3xl" />
              <h1>Upload Image</h1>
            </button>
          </label>
        </div>
        {selectedImage && (
          <div className="mt-4 flex flex-col items-center">
            <img
              src={selectedImage.preview}
              alt="Selected"
              className="rounded-full shadow-lg w-56 h-56"
            />
            <button
              className="mt-4 shadow-lg px-6 py-4 text-xl font-bold bg-green-400 text-white rounded-lg"
              onClick={handleUpdateProfileImage}
            >
              {
                updating ? <p>Updating...</p>: <p>Update Profile Picture</p>
              }
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditProfileImage;
