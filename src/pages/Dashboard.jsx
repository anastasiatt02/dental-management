import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';


export default function Dashboard() {

  const navigate = useNavigate();
  const { isSignedIn } = useUser(); //check the user has been authenticated

  // direct to login if user not signed in

  const goToPatients = () => {
    navigate('/patients');
  }

  const goToAppointments = () => {
    navigate('/appointments');
  }  

  return (
    <div className='dashboard'>
      <h1>Dashboard</h1>
      <div className='dashboard-actions'>
        <button className='action-button-d' onClick={goToPatients}> Patients </button>
        <button className='action-button-d' onClick={goToAppointments}> Appointments </button>
      </div>
    </div>
  )
}
