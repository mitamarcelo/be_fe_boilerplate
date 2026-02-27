import { createBrowserRouter } from "react-router-dom";

import AppLayout from "@src/components/AppLayout";
import Home from "@src/pages/Home";
import Login from "@src/pages/Login";
import Register from "@src/pages/Register";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
    ],
  },
]);
