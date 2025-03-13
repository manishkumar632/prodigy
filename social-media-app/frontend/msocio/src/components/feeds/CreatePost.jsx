import { useAuth } from "@/context/AuthContext";
import React, { useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { FaLocationDot, FaUserTag } from "react-icons/fa6";
import axios from "axios";

const CreatePost = ({ setShowCreatePost }) => {
  const { user, setPosts } = useAuth();
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e, setFiles) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const handleRemoveFile = (index, setFiles) => {
    setFiles((prevFiles) => {
      const updatedFiles = [...prevFiles];
      URL.revokeObjectURL(updatedFiles[index].preview);
      updatedFiles.splice(index, 1);
      return updatedFiles;
    });
  };

  const handleSubmit = async () => {
    if (!content.trim() && images.length === 0 && videos.length === 0) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("content", content.trim());

    images.forEach(({ file }) => formData.append("images", file));
    videos.forEach(({ file }) => formData.append("videos", file));

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://127.0.0.1:8000/api/posts/",
        formData,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 201) {
        
        setShowCreatePost(false);
      }
    } catch (error) {
      console.error(
        "Error creating post:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex min-w-md`}>
      <div className="bg-white flex flex-col w-full rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Create post</h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={() => setShowCreatePost(false)}
          >
            <IoMdCloseCircle className="text-2xl" />
          </button>
        </div>
        <textarea
          className="w-full border-none focus:ring-0 text-lg"
          placeholder="What's on your mind?"
          rows="3"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>

        {images.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mb-4 max-w-md">
            {images.map((image, index) => (
              <div key={index} className="relative">
                <img src={image.preview} alt="" className="w-full rounded-lg" />
                <IoMdCloseCircle
                  className="absolute top-0 right-0 text-2xl cursor-pointer text-white bg-black rounded-full"
                  onClick={() => handleRemoveFile(index, setImages)}
                />
              </div>
            ))}
          </div>
        )}

        {videos.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mb-4">
            {videos.map((video, index) => (
              <div key={index} className="relative">
                <video className="w-full rounded-lg" controls>
                  <source src={video.preview} type="video/mp4" />
                </video>
                <IoMdCloseCircle
                  className="absolute top-0 right-0 text-2xl cursor-pointer text-white bg-black rounded-full"
                  onClick={() => handleRemoveFile(index, setVideos)}
                />
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center border border-gray-300 rounded-full px-4 py-2 mb-4">
          <span className="text-gray-700">Add to your post</span>
          <div className="flex items-center gap-4">
            <label>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                multiple
                onChange={(e) => handleFileChange(e, setImages)}
              />
              <img
                alt="Add Image"
                className="w-6 h-6 cursor-pointer"
                src="/create-post-image-icon.svg"
              />
            </label>
            <label>
              <input
                type="file"
                accept="video/*"
                className="hidden"
                multiple
                onChange={(e) => handleFileChange(e, setVideos)}
              />
              <img
                alt="Add Video"
                className="w-6 h-6 cursor-pointer"
                src="/create-post-video-icon.svg"
              />
            </label>
            <FaLocationDot
              className="text-2xl text-red-400"
              title="Location (Not Implemented)"
            />
            <FaUserTag
              className="text-2xl text-blue-500"
              title="Tag Friends (Not Implemented)"
            />
          </div>
        </div>

        <button
          className={`w-full py-2 rounded-lg text-xl ${
            content || images.length || videos.length
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-500"
          }`}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
