import React from "react";
import { IoMdCloseCircle } from "react-icons/io";
const ShowSingleImage = ({ imageUrl, onClose }) => {
  return (
    <div className="fixed inset-0 bg-opacity-75 flex items-center justify-center z-50" style={{backgroundColor: 'rgba(0, 0, 0, 0.7)'}}>
        <IoMdCloseCircle className="absolute top-0 right-0 text-3xl text-white" onClick={onClose}/>
      <div className="relative w-[90%] flex items-center justify-center">
        <img
          src={imageUrl}
          alt="Full screen"
          className="max-w-full max-h-full"
        />
      </div>
    </div>
  );
};

export default ShowSingleImage;
