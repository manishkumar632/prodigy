import { useState } from "react";
import "./App.css";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Admin_Layout from "./components/admin/Admin_Layout";
import ContentLayout from "./components/admin/ContentLayout";
import AddEmployee from "./components/employee/AddEmployee";
import ShowEmployees from "./components/employee/ShowEmployees";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Admin_Layout />,
    children: [
      {
        path: "/",
        element: <ContentLayout />,
        children: [
          {
            path: "employees/add",  // Corrected path
            element: <AddEmployee />,
          },
          {
            path: "employees/view",
            element: <ShowEmployees />
          }
        ],
      },
    ],
  },
]);


function App() {
  return (
    <>
    <RouterProvider router={routes} />
    </>
  );
}

export default App;
