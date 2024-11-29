import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/home";
import User from "../pages/user";
import DashBoard from "../pages/dashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    children: [
      { path: "/", element: <DashBoard /> },
      { path: "user", element: <User /> },
    ],
  },
]);

export default router;
