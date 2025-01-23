import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {

  const navigate = useNavigate();

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
