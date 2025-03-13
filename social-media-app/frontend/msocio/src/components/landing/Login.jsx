import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, message } = useAuth();
  const navigate = useNavigate();
  const {user} = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  useEffect(()=>{
    if(user){
      navigate('/')
    }
  }, [user])
  return (
    <div class="p-8 shadow-lg">
      <form onSubmit={handleSubmit}>
        <div class="mb-4">
          <input
            type="text"
            placeholder="Email address or phone number"
            class="w-full p-3 border border-gray-300 rounded-lg outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div class="mb-4">
          <input
            type="password"
            placeholder="Password"
            class="w-full p-3 border border-gray-300 rounded-lg outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div class="mb-4">
          <button
            type="submit"
            class="w-full bg-blue-600 text-white p-3 rounded-lg text-lg"
          >
            Log in
          </button>
        </div>
        {message && <div class="text-center mb-4 text-red-600">{message}</div>}
        <div class="text-center mb-4">
          <a href="#" class="text-blue-600">
            Forgotten password?
          </a>
        </div>
        <hr class="mb-4" />
        <div class="text-center">
          <Link
            to="/signup"
            class="flex justify-center items-center bg-green-500 font-semibold text-white p-3 rounded-lg text-lg"
          >
            Create new account
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
