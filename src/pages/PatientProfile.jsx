import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import supabase from '../supabaseClient';

export default function PatientProfile() {
    const {id} = useParams(); // get patient id from the URL
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [appointments, setAppointments] = useState([]);
    const [deleting, setDeleting] = useState(false);
    const navigate = useNavigate();

    // format date in form dd.mm.yyyy
    const formatDate = (dateString) => {
        if (!dateString) return "Not provided";
        const [year, month, day] = dateString.split("-");
        return `${day}.${month}.${year}`;
    }

    // format date and time from database
    const formatDateTime = (timestamp) => {
        if (!timestamp) return { date: "Not provided", time: "Not provided"};

        const dateObject = new Date(timestamp);
        const day = String(dateObject.getDate()).padStart(2, "0");
        const month = String(dateObject.getMonth() + 1).padStart(2, "0");
        const year = dateObject.getFullYear();
        const hours = String(dateObject.getHours()).padStart(2, "0");
        const minutes = String(dateObject.getMinutes()).padStart(2, "0");

        return {
            date: `${day}.${month}.${year}`,
            time: `${hours}:${minutes}`
        };
    };

    useEffect(() => {
        const fetchPatientData = async() => {
            setLoading(true);
            try {
                const {data: patientData, patientError} = await supabase
                    .from("users")
                    .select("*")
                    .eq("id", id)
                    .single();
                
                // console.log("Fetched Patient Data:", patientData);

                
                if (patientError) throw patientError;
                setPatient(patientData);

                // fetch from database appointments for this selected patient
                const {data: appointmentData, error: appointmentError} = await supabase
                    .from("appointments")
                    .select(`appointment_id, appointment_date, procedure_id, procedure(procedure_name)`)
                    .eq("patient_id", id)
                    .order("appointment_date", { ascending: true});

                if (appointmentError) throw appointmentError;
                
                //create a category for appointments: past, today, upcoming
                const today = new Date().setHours(0, 0, 0, 0); // today's date
                
                const pastAppointments = [];
                const todayAppointments = [];
                const upcomingAppointments = [];

                appointmentData.forEach((appointment) => {
                    const appointmentDate = new Date(appointment.appointment_date).setHours(0, 0, 0, 0);

                    if (appointmentDate < today) {
                        pastAppointments.push(appointment);
                    } else if (appointmentDate === today) {
                        todayAppointments.push(appointment);
                    } else {
                        upcomingAppointments.push(appointment);
                    }
                });

                setAppointments({
                    past: pastAppointments.reverse(), //most recent one first
                    today: todayAppointments,
                    upcoming: upcomingAppointments,
                });

            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchPatientData();
    }, [id]);

    // handle deleting patients
    const deletePatient = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this patient? This action cannot be undone.");
        if (!confirmDelete) return;

        setDeleting(true);
        try {
            // delete the selected patient's appointments
            const { error: deleteAppointmentsError} = await supabase 
                .from("appointments")
                .delete()
                .eq("patient_id", id);

            if (deleteAppointmentsError) throw deleteAppointmentsError;

            // delete patient
            const {error: deletePatientError} = await supabase
                .from("users")
                .delete()
                .eq("id", id);
            
            if (deletePatientError) throw deletePatientError;

            alert("Patient deleted successfully");
            navigate("/patients"); // go back to patient list
        } catch (error) {
            alert("Error deleting patient" + error.message);
        } finally {
            setDeleting(false);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!patient) return <p>Patient not found.</p>

    return (
        <div>
            <h1>Patient Profile</h1>
            {/* <p>Patient ID: {id}</p> */}
            <p>Full name: {patient.full_name}</p>
            <p>Date of birth: {formatDate(patient.date_of_birth)}</p>
            <p>Email address: {patient.email}</p>
            <p>Phone number: {patient.phone_number}</p>
            <p>Who to contact in case of emergency: {patient.emergency_name} {patient.emergency_contact || "Not provided"}</p>

            {/* Display appointments */}
            <h3>Appointments</h3>
            
            {/* today */}
            {appointments.today.length > 0 && (
                <>
                <h4>Today's appointments</h4>
                <ul>
                    {appointments.today.map((appointment) => {
                        const {date, time} = formatDateTime(appointment.appointment_date);
                        return (
                            <li key={appointment.id}>
                                <p>We will be performing a {appointment.procedure?.procedure_name || "Not specified"} on {date} at {time}</p>
                            </li>
                        );
                    })}
                </ul>
                </>
            )}

            {/* upcoming */}
            {appointments.upcoming.length > 0 && (
                <>
                    <h4>Upcoming appointments</h4>
                    <ul>
                    {appointments.upcoming.map((appointment) => {
                        const {date, time} = formatDateTime(appointment.appointment_date);
                        return (
                            <li key={appointment.id}>
                                <p>We will be performing a {appointment.procedure?.procedure_name || "Not specified"} at {time}</p>
                            </li>
                        );
                    })}
                </ul>
                </>
            )}

            {/* past */}
            {appointments.past.length > 0 && (
                <>
                    <h4>Past appointments</h4>
                    <ul>
                    {appointments.past.map((appointment) => {
                        const {date, time} = formatDateTime(appointment.appointment_date);
                        return (
                            <li key={appointment.id}>
                                <p>We will be performing a {appointment.procedure?.procedure_name || "Not specified"} on {date} at {time}</p>
                            </li>
                        );
                    })}
                </ul>
                </>
            )}

            <h3>Health History</h3>
            {patient?.health_history?.length > 0 ? (
                (() => {
                    const healthData = patient.health_history[0]; // Extract the first object

                    return (
                        <div>
                            <p><strong>Medical Conditions:</strong> {healthData.medical_condition || "None reported"}</p>
                            <p><strong>Allergies:</strong> {healthData.allergies || "None reported"}</p>
                            <p><strong>Medications:</strong> {healthData.medications || "None reported"}</p>
                            <p><strong>Last Updated:</strong> {formatDate(healthData.last_updated)}</p>
                        </div>
                    );
                })()
            ) : (
                <p>No health history available.</p>
            )}

            {/* delete patient button */}
            <button
                onClick={deletePatient}
                disabled={deleting}
                style={{
                    backgroundColor: "red",
                    color: "white",
                    padding: "10px 15px",
                    border: "none",
                    cursor: deleting ? "not-allowed" : "pointer",
                    marginTop: "20px",

                }}
            
            >
                {deleting ? "Deleting..." : "Delete patient"}
            </button>


        </div>
    );
}