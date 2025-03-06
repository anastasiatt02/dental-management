import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AuthGuard from "./components/AuthGuard";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import CreatePatient from "./pages/CreatePatient";
import Appointments from "./pages/Appointments";
import CreateAppointment from "./pages/CreateAppointment";
import PatientProfile from "./pages/PatientProfile";


function App() {
  return (
    <Router>
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<HomePage />} />

        {/* Protected Pages - doctor only*/}
        <Route
          path="/dashboard"
          element={
            <AuthGuard allowedRoles={["doctor"]}> 
              <Dashboard />
            </AuthGuard>
          }
        />
        <Route
          path="/patients"
          element={
            <AuthGuard allowedRoles={["doctor"]}>
              <Patients />
            </AuthGuard>
          }
        />
        <Route
          path="/create-patient"
          element={
            <AuthGuard allowedRoles={["doctor"]}>
              <CreatePatient />
            </AuthGuard>
          }
        />
        <Route
          path="/appointments"
          element={
            <AuthGuard allowedRoles={["doctor"]}>
              <Appointments />
            </AuthGuard>
          }
        />
        <Route
          path="/create-appointment"
          element={
            <AuthGuard allowedRoles={["doctor"]}>
              <CreateAppointment />
            </AuthGuard>
          }
        />
        <Route
          path="/patient-profile/:id"
          element={
            <AuthGuard allowedRoles={["doctor", "patient"]}>
              <PatientProfile />
            </AuthGuard>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
