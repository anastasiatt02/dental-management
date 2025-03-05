
/** Patient schema (validation)
 * 
 * The schema defines validation rules for patient data using Zod
 * Ensures that required field are provided and formated correctly for the database
 */

import { z } from "zod";

const patientSchema = z.object({
    full_name: z.string().min(1, "Full name is required"), // Full name must be at leat 1 character long and is required
    email: z.string().email("Invalid email address"), // Email must be of valid email format
    phone_number: z.string().min(10, "Phone number must be at least 10 digits"), // Phone number must be at least 10 characters long 
    date_of_birth: z.string().refine((date) => !isNaN(Date.parse(date))), // Date of birth must be a valid date string
    emergency_name: z.string().optional(), // Emergendy contact details are optional
    emergency_contact: z.string().optional(),
    medical_condition: z.string().optional(), // Medical history optional to be filled
    allergies: z.string().optional(),
    medications: z.string().optional()
})

export default patientSchema;