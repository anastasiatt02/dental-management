import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import supabase from '../supabaseClient';

export default function PatientProfile() {
    const {id} = useParams(); // get patient id from the URL
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [appointments, setAppointments] = useState([]);

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
                
                if (patientError) throw patientError;
                setPatient(patientData);

                // fetch from database appointments for this selected patient
                const {data: appointmentData, error: appointmentError} = await supabase
                    .from("appointments")
                    .select(`appointment_id, appointment_date, procedure_id, procedure(procedure_name)`)
                    .eq("patient_id", id)
                    .order("appointment_date", { ascending: true});

                if (appointmentError) throw appointmentError;
                setAppointments(appointmentData);

            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchPatientData();
    }, [id]);

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
            <h3>Appoitnments</h3>
            {appointments.length > 0 ? (
                <ul>
                    {appointments.map((appointment) => {
                        const {date, time} = formatDateTime(appointment.appointment_date);
                        return (
                            <li key={appointment.id}>
                                <p>We will be performing {appointment.procedure?.procedure_name || "Not specified"}</p>
                                <p>When: {date} at {time}.</p>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <p>No appointments found.</p>
            )}
        
        </div>
    )
}