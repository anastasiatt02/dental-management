import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Navbar from "./NavBar";

/**
 * ProtectedLayout component
 * 
 * The layout makes sure:
 * - a consistent structure across protected pages
 * - a header and footer for all pages
 * - a navigation menu visible only for signed-in users
 * - supports content transaltion
 * 
 */

const ProtectedLayout = ({ children }) => {
  return (
    <div className="layout-wrapper">
      {/* Header section */}
      <Header /> 

      {/* Navbar */}
      <Navbar /> 

      {/* Main Content */}
      <main className="layout-main">{children}</main>
      
      {/* Footer section */}
      <Footer/>
    </div>
  );
};

export default ProtectedLayout;
