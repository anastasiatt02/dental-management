import { useEffect, useState } from "react"; // core React hooks for component behavior
import { useParams, useNavigate } from "react-router-dom"; // routing tools to access the patient id and for page navigation
import supabase from '../supabaseClient'; // Supabase client to interact with the database
import { useTranslation } from 'react-i18next'; // multi-language support
import '../styles/patientProfile.css'; // css styling for Patient Profile page

/**
 * patient profile page allows dentists to view, edit and manage a specific patient's full profile
 * their medical history and appointment records (with present, future and past appointments)
 * 
 */

export default function PatientProfile() {
    const {id} = useParams(); // get patient id from the URL
    const [patient, setPatient] = useState(null); // store fetched patient info
    const [loading, setLoading] = useState(true); // to show a loading message while data is being fetched from database
    const [error, setError] = useState(""); // any error message during data fetch
    const [appointments, setAppointments] = useState([]); // all fetched appointments to be categorised
    const [deleting, setDeleting] = useState(false); // if delete is in progress
    const [isEditing, setIsEditing] = useState(false); // show or hide the edit form
    const [formData, setFormData] = useState({ // input values while editing patient info
        email: "",
        phone_number: "",
        emergency_name: "",
        emergency_contact: "",
        health_history: {
            medical_condition: "",
            allergies: "",
            medications: "",
        }
    });
    const navigate = useNavigate(); // routing to other pages
    const {t} = useTranslation(); // set up translation

    // format date in form dd.mm.yyyy from yyyy-mm-dd
    const formatDate = (dateString) => {
        if (!dateString) return t("patient-profile.missing");
        const [year, month, day] = dateString.split("-"); // destructure year, month, day from date string
        return `${day}.${month}.${year}`; // and return the formated string
    }

    // format date and time from database 
    const formatDateTime = (timestamp) => {
        // if the timestamp is missing then give the missing labels
        if (!timestamp) return { date: t("patient-profile.missing"), time: t("patient-profile.missing")};

        const dateObject = new Date(timestamp); // convert timestamp into JS Date object
        const day = String(dateObject.getDate()).padStart(2, "0"); 
        const month = String(dateObject.getMonth() + 1).padStart(2, "0");
        const year = dateObject.getFullYear();
        const hours = String(dateObject.getHours()).padStart(2, "0");
        const minutes = String(dateObject.getMinutes()).padStart(2, "0");

        // date and time strings
        return {
            date: `${day}.${month}.${year}`,
            time: `${hours}:${minutes}`
        };
    };

    // fetch patient data and their appointments from Supabase when component loads
    useEffect(() => {
        // fetch patient data 
        const fetchPatientData = async() => {
            setLoading(true);
            try {
                // get patient by id
                const {data: patientData, patientError} = await supabase
                    .from("users")
                    .select("*")
                    .eq("id", id)
                    .single(); // exactly one patient is expected
                
                if (patientError) throw patientError; // if any error occurs, show error
                setPatient(patientData); //save patient data in state

                // fetch from database appointments for this selected patient
                const {data: appointmentData, error: appointmentError} = await supabase
                    .from("appointments")
                    .select(`appointment_id, appointment_date, status, procedure_id, procedure(procedure_name)`)
                    .eq("patient_id", id)
                    .order("appointment_date", { ascending: true});

                if (appointmentError) throw appointmentError; // if any error occurs, show error
                
                //create a category for appointments: past, today, upcoming
                const today = new Date().setHours(0, 0, 0, 0); // today's date
                
                // arrays to store appointment in categories
                const pastAppointments = [];
                const todayAppointments = [];
                const upcomingAppointments = [];

                // check every appointments date
                appointmentData.forEach((appointment) => {
                    const appointmentDate = new Date(appointment.appointment_date).setHours(0, 0, 0, 0);

                    // if appointment was canceled, treat it as a past appoitnment
                    if (appointment.status === "canceled") {
                        pastAppointments.push(appointment);
                        return;
                    }

                    // sort into past, today, or upcoming
                    if (appointmentDate < today) {
                        pastAppointments.push(appointment);
                    } else if (appointmentDate === today) {
                        todayAppointments.push(appointment);
                    } else {
                        upcomingAppointments.push(appointment);
                    }
                });

                // save all categorized appointments in state
                setAppointments({
                    past: pastAppointments.reverse(), //most recent one first
                    today: todayAppointments,
                    upcoming: upcomingAppointments,
                });

                // pre-fill form data for editing
                setFormData({
                    email: patientData.email || "",
                    phone_number: patientData.phone_number || "",
                    emergency_name: patientData.emergency_name || "",
                    emergency_contact: patientData.emergency_contact || "",
                    health_history: patientData.health_history?.[0] || {
                        medical_condition: "",
                        allergies: "",
                        medications: "",
                    },
                });

            } catch (error) {
                setError(error.message); // if  any error occurs show the error message
            } finally {
                setLoading(false); // end loading state
            }
        };
        fetchPatientData(); // get the patient data based on the patient id
    }, [id]);

    // handle deleting patients
    const deletePatient = async () => {
        // ask the user to confirm the deletion using a confirmation popup
        // ff they click "cancel", stop the function early
        const confirmDelete = window.confirm(t("patient-profile.confirm-deletion"));
        if (!confirmDelete) return; // user canceled so do nothing

        setDeleting(true); // disable delete button so mark deleting as in progress
        try {
            // delete all appointments belongign to this patient
            const { error: deleteAppointmentsError} = await supabase 
                .from("appointments") // target appointments table
                .delete()  // perform a delete operation
                .eq("patient_id", id); // delete rows where patient id matches the selected patient

            if (deleteAppointmentsError) throw deleteAppointmentsError; // throw any errors that occur

            // delete patient record from users table
            const {error: deletePatientError} = await supabase
                .from("users") // target the users table
                .delete()  // delete the selected patient
                .eq("id", id);  // delete the user with the matching id
            
            if (deletePatientError) throw deletePatientError; // throw any errors that occur

            alert(t("patient-profile.delete-success")); // show a success message to the user if deletion is successful
            navigate("/patients"); // go back to patient list
        } catch (error) {
            alert(t("patient-profile.delete-error") + error.message); // show an error message if something went wrong during either deletion
        } finally {
            setDeleting(false); // stop the deleting state
        }
    };

    if (loading) return <p>{t("patient-profile.loading")}</p>; // show a loading message while the data is still being fetched from the database
    if (error) return <p>{t("patient-profile.error")} {error}</p>; // if there was an error while fetching the data display the error message
    if (!patient) return <p>{t("patient-profile.patient-not-found")}</p> // if no patient was found in the database show a "not found" message

    // this function deals with changes in the edit form inputs when user wants to edit the patient profile
    // it updates the corresponding field in the formData state whenever a user types something
    const inputChange = (e) => {
        const {name, value} = e.target; // extract the name of the input field and its current value
        if (["medical_condition", "allergies", "medications"].includes(name)) { // check if the changed input is part of the health history fields
            setFormData((prev) => ({ //  update only the specific health history field without affecting the rest
                ...prev, // keep all existing top-level form data
                health_history: {...prev.health_history, [name]: value} // keep the existing health history fields, and only update the specific field that was changed
            }));
        } else { // update directly top-level fields like email or phone no in the formData object
            setFormData((prev) => ({...prev, [name]: value})); // keep all the other form fields unchanged, only update the changed field
        }
    };

    // saveChanges is called when the user clicks 'save' in the edit form
    // it sends the updated patient information to the Supabase database
    const saveChanges = async () => {
        try {
            // First build the updated health history object to save in the database

            // for each health history field:
            // - use the value from the form if available
            // - otherwise fall back to the current patient data (if it exists)
            // - if both are missing, default to an empty string
                const updatedHealthHistory = {
                medical_condition: formData.health_history?.medical_condition || patient.health_history?.[0]?.medical_condition || "",
                allergies: formData.health_history?.allergies || patient.health_history?.[0]?.allergies || "",
                medications: formData.health_history?.medications || patient.health_history?.[0]?.medications || "",
                last_updated: new Date().toISOString() // Always update to current timestamp for tracking when it was last updated
            };

            // Then, send the updated data to Supabase to update the patient's row
            const {error} = await supabase 
                .from("users") // target the 'users' table
                .update({ 
                    // update the patient's personal details and health history
                    email: formData.email,
                    phone_number: formData.phone_number,
                    emergency_name: formData.emergency_name,
                    emergency_contact: formData.emergency_contact,
                    health_history: [updatedHealthHistory] // array format to match database format
                })
                .eq("id", id);  // only update the row where the id matches the current patient
            
            if (error) throw error; // throw any errors that occur

            alert(t("patient-profile.update-success")); // show a success alert if the update was successful

            // now update the local React state with the new values to sync UI with what was saved
            setPatient((prev) => ({...prev, // keep any other data in the patient object as it is
                email: formData.email,
                phone_number: formData.phone_number,
                emergency_name: formData.emergency_name,
                emergency_contact: formData.emergency_contact,
                health_history: [updatedHealthHistory]
            }));
            // exit edit mode and hide edit form
            setIsEditing(false); 
        } catch (error) {
            alert(t("patient-profile.error-update"), error.message); // show error alert if anything went wrong
        }
    }

    // in this function, I take a procedure object and return its transalted name
    const translateProcedure = (procedure) => {
        if (!procedure) return t("patient-profile.not-specified"); // if the procedure is missing, return a fallback string to inform (in both languages based on the current selected one)
        return t(`procedures.${procedure.procedure_name}`); // otherwise return the procedure (translated if needed using the transaltion key)
    };

    return (
        <>
            {/* edit profile button */}
            <div className="edit-profile">
                <button className="edit-button" onClick={() => setIsEditing(!isEditing)}> {/* manage edit form visibility */}
                    {isEditing ? t("common.close") : t("patient-profile.edit-profile")}  {/* button text changes based on whether the form is open or not */}
                </button>
            </div>

            {/* main container for the entire patient profile */}
            <div className="patient-profile-container">
                {/* edit form (only shown if edit mode is active) */}
                {isEditing && (
                    <div className="pop-up">
                        <div className="edit-section">
                            <h3>{t("patient-profile.edit-profile")}</h3> {/* form heading*/}

                            {/* Contact information input */}
                            <label>{t("common.email")}</label>
                            <input type="email" name="email" value={formData.email}  onChange={inputChange}/> {/* update email in form state */}

                            <label>{t("common.phone-no")}</label>
                            <input type="text" name="phone_number" value={formData.phone_number}  onChange={inputChange}/> {/* update phone number in form state */}
                        
                            <label>{t("common.emergency_name")}</label>
                            <input type="text" name="emergency_name" value={formData.emergency_name}  onChange={inputChange}/> {/* update emergency person name in form state */}

                            <label>{t("common.emergency_contact")}</label>
                            <input type="text" name="emergency_contact" value={formData.emergency_contact}  onChange={inputChange}/> {/* update emergency person phone number in form state */}

                            {/* health history inputs */}
                            <h4>{t("patient-profile.health-hist")}</h4>
                            <label>{t("patient-profile.medical-cond")}</label>
                            <input type="text" name="medical_condition" value={formData.health_history.medical_condition}  onChange={inputChange}/> {/* update any new medical conditions in form state */}

                            <label>{t("patient-profile.allergies")}</label>
                            <input type="text" name="allergies" value={formData.health_history.allergies}  onChange={inputChange}/> {/* update any allergies in form state */}
                        
                            <label>{t("patient-profile.medications")}</label>
                            <input type="text" name="medications" value={formData.health_history.medications}  onChange={inputChange}/> {/* update any medications being taken in form state */}
                        
                            <button className="save-button" onClick={saveChanges}>{t("common.save")}</button> {/* update phone number in form state */}
                            <button className="cancel-button" onClick={() => setIsEditing(false)}>{t("common.cancel")}</button> {/* cancel changes */}
                        </div>
                    </div>
                )}


                <h1 className="profile-header">{t("patient-profile.profile-title")}</h1>

                {/* personal detials dispaly*/}
                <h3 className="patient-profile-section-header">{t("patient-profile.personal-details")}</h3>
                <p><strong>{t("common.full-name")} </strong>{patient.full_name}</p>
                <p><strong>{t("common.dob")} </strong>{formatDate(patient.date_of_birth)}</p>
                <p><strong>{t("common.gender")} </strong>{t(`common.${patient.gender}`)}</p> 

                <p><strong>{t("common.email")}</strong>{patient.email}</p>
                <p><strong>{t("common.phone-no")} </strong>{patient.phone_number}</p>
                <p><strong>{t("patient-profile.emergency")} </strong>{patient.emergency_name} {patient.emergency_contact || t("patient-profile.missing")}</p>

                {/* health history section */}
                <h3 className="patient-profile-section-header">{t("patient-profile.health-hist")}</h3>
                {/* check if the patient has at least one health history record */}
                {patient?.health_history?.length > 0 ? ( 
                    // extract and display the first health history object
                    (() => {
                        const healthData = patient.health_history[0]; // Extract the first object

                        // display the information that is saved in the database or a message that nothing has been recorded
                        return (
                            <div>
                                <p><strong>{t("patient-profile.medical-cond")}</strong> {healthData?.medical_condition || t("patient-profile.no-report")}</p>
                                <p><strong>{t("patient-profile.allergies")}</strong> {healthData?.allergies || t("patient-profile.no-report")}</p>
                                <p><strong>{t("patient-profile.medications")}</strong> {healthData?.medications || t("patient-profile.no-report")}</p>
                                <p><strong>{t("patient-profile.updated")}</strong> {formatDate(healthData?.last_updated.split("T")[0])}</p>
                            </div>
                        );
                    })()
                ) : (
                    <p>{t("patient-profile.not-available")}</p> // fallback if no health history recorded
                )}

                {/* Display appointments based on today, upcoming or past*/}
                <div className="appointments-section">
                    <h3 className="patient-profile-section-header">{t("patient-profile.appointments-sect")}</h3> {/* subheader for the section */}
                    
                    {/* today */}
                    {appointments.today.length > 0 && (
                        <div className="appointment-list today">
                            <h4>{t("patient-profile.today")}</h4>
                            <ul>
                                {/* loop through all of today's appointments */}
                                {appointments.today.map((appointment) => {
                                    const {time} = formatDateTime(appointment.appointment_date); // format the time from the appointment date

                                    const translatedProcedure = translateProcedure(appointment.procedure); // get the translated procedure name

                                    return (
                                        <li key={appointment.id}
                                            onClick={() => navigate(`/appointment-history/${appointment.appointment_id}`)} // navigate to full appointment history
                                            style={{cursor: "pointer"}}>
                                            <p>{t("patient-profile.today-appt", {procedure: translatedProcedure, time})}</p> {/* return the list of today's appointments*/}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}

                    {/* upcoming */}
                    {appointments.upcoming.length > 0 && (
                        <div className="appointment-list upcoming">
                            <h4>{t("patient-profile.upcoming")}s</h4>
                            <ul>
                            {/* loop through all of upcoming appointments */}
                            {appointments.upcoming.map((appointment) => {
                                const {date, time} = formatDateTime(appointment.appointment_date); // format the time and date from the appointment date

                                const translatedProcedure = translateProcedure(appointment.procedure); // get the translated procedure name

                                return (
                                    <li key={appointment.id}>
                                        <p>{t("patient-profile.upcoming-appt", {procedure: translatedProcedure, date, time})} </p> {/* return the list of upcoming appointments*/}
                                    </li>
                                );
                            })}
                        </ul>
                        </div>
                    )}

                    {/* past */}
                    {appointments.past.length > 0 && (
                        <div className="appointment-list past">
                            <h4>{t("patient-profile.past")}</h4>
                            <ul>
                            {/* loop through past appointments */}
                            {appointments.past.map((appointment) => {
                                const {time, date} = formatDateTime(appointment.appointment_date); // format the time and date from the appointment date

                                const translatedProcedure = translateProcedure(appointment.procedure); // get the translated procedure name

                                return (
                                    <li key={appointment.id}
                                        onClick={() => navigate(`/appointment-history/${appointment.appointment_id}`)} // navigate to full appointment history
                                        style={{cursor: "pointer"}}
                                    >
                                        {appointment.status === "canceled" ? (
                                            <p>
                                                {t("patient-profile.canceled-appt", { date, time})} {/* if the appointment was canceled show with a different text*/}
                                            </p>
                                        ) : (
                                            <p>
                                                {t("patient-profile.past-appt", {procedure: translatedProcedure, date, time})} {/* say what was performed and when*/}
                                            </p>
                                        )}                                        
                                    </li>
                                );
                            })}
                        </ul>
                        </div>
                    )}
                </div>                

                {/* delete patient button */}
                <button
                    className="delete-patient"
                    onClick={deletePatient} // call deletePatient() function when clicked
                    disabled={deleting} //disable the button while deletion is in progress     
                >
                    {deleting ? t("patient-profile.deleting") : t("patient-profile.delete-patient")} {/* if deletion is happening, show "Deleting...", else show "Delete Patient" */}
                </button>
            </div>
        </>
    );
    
}