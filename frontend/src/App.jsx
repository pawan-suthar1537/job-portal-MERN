import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Home from "./components/Home";
import Jobs from "./components/Jobs";
import Browse from "./components/Browse";
import Profile from "./components/Profile";
import JobDescription from "./components/JobDescription";
import EmployeeJobs from "./components/employee/EmployeeJobs";
import PostJob from "./components/employee/PostJob";
import Jobdetails from "./components/employee/Jobdetails";

const approuter = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/jobs",
    element: <Jobs />,
  },
  {
    path: "/description/:id",
    element: <JobDescription />,
  },

  {
    path: "/applications",
    element: <Browse />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/employee/alljobs",
    element: <EmployeeJobs />,
  },
  {
    path: "/employee/jobs/create",
    element: <PostJob />,
  },
  {
    path: "/employee/jobdetail/:id",
    element: <Jobdetails />,
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={approuter} />
    </>
  );
}

export default App;
