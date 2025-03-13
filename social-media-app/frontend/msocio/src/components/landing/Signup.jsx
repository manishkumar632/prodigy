import React, { useState, useContext, useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext, useAuth } from "../../context/AuthContext";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [gender, setGender] = useState("");
  const { signup, message } = useContext(AuthContext);
  const {user} = useAuth();
  const navigate = useNavigate();
  const monthOptions = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];
  const currentYear = new Date().getFullYear() - 1;
  const yearOptions = Array.from({ length: 100 }, (_, i) => currentYear - i);
  const handleSignup = async (e) => {
    e.preventDefault();
    const formattedDateOfBirth = `${year}-${month.padStart(
      2,
      "0"
    )}-${day.padStart(2, "0")}`;
    signup({
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password,
      date_of_birth: formattedDateOfBirth,
      gender: gender,
    });
  };
  useEffect(() => {
    if (user) {
      navigate("/"); // ✅ Works correctly
    }
  }, [user]);
  const handleGoogleSignup = () => {
    // Handle Google signup logic here
  };

  return (
    <div>
      <div className="p-6 rounded-lg">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Create a new account</h1>
          <p className="text-gray-600">It's quick and easy.</p>
        </div>
        <form onSubmit={handleSignup}>
          <div className="flex space-x-2 mb-4">
            <input
              className="w-1/2 p-2 border border-gray-300 rounded"
              placeholder="First name"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              className="w-1/2 p-2 border border-gray-300 rounded"
              placeholder="Surname"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 mb-1">
              Date of birth
              <i className="fas fa-question-circle"></i>
            </label>
            <div className="flex space-x-2">
              <select
                className="w-1/3 p-2 border border-gray-300 rounded"
                onChange={(e) => setDay(e.target.value)}
              >
                {Array.from({ length: 31 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
              <select
                className="w-1/3 p-2 border border-gray-300 rounded"
                onChange={(e) => setMonth(e.target.value)}
              >
                {monthOptions.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
              <select
                className="w-1/3 p-2 border border-gray-300 rounded"
                onChange={(e) => setYear(e.target.value)}
              >
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-600 mb-1">
              Gender
              <i className="fas fa-question-circle"></i>
            </label>
            <div className="flex space-x-2">
              <label className="flex items-center space-x-1">
                <input
                  className="form-radio"
                  name="gender"
                  type="radio"
                  value="Female"
                  onChange={(e) => setGender(e.target.value)}
                />
                <span>Female</span>
              </label>
              <label className="flex items-center space-x-1">
                <input
                  className="form-radio"
                  name="gender"
                  type="radio"
                  value="Male"
                  onChange={(e) => setGender(e.target.value)}
                />
                <span>Male</span>
              </label>
              <label className="flex items-center space-x-1">
                <input
                  className="form-radio"
                  name="gender"
                  type="radio"
                  value="Custom"
                  onChange={(e) => setGender(e.target.value)}
                />
                <span>Custom</span>
              </label>
            </div>
          </div>
          <div className="mb-4">
            <input
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Mobile number or email address"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <input
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="New password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {message && <p className="text-red-600">{message}</p>}
          <p className="text-xs text-gray-600 mb-4">
            People who use our service may have uploaded your contact
            information to Msocio.{" "}
            <Link className="text-blue-600" to="#">
              Learn more.
            </Link>
          </p>
          <p className="text-xs text-gray-600 mb-4">
            By clicking Sign Up, you agree to our
            <Link className="text-blue-600" to="#">
              Terms
            </Link>
            ,
            <Link className="text-blue-600" to="#">
              Privacy Policy
            </Link>
            and
            <Link className="text-blue-600" to="#">
              Cookies Policy
            </Link>
            . You may receive SMS notifications from us and can opt out at any
            time.
          </p>
          <button className="w-full bg-green-600 text-white p-2 rounded font-bold">
            Sign Up
          </button>
        </form>
        <div className="text-center mt-4">
          <Link to={"/login"} className="text-blue-600">
            Already have an account?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
