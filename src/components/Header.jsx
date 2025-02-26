import React from 'react'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'
// import '../styles/header.css';
import { useTranslation } from 'react-i18next';

export default function Header() {
  const {i18n} = useTranslation();
  const {t} = useTranslation();



  return (
    <header className='header'>
      <div className='header-content'>
        {/* Logo and clinic name */}
        <div className='logo-container'>
          <img src="/images/logo.png" alt="Clinic Logo" className='logo-img'/>
          <h1 className='clinic-name'>{t('header.clinic-name')}</h1>
        </div>

        <div>
          <button onClick={() => i18n.changeLanguage('en')}>English</button>
          <button onClick={() => i18n.changeLanguage('alb')}>Shqip</button>
        </div>

        <nav className='navbar'>
          <SignedOut>
            <SignInButton className='auth-button' />
          </SignedOut>
          <SignedIn>
            <UserButton className='auth-button' />
          </SignedIn>
        </nav>
      </div>
    </header>
  )
}
