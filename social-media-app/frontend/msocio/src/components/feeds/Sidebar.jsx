import { useAuth } from "@/context/AuthContext";
import React, { useEffect } from "react";
import {
  FaUserFriends,
  FaChartBar,
  FaNewspaper,
  FaUsers,
  FaStore,
  FaVideo,
  FaClock,
  FaBookmark,
  FaFlag,
  FaCalendarAlt,
  FaChevronDown,
  FaUserCircle,
} from "react-icons/fa";
import { IoSettingsSharp } from "react-icons/io5";
import { Link } from "react-router-dom"; // Make sure to import from 'react-router-dom'
import { AiOutlineLogout } from "react-icons/ai";
const Sidebar = () => {
  const { user } = useAuth();
  useEffect(() => {}, [user]);
  return (
    <div className="w-64 p-4 bg-white shadow-lg rounded-lg h-[90vh] sticky top-20 min-w-sm">
      <Link to={`#`} className="flex items-center mb-4">
        {user.image ? (
          <img
            alt={`Profile picture of ${user.first_name} ${user.last_name}`}
            className="w-10 h-10 rounded-full mr-3"
            height="40"
            src={user.image}
            width="40"
          />
        ) : (
          <FaUserCircle className="w-10 h-10 text-gray-400 mr-3" />
        )}
        <span className="font-bold text-xl text-gray-800">
          {user.first_name} {user.last_name}
        </span>
      </Link>
      <ul>
        <Link to={`/profile/${user.id}`} className="flex items-center mb-4 text-gray-700 hover:text-blue-500 cursor-pointer">
          <FaUserCircle className="text-xl mr-3" />
          <span>Profile</span>
        </Link>
        <li className="flex items-center mb-4 text-gray-700 hover:text-blue-500 cursor-pointer">
          <FaChartBar className="text-xl mr-3" />
          <span>Professional dashboard</span>
        </li>
        <li className="flex items-center mb-4 text-gray-700 hover:text-blue-500 cursor-pointer">
          <FaNewspaper className="text-xl mr-3" />
          <span>Feeds</span>
        </li>
        <li className="flex items-center mb-4 text-gray-700 hover:text-blue-500 cursor-pointer">
          <FaUsers className="text-xl mr-3" />
          <span>Groups</span>
        </li>
        <li className="flex items-center mb-4 text-gray-700 hover:text-blue-500 cursor-pointer">
          <FaStore className="text-xl mr-3" />
          <span>Marketplace</span>
        </li>
        <li className="flex items-center mb-4 text-gray-700 hover:text-blue-500 cursor-pointer">
          <FaVideo className="text-xl mr-3" />
          <span>Video</span>
        </li>
        <li className="flex items-center mb-4 text-gray-700 hover:text-blue-500 cursor-pointer">
          <FaClock className="text-xl mr-3" />
          <span>Memories</span>
        </li>
        <li className="flex items-center mb-4 text-gray-700 hover:text-pink-500 cursor-pointer">
          <FaBookmark className="text-xl mr-3" />
          <span>Saved</span>
        </li>
        <li className="flex items-center mb-4 text-gray-700 hover:text-orange-500 cursor-pointer">
          <FaFlag className="text-xl mr-3" />
          <span>Pages</span>
        </li>
        <li className="flex items-center mb-4 text-gray-700 hover:text-red-500 cursor-pointer">
          <FaCalendarAlt className="text-xl mr-3" />
          <span>Events</span>
        </li>
        <li
          className="flex items-center mb-4 text-gray-700 hover:text-red-500 cursor-pointer"
          onClick={() => {
            localStorage.clear();
            window.location.reload();
          }}
        >
          <AiOutlineLogout className="text-xl mr-3" />
          <span>Logout</span>
        </li>
        <li className="flex items-center text-gray-700 hover:text-gray-500 cursor-pointer">
          <Link to={`setting`} className="flex items-center">
          <IoSettingsSharp className="text-xl mr-3" />
          <span>Setting</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};
export default Sidebar;