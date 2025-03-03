import React, { useState, useEffect } from 'react';
// import { useForm } from "react-hook-form";
import supabase from '../supabaseClient';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from'@fullcalendar/interaction';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';


export default function Appointments() {

  const navigate = useNavigate()
  const [appointmentSlot, setAppointmentSlot] = useState([]); //will deal with the clots needed for the calendar
  const [selectedAppointment, setSelectedAppointment] = useState(null); // to store chosen appointment for editing
  

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
      };

      // console.log("fetched appointments data: ", data); //

      // prepare data for FullCalendar format to add on calendar
      const formatedAppointments = data.map((appointment) => ({
        appointment_id: appointment.appointment_id,
        title: `${appointment.procedure.procedure_name} - ${appointment.patient.full_name}`,
        start: appointment.appointment_date,
        end: new Date(new Date(appointment.appointment_date).getTime() + appointment.procedure.duration_minutes * 60000),
        backgroundColor: getColourByProcedureType(appointment.procedure.procedure_name),
        extendedProps: {
          patient: appointment.patient,
          dentist: appointment.dentist,
          procedure: appointment.procedure
        }
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

    const appointmentId = clickInfo.event.extendedProps.appointment_id;

    // Modify appointments on calendar
    const action = window.confirm(
      `Do you want to modify this appointment?"${clickInfo.event.title}"?`
    );

    if (action) {
      setSelectedAppointment({
        appointment_id: appointmentId,
        patient: clickInfo.event.extendedProps.patient,
        dentist: clickInfo.event.extendedProps.dentist,
        procedure: clickInfo.event.extendedProps.procedure,
        appointment_date: clickInfo.event.start.toISOString().split('T')[0],
        appointment_time: clickInfo.event.start.toTimeString().split(' ')[0].substring(0, 5)
      });
    } else {
      handleCancelAppointment(appointmentId);
    }

  };

  // cancel appointment
  const handleCancelAppointment = async (appointmentId) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this appointment?");

    if (confirmCancel) {
      try {

        const { error } = await supabase
          .from("appointments")
          .update({status: "canceled"}) // change status to cancelled for the event
          .eq("appointment_id", appointmentId);

        if (error) throw error;

        // remove event from calendar
        setAppointmentSlot((prevAppointments) => prevAppointments.filter((event) => event.appointment_id !== appointmentId));
        alert("Appointment cancelled successfully.");
      } catch (error) {
        console.error("Error canceling appointment", error.message);
      }
    }
  }

  return (   
    <div className='appointments-page'>
      {/* <Sidebar/> */}

      <div className='appointments-container'>
      <div className='appointments-header'>
        <h1>Appointments page</h1>  
        <button className='appointments-actions' onClick={() => navigate("/create-appointment")}> 
          Create appointment 
        </button>
      </div>
      

      {/* Calendar component */}
      <div className='calendar-container'>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar = {{
            left: "prev, next today",
            center: "title",
            right: "dayGridMonth, timeGridWeek, timeGridDay",
          }}
          slotMinTime="08:00:00" // start calendar dispaly at 8am
          slotMaxTime="21:00:00" // end calendar dispaly time at 9pm
          height="100%"
          contentHeight="auto"
          events={appointmentSlot}
          eventClick={handleEventClick}
        />
      </div>
      </div>

      {/* modify appointment */}
      {selectedAppointment && (
        <ModifyAppointment
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          onSave={(updatedData) => {
            setAppointmentSlot((previewAppointments) => 
              previewAppointments.map((event) => 
                event.appointment_id === updatedData.appointment_id ? updatedData : event
              )
            );
            setSelectedAppointment(null);
          }}
        
        />
      )}

    </div>
  ); 
}

// // modify appointment 
// function ModifyAppointment({appointment, onClose, onSave}) {
//   const [newDate, setNewDate] = useState(appointment.appointment_date);
//   const [newTime, setNewTime] = useState(appointment.appointment_date);
// }
