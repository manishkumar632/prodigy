import React from "react";
import { Link } from "react-router-dom";

const personalDetails = [
  { label: "Name", value: "John Doe" },
  { label: "Email", value: "john.doe@example.com" },
  { label: "Phone", value: "+1234567890" },
  { label: "Address", value: "123 Main St, Anytown, USA" },
  { label: "Position", value: "Software Engineer" },
];

const PersonalInfo = ({ setCurrentStep }) => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <form>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="col-span-1 md:col-span-1 flex justify-center items-center">
            <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-camera text-gray-400 text-2xl"></i>
            </div>
          </div>
          <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              placeholder="First Name"
              className="border border-gray-300 rounded-lg p-3 w-full"
            />
            <input
              type="text"
              placeholder="Last Name"
              className="border border-gray-300 rounded-lg p-3 w-full"
            />
            <input
              type="text"
              placeholder="Mobile Number"
              className="border border-gray-300 rounded-lg p-3 w-full"
            />
            <input
              type="email"
              placeholder="Email Address"
              className="border border-gray-300 rounded-lg p-3 w-full"
            />
            <div className="relative">
              <input
                type="text"
                placeholder="Date of Birth"
                className="border border-gray-300 rounded-lg p-3 w-full"
              />
              <i className="fas fa-calendar-alt absolute right-3 top-3 text-gray-400"></i>
            </div>
            <select className="border border-gray-300 rounded-lg p-3 w-full">
              <option>Marital Status</option>
            </select>
            <select className="border border-gray-300 rounded-lg p-3 w-full">
              <option>Gender</option>
            </select>
            <input
              type="text"
              placeholder="Nationality"
              className="border border-gray-300 rounded-lg p-3 w-full"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <input
            type="text"
            placeholder="Address"
            className="border border-gray-300 rounded-lg p-3 w-full col-span-1 md:col-span-3"
          />
          <select className="border border-gray-300 rounded-lg p-3 w-full">
            <option>City</option>
          </select>
          <select className="border border-gray-300 rounded-lg p-3 w-full">
            <option>State</option>
          </select>
          <input
            type="text"
            placeholder="ZIP Code"
            className="border border-gray-300 rounded-lg p-3 w-full"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            className="bg-white text-gray-600 border border-gray-300 rounded-lg px-6 py-2 mr-3"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => setCurrentStep(2)}
            className="bg-purple-600 text-white rounded-lg px-6 py-2"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default PersonalInfo;
