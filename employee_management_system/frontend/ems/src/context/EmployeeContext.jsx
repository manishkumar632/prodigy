import React, { createContext, useContext, useState } from 'react'


export const EmpContext = createContext();

const EmployeeContextProvider = ({children}) => {
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zip, setZip] = useState(null);
    const [gender, setGender] = useState('');
    const [dob, setDob] = useState('');
    const [salary, setSalary] = useState(null);
    const [department, setDepartment] = useState('');
    const [designation, setDesignation] = useState('');
    const [experience, setExperience] = useState(null);
    const [nationality, setNationality] = useState('');
    const [maritalStatus, setMaritalStatus] = useState('');
    const [emergencyContact, setEmergencyContact] = useState('');
    const [empId, setEmpId] = useState(null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [dateJoined, setDateJoined] = useState('');
    const [officeLocation, setOfficeLocation] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [appointmentLetter, setAppointmentLetter] = useState(null);
    const [accountNumber, setAccountNumber] = useState(null);
    const [github, setGithub] = useState('');
  return (
    <EmpContext.Provider value={{
        fname, setFname,
        lname, setLname,
        email, setEmail,
        phone, setPhone,
        address, setAddress,
        city, setCity,
        state, setState,
        zip, setZip,
        gender, setGender,
        dob, setDob,
        salary, setSalary,
        department, setDepartment,
        designation, setDesignation,
        experience, setExperience,
        nationality, setNationality,
        maritalStatus, setMaritalStatus,
        emergencyContact, setEmergencyContact,
        empId, setEmpId,
        username, setUsername,
        password, setPassword,
        confirmPassword, setConfirmPassword,
        dateJoined, setDateJoined,
        officeLocation, setOfficeLocation,
        phoneNumber, setPhoneNumber,
        appointmentLetter, setAppointmentLetter,
        accountNumber, setAccountNumber,
        github, setGithub
    }}>
        {children}
    </EmpContext.Provider>
  )
}

export default EmployeeContextProvider

export const useEmployee = () => useContext(EmpContext)