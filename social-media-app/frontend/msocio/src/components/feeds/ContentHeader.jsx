import React, { useEffect, useState } from "react";
import { FaVideo, FaPhotoVideo, FaFilm, FaUserCircle } from "react-icons/fa";
import CreatePost from "./CreatePost";
import { useAuth } from "@/context/AuthContext";

const ContentHeader = () => {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const {user} = useAuth();
   useEffect(()=>{
      
    }, [user])
  return (
    <div className="flex w-full mb-4">
      <div className="p-4 rounded-lg shadow-md w-full">
        <div className="flex items-center space-x-4">
          {
            user.image ? (
              <div className="w-18 h-18 flex items-center justify-center">
                <div className="flex w-18 h-18 items-center justify-center rounded-full overflow-hidden">
                <img
            alt="User profile picture"
            className=""
            src={user.image}
          />
              </div>
              </div>
            ):(
              <FaUserCircle className="w-10 h-10 text-gray-400 mr-3" />
            )
          }
          <input
            className="w-full bg-gray-100 p-2 rounded-full focus:outline-none"
            placeholder="What's on your mind, Manish?"
            type="text"
            onClick={() => setShowCreatePost(true)}
          />
        </div>
        <div className="flex justify-around mt-4">
          <button className="flex items-center space-x-2 text-red-500">
            <FaVideo />
            <span>Live video</span>
          </button>
          <button className="flex items-center space-x-2 text-green-500">
            <FaPhotoVideo />
            <span>Photo/video</span>
          </button>
          <button className="flex items-center space-x-2 text-pink-500">
            <FaFilm />
            <span>Reel</span>
          </button>
        </div>
      </div>
      {showCreatePost && (
        <div
          className="fixed inset-0 z-10 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="bg-white p-4 rounded-lg shadow-lg z-20">
            <CreatePost setShowCreatePost={setShowCreatePost} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentHeader;
