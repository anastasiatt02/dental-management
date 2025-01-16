import React from "react";
import { z } from "zod";

const patientSchema = z.object({
    fullName: z.string().min(1, "Full name is required"),
    email: z.string().email("Invalid email address"),
    phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
    dateOfBirth: z.string().refine((date) => !isNaN(Date.parse(date))),
    emergencyName: z.string().optional(),
    emergencyContact: z.string().optional(),
})

export default patientSchema;