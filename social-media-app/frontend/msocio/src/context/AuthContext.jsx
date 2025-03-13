import axios from "axios";
import React, { createContext, useState, useContext, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // ✅ Get stored user from localStorage when app loads
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || null;
  });
  const [message, setMessage] = useState("");
  const [posts, setPosts] = useState([]);

  const getPosts = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found, user is not authenticated!");
      return;
    }

    try {
      const response = await axios.get("http://127.0.0.1:8000/api/posts/", {
        headers: {
          Authorization: `Token ${token}`, // ✅ Use 'Token' instead of 'Bearer'
        },
      });
      // console.log(response.data.posts)
      setPosts(response.data.posts);
    } catch (error) {
      console.error(
        "Error fetching posts:",
        error.response?.data || error.message
      );
    }
  };
  // ✅ Function to save user in localStorage
  const saveUser = (userData) => {
    setUser(userData.user);
    localStorage.setItem("user", JSON.stringify(userData.user)); // Store in localStorage
    localStorage.setItem("token", userData.token); // Store token in localStorage
  };

  const signup = async (userData) => {
    try {
      const response = await fetch("http://localhost:8000/api/signup/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (response.ok) {
        saveUser(data); // ✅ Store user in state & localStorage
        setMessage("User created successfully!");
      } else {
        setMessage(data.message || "An error occurred");
      }
    } catch (error) {
      setMessage("An error occurred");
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch("http://localhost:8000/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        saveUser(data); // ✅ Store user in state & localStorage
        setMessage("Logged in successfully!");
      } else {
        setMessage(data.message || "An error occurred");
      }
    } catch (error) {
      setMessage("An error occurred");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user"); // ✅ Remove user from localStorage on logout
  };

  // const getUserPosts = async () => {
  //   const token = localStorage.getItem("token");
  //   if (!token) {
  //     console.error("No token found, user is not authenticated!");
  //     return;
  //   }
  //   try {
  //     const response = await axios.get(
  //       "http://127.0.0.1:8000/api/user-posts/",
  //       {
  //         headers: {
  //           Authorization: `Token ${token}`, // Use 'Token' instead of 'Bearer'
  //         },
  //       }
  //     );
  //     setPosts(response.data.posts); // Assuming setPosts is defined in your component
  //   } catch (error) {
  //     console.error(
  //       "Error fetching user posts:",
  //       error.response?.data || error.message
  //     );
  //   }
  // };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        signup,
        login,
        logout,
        message,
        posts,
        getPosts,
        setPosts
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Export useAuth hook
export const useAuth = () => useContext(AuthContext);
