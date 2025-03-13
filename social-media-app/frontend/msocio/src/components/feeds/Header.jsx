import { useAuth } from "@/context/AuthContext";
import React from "react";
import {
  FaHome,
  FaUserFriends,
  FaUser,
  FaBell,
  FaSearch,
} from "react-icons/fa";
import { Link } from "react-router";

const Header = () => {
  const {user} = useAuth();
  return (
    <div className="max-w-7xl m-auto flex justify-between items-center p-4 sticky top-0 z-10 bg-white">
      {/* left section */}
      <div className="flex items-center gap-4">
        <Link to={`/`} className="font-bold text-3xl text-blue-500">MSOCIO</Link>
        <div className="flex items-center border rounded-3xl p-2">
          <FaSearch className="mr-2" />
          <input type="text" placeholder="Search" className="outline-none" />
        </div>
      </div>

      {/* center section */}
      <div className="flex items-center space-x-4">
        <Link to={`/`} className="p-2">
          <FaHome className="h-6 w-6" />
        </Link>
        <button className="p-2">
          <FaUserFriends className="h-6 w-6" />
        </button>
      </div>

      {/* right section */}
      <div className="flex items-center space-x-4">
        <button className="p-2">
          {user.image ?<div className="h-16 w-16 rounded-full shadow overflow-hidden">
            <img src={user.image} alt="" className="rounded-full" />
          </div> : <FaUser className="h-6 w-6" />}
        </button>
        <button className="p-2">
          <FaBell className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default Header;
