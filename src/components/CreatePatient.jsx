import React, { useState, useEffect } from "react";
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import patientSchema from "./patientSchema";
import supabase from "../supabaseClient";

export default function CreatePatient() {
    const navigate = useNavigate();
    // show health history after completing the patient details
    const [showHealthHistory, setShowHealthHistory] = useState(false); // track if the health hstory should show in the form
    const {
        register,
        handleSubmit,
        formState: {errors},
        watch,
    } = useForm({resolver: zodResolver(patientSchema), // connect with schema
        mode: 'onBlur'
    });

    // keep watch if required fields are filled
    const fullName = watch("full_name");
    const email = watch("email");
    const phoneNumber = watch("phone_number");
    const dateOfBirth = watch("date_of_birth");

    // check all required fields have been filled
    const filledRequired = fullName?.trim() && email?.trim() && phoneNumber?.trim() && dateOfBirth;
    //show health history part
    React.useEffect(() => {
        setShowHealthHistory(Boolean(filledRequired));
    }, [filledRequired]);

    const onSubmit = async (data) => { //connection to supabase
        try {
            // const patientDetails = {...data, role:'patient'}; // set the role automatically to patient
            // console.log('data to be sent to database: ', patientDetails); 
            // const { error } = await supabase.from('users').insert(patientDetails);
            // if (error) throw error;
            // alert('Patient form submitted successfully!')

            // const healthHistory = {
            //     medical_condition: data.medical_condition || null,
            //     allergies: data.allergies || null,
            //     medications: data.medications || null,
            //     last_updated: new Date().toISOString(), // date at the moment of creating
            // };

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
            }; // health history

            console.log("data to be sent to database: ", patientDetails);
            console.log('health history array:', patientDetails.health_history);
            console.log(patientDetails);

            const result = await supabase.from("users").insert([patientDetails]).select();
            // if (error) throw error;
            console.log(result);

            alert("patient form submited successfully!");

        } catch (error) {
            console.log('Error creating patient: ', error.message);
            alert('Failed to create patient.');
        }
    };

    return (
        <div className="form-container">
            <h3>Create new patient</h3>
            <form onSubmit={handleSubmit(onSubmit)}>
                <label>
                    Full name: <span style={{color: 'red'}}>*</span>
                    <input type="text" {...register('full_name')} />
                    {errors.full_name && <p>{errors.full_name.message}</p>}
                </label>
                <label>
                    Email: <span style={{color: 'red'}}>*</span>
                    <input type="text" {...register('email')} />
                    {errors.email && <p>{errors.email.message}</p>}
                </label>
                <label>
                    Phone number: <span style={{color: 'red'}}>*</span>
                    <input type="text" {...register('phone_number')} />
                    {errors.phone_number && <p>{errors.phone_number.message}</p>}
                </label>
                <label>
                    Date of birth: <span style={{color: 'red'}}>*</span>
                    <input type="date" {...register('date_of_birth')} />
                    {errors.date_of_birth && <p>{errors.date_of_birth.message}</p>}
                </label>
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

                {/* health history form fields */}
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

                <button type="submit">Submit</button>
            </form>
        </div>
    );
}






