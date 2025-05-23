import React from 'react'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'
import '../styles/header.css';
import { useTranslation } from 'react-i18next';

/**
 * Header component
 * Displays clinic's logo, name, language switcher and authentication button.
 * Uses Clerk for authentication and i18next for language transaltion
 */

export default function Header() {
  // Access translation functions from i18next
  const { t} = useTranslation();



  //
  return (
    // Header container
    <header className='header'>
      <div className='header-content'>
        {/* Logo and clinic name */}
        <div className='logo-container'>
          <img src={`${import.meta.env.BASE_URL}images/logo.png`} alt="Clinic Logo" className='logo-img'/>
          <h1 className='clinic-name'>{t('header.clinic-name')}</h1>
          {/* Retrieves transalted clinic name from localisation files */}
        </div>

        {/* Authentication section */}
        <nav className='navbar'>
          <SignedOut>
            {/* Display sign-in button when user is signed out */}
            <SignInButton>
              <span className='auth-button'>{t("button.sign-in")}</span>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            {/* Display button of profile when user is signed in */}
            <UserButton className='auth-button' redirectUrl="/dental-management/"/>
          </SignedIn>
        </nav>
      </div>
    </header>
  )
}
