import React from "react";
import Header from "../Header";
import ContentLayout from "./ContentLayout";
import { Outlet } from "react-router-dom";

const Admin_Layout = () => {
  return (
    <div className="w-full flex flex-col">
      <Header />
      <Outlet />
    </div>
  );
};

export default Admin_Layout;
