import { z } from "zod";

/** Patient schema (validation) - with i18 support 
 * 
 * The schema defines validation rules for patient data using Zod
 * Ensures that required field are provided and formated correctly for the database
 */

const patientSchema = (t) => 
    z.object({
        full_name: z.string().min(1, {message: t("patient-schema.full-name")}), // Full name must be at leat 1 character long and is required
        
        email: z.string().email({message: t("patient-schema.email")}), // Email must be of valid email format
        
        phone_number: z.string().min(10, {message: t("patient-schema.phone-no")}), // Phone number must be at least 10 characters long 
        
        date_of_birth: z.string()
            .refine((date) => !isNaN(Date.parse(date)), {message: t("patient-schema.dob")}) // Date of birth must be a valid date string
            .refine((date) => {
                //check the patient is at least 6 months old
                const dob = new Date(date);
                const validAge = new Date();
                validAge.setMonth(validAge.getMonth() - 6);
                return dob <= validAge;
            }, {message: t("patient-schema.valid-age")}),

        gender: z.enum(["male", "female"], { // Register the gender of the patient, it is a required detail
            errorMap: () => ({message: t("create-patient.gender-required")}) 
        }),
            
        emergency_name: z.string().optional(), // Emergency contact details are optional
        
        emergency_contact: z.string().optional(),
        
        medical_condition: z.string().optional(), // Medical history optional to be filled
        
        allergies: z.string().optional(),
        
        medications: z.string().optional()
})

export default patientSchema;