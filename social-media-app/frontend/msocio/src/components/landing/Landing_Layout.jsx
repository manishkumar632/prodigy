import { Outlet, Link } from "react-router-dom";
import AboutMsocio from "./AboutMsocio";

const Landing_Layout = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-screen max-w-7xl mx-auto items-center justify-center lg:gap-12 md:gap-8 gap-4">
      <AboutMsocio />
      <Outlet />
    </div>
  );
};

export default Landing_Layout;
