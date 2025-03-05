import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

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
 * @param {*} param0  
 */

const ProtectedLayout = ({ children }) => {
  const { isSignedIn } = useUser(); // Check the user is authenticated
  const {t} = useTranslation(); // Translation function


  return (
    <div>
      {/* Header section */}
      <Header /> 

      {/* Navigation menu - visible only when user is signed in */}
      {isSignedIn && (
        <nav className='nav-bar'>
          <ul className='nav-links'>
            <li><Link to='/'>{t("nav.home")}</Link></li>
            <li><Link to='/dashboard'>{t("nav.dashboard")}</Link></li>
            <li><Link to='/patients'>{t("nav.patients")}</Link></li>
            <li><Link to='/appointments'>{t("nav.appointments")}</Link></li>
            
          </ul>
        </nav>
      )}
      {/* Main Content */}
      <main>{children}</main>
      {/* Footer section */}
      <Footer/>
    </div>
  );
};

export default ProtectedLayout;
