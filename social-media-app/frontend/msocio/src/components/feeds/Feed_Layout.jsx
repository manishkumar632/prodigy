import React from "react";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import RightSidebar from "./RightSidebar";

const Feed_Layout = () => {
  return (
    <div>
      <Header />
      <div className="flex">
        <Sidebar />
        <Outlet />
        <RightSidebar />
      </div>
    </div>
  );
};

export default Feed_Layout;
