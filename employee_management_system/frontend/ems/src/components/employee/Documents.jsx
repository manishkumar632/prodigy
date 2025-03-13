import React from "react";

const Documents = ({ formData, handleChange, setCurrentStep }) => {
  return (
    <div>
      <h2>Documents</h2>
      <div>
        <label htmlFor="resume">Resume:</label>
        <input type="file" id="resume" name="resume" onChange={handleChange} />
      </div>
      <div>
        <label htmlFor="coverLetter">Cover Letter:</label>
        <input
          type="file"
          id="coverLetter"
          name="coverLetter"
          onChange={handleChange}
        />
      </div>
      <button type="button" onClick={() => setCurrentStep(2)}>
        Back
      </button>
      <button type="button" onClick={() => setCurrentStep(4)}>
        Next
      </button>
    </div>
  );
};

export default Documents;
