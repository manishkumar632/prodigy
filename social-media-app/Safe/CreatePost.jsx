import { useAuth } from "@/context/AuthContext";
import React, { useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { FaLocationDot } from "react-icons/fa6";
import { FaUserTag } from "react-icons/fa";
import axios from "axios";

const CreatePost = ({ setShowCreatePost }) => {
  const { user } = useAuth();
  const [content, setContent] = useState(""); // Fixed null issue
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]); // Fixed videos issue

  const handleImageChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const newImageObjects = newFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));

      setImages((prevImages) => [...prevImages, ...newImageObjects]);
    }
  };

  const handleVideoChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const newVideoObjects = newFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));

      setVideos((prevVideos) => [...prevVideos, ...newVideoObjects]); // Fixed this line
    }
  };

  const handleRemoveImage = (index) => {
    setImages((prevImages) => {
      const updatedImages = [...prevImages];
      URL.revokeObjectURL(updatedImages[index].preview);
      updatedImages.splice(index, 1);
      return updatedImages;
    });
  };

  const handleRemoveVideo = (index) => {
    setVideos((prevVideos) => {
      const updatedVideos = [...prevVideos];
      URL.revokeObjectURL(updatedVideos[index].preview);
      updatedVideos.splice(index, 1);
      return updatedVideos;
    });
  };

  const handleSubmit = async () => {
    if (!content && images.length === 0 && videos.length === 0) return;

    const formData = new FormData();
    formData.append("user_id", user.id);
    formData.append("content", content);

    images.forEach((imageObj) => {
      formData.append("images", imageObj.file); // Send file, not preview
    });

    videos.forEach((videoObj) => {
      formData.append("videos", videoObj.file); // Send file, not preview
    });

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/create_post/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 201) {
        setShowCreatePost(false);
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <div className="flex min-w-sm">
      <div className="bg-white flex flex-col w-full rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-center">Create post</h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={() => setShowCreatePost(false)}
          >
            <IoMdCloseCircle className="text-2xl" />
          </button>
        </div>
        <hr />
        <div className="flex items-center mb-4 mt-4">
          <img
            alt="User profile"
            className="w-10 h-10 rounded-full"
            height="40"
            src="https://storage.googleapis.com/a1aa/image/Qjw6W20Ob0CUSMBKNN4U_6DS9jWgfa5u8NNcsXF6BQs.jpg"
            width="40"
          />
          <div className="ml-2">
            <p className="font-semibold">{user.username}</p>
          </div>
        </div>
        <div className="mb-4">
          <textarea
            className="w-full border-none focus:ring-0 text-lg"
            placeholder="What's on your mind?"
            rows="3"
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
        </div>

        {/* Image Preview */}
        {images.length > 0 && (
          <div className="mb-4 max-w-sm grid grid-cols-2 gap-2">
            {images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image.preview}
                  alt={`Selected ${index}`}
                  className="w-full rounded-lg"
                />
                <IoMdCloseCircle
                  className="absolute top-0 right-0 text-2xl cursor-pointer text-black bg-white rounded-full p-0"
                  onClick={() => handleRemoveImage(index)}
                />
              </div>
            ))}
          </div>
        )}

        {/* Video Preview */}
        {videos.length > 0 && (
          <div className="mb-4 max-w-sm grid grid-cols-2 gap-2">
            {videos.map((video, index) => (
              <div key={index} className="relative">
                <video className="w-full rounded-lg" controls>
                  <source src={video.preview} type="video/mp4" />
                </video>
                <IoMdCloseCircle
                  className="absolute top-0 right-0 text-2xl cursor-pointer text-black bg-white rounded-full p-0"
                  onClick={() => handleRemoveVideo(index)}
                />
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between border border-gray-300 rounded-full px-4 py-2 mb-4">
          <span className="text-gray-700">Add to your post</span>
          <div className="flex items-center gap-4">
            <label>
              <img
                alt="Image icon"
                className="w-6 h-6 cursor-pointer"
                src="/create-post-image-icon.svg"
              />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                multiple
                onChange={handleImageChange}
              />
            </label>
            <label>
              <img
                alt="Video icon"
                className="w-6 h-6 cursor-pointer"
                src="/create-post-video-icon.svg"
              />
              <input
                type="file"
                accept="video/*"
                className="hidden"
                multiple
                onChange={handleVideoChange}
              />
            </label>
            <FaLocationDot
              className="text-2xl text-red-400"
              title="Not Implemented Yet"
            />
            <FaUserTag
              className="text-2xl text-blue-500"
              title="Not Implemented Yet"
            />
          </div>
        </div>

        <button
          className={`w-full py-2 rounded-lg text-xl ${
            content || images.length > 0 || videos.length > 0
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-500"
          }`}
          onClick={handleSubmit}
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
