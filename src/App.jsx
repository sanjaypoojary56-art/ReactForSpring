import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import "./AppRedesign.css";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import Register from "./pages/Register.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import EditProfile from "./pages/EditProfile.jsx";
import AllJobs from "./pages/AllJobs.jsx";
import JobDetails from "./pages/JobDetails.jsx";
import RecruiterRegister from "./pages/RecruiterRegister.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import RecruiterDashboard from "./pages/RecruiterDashboard.jsx";
function App() {

  return (
    <BrowserRouter>

      <Routes>

        {/* Public SEO-friendly homepage */}
        <Route path="/" element={<Home />} />

        {/* Authentication */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />
        <Route
          path="/jobs/:id"
          element={<JobDetails />}
        />
        <Route
        path="/recruiter-dashboard"
        element={<RecruiterDashboard />}
        />
        <Route
          path="/jobs"
          element={<AllJobs />}
        />

        {/* Student */}
        <Route
          path="/dashboard"
          element={<StudentDashboard />}
        />
        <Route 
        path="/recruiter-register"
        element={<RecruiterRegister />}
        />
        <Route 
        path="/edit-profile"
        element={<EditProfile />}
        />
        <Route 
        path="/admin"
        element={<AdminDashboard />}
        />
        <Route
          path="/profile"
          element={<EditProfile />}
        />

        <Route
          path="/jobs"
          element={<AllJobs />}
        />

        {/* Individual job */}
        <Route
          path="/jobs/:jobid"
          element={<JobDetails />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;
