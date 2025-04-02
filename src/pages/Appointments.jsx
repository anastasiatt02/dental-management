import React, { useState, useEffect } from 'react';
import supabase from '../supabaseClient'; // Supabase client to interact with the database
import FullCalendar from '@fullcalendar/react'; // fullCalendar component for appointment's calendar
import dayGridPlugin from '@fullcalendar/daygrid'; // package to show month view of appointment
import timeGridPlugin from '@fullcalendar/timegrid'; // to show the time slots on calendar
import interactionPlugin from'@fullcalendar/interaction'; // for interactivity in the calendar (- needed for dragging and clicking)
import { useNavigate } from 'react-router-dom'; // for page navigation
import { useTranslation } from 'react-i18next'; // multi-language support

import '../styles/appointments.css';


export default function Appointments() {
  const navigate = useNavigate(); // routing to other pages
  const [appointmentSlot, setAppointmentSlot] = useState([]); // will keep formated appointment data for the calendar
  const [rightClickMenu, setContextMenu] = useState(null); // rightClickMenu - used for visibility and position
  const [selectedAppointment, setSelectedAppointment] = useState(null);// stored appointment that needs to be modified
  const [modifyPanel, setmodifyPanel] = useState(false); // modify pop up panel - visibility
  const [newDate, setNewDate] = useState(''); // new date for modified appointments
  const [newTime, setNewTime] = useState('');// new time for modified appointments
  const {t, i18n} = useTranslation();//i18n functions for translation

  /* 
  *  useEffect hook responsible for fetching all the appoitnments data stored in the Supabase database 
  *  whenever the component is being accessed.
  *  fetchAppointments, an asynchronous function, queries the appointments table and joins related data
  *  from users table (to get the users full name based on the user id used in appointments table) and procedure table
  *  (to get the procedure's name based on the procedure id stored in appointments table). 
  *  After fetching the data from database, appointments are formated ready to be added in slots into the fullCalendar.
  *  Each slot contains the start and end time, procedure name and patient name.
  *  setAppointmentSlot stores the list of appointments that are to be added into the calendar.
  *  Error messages are in place if anything does not go as planned.
  *  All UI components are transalted. 
  */
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data, error } = await supabase
          .from("appointments")
          .select(`
            appointment_id, 
            appointment_date, 
            status,
            patient:users!appointments_patient_id_fkey(full_name),
            procedure:procedure(procedure_name, duration_minutes)
          `)
  
        if (error) throw error;

        const formattedAppointments = data.map((appointment) => {
          let translatedProcedureName = t(`procedures.${appointment.procedure.procedure_name}`); //translates procedures

          // appointments are transformed into a format that FullCalendar can display. 
          // Creates a slot with title and patient full name, calculates the end time based on duration saved in database and the selected start time
          // Completed appointments are displayed in grey colour, canceled in red and default are blue
          // makes use of extendedProps to store data for later use (navigation when clicking on appointment slot or righ-clicking actions)
          return {
          appointment_id: appointment.appointment_id,
          title: `${translatedProcedureName} - ${appointment.patient.full_name}`,
          start: appointment.appointment_date,
          end: new Date(new Date(appointment.appointment_date).getTime() + appointment.procedure.duration_minutes * 60000),
          backgroundColor: 
            appointment.status === "completed" ? "#689d19" :  // Gray for completed appointments
            appointment.status === "canceled" ? "#ff4d4d" : "#00aee8",
          extendedProps: {
            patient: appointment.patient,
            procedure: appointment.procedure,
            status: appointment.status
          }
        }});
  
        setAppointmentSlot(formattedAppointments); // update component's state with formated appointment list
      } catch (error) {
        console.error(t("appointments.fetch-error"), error.message); // inform of any errors
      }
    };
  
    fetchAppointments(); // run the function
  }, [i18n.language]); // this will tell useEffect to re-run, re-fetch, re-transalte when language is switched
  
  // when the user clicks on the appointment slot on the calendar, grabs the appointment id that is stored in extendedProps,
  // and uses it to navigate to that appointment history page to complete during the procedure
  const handleEventClick = (clickInfo) => {
    const appointmentId = clickInfo.event.extendedProps.appointment_id;
    navigate(`/appointment-history/${appointmentId}`);
  };

  // function to handle appointment rescheduling by drag and drop on the calendar
  // this action cannot be undone once it is commited, so it double checks the user they are fully sure to move
  const handleEventDrop = async (info) => {
    const confirmReschedule = window.confirm(t("appointments.confirm-reschedule")); 

    // in case the user is not happy to move the schedule, it will take the changes back to the original state
    if (!confirmReschedule) {
      info.revert();
      return;
    }


    //when the user confirms they are happy to move the slot to another time, it stores the time and/or date 
    // from the dropped event and updates these changes in the Supabase appointments table based on appointment id
    try {
      const updatedDateTime = info.event.start.toISOString();
      const { error } = await supabase
        .from('appointments')
        .update({ appointment_date: updatedDateTime })
        .eq('appointment_id', info.event.extendedProps.appointment_id);

      if (error) throw error;

    } catch (error) {
      console.error(t("appointments.error-reschedule"), error.message); // inform if anything goes not as planned
    }
  };

  // right-clicking on an appointment on the calendar will show a custom menu with modify and cancel options
  const handleRightClick = (e, info) => {
    e.preventDefault(); // disable the default right click menu to activate the desired one
    setSelectedAppointment(info.event); // store the current appointment 
    // extract the time and date from the appointment and store them to be prefilled when modifying, so user knows what to change from
    setNewDate(info.event.startStr.split('T')[0]); 
    setNewTime(info.event.startStr.split('T')[1].substring(0, 5));
    // open the right-click menu exactly in the position that it was clicked on the screen
    setContextMenu({ 
      mouseX: e.pageX, // pageX & Y instead of clientX, Y for precise positioning on the page
      mouseY: e.pageY,
    });
  };
 
  // use esc button to close the context-menu when right clicking on appointment but 
  // doesn't want to take any of the two possible actions
  useEffect(() => {
    // handle any key presses, if it is ESC then close
    const escape = (e) => {
      if (e.key === "Escape") handleClose();
    };

    // listen for any keydown
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape); // cleanup function when the component is not called anymore
  }, []);  

  // function to close the context menu by reseting the state
  const handleClose = () => {
    setContextMenu(null);
  };

  // function will open the modify appointment pop up
  const modifyAppointment = () => {
    setmodifyPanel(true); // show the pop up
    handleClose(); // close context menu after pop up is open
  };

  // function activated once the user modifies the appointment with a new date and/or time and clicks "Save"
  // new datetime is saved from the input, prepared and updated in the database.
  // automatically closes the edit popup after successful update
  const saveModifiedAppointment = async () => {
    try {
      const updatedDateTime = new Date(`${newDate}T${newTime}:00`).toISOString(); // date and time combined in one full date as saved in the database

      const { error } = await supabase
        .from('appointments')
        .update({ appointment_date: updatedDateTime })
        .eq('appointment_id', selectedAppointment.extendedProps.appointment_id); // make sure only the selected appointment id is updated nothing else

      // if (error) throw error; // inform if anything unexpected happens

      alert(t("appointments.success-update")); // inform upon successful update
      setmodifyPanel(false); // close modifying pop up
    } catch (error) {
      console.error(t("appointments.error-update"), error.message); // inform if any error
    }
  };

  // function called when the user chooses to cancel appointment from the context menu
  // it will first ask the user to confirm they want to cancel
  // upon confirmation, a request is sent to Supabase to change the status of the appointment using appointment id
  // once updated successfully, the calendar is also updated to reflect the change showing a red slot for canceled appointments.
  const cancelAppointment = async () => {
    // the user is checked again if they are sure they want to cancel which they need to confirm
    const confirmCancel = window.confirm(t("appointments.confirm-cancel"));
    // once happy to proceed, a request is sent to Supabase to update the status of the appointment using the appoitnment id, and sets it as cancelled
    if (confirmCancel) {
      try {
        const { error } = await supabase
          .from("appointments")
          .update({ status: "canceled" })
          .eq("appointment_id", selectedAppointment.extendedProps.appointment_id);

        if (error) throw error;

        // loop through all previously saved appointments 
        setAppointmentSlot((prevAppointments) =>
          prevAppointments.map((event) => { //map the one we want to change  
            if (event.appointment_id === selectedAppointment.extendedProps.appointment_id) { // select that appointment if it has a matching appointment id
              return {
                ...event, // copy all properties of the current appointment object into a new object and only change the selected specific parts
                backgroundColor: "#ff4d4d",  // background colour of clot in red
                extendedProps: { // from extended props do not chnage anything but the status only
                  ...event.extendedProps,
                  status: "canceled",
                },
              };
            }
            return event; //if no match of appointment id, do not make any change
          })
        );
        alert(t("appointments.success-cancel")); // inform upon cancelling success
      } catch (error) {
        console.error(t("appointments.error-cancel"), error.message); // inform of any erros
      }
    }
    handleClose(); // close the context menu
  };

  // when the user clicks on an empty time slot on the calendar that time and the date are stored, formated and 
  // the user is redirected to the appointment creation page with that information already filled on the form
  const handleDateClick = (info) => {
    const selectedDateTime = new Date(info.date);
    const formatedDate = selectedDateTime.toISOString().split("T")[0]; // extract only the date (yyyy-mm-dd) from the full ISO string
    const formatedTime = selectedDateTime.toTimeString().split(" ")[0].substring(0, 5); // extract the time (hh:mm) from the string eg "14:30:00 GMT+0000"

    navigate(`/create-appointment?date=${formatedDate}&time=${formatedTime}`); // take the user to book the new appointment
  };

  return (
    <div className='appointments-page'>
      <div className='appointments-header'>
        <h1>{t("appointments.title")}</h1>
        {/* button to navigate to create appointment page */}
        <button className='new-appointment-button' onClick={() => navigate("/create-appointment")}>{t("button.new-appointment")}</button> 
      </div>

      {/*  */}
      <div className='calendar-container'>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]} // month view, week/ day time slots, allow dragging, clicking, right-clicking with interaction
          initialView="timeGridWeek"
          editable={true} // allow drag and drop
          droppable={false} 
          eventDrop={handleEventDrop}
          longPressDelay={100}
          eventDurationEditable={true}
          headerToolbar={{ // calendar's top navigation toolbar contents
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          
          // all day row - translation
          allDayText={t("fullcalendar.all-day")} 

          // translate the display buttons for calendar, choose how to display the appointments
          buttonText={{
            prev: t("fullcalendar.previous"),
            next: t("fullcalendar.next"),
            today: t("fullcalendar.today"),
            month: t("fullcalendar.month"),
            week: t("fullcalendar.week"),
            day: t("fullcalendar.day")
          }}

          // transalte weekdays
          dayHeaderContent={(args) => {
            const date = args.date;
            const formattedDate = `${date.getDate()}/${date.getMonth() + 1}`; // to get the date format dd/mm
            return `${t(`fullcalendar.weekdays.${args.date.getDay()}`)} ${formattedDate}`;
            }
          }

          // transalting months in calendar title
          titleFormat={(date) => {
            const month = date.date.month;
            const year = date.date.year;
            return `${t(`fullcalendar.months.${month}`)} ${year}`;
          }}
          
          // only show calendar for the working hours
          slotMinTime="08:00:00"
          slotMaxTime="21:00:00"
          height="100%"
          contentHeight="auto"
          events={appointmentSlot} // loads events from appointmentSlot state
          eventClick={handleEventClick} // allows to click on appointment slot
          eventDidMount={(info) => { // adds the right-click for context menu
            info.el.addEventListener("contextmenu", (e) => handleRightClick(e, info));
          }}
          dateClick={handleDateClick} // allows to click on empty slots to book appointment
        />
        </div> 

      {/* right click on appointment shown on calendar to modify or cancel the appointment */}
      {rightClickMenu && (
        <div className="context-menu" style={{ top: rightClickMenu.mouseY, left: rightClickMenu.mouseX }}>
          <button onClick={modifyAppointment}>{t("appointments.modify-appt")}</button>
          <button onClick={cancelAppointment}>{t("appointments.cancel-appt")}</button>
        </div>
      )}

      {/* pop up panel to modify the time or date for the appointment*/}
      {modifyPanel && (
        <div className='pop-up'>
          <div className="panel">
            <h3>{t("appointments.modify-appt")}</h3>
            <input type='date' value={newDate} onChange={(e) => setNewDate(e.target.value)} />
            <input type='time' value={newTime} onChange={(e) => setNewTime(e.target.value)} />
            <button onClick={saveModifiedAppointment}>{t("common.save")}</button>
            <button onClick={() => setmodifyPanel(false)}>{t("common.cancel")}</button>
          </div>
        </div>
      )}
    </div>
  );
}

