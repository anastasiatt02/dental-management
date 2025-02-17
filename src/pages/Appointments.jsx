import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import supabase from '../supabaseClient';



export default function Appointments() {

  const [isPopupOpen, setIsPopupOpen] = useState(false); //visibility of pop up window, intially invisible

  const togglePopup = () => { // hides or shows the pop up window when called 
    setIsPopupOpen(!isPopupOpen);
  };

  return (   // renders page name and create appointment button 
    <div className='appointments'>
      <h1>Appointments page</h1>  
      <button className='appointments-actions' onClick={togglePopup}> 
        Create appointment 
      </button>
      {isPopupOpen && <PopupWindow onClose={togglePopup} />} 
    </div>
  ); // if isPopUpOpen is true the pop up window is rendered and onClose the popup window can be closed 
}

function PopupWindow({ onClose }) {

  // state form for patients
  const [searchQuery, setSearchQuery] = useState(""); // patient search input by doctor, empty 
  const [patientResults, setPatientResults] = useState([]); // loading indicator indicates when searching for patient name is in progress
  const [selectedPatient, setSelectedPatient] = useState(null) // fetch patient results from database, empty array

  // dentist selection
  const [dentistQuery, setDentistQuery] = useState("");
  const [dentistResults, setDentistResults] = useState([]);
  const [selectedDentist, setSelectedDentist] = useState(null);

  // search for a procedure queries
  const [procedureQuery, setProcedureQuery] = useState("");
  const [procedureResults, setProcedureResults] = useState([]);
  const [selectedProcedure, setSelectedProcedure] = useState(null);

  // date and hour of appointment
  const [appointmentDate, setAppointmentDate] = useState(""); // store selected date
  const [appointmentTime, setAppointmentTime] = useState(""); // store selected time
  const [appointmentDetails, setAppointmentDetails] = useState(""); // optioonally add appointmet notes

  // triggered whenever searchQuery changes - fetching patients data
  useEffect(() =>{
    const fetchPatients = async () => {  // check the search query has at least 2 characters, oyherwise clear the search results
      if(searchQuery.length <2) {
        setSearchResults([]);
        return;
      }
      
      try {
        const {data, error} = await supabase 
        .from("users")
        .select("id, full_name")
        .ilike("full_name", `%${searchQuery}%`)
        .eq("role", "patient");

        if (error) throw error;
        setPatientResults(data);
      } catch (error) {
        console.error("Error fetching patients: ", error); // otherwise throw an error message in console
      } 
    };

    fetchPatients();
  }, [searchQuery]); //runs whenever searchQuery changes

  const selectPatient = (patient) => { 
    setSelectedPatient(patient);
    setSearchQuery(patient.full_name);
    setSearchResults([]);
  } // when selecting a patients from the list of search, the search field is updated with the patients name
  // and clear the search results to remove the list of suggestions


  // fetching dentist data
  useEffect(() =>{
    const fetchDentist = async () => {  // check the search query has at least 2 characters, oyherwise clear the search results
      if(dentistQuery.length <2) {
        setDentistResults([]);
        return;
      }
      
      try {
        const {data, error} = await supabase 
        .from("users")
        .select("id, full_name")
        .ilike("full_name", `%${dentistQuery}%`)
        .eq("role", "doctor");

        if (error) throw error;
        setDentistResults(data);
      } catch (error) {
        console.error("Error fetching dentists: ", error); // otherwise throw an error message in console
      }
    };

    fetchDentist();
  }, [dentistQuery]); 
  
  const selectDentist = (dentist) => { 
    setSelectedDentist(dentist);
    setDentistQuery(dentist.full_name);
    setDentistResults([]);
  };


  // fetch procedures 
  useEffect(() =>{
    const fetchProcedures = async () => {  // check the search query has at least 2 characters, oyherwise clear the search results
      if(procedureQuery.length <2) {
        setProcedureResults([]);
        return;
      }

      try {
        const {data, error} = await supabase 
        .from("procedure")
        .select("procedure_id, procedure_name")
        .ilike("procedure_name", `%${procedureQuery}%`);

        if (error) throw error;
        setProcedureResults(data);
      } catch (error) {
        console.error("Error fetching procedures: ", error); // otherwise throw an error message in console
      }
    };

    fetchProcedures();
  }, [procedureQuery]); 
  
  const selectProcedure = (procedure) => { 
    setSelectedProcedure(procedure);
    setProcedureQuery(procedure.procedure_name);
    setProcedureResults([]);
  };

  
  // submit the new appointment to the database
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formatedDateTime = `${appointmentDate} ${appointmentTime}:00Z`;
    const date = new Date(formatedDateTime).toISOString();

    try {
      const {error} = await supabase.from("appointments").insert([
        {
          patient_id:selectedPatient.id,
          dentist_id:selectedDentist.id,
          procedure_id:selectedProcedure.procedure_id,
          appointment_date:date,
          appointment_details: appointmentDetails || null,
          status: "scheduled",
        },
      ]);

      if (error) throw error;
      alert("Appointment successfully created!");
      onClose();
    } catch (error) {
      console.error("Error saving appointment: ", error.message);
      alert("Failed to create appointment.");
    }
  };


  return (
    <div className='popup'>
        <div className='popup-content'>
            <h2>Create appointment</h2>
            <form onSubmit={handleSubmit}>

              {/* Patient search */}
              <label> 
                Search patient:
                <input type="text" value={searchQuery} onChange= {(e) => setSearchQuery(e.target.value)} placeholder='Enter patient name' />
              </label>
              <ul>
                {patientResults.map((patient) => (
                  <li key={patient.id} onClick={() => selectPatient(patient)} style={{cursor: 'pointer', color: 'blue'}}> {patient.full_name}</li>
                ))}
              </ul>
              {selectedPatient && <p>Selected patient: {selectedPatient.full_name}</p>}

              {/* dentist search */}
              <label>
                Search for a dentist:
                <input type="text" value={dentistQuery} onChange= {(e) => setDentistQuery(e.target.value)} placeholder='Enter dentist name' />
              </label>
              <ul>
                {dentistResults.map((dentist) => (
                  <li key={dentist.id} onClick={() => selectDentist(dentist)} style={{cursor: 'pointer', color: 'blue'}}> {dentist.full_name}</li>
                ))}
              </ul>
              {selectedDentist && <p>Selected dentist: {selectedDentist.full_name}</p>}

              {/* procedure search */}
              <label>
                Search procedure:
                <input type="text" value={procedureQuery} onChange= {(e) => setProcedureQuery(e.target.value)} placeholder='Enter procedure name' />
              </label>
              <ul>
                {procedureResults.map((procedure) => (
                  <li key={procedure.procedure_id} onClick={() => selectProcedure(procedure)} style={{cursor: 'pointer', color: 'blue'}}> {procedure.procedure_name}</li>
                ))}
              </ul>
              {/* {selectProcedure && <p>Selected procedure: {selectedProcedure.procedure_name}</p>} */}

              {/* Date and time */}
              <label>
                Select appointment date:
                <input type="date" value={appointmentDate} onChange= {(e) => setAppointmentDate(e.target.value)} />
              </label>
              <label>
                Select appointment time:
                <input type="time" value={appointmentTime} onChange= {(e) => setAppointmentTime(e.target.value)} />
              </label>

              {/* Appointment details */}
              <label>
                Enter any details regarding the appointment: 
                <textarea value={appointmentDetails} onChange= {(e) => setAppointmentDetails(e.target.value)} placeholder='Enter any notes..'/>
              </label>
              
              <button type='submit'>Save appointment</button>

            </form>
            <button onClick={onClose}>Cancel</button>
            
        </div>
    </div>
  );
}