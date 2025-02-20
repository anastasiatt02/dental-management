import React, { useState, useEffect } from 'react';
// import { useForm } from "react-hook-form";
import supabase from '../supabaseClient';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from'@fullcalendar/interaction';
import { useNavigate } from 'react-router-dom';


export default function Appointments() {

  const navigate = useNavigate()
  const [isPopupOpen, setIsPopupOpen] = useState(false); //visibility of pop up window, intially invisible
  const [appointmentSlot, setAppointmentSlot] = useState([]); //will deal with the clots needed for the calendar

  const togglePopup = () => { // hides or shows the pop up window when called 
    setIsPopupOpen(!isPopupOpen);
  };

  // fetch appointments from supabase
  useEffect(() => {
    const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase 
        .from('appointments')
        .select('appointment_id, appointment_date, patient:users!appointments_patient_id_fkey(id, full_name), dentist:users!appointments_dentist_id_fkey(id, full_name), procedure(procedure_id, procedure_name, duration_minutes)')
        .eq('status', 'scheduled');

      if (error) throw error;

      // assign colours for procedures 
      const getColourByProcedureType = (type) => {
        switch (type.toLowerCase()) {
          case 'emergency': return '#FF0000'; // red for emergencies to stand out
          case 'check-up': return '#80cb0f'; // green for check-up
          default: return '#00aee8'; // blue as default - for the rest of the procedures
        }
      }

      // console.log("fetched appointments data: ", data); //

      // prepare data for FullCalendar format to add on calendar
      const formatedAppointments = data.map((appointment) => ({
        appointment_id: appointment.appointment_id,
        title: `${appointment.procedure.procedure_name} - ${appointment.patient.full_name}`,
        start: appointment.appointment_date,
        end: new Date(new Date(appointment.appointment_date).getTime() + appointment.procedure.duration_minutes * 60000),
        backgroundColor: getColourByProcedureType(appointment.procedure.procedure_name),
      }));

      setAppointmentSlot(formatedAppointments);
    } catch (error) {
      console.error("Error fetching appointments: ", error.message);
    }
  };
  fetchAppointments();
}, []);

  // deal with clicking and canceling event from calendar dicplay
  const handleEventClick = async (clickInfo) => {
    const confirmCancel = window.confirm(
      `Do you want to cancel this appointment "${clickInfo.event.title}"?`
    );

    if (confirmCancel) {
      try {
        const appointmentId = clickInfo.event.extendedProps.appointment_id;

        const { error } = await supabase
          .from("appointments")
          .update({status: "canceled"}) // change status to cancelled for the event
          .eq("appointment_id", appointmentId);

        if (error) throw error;

        // remove event from calendar
        setAppointmentSlot((prevAppointments) => 
          prevAppointments.filter((event) => event.appointment_id !== appointmentId)
        );

        alert("Appointment cancelled successfully.");
      } catch (error) {
        console.error("Error canceling appointment", error.message);
      }
    }
  };

  return (   // renders page name and create appointment button 
    <div className='appointments'>
      <h1>Appointments page</h1>  
      <button className='appointments-actions' onClick={() => navigate("/create-appointment")}> 
        Create appointment 
      </button>

      {/* Calendar component */}
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar = {{
          left: "prev, next today",
          center: "title",
          right: "dayGridMonth, timeGridWeek, timeGridDay",
        }}
        events={appointmentSlot}
        eventClick={handleEventClick}
      />

    </div>
  ); // if isPopUpOpen is true the pop up window is rendered and onClose the popup window can be closed 
}


