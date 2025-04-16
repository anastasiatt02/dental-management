import React, { useState, useEffect } from 'react'; 
import supabase from '../supabaseClient';
import { useNavigate, useSearchParams } from 'react-router-dom'; // used for page navivation routes and to read query parameters (like time and date in pre-filled form)
import { useTranslation } from 'react-i18next';
import "../styles/createAppointment.css";

// this component allows users (at the moment the dentist) to create a new appointment
// it supports selecting a patient, a dentist, a procedure, a date and time, and adding any optional notes
// it also checks for appointment conflicts before saving a new appointment to the Supabase database

export default function CreateAppointment() {

    const navigate = useNavigate();
    const [searchParams] = useSearchParams(); // exact parameters from url
    const {t} = useTranslation(); // handle translations

    // prefilled date and time from calendar click
    const prefilledDate = searchParams.get("date");
    const prefilledTime = searchParams.get("time");
    

    // state form for patients
    const [searchQuery, setSearchQuery] = useState(""); // patient search input by doctor, empty 
    const [patientResults, setPatientResults] = useState([]); // loading indicator indicates when searching for patient name is in progress
    const [selectedPatient, setSelectedPatient] = useState(null) // fetch patient results from database, empty array
  
    // dentist selection and search
    const [dentistQuery, setDentistQuery] = useState("");
    const [dentistResults, setDentistResults] = useState([]);
    const [selectedDentist, setSelectedDentist] = useState(null);
  
    // search for a procedure queries
    const [procedureQuery, setProcedureQuery] = useState("");
    const [procedureResults, setProcedureResults] = useState([]);
    const [selectedProcedure, setSelectedProcedure] = useState(null);
  
    // date and hour of appointment
    const [appointmentDate, setAppointmentDate] = useState(prefilledDate || ""); // store selected date
    const [appointmentTime, setAppointmentTime] = useState(prefilledTime || ""); // store selected time
    const [appointmentDetails, setAppointmentDetails] = useState(""); // optioonally add appointmet notes
  

    // triggered whenever searchQuery changes - fetching matching patients data based on search input
    useEffect(() =>{
      const fetchPatients = async () => {  // check the search query has at least 2 characters 
        if(searchQuery.length <2) {
          setPatientResults([]); // show the results matching 2 characters inputed
          return;
        }
        
        try {
          // query 'users' table in SUpabase to find users with the 'patient' role, that their full_name field contains the entered text (case insensitive search)
          const {data, error} = await supabase 
          .from("users")
          .select("id, full_name")
          .ilike("full_name", `%${searchQuery}%`)
          .eq("role", "patient");
  
          if (error) throw error; //if the query encounters an error throw it
          setPatientResults(data); // if data returned with success, store the matching patients in state to show them in the list of patients
        } catch (error) {
          console.error(t("create-patient.fetch-error-patient"), error); // otherwise throw an error message in console
        } 
      };
  
      fetchPatients(); //call the async function to perform the fetch
    }, [searchQuery]); //runs whenever searchQuery changes
  
    const selectPatient = (patient) => { 
      setSelectedPatient(patient);
      setSearchQuery(patient.full_name);
      setPatientResults([]);
    } // when selecting a patients from the list of search, the search field is updated with the patients name
    // and clear the search results to remove the list of suggestions
  
  
    // fetching dentist data - it is run every time the user types in the dentist input field to search for a dentist
    // searches for matching dentists in the database while the user is typing
    useEffect(() =>{
      const fetchDentist = async () => {  // check the search query has at least 2 characters
        if(dentistQuery.length <2) {
          setDentistResults([]); // show the results matching 2 characters inputed
          return;
        }
        
        try {
          // query 'users' table in SUpabase to find users with the 'doctor' role, that their full_name field contains the entered text (case insensitive search)
          const {data, error} = await supabase 
          .from("users")
          .select("id, full_name")
          .ilike("full_name", `%${dentistQuery}%`)
          .eq("role", "doctor");
  
          if (error) throw error; //if the query encounters an error throw it
          setDentistResults(data); // if data returned with success, store the matching patients in state to show them in the list of dentists
        } catch (error) {
          console.error(t("create-patient.fetch-error-dentist"), error); // otherwise throw an error message in console
        }
      };
  
      fetchDentist(); //call the async function to perform the fetch
    }, [dentistQuery]);  //runs whenever dentistQuery changes
    
    const selectDentist = (dentist) => { 
      setSelectedDentist(dentist);
      setDentistQuery(dentist.full_name);
      setDentistResults([]);
    };

    // translated procedure - takes the procedure object and returns the translated procedure name
    const getTranslatedProcedure = (procedure) => {
      if (!procedure?.procedure_name) return "";
      return t(`procedures.${procedure.procedure_name}`);
    };
  
    // fetch procedures - it is run every time the user types in the procedure input field to search for a procedure 
    // searches for matching procedures in the database while the user is typing
    useEffect(() =>{
      const fetchProcedures = async () => {  // check the search query has at least 2 characters, oyherwise clear the search results
        if(procedureQuery.length <2) {
          setProcedureResults([]); //show the results matching 2 characters inputed
          return;
        }
  
        try {
          // query 'procedure' table in SUpabase to find procedures where the name contains the typed characters (case insensitive match)
          const {data, error} = await supabase 
          .from("procedure")
          .select("procedure_id, procedure_name");
          // .ilike("procedure_name", `%${procedureQuery}%`);
  
          if (error) throw error; //if the query encounters an error throw it
          setProcedureResults(data); // if data returned with success, store the matching procedures in state to show them in the list of procedures
        } catch (error) {
          console.error(t("create-patient.fetch-error-procedures"), error); // otherwise throw an error message in console
        }
      };
  
      fetchProcedures(); //call the async function to perform the fetch
    }, [procedureQuery]); // rerun if the user types
    
    // procedures based on search language - filter searched procedure based on the selected language
    const filterLanguage = procedureResults.filter((procedure) => {
      const translatedProcedure = getTranslatedProcedure(procedure).toLocaleLowerCase(); // get translated version of procedure name based on current chosen language
      return translatedProcedure.includes(procedureQuery.toLowerCase()); // check if user input exists inside the translated procedure names
    });

    const selectProcedure = (procedure) => { 
      setSelectedProcedure(procedure); // store the selected procedure in state
      setProcedureQuery(getTranslatedProcedure(procedure)); //replace the procedure search with the selected procedure
      setProcedureResults([]); // clear the list of procedure suggestions after the selection has been made
    };
  
    // submit the new appointment to the database
    const handleSubmit = async (e) => {
      e.preventDefault();

      // if not all required fields are filled, inform the user
      if (!selectedPatient || !selectedDentist || !selectedProcedure || !appointmentDate || !appointmentTime) {
        alert(t("create-patient.required-fields"));
        return;
      }
  
      // calculate appoitnment start and end time
      const formatedDateTime = `${appointmentDate}T${appointmentTime}`; // combine selected date and time into a full ISO timestamp yyyy.mm.dd hh.mm.ssz
      const startTime = new Date(formatedDateTime);
      const procedureDuration = selectedProcedure.duration_minutes || 30; // get duration of the selected procedure, 30 min if not specified
      const endTime = new Date(startTime.getTime() + procedureDuration * 60000); // calculate the end time of the appointment based on duration
  
      try {
        // get the existing appointments for the same dentist first and avoid double booking the dentist
        const {data: existingAppointments, error} = await supabase
            .from("appointments")
            .select("appointment_date, procedure(duration_minutes)")
            .eq("dentist_id", selectedDentist.id)
            .eq("status", "scheduled"); // check against scheduled appointments
  
        if (error) throw error;

        // check if there is any conflicting slots, do not book 2 same appointments within a booked slot
        const isConflicting = existingAppointments.some((appointment) => {
            const existingStartTime = new Date(appointment.appointment_date);
            const existingDuration = appointment.procedure?.duration_minutes || 30;
            const existingEndTime = new Date(existingStartTime.getTime() + existingDuration * 60000);

            return startTime < existingEndTime && endTime > existingStartTime; // check if new appointment overlaps with any existing appointment time
        });
        
        // alert the user if the time slot is already booked
        if (isConflicting) {
            alert(t("create-patient.already-booked-slot"));
            return;
        }

        //save the new appointment without conflicts in the database
        const { error: insertError } = await supabase.from("appointments")
             .insert([
            {
                patient_id:selectedPatient.id,
                dentist_id:selectedDentist.id,
                procedure_id:selectedProcedure.procedure_id,
                appointment_date: startTime.toISOString(),
                appointment_details: appointmentDetails || null,
                status: "scheduled", // default status for newly created appointments
            },
        ]);

        if (insertError) throw insertError;

        alert(t("create-patient.new-appointment-success")); // notify upon success
        navigate("/appointments"); // redirect to calendar

      } catch (error) {
        console.error(t("create-patient.error-saving-appointment"), error.message); // inform of any errors
        alert(t("create-patient.new-appointment-fail"));// alert if creation fails
      }
    };
  
  
    return (
      <div className='create-appointment'>
        
        {/* page title */}
        <h2>{t("create-appt.title")}</h2> 
        <form onSubmit={handleSubmit}>

          {/* Patient search - all appointment data will be submitted via this form*/}
          <label> 
              {t("patients.search")}:
              <input type="text" value={searchQuery} onChange= {(e) => setSearchQuery(e.target.value)} placeholder={t("create-appt.type-patient")} />
          </label>
          {/* patient suggestion dropdown */}
          <ul>
              {patientResults.map((patient) => (
              <li key={patient.id} onClick={() => selectPatient(patient)} style={{cursor: 'pointer', color: 'blue'}}> {patient.full_name}</li>
              ))}
          </ul>

          {/* dentist search field */}
          <label>
          {t("create-appt.dentist")}:
              <input type="text" value={dentistQuery} onChange= {(e) => setDentistQuery(e.target.value)} placeholder={t("create-appt.type-dentist")} />
          </label>
          {/* dentist suggestion dropdown */}
          <ul>
              {dentistResults.map((dentist) => (
              <li key={dentist.id} onClick={() => selectDentist(dentist)} style={{cursor: 'pointer', color: 'blue'}}> {dentist.full_name}</li>
              ))}
          </ul>

          {/* procedure search */}
          <label>
              {t("create-appt.procedure")}:
              <input type="text" value={procedureQuery} onChange= {(e) => setProcedureQuery(e.target.value)} placeholder={t("create-appt.type-procedure")} />
          </label>
          {/* procedure suggestion dropdown */}
          <ul>
              {filterLanguage.map((procedure) => (
              <li key={procedure.procedure_id} onClick={() => selectProcedure(procedure)} style={{cursor: 'pointer', color: 'blue'}}> {getTranslatedProcedure(procedure)}</li>
              ))}
          </ul>

          {/* Date and time */}
          {/* date */}
          <label>
              {t("create-appt.date")}:
              <input type="date" value={appointmentDate} onChange= {(e) => setAppointmentDate(e.target.value)} />
          </label>
          {/* time */}
          <label>
              {t("create-appt.time")}:
              <input type="time" value={appointmentTime} onChange= {(e) => setAppointmentTime(e.target.value)} />
          </label>

          {/* Appointment details */}
          <label>
              {t("create-appt.details")}: 
              <textarea value={appointmentDetails} onChange= {(e) => setAppointmentDetails(e.target.value)} placeholder={t("create-appt.type")}/>
          </label>
          
          {/* submit button */}
          <button type='submit'>{t("button.save-appt")}</button>

        </form>

        {/* cancel button */}
        <button className='cancel-button-new-appt' onClick={() => navigate("/appointments")}>{t("button.cancel")}</button>
    
      </div>
    
  );
}