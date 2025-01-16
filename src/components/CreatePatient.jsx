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
        try {
            const patientData = {...data, role: 'patient'}; // set the role - patient
            console.log('data to be sent', patientData); // debug line
            const { error } = await supabase.from('users').insert(patientData);
            if (error) throw error;
            alert('Patient form submitted successfully!')
        } catch (error) {
            console.error('Error creating patient: ', error.message);
            alert('Failed to create patient.');
        }
    };

    return (
        <div className="form-container">
            <h1>Create new patient</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <label>
                    Full name:
                    <input type="text" {...register('full_name')} />
                    {errors.full_name && <p>{errors.full_name.message}</p>}
                </label>
                <label>
                    Email:
                    <input type="text" {...register('email')} />
                    {errors.email && <p>{errors.email.message}</p>}
                </label>
                <label>
                    Phone number: 
                    <input type="text" {...register('phone_number')} />
                    {errors.phone_number && <p>{errors.phone_number.message}</p>}
                </label>
                <label>
                    Date of birth:
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

                <button type="submit">Submit</button>
            </form>
        </div>
    );
}






