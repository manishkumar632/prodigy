import React from "react";
import Sidebar from "./Sidebar";
import Content from "./Content";
import RightSidebar from "./RightSidebar";
import { Outlet } from "react-router";

const Feeds = () => {
  return (
    <div className="flex">
      <Sidebar />
      {/* <Content /> */}
      <Outlet />
      <RightSidebar />
    </div>
  );
};

export default Feeds;
