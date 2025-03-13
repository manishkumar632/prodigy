import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { MdGroups } from "react-icons/md";
import { FcDepartment } from "react-icons/fc";
import { IoSettingsSharp } from "react-icons/io5";
import { IoMdAddCircle } from "react-icons/io";
import { FaEye } from "react-icons/fa";

const Sidebar = () => {
  const [isEmployeeDropdownOpen, setIsEmployeeDropdownOpen] = useState(false);

  const toggleEmployeeDropdown = () => {
    setIsEmployeeDropdownOpen(!isEmployeeDropdownOpen);
  };

  return (
    <div className="h-screen w-64 bg-gray-800 text-white shadow-lg sticky top-10">
      <ul className="space-y-6 p-6">
        <li className="flex items-center space-x-4">
          <MdDashboard className="text-2xl" />
          <Link to="/dashboard" className="text-lg hover:text-blue-400">
            Dashboard
          </Link>
        </li>
        <li className="flex flex-col space-y-2">
          <div
            className="flex items-center space-x-4 cursor-pointer"
            onClick={toggleEmployeeDropdown}
          >
            <MdGroups className="text-2xl" />
            <span className="text-lg hover:text-blue-400">Employees</span>
          </div>
          {isEmployeeDropdownOpen && (
            <ul className="ml-8 space-y-2 transition-all duration-300 ease-in-out">
              <li className="flex items-center space-x-4">
                <IoMdAddCircle className="text-xl" />
                <Link
                  to="employees/add"
                  className="text-lg hover:text-blue-400"
                >
                  Add
                </Link>
              </li>
              <li className="flex items-center space-x-4">
                <FaEye className="text-xl" />
                <Link
                  to="/employees/view"
                  className="text-lg hover:text-blue-400"
                >
                  View
                </Link>
              </li>
            </ul>
          )}
        </li>
        <li className="flex items-center space-x-4">
          <FcDepartment className="text-2xl" />
          <Link to="/departments" className="text-lg hover:text-blue-400">
            Departments
          </Link>
        </li>
        <li className="flex items-center space-x-4">
          <IoSettingsSharp className="text-2xl" />
          <Link to="/settings" className="text-lg hover:text-blue-400">
            Settings
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
