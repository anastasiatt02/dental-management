import React from 'react'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'

export default function Header() {
  return (
    <header className='header'>
      <div className='header-content'>
        {/* Logo and clinic name */}
        <div className='logo-container'>
          <img src="/images/logo.png" alt="Clinic Logo" className='logo-img'/>
          <h1 className='clinic-name'>Saqellari Dental Clinic</h1>
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
