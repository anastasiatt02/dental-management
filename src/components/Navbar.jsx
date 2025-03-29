import React from "react";
import { useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Navbar() {
    const {isSignedIn} = useUser();
    const {t, i18n} = useTranslation();

    return (
        <nav className='nav-bar'>
            <div className="nav-content">
                <div className="nav-left">
                  <ul className='nav-links'>
                  {isSignedIn && (
                    <>
                    <li><Link to='/'>{t("nav.home")}</Link></li>
                    <li><Link to='/patients'>{t("nav.patients")}</Link></li>
                    <li><Link to='/appointments'>{t("nav.appointments")}</Link></li>
                    </>
                  )}
                  </ul>
        
                </div>

                {/* Language switcher */}
                <div className="language-switcher">
                  <button onClick={() => i18n.changeLanguage('en')}>English</button>
                  <button onClick={() => i18n.changeLanguage('alb')}>Shqip</button>
                </div>
            </div>
        </nav>
    );
}

