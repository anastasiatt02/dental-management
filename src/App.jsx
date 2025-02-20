import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AuthGuard from "./components/AuthGuard";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import CreatePatient from "./components/CreatePatient";
import Appointments from "./pages/Appointments";
// import './App.css'
import CreateAppointment from "./pages/CreateAppointment";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<HomePage />} />

        {/* Protected Pages */}
        <Route
          path="/dashboard"
          element={
            <AuthGuard>
              <Dashboard />
            </AuthGuard>
          }
        />
        <Route
          path="/patients"
          element={
            <AuthGuard>
              <Patients />
            </AuthGuard>
          }
        />
        <Route
          path="/create-patient"
          element={
            <AuthGuard>
              <CreatePatient />
            </AuthGuard>
          }
        />
        <Route
          path="/appointments"
          element={
            <AuthGuard>
              <Appointments />
            </AuthGuard>
          }
        />
        <Route
          path="/create-appointment"
          element={
            <AuthGuard>
              <CreateAppointment />
            </AuthGuard>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
