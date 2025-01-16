import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {



  const handleCreateAppointment = () => {
    navigate("/create-appointment");
  };

  return (
    <div className='dashboard'>
      <h1>Dashboard</h1>
      <div className='dashboard-actions'>
        <button className='action-button-d' onClick={handleCreateAppointment}>Create appointment</button>
      </div>
    </div>
  )
}
