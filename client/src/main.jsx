import React from "react";
import ReactDOM from "react-dom/client";
<<<<<< TaskManager-Home
 
=======

>>>>>> dev
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Welcome from "./pages/Welcome/Welcome";
import Home from "./pages/Home/Home";
import Archive from "./pages/Archive/Archive";
import Member from "./pages/Member/Member";
import Table from "./pages/Table/Table";
import Collaborater from "./components/Collaborater/Collaborater";

import App from "./App";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
<<<<<< TaskManager-Home
        index: true,
=======
        path: "/",
>>>>>> dev
        element: <Welcome />,
      },
      {
        path: "/home",
        element: <Home />,
      },

      {
        path: "/archive",
        element: <Archive />,
      },
      {
        path: "/member",
        element: <Member />,
      },
      {
        path: "/table",
        element: <Table />,
      },
      {
        path: "/collaborater",
        element: <Collaborater />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
