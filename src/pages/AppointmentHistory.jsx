import React, {useState, useEffect} from "react"; // React is the core librry to build UI, 
// useState is a react hook to store component state, 
// useEffect is a react hook that runs effects (fetching data)
import { useParams, useNavigate } from "react-router-dom"; // useParams gets the route parameter from the URL
// useNavigate allows for navigations to other pages in the system
import supabase from "../supabaseClient"; // The configured Supabase client to get queries or update the database
import { useTranslation } from 'react-i18next'; // Hook to manage translations
import "../styles/appointment-history.css"; // CSS styling file

/**
 * The AppointmentHistory displays detailed information about a specific dental appointment of a patient.
 * It includes the current appointment status, pre-booking notes and medical history records.
 * 
 * The autorised user (dentist) can:
 *    - view appointment details (patient, procedure to be done, appointment date, appointment status)
 *    - update appointment status (scheduled, completed, or cancel)
 *    - add new details about the appointment's history - dentist can add any notes important for the tooth,
 *      what has been done during the procedure, any materials or medications used during procedure
 *    - view a list of preiouslt completed records linked with that appointment
 */


export default function AppointmentHistory() {
  const {appointmentId} = useParams(); // get the AppointmentID from the URL
  const navigate = useNavigate(); // manage redirection 
  const [appointment, setAppointment] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [historyRecords, setHistoryRecords] = useState([]);
  const [status, setStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [procedureDetails, setProcedureDetails] = useState("");
  const [treatmentMaterials, setTreatmentMaterials] = useState("");
  // state variables for appointment status, loading state, existing appointment history, appointment status, form field to add new history
  const {t, i18n} = useTranslation(); 

  // fetchAppointmentDetails is run when the page first loads or the language changes, to get appointment details
  useEffect(() => {
    fetchAppointmentDetails();
  }, [i18n.language]);

  // Will load appointment deails from supabase based on appointmentId
  const fetchAppointmentDetails = async() => {
    setLoading(true);

    const {data, error} = await supabase
      .from("appointments")
      .select(`
        appointment_id, 
        appointment_date, 
        appointment_details, 
        status, 
        history, 
        patient:users!appointments_patient_id_fkey(id, full_name),
        procedure:procedure(procedure_name)
      `)
      .eq("appointment_id", appointmentId)
      .single();

    // if data is fetched from the supabase, store them in state and initialise histori and status
    if (error) {
      console.error(t("appointments.fetch-error"), error);
    } else {
      setAppointment(data);
      setHistoryRecords(data.history || []);
      setStatus(data.status); 
    }

    setLoading(false); // stop loading after getting the data
  };

  // return the procedure name in the correct selected language 
  const translateProcedure = () => {
    if (!appointment?.procedure) return "";

    return t(`procedures.${appointment.procedure.procedure_name}`) // simpler and cleaner translation
  };

  // change appointment status
  const statusChange = async(newStatus) => {
    setStatus(newStatus);  // this updates status locally to update the <select> element

   // send status update to supabase
    const {error} = await supabase
      .from("appointments")
      .update({status: newStatus})
      .eq("appointment_id", appointmentId);
    
    // alert the user upon success or failure
    if (error) {
      console.error(t("appointment-history.status-error"), error);
      alert(t("appointment-history.status-fail"));
    } else {
      alert (t("appointment-history.status-update"));

      if (newStatus === "canceled") { // if appointment is cancelled, redirect user to appointments page to view update on calendar
        navigate("/appointments");
      }
    }
  };

  // add new history about the appointment
  const addHistory = async() => {
    // cannot submit empty fields, therefore displays alert of rule is broken
    if (!notes && !fileUrl && !procedureDetails && !treatmentMaterials) {
      alert(t("appointment-history.fill-fields"));
      return;
    }

    // get what the current chosen language is
    const procedureName = translateProcedure();

    // build the new history entry for the procedure
    const newHistoryDetails = {
      procedure_name: procedureName,
      notes: notes || null,
      file_url: fileUrl || null,
      procedure_details: procedureDetails || null,
      treatment_materials: treatmentMaterials || null,
      recorded_at: new Date().toISOString(),
    };

    // add the new history details to the existing list of history
    const updatedHistory = [...historyRecords, newHistoryDetails];

    // now update the appointment history in supabase for the selcted appointmentId
    const {error} = await supabase
      .from("appointments")
      .update({history: updatedHistory})
      .eq("appointment_id", appointmentId);

    // inform the user if the action was a success or failed
    if (error) {
      console.error(t("appointment-history.history-error"), error);
      alert(t("appointment-history.details-error"));
    } else {
      // upon updating the appointment history in supabase, also clear form fields that were completed, and update the history for the doctor to see  
      alert(t("appointment-history.history-update"));
      setHistoryRecords(updatedHistory);
      setNotes("");
      setFileUrl("");
      setProcedureDetails("");
      setTreatmentMaterials("");
    }
  };

  return (
    <div className="appointment-history">
      <h1 className="section-header">{t("appointment-history.history-title")}</h1>

      {/* Conditional rendering - while the data is still loading, show a loading messasge. 
      Otherwise, if the appointment exists, show appointment details.
      If it doesn't exist, display a not found message*/}
      {loading ? (
        <p>{t("appointment-history.appointment-loading")}</p>
      ) : appointment ? (
        // display appointment detals
        <div className="appointment-details">
          <h2>{t("appointment-history.appointment-details")}</h2>
          <p>{t("appointment-history.appointment-patient")}
            <span onClick={() => navigate(`/patient-profile/${appointment.patient.id}`)}
              style={{cursor: 'pointer'}}>
              {appointment.patient.full_name} 
            </span>
          </p>
          <p>{t("appointment-history.appointment-procedure")}{translateProcedure()}</p>
          <p>{t("appointment-history.appointment-date")} {new Date(appointment.appointment_date).toLocaleDateString()}</p>
          <p>{t("appointment-history.appointment-pre-booking")} {appointment.appointment_details || t("appointment-history.no-details")}</p>
        
          {/* drop down menu to update the appoitnment status */}
          <div className="status-update">
            <label>{t("appointment-history.appointment-status")}</label>
            <select value={status} onChange={(e) => statusChange(e.target.value)}>
              <option value="scheduled">{t("appointment-history.scheduled")}</option>
              <option value="completed">{t("appointment-history.completed")}</option>
              <option value="canceled">{t("common.cancel")}</option>
            </select>
          </div>
        
          {/* input fields for user to add new history information */}
          <h2>{t("appointment-history.new-history-records")}</h2>
          <p>{t("appointment-history.appointment-procedure")} {translateProcedure()}</p> {/* user can see procedure in the selected language */}
          <input type="text" placeholder={t("appointment-history.file")} value={fileUrl} onChange={(e) => setFileUrl(e.target.value)}/>
          <textarea placeholder={t("appointment-history.procedure-details")} value={procedureDetails} onChange={(e) => setProcedureDetails(e.target.value)}/>
          <input type="text" placeholder={t("appointment-history.treatment-materials")} value={treatmentMaterials} onChange={(e) => setTreatmentMaterials(e.target.value)} />
          <button className="appt-history-button" onClick={addHistory}>{t("appointment-history.save-history")}</button>
        
          {/* display the information recorded about treatment history, and show a fallback message if no existing history was found */}
          <h2>{t("appointment-history.history-records")}</h2>
          {historyRecords.length > 0 ? (
            historyRecords.map((record, index) => (
              <div key={index} className="history-item">
                {/* <p>{t("appointment-history.appointment-procedure")} {record.procedure_name}</p> */}
                <p>{t("appointment-history.doctor-notes")}{record.notes || t("appointment-history.no-notes")}</p>
                {record.file_url && (
                  <p>
                    {t("appointment-history.file")}<strong><a href={record.file_url} target="_blank" rel="noopener noreferrer">{record.file_url}</a></strong>
                  </p>
                )}
                <p>{t("appointment-history.procedure-details")} {record.procedure_details || t("appointment-history.no-details")}</p>
                <p>{t("appointment-history.treatment-materials")} {record.treatment_materials || t("patient-profile.not-specified")}</p>
                <p><em>{t("appointment-history.recorded")} {new Date(record.recorded_at).toLocaleDateString()}</em></p>
              </div>
            ))
          ): (
            <p>{t("appointment-history.appointment-history-not-found")} </p>
          )}
        </div>
      ) : (
        <p>{t("appointment-history.appointment-not-found")}</p>
      )}

    </div>
  );
}




