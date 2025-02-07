import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";


const ProtectedLayout = ({ children }) => {
  const { isSignedIn } = useUser();


  return (
    <div>
      <Header />

      {isSignedIn && (
        <nav className='nav-bar'>
          <ul className='nav-links'>
            <li><Link to='/'>Home</Link></li>
            <li><Link to='/dashboard'>Dashboard</Link></li>
            <li><Link to='/patients'>Patients</Link></li>
            <li><Link to='/appointments'>Appointments</Link></li>
            
          </ul>
        </nav>
      )}
      {/* Main Content */}
      <main>{children}</main>
      <Footer/>
    </div>
  );
};

export default ProtectedLayout;
