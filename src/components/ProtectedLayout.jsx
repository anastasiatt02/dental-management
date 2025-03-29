import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import Navbar from "./NavBar";

/**
 * ProtectedLayout component
 * 
 * The layout makes sure:
 * - a consistent structure across protected pages
 * - a header and footer for all pages
 * - a navigation menu only for signed-in users
 * - supports content transaltion
 * 
 * 
 */

const ProtectedLayout = ({ children }) => {
  const { isSignedIn } = useUser(); // Check the user is authenticated
  const {t} = useTranslation(); // Translation function


  return (
    <div>
      {/* Header section */}
      <Header /> 

      {/* Navbar */}
      <Navbar /> 

      {/* Main Content */}
      <main>{children}</main>
      
      {/* Footer section */}
      <Footer/>
    </div>
  );
};

export default ProtectedLayout;
