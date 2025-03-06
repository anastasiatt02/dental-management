import React from "react";
import { useNavigate } from "react-router-dom";
import '../styles/sidebar.css';

const Sidebar = () => {
    const navigate = useNavigate();

    return (
        <div className="sidebar">
            {/* <h2 className="sidebar-title">Clinic manager</h2> */}
            <button className="sidebar-button" onClick={() => navigate("/")}>Home</button>
            <button className="sidebar-button" onClick={() => navigate("/dashboard")}>Dashboard</button>
            <button className="sidebar-button" onClick={() => navigate("/patients")}>Patients</button>
            <button className="sidebar-button" onClick={() => navigate("/appointments")}>Appointments</button>
            
        </div>
    );
};

export default Sidebar;



