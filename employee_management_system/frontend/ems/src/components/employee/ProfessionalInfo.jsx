import React, { useState } from 'react';
import './ProfessionalInfo.css'; // Importing the CSS for styling

const ProfessionalInfo = ({ formData, handleChange, setCurrentStep }) => {
  const [professionalEntries, setProfessionalEntries] = useState([{
    position: "",
    company: "",
    startDate: "",
    endDate: "",
  }]);

  const handleAddEntry = () => {
    setProfessionalEntries([...professionalEntries, { position: "", company: "", startDate: "", endDate: "" }]);
  };

  const handleRemoveEntry = (index) => {
    const newEntries = professionalEntries.filter((_, i) => i !== index);
    setProfessionalEntries(newEntries);
  };

  const handleEntryChange = (index, e) => {
    const { name, value } = e.target;
    const newEntries = [...professionalEntries];
    newEntries[index][name] = value;
    setProfessionalEntries(newEntries);
  };

  return (
    <div>
      {professionalEntries.map((entry, index) => (
        <div key={index} className="professional-entry">
          <input
            type="text"
            name="position"
            value={entry.position}
            onChange={(e) => handleEntryChange(index, e)}
            placeholder="Position"
            className="input-field"
          />
          <input
            type="text"
            name="company"
            value={entry.company}
            onChange={(e) => handleEntryChange(index, e)}
            placeholder="Company"
            className="input-field"
          />
          <input
            type="date"
            name="startDate"
            value={entry.startDate}
            onChange={(e) => handleEntryChange(index, e)}
            className="input-field"
          />
          <input
            type="date"
            name="endDate"
            value={entry.endDate}
            onChange={(e) => handleEntryChange(index, e)}
            className="input-field"
          />
          <button type="button" onClick={() => handleRemoveEntry(index)} className="remove-button">Remove</button>
        </div>
      ))}
      <button type="button" onClick={handleAddEntry} className="add-button">Add Professional Entry</button>
    </div>
  );
}

export default ProfessionalInfo;
