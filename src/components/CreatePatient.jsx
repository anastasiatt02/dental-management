import React from "react";
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import patientSchema from "./patientSchema";
import supabase from "../supabaseClient";

export default function CreatePatient() {
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm({resolver: zodResolver(patientSchema), // connect with schema
        mode: 'onBlur'
    });

    const onSubmit = async (data) => {
        const patientData = {...data, role: 'patient'}; // set the role - patient
        console.log('patient data', patientData);
        alert('Patient form submitted successfully!')
        // connection to supabase
    };

    return (
        <div className="form-container">
            <h1>Create new patient</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <label>
                    Full name:
                    <input type="text" {...register('fullName')} />
                    {errors.fullName && <p>{errors.fullName.message}</p>}
                </label>
                <label>
                    Email:
                    <input type="text" {...register('email')} />
                    {errors.email && <p>{errors.email.message}</p>}
                </label>
                <label>
                    Phone number: 
                    <input type="text" {...register('phoneNumber')} />
                    {errors.phoneNumber && <p>{errors.phoneNumber.message}</p>}
                </label>
                <label>
                    Date of birth:
                    <input type="date" {...register('dateOfBirth')} />
                    {errors.dateOfBirth && <p>{errors.dateOfBirth.message}</p>}
                </label>
                <label>
                    Emergency contact name:
                    <input type="text" {...register('emergencyName')} />
                    {errors.emergencyName && <p>{errors.emergencyName.message}</p>}
                </label>
                <label>
                    Emergency contact number:
                    <input type="text" {...register('emergencyContact')} />
                    {errors.emergencyContact && <p>{errors.emergencyContact.message}</p>}
                </label>

                <button type="submit">Submit</button>
            </form>
        </div>
    );
}






