import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AuthGuard from "./components/AuthGuard";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";

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
      </Routes>
    </Router>
  );
}

export default App;
