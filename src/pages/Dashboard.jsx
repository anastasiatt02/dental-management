import {useEffect} from 'react';
import { useAuth } from '@clerk/clerk-react'; // for auth token management

/**
 * Dashboard component - this component was primarily used to test secure communication with 
 * a protected backend API using Clerk's JWT based authentication. 
 * It shows how to:
 *  - Retrieve a token from Clerk
 *  - Call a protected API route
 *  - Refresh the token if it has expired (handle 401 errors)
 * 
 */

export default function Dashboard() {

  /**
   * callMyApi is the function that shows:
   *  - How to fetch a Clerk-issued token with a custom template
   *  - Use the token to call protected backend API
   *  - Detect expired tokens and refresh them automatically 
   *
   */
  const callMyApi = async () => {
    const { getToken, sessionId } = useAuth(); // Clerk auth hook used to get the tokens and session ID

    try {
        // get the JWT token using the 'backend' template defined in Clerk dashboard
        let token = await getToken({ template: "backend" });

        // call protected backend API using the token
        let response = await fetch("http://localhost:3000/api/users", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`, // attach token in authorisation header
            },
        });

        // if token is invalid or expired, try to refresh for a new one
        if (response.status === 401) { // status code
            console.log("Token expired, refreshing...");

            // force Clerk to issue a new token (JWT)
            await clerkClient.sessions.revokeSession(sessionId);
            token = await getToken({ template: "backend" });

            // Retry the API call with new token
            response = await fetch("http://localhost:3000/api/users", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        }

        // parse and log the responce from the backend
        const data = await response.json();
        console.log("API Response:", data);
    } catch (error) {
        // lof any error that ocurred during fetch
        console.error("API Error:", error);
    }
};

    /**
     * the useEffect is run when the component is run, which triggeres the API call
     */
    useEffect(() => {
        callMyApi(); // run secure API call 
    }, [])  // empty dependency array to make sure this only runs once

}
