import React from "react";

const AccountAccess = ({ formData, handleChange, setCurrentStep }) => {
  return (
    <div>
      <h2>Account Access</h2>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
      </div>
      <button type="button" onClick={() => setCurrentStep(3)}>
        Back
      </button>
      <button type="submit">Submit</button>
    </div>
  );
};

export default AccountAccess;
