import React from "react";
import { z } from "zod";

const patientSchema = z.object({
    full_name: z.string().min(1, "Full name is required"),
    email: z.string().email("Invalid email address"),
    phone_number: z.string().min(10, "Phone number must be at least 10 digits"),
    date_of_birth: z.string().refine((date) => !isNaN(Date.parse(date))),
    emergency_name: z.string().optional(),
    emergency_contact: z.string().optional(),
    medical_condition: z.string().optional(),
    allergies: z.string().optional(),
    medications: z.string().optional()
})

export default patientSchema;