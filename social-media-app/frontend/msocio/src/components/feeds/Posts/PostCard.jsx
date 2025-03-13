import { useAuth } from "@/context/AuthContext";
import React, { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { FaCircleUser } from "react-icons/fa6";
import ShowSingleImage from "./ShowSingleImage";
import {handleUserLike} from "../../../context/userContext";
import { useParams } from "react-router-dom";
import { getUserPosts } from "../../../context/userContext";

const PostCard = () => {
  const { id } = useParams();
  const { posts, setPosts, user } = useAuth();
  const [selectedImage, setSelectedImage] = useState(null);
  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const handleClose = () => {
    setSelectedImage(null);
  };


  useEffect(() => {
    const fetchUserPosts = async () => {
      if (id) {
        try {
          const userPosts = await getUserPosts();
          setPosts(userPosts);
        } catch (error) {
          console.error("Error fetching user posts:", error);
        }
      }
    };
  
    fetchUserPosts(); // ✅ Call the async function
  
  }, [id]); // ✅ Include dependencies if necessary

  return (
    <div className="flex flex-col w-full items-center space-y-4">
      {posts &&
        posts.map((post, index) => (
          <div
            key={index}
            className="w-full flex flex-col justify-between bg-white shadow-md rounded-lg p-4"
          >
            {/* User Info */}
            <div className="flex gap-2 items-center">
              <div className="w-18 h-18 flex items-center justify-center rounded-full overflow-hidden">
              <img
                src={post.user.image}
                alt=""
                className="shadow rounded-full"
              />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {post.user?.first_name
                    ? `${post.user.first_name} ${post.user.last_name}`
                    : post.user?.email || "Unknown User"}
                </h2>
                <p className="text-sm text-gray-600">
                  {/* show only date */}
                  {new Date(post.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Post Content */}
            <p className="text-gray-700 mt-2 flex-grow">
              {post.content.length > 100
                ? `${post.content.substring(0, 100)}...`
                : post.content}
            </p>

            {/* Post Images */}
            {post.images && post.images.length > 0 && (
              <div
                className={`mt-2 ${
                  post.images.length <= 2
                    ? "flex flex-col gap-2 justify-center"
                    : "grid grid-cols-2 gap-2"
                }`}
              >
                {post.images.map((imageObj, idx) => {
                  // ✅ Remove "image/upload/" prefix if it exists
                  const cleanImageUrl = imageObj.image.replace(
                    "image/upload/",
                    ""
                  );

                  return (
                    <img
                      key={idx}
                      src={cleanImageUrl}
                      alt={`Post image ${idx}`}
                      className={`w-full ${
                        post.images.length <= 2 ? "h-64" : "h-48"
                      } object-contain rounded-md cursor-pointer`}
                      onClick={() => handleImageClick(cleanImageUrl)}
                    />
                  );
                })}
              </div>
            )}

            {/* Post Footer */}
            <div className="mt-4 flex justify-between items-center text-gray-600">
              <div className="flex items-center space-x-2">
                <FaHeart className="text-red-500 cursor-pointer hover:scale-110 transition-transform" onClick={() => handleUserLike({ postId: post.id, setPosts })} />
                <span>{post.like_count ?? 0} Likes</span>
              </div>
            </div>
          </div>
        ))}
      {selectedImage && (
        <ShowSingleImage imageUrl={selectedImage} onClose={handleClose} />
      )}
    </div>
  );
};

export default PostCard;
