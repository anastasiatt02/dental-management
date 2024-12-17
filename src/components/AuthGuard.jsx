import React from 'react';
import { useUser, SignIn } from '@clerk/clerk-react';
import ProtectedLayout from './ProtectedLayout';

const AuthGuard = ({ children }) => {
  const { isSignedIn, isLoaded } = useUser();

  // Wait until Clerk has fully loaded
  if (!isLoaded) return <div>Loading...</div>;

  // If not signed in, render the SignIn component
  if (!isSignedIn) {
    return (
      <div>
        <h2>You must be signed in to view this page</h2>
        <SignIn />
      </div>
    );
  }

  // If signed in, render the content with ProtectedLayout
  return <ProtectedLayout>{children}</ProtectedLayout>;
};

export default AuthGuard;
