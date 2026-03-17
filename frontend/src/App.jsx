import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "./App.css"

import Nav from "./comp/Nav.jsx";
import Login from "./comp/Login.jsx";
import Reg from "./comp/Reg.jsx";
import Logout from "./comp/Logout.jsx";
import Home from "./comp/Home.jsx";
import Search from "./comp/Search.jsx";
import ResetPassword from "./comp/ResetPassword.jsx";
import DoctorDetails from "./comp/DoctorDetails.jsx";
import EditProfile from "./comp/EditProfile.jsx";
import AllDoctors from "./comp/AllDoctors.jsx";

import DoctorDashboard from "./comp/DoctorDashboard.jsx";
import PatientDashboard from "./comp/PatientDashboard.jsx";
import ReceptionistDashboard from "./comp/ReceptionistDashboard.jsx";
import AdminDashboard from "./comp/AdminDashboard.jsx";
import ProtectedRoute from "./comp/ProtectedRoute.jsx";
import Footer from "./comp/Footer.jsx"; // Import Footer

import Ct from "./comp/Ct.jsx";
import ContactUs from "./comp/ContactUs.jsx";

const App = () => {
  const [state, setState] = useState(() => {
    const t = sessionStorage.getItem("user");
    return t ? JSON.parse(t) : {
      token: "",
      uid: "",
      name: "",
      role: "",
    };
  });

  const updstate = (obj) => {
    setState((prev) => ({ ...prev, ...obj }));
  };

  return (
    <BrowserRouter>
      <AppContent state={state} updstate={updstate} />
    </BrowserRouter>
  );
};

const AppContent = ({ state, updstate }) => {
  const location = useLocation();

  return (
    <Ct.Provider value={{ state, updstate }}>
      <Nav />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/register" element={<Reg />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/doctor-details" element={<DoctorDetails />} />
        <Route path="/all-doctors" element={<AllDoctors />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={["doctor"]} />}>
          <Route path="/doctor" element={<DoctorDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["patient"]} />}>
          <Route path="/patient" element={<PatientDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["receptionist"]} />}>
          <Route path="/receptionist" element={<ReceptionistDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["doctor", "patient"]} />}>
          <Route path="/editprofile" element={<EditProfile />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      {location.pathname === "/" && <Footer />}
    </Ct.Provider>
  );
};

export default App;
