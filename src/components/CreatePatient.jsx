import React, { useState, useEffect } from "react";
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import patientSchema from "./patientSchema"; // Schema for validation
import supabase from "../supabaseClient"; // Supabase database client
import emailjs from "@emailjs/browser"; // Email sending service
import { useTranslation } from "react-i18next"; 

/**
 * CreatePatient component handles:
 * - Rendering a patient registration form
 * - Validating input with Zod and react-hook-form
 * - Saving patient data to Supabase
 * - Sending a welcome email using EmailJS 
 * 
 */


export default function CreatePatient() {
    const {t} = useTranslation();

    // Control if health history is displayed
    // show health history after completing the patient details
    const [showHealthHistory, setShowHealthHistory] = useState(false); // track if the health hstory should show in the form
    // Initialise react-hook-form with Zod validation
    const {
        register,
        handleSubmit,
        formState: {errors},
        watch,
    } = useForm({resolver: zodResolver(patientSchema), // Connect with schema
        mode: 'onBlur', // Validate on blur (user leaving the field)
    });

    // Keep watch if required fields are filled and if health history should display
    const fullName = watch("full_name");
    const email = watch("email");
    const phoneNumber = watch("phone_number");
    const dateOfBirth = watch("date_of_birth");

    // check all required fields have been filled
    const filledRequired = fullName?.trim() && email?.trim() && phoneNumber?.trim() && dateOfBirth;
    //show health history part only if required fields are filled
    React.useEffect(() => {
        setShowHealthHistory(Boolean(filledRequired));
    }, [filledRequired]);


    /**
     * Handle form submission and save patient data to Supabase
     * @param {Object} data - Validated form data
     */
    const onSubmit = async (data) => { //connection to supabase
        try {
            // Patient details object
            const patientDetails = {
                full_name:data.full_name,
                email:data.email,
                phone_number: data.phone_number,
                date_of_birth: data.date_of_birth,
                emergency_name: data.emergency_name,
                emergency_contact: data.emergency_contact,
                role: "patient", // automatically assign
                health_history: [
                     {
                    medical_condition: data.medical_condition,
                    allergies: data.allergies,
                    medications: data.medications,
                    last_updated: new Date().toISOString(),},],
            };

            console.log("Data to be sent to database: ", patientDetails);
            // console.log('Health history array:', patientDetails.health_history);
            // console.log(patientDetails);

            // Insert the new patient into Supabase
            const result = await supabase.from("users").insert([patientDetails]).select();

            //  Send welcome email to new patient created
            await sendConfigEmail(data.email, data.full_name);
            alert("patient form submited successfully!");

        } catch (error) {
            console.log('Error creating patient: ', error.message);
            alert('Failed to create patient.');
        }
    };

    
    /**
     * Send a welcome email to the newly registered patient
     * @param {string} patientEmail - Patient's email
     * @param {string} patientName - Patient's full name 
     */
    const sendConfigEmail = async (patientEmail, patientName) => {
        try {
            await emailjs.send(
                "service_gvxd9tl", // EmailJS service id
                "template_pzownh1", // EmailJS template id
                {
                    full_name: patientName,
                    email: patientEmail,
                },
                "TXGcbVCGnLGIuPYLl" // EmailJS public key
            );
            console.log("Email sent successfully."); // debugging
        } catch (error) {
            console.error("Error sending email: ", error);
        }
    };

    return (
        <div className="form-container">
            <h3>Create new patient</h3>

            {/* Patient registration form */}
            <form onSubmit={handleSubmit(onSubmit)}>

                {/* Full name */}
                <label> 
                    Full name: <span style={{color: 'red'}}>*</span>
                    <input type="text" {...register('full_name')} />
                    {errors.full_name && <p>{errors.full_name.message}</p>}
                </label>

                {/* Email */}
                <label>
                    Email: <span style={{color: 'red'}}>*</span>
                    <input type="text" {...register('email')} />
                    {errors.email && <p>{errors.email.message}</p>}
                </label>

                {/* Phone number */}
                <label>
                    Phone number: <span style={{color: 'red'}}>*</span>
                    <input type="text" {...register('phone_number')} />
                    {errors.phone_number && <p>{errors.phone_number.message}</p>}
                </label>

                {/* DOB */}
                <label>
                    Date of birth: <span style={{color: 'red'}}>*</span>
                    <input type="date" {...register('date_of_birth')} />
                    {errors.date_of_birth && <p>{errors.date_of_birth.message}</p>}
                </label>

                {/* Emergency contact */}
                <label>
                    Emergency contact name:
                    <input type="text" {...register('emergency_name')} />
                    {errors.emergency_name && <p>{errors.emergency_name.message}</p>}
                </label>
                <label>
                    Emergency contact number:
                    <input type="text" {...register('emergency_contact')} />
                    {errors.emergency_contact && <p>{errors.emergency_contact.message}</p>}
                </label>

                {/* health history form fields - displayed only when the basic details have been filled */}
                {showHealthHistory && (
                    <div className="health-history">
                        <h4>Health history</h4>
                        <label>
                            Do you have any long term medical condition?
                            <input type="text" {...register("medical_condition")} />
                            {errors.medical_conditions && (
                                <p>{errors.medical_conditions.message}</p>
                            )}
                        </label>
                        <label>
                            Do you have any allergies?
                            <input type="text" {...register("allergies")} />
                            {errors.allergies && (
                                <p>{errors.allergies.message}</p>
                            )}
                        </label>
                        <label>
                            Are you currently taking any medications?
                            <input type="text" {...register("medications")} />
                            {errors.medications && (
                                <p>{errors.medications.message}</p>
                            )}
                        </label>
                    </div>
                )}

                <button type="submit">{t("button.submit")}</button>
            </form>
        </div>
    );
}
