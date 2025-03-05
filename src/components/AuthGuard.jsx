import React from 'react';
import { useUser, SignIn } from '@clerk/clerk-react';
import { Navigate, useLocation} from 'react-router-dom';
import ProtectedLayout from './ProtectedLayout';

// AuthGuard component -> acts as a wrapper to protect routes based on authentication and role-based access
// children -> the protected components that should only be accessible to authorised users
// allowedRoles -> an array of roles that are allowed to access the route, by default the doctor who can access anything
// returns component based on authentication and authorisation status

const AuthGuard = ({ children, allowedRoles = ["doctor"] }) => {
  // Retrieve authentication statur and user info from clerk
  const { isSignedIn, isLoaded, user} = useUser();
  const location = useLocation();

  // Wait until Clerk has fully loaded before rendering anything to user
  if (!isLoaded) return <div>Loading...</div>;

  // If not signed in, render the SignIn component to user
  if (!isSignedIn) {
    return (
      <div>
        <h2>You must be signed in to view this page</h2>
        <SignIn />
      </div>
    );
  }

  const userRole = user?.publicMetadata?.role; // Extract the user's role from Clerk's public metadata

  // At the moment, if the user's role is not in the allowedList rediret them back to their profile page
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to={`/patient-profile/${user.id}`} state={{from: location}} /> 
  }

  // If signed in, render the content with ProtectedLayout
  return <ProtectedLayout>{children}</ProtectedLayout>;
};

export default AuthGuard;
