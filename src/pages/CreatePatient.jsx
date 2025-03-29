import React, { useState, useEffect } from "react";
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import patientSchema from "../components/patientSchema"; // Schema for validation
import supabase from "../supabaseClient"; // Supabase database client
import emailjs from "@emailjs/browser"; // Email sending service
import { useTranslation } from "react-i18next"; 
import "../styles/create-patient.css";

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
    } = useForm({resolver: zodResolver(patientSchema(t)), // Connect with schema
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

            // Insert the new patient into Supabase
            const result = await supabase.from("users").insert([patientDetails]).select();

            //  Send welcome email to new patient created
            await sendConfigEmail(data.email, data.full_name);
            alert(t("create-patient.submited-form"));

        } catch (error) {
            console.log(t("create-patient.error-new-patient"), error.message);
            alert(t("create-patient.fail-create-new-patient"));
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
                    patientEmail: patientEmail,
                },
                "TXGcbVCGnLGIuPYLl" // EmailJS public key
            );
            console.log(t("create-patient.success-emailing")); // debugging
        } catch (error) {
            console.error(t("create-patient.error-emailing"), error);
        }
    };

    return (
        <div className="form-container">
            <h3>{t("create-patient.form-title")}</h3>

            {/* Patient registration form */}
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-inner">

                    {/* Full name */}
                    <label> 
                        {t("common.full-name")} <span style={{color: 'red'}}>*</span>
                        <input type="text" {...register('full_name')} />
                        {errors.full_name && <p>{errors.full_name.message}</p>}
                    </label>

                    {/* Email */}
                    <label>
                        {t("common.email")}<span style={{color: 'red'}}>*</span>
                        <input type="text" {...register('email')} />
                        {errors.email && <p>{errors.email.message}</p>}
                    </label>

                    {/* Phone number */}
                    <label>
                        {t("common.phone-no")}<span style={{color: 'red'}}>*</span>
                        <input type="text" {...register('phone_number')} />
                        {errors.phone_number && <p>{errors.phone_number.message}</p>}
                    </label>

                    {/* DOB */}
                    <label>
                        {t("common.dob")}<span style={{color: 'red'}}>*</span>
                        <input type="date" {...register('date_of_birth')} />
                        {errors.date_of_birth && <p>{errors.date_of_birth.message}</p>}
                    </label>

                    {/* Emergency contact */}
                    <label>
                        {t("create-patient.emergency-name")}
                        <input type="text" {...register('emergency_name')} />
                        {errors.emergency_name && <p>{errors.emergency_name.message}</p>}
                    </label>
                    <label>
                        {t("create-patient.emergency-contact")}
                        <input type="text" {...register('emergency_contact')} />
                        {errors.emergency_contact && <p>{errors.emergency_contact.message}</p>}
                    </label>

                    {/* health history form fields - displayed only when the basic details have been filled */}
                    {showHealthHistory && (
                        <div className="health-history">
                            <h4>{t("create-patient.health-history")}</h4>
                            <label>
                                {t("create-patient.medical-condition")}
                                <input type="text" {...register("medical_condition")} />
                                {errors.medical_conditions && (
                                    <p>{errors.medical_conditions.message}</p>
                                )}
                            </label>
                            <label>
                                {t("create-patient.allergies")}
                                <input type="text" {...register("allergies")} />
                                {errors.allergies && (
                                    <p>{errors.allergies.message}</p>
                                )}
                            </label>
                            <label>
                                {t("create-patient.medications")}
                                <input type="text" {...register("medications")} />
                                {errors.medications && (
                                    <p>{errors.medications.message}</p>
                                )}
                            </label>
                        </div>
                    )}

                    <button type="submit">{t("button.submit")}</button>
                </div>
            </form>
        </div>
    );
}
