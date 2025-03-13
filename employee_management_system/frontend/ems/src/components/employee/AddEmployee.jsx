import React, { useState } from "react";
import { Link } from "react-router-dom";
import PersonalInfo from "./PersonalInfo";
import ProfessionalInfo from "./ProfessionalInfo";
import Documents from "./Documents";
import AccountAccess from "./AccountAccess";

const AddEmployee = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    position: "",
    dateJoined: "",
    salary: "",
    image: null,
    imagePreview: "",
    dob: "",
    city: "",
    postalCode: "",
    country: "",
    area: "",
    state: "",
    idNumber: "",
    documents: [], // Array to hold multiple documents
    accountAccess: [] // Array to hold multiple account access entries
  });

  const [currentStep, setCurrentStep] = useState(1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      image: file,
      imagePreview: URL.createObjectURL(file),
    }));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    setFormData((prevData) => ({
      ...prevData,
      image: file,
      imagePreview: URL.createObjectURL(file),
    }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.salary <= 0) {
      alert("Salary must be greater than 0");
      return;
    }
    // Handle form submission logic here
    console.log("Employee Added:", formData);
  };

  return (
    <div>
      <div className="border-b border-gray-200 mb-6">
        <ul className="flex">
          <li className={`mr-6 ${currentStep === 1 ? "text-purple-600 font-semibold" : "text-gray-600"}`}>
            <Link to="#" onClick={() => setCurrentStep(1)}>Personal Information</Link>
          </li>
          <li className={`mr-6 ${currentStep === 2 ? "text-purple-600 font-semibold" : "text-gray-600"}`}>
            <Link to="#" onClick={() => setCurrentStep(2)}><i className="fas fa-briefcase mr-2"></i> Professional Information</Link>
          </li>
          <li className={`mr-6 ${currentStep === 3 ? "text-purple-600 font-semibold" : "text-gray-600"}`}>
            <Link to="#" onClick={() => setCurrentStep(3)}><i className="fas fa-file-alt mr-2"></i> Documents</Link>
          </li>
          <li className={`mr-6 ${currentStep === 4 ? "text-purple-600 font-semibold" : "text-gray-600"}`}>
            <Link to="#" onClick={() => setCurrentStep(4)}><i className="fas fa-lock mr-2"></i> Account Access</Link>
          </li>
        </ul>
      </div>
      <form onSubmit={handleSubmit}>
        {currentStep === 1 && (
          <PersonalInfo
            formData={formData}
            handleChange={handleChange}
            setCurrentStep={setCurrentStep}
          />
        )}
        {currentStep === 2 && (
          <ProfessionalInfo
            formData={formData}
            handleChange={handleChange}
            setCurrentStep={setCurrentStep}
          />
        )}
        {currentStep === 3 && (
          <Documents
            formData={formData}
            handleChange={handleChange}
            setCurrentStep={setCurrentStep}
          />
        )}
        {currentStep === 4 && (
          <AccountAccess
            formData={formData}
            handleChange={handleChange}
            setCurrentStep={setCurrentStep}
          />
        )}
        <div className="mt-4">
          {currentStep > 1 && (
            <button type="button" onClick={() => setCurrentStep(currentStep - 1)}>Back</button>
          )}
          {currentStep < 4 && (
            <button type="button" onClick={() => setCurrentStep(currentStep + 1)}>Next</button>
          )}
          {currentStep === 4 && <button type="submit">Submit</button>}
        </div>
      </form>
    </div>
  );
};

export default AddEmployee;
