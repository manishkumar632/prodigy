import React from "react";

const menuItems = [
  {
    icon: "fas fa-th-large",
    label: "Dashboard",
    bgColor: "bg-purple-100",
    textColor: "text-purple-600",
  },
  { icon: "fas fa-users", label: "All Employees" },
  { icon: "fas fa-building", label: "All Departments" },
  { icon: "fas fa-calendar-check", label: "Attendance" },
  { icon: "fas fa-dollar-sign", label: "Payroll" },
  { icon: "fas fa-briefcase", label: "Jobs" },
  { icon: "fas fa-user-tie", label: "Candidates" },
  { icon: "fas fa-file-alt", label: "Leaves" },
  { icon: "fas fa-calendar-alt", label: "Holidays" },
  { icon: "fas fa-cog", label: "Settings" },
];

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-white shadow-md">
      <div className="flex items-center p-4">
        <img
          alt="HRMS logo"
          className="w-10 h-10 rounded-full"
          height="40"
          src="https://storage.googleapis.com/a1aa/image/m3fQYQetZ8BhYyhdBw1pnDmu6IHfs7TU9VAnVjqMTRc.jpg"
          width="40"
        />
        <span className="ml-2 text-2xl font-bold text-black">HRMS</span>
      </div>
      <div className="mt-4">
        {menuItems.map((item, index) => (
          <div
            key={index}
            className={`flex items-center p-4 ${item.bgColor || ""} rounded-lg`}
          >
            <i className={`${item.icon} ${item.textColor || "text-black"}`}></i>
            <span
              className={`ml-2 ${item.textColor || "text-black"} font-semibold`}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
