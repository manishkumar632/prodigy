import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom"; // ✅ Fix import
import Landing_Layout from "./components/landing/Landing_Layout";
import { AuthProvider, useAuth } from "./context/AuthContext"; // ✅ Import useAuth
import Login from "./components/landing/Login";
import Signup from "./components/landing/Signup";
import Feed_Layout from "./components/feeds/Feed_Layout";
import Profile_Layout from "./components/profile/Profile_Layout";
import Feeds from "./components/feeds/Feeds";
import Content from "./components/feeds/Content";

const AppRouter = () => {
  const { user } = useAuth(); // ✅ Get user from AuthContext
  const routes = createBrowserRouter([
    {
      path: "/",
      element: user ? <Feed_Layout /> : <Navigate to="/login" />, // ✅ Use user inside component
      children: [
        {
          path: "/",
          element: <Content />,
        },
        {
          path: "/profile/:id",
          element: <Profile_Layout />,
        },
      ]
    },
    {
      path: "/",
      element: <Landing_Layout />,
      children: [
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "signup",
          element: <Signup />,
        },
      ],
    },
  ]);

  return <RouterProvider router={routes} />;
};

const App = () => {
  return (
    <AuthProvider>
      <AppRouter /> {/* ✅ AppRouter can now access user */}
    </AuthProvider>
  );
};

export default App;
