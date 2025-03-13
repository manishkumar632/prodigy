import { useAuth } from "@/context/AuthContext";
import React, { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import EditProfileImage from "./EditProfileImage";
const UserDetails = () => {
  const { user, setUser } = useAuth();

  const [editprofile, setEditprofile] = useState(false);
  const profileImage = user.image || "";
  useEffect(()=>{
    
  }, [user])
  return (
    <div>
      {editprofile && (
        <div
          className={`absolute inset-0 z-10 flex items-center justify-center`}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <EditProfileImage setEditprofile={setEditprofile} />
        </div>
      )}
      <div className="flex items-center gap-4">
      {user.image ? (
        <div className="w-32 h-32 relative flex items-center justify-center">
          <div className="flex items-center justify-center overflow-hidden w-32 h-32 rounded-full">
          <img
            src={profileImage}
            alt="profile image"
            className="rounded-full"
          />
          </div>
          <MdEdit
            className="absolute bottom-0 right-0 bg-white rounded-full text-2xl"
            onClick={() => setEditprofile(true)}
          />
        </div>
      ) : (
        <div className="w-fit relative">
          <FaUserCircle className="text-7xl" />
          <MdEdit
            className="absolute bottom-0 right-0 bg-white rounded-full text-2xl"
            onClick={() => setEditprofile(true)}
          />
        </div>
      )}
      <div>
      <div className="flex gap-2 text-2xl font-bold">
      <h1>{user.first_name.charAt(0).toUpperCase() + user.first_name.slice(1)}</h1>
      <h1>{user.last_name.charAt(0).toUpperCase() + user.last_name.slice(1)}</h1>
      </div>
      </div>
      </div>
    </div>
  );
};

export default UserDetails;
