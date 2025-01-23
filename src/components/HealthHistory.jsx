import React from "react";
// import { useNavigate, useLocation } from "react-router-dom";
import { useForm, Controller } from 'react-hook-form';

export default function HealthHistory() {
    const { control, handleSubmit, watch, register } = useForm();

    // can add watch fields here
    const underMedicalCare = watch('under_medical_care');
    const takingMedications = watch('taking_medications');
    const osteoporosisMedication = watch('osteoporosis_medication');
    const pregnantWoman = watch('pregnant');
    const anyAllergies = watch('allergies');
    const heartProblems = watch('heart_problems');
    const liverKidneyDisease = watch('liver_kidney_disease');
    const chestCondition = watch('chest_condition');
    const cancerHistory = watch('cancer');
    const infectiousDisease = watch('infectious_disease');
    const epilepsyRecord = watch('epilepsy');
    const anaesthetic_Reaction = watch('anaesthetic_reactio');
    const diabetesHistory = watch('diabetes');
    const operationRecord = watch('operations');
    const arthritisRecord = watch('arthritis');
    const heartPacemaker = watch('pacemaker');
    const exessiveBleeding = watch('exessive_bleeding');
    const heartSurgeryHistory = watch('heart_surgery');
    const brainSurgeryHistory = watch('brain_history');
    const smoker = watch('smoke');
    const alcoholConsumer = watch('alcohol');
    const extraDetails = watch('extra_details');




    const onSubmit = async (data) => {
        // combine data from both forms
        // const combineData = {
        //     ...patientDetails, 
        //     health_history: Object.entries(data).filter(([key, value]) => value && value.answer === 'yes') // only yes answers are recorded
        //     .map(([key, value]) => ({
        //         type: key,
        //         details: value.details || null,
        //     })),
        // }

        console.log('Data from form: ', data);
        // submit to database instead once it works
        alert('health history submitted!');

    };

    return (
        <div className="form-container">
            <h1>Health history</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                
                <div>
                    <label>
                        Are you at the moment under medical care?
                        <Controller
                            control={control}
                            name="under_medical_care"
                            render={({...field}) => (
                                <select {...field}>
                                    <option value="no">No</option>
                                    <option value="yes">Yes</option>
                                </select>
                            )} 
                        />
                    </label>
                    {underMedicalCare === 'yes' && (
                        <input type="text"
                        placeholder="Please provide more details"
                        {...register('under_medical_care_details')} />
                    )}
                </div>

                <div>
                    <label>
                        Are you taking any medications perscribed by your doctor?
                        <Controller
                            control={control}
                            name="taking_medications"
                            render={({...field}) => (
                                <select {...field}>
                                    <option value="no">No</option>
                                    <option value="yes">Yes</option>
                                </select>
                            )} 
                        />
                    </label>
                </div>

                <div>
                    <label>
                       Are you taking any medication for osteoporosis?
                        <Controller
                            control={control}
                            name="osteoporosis_medication"
                            render={({...field}) => (
                                <select {...field}>
                                    <option value="no">No</option>
                                    <option value="yes">Yes</option>
                                </select>
                            )} 
                        />
                    </label>
                </div>

                <div>
                    <label>
                        Are you pregnant?
                        <Controller
                            control={control}
                            name="pregnant"
                            render={({...field}) => (
                                <select {...field}>
                                    <option value="no">No</option>
                                    <option value="yes">Yes</option>
                                </select>
                            )} 
                        />
                    </label>
                </div>

                <div>
                    <label>
                    Have you ever suffered from allergies to any medicines i.e. penicillin, substances (e.g. latex/rubber) or foods?
                        <Controller
                            control={control}
                            name="allergies"
                            render={({...field}) => (
                                <select {...field}>
                                    <option value="no">No</option>
                                    <option value="yes">Yes</option>
                                </select>
                            )} 
                        />
                    </label>
                </div>

                <div>
                    <label>
                    Have you ever suffered from heart problems, angina, blood pressure problems or stroke?
                        <Controller
                            control={control}
                            name="heart_problems"
                            render={({...field}) => (
                                <select {...field}>
                                    <option value="no">No</option>
                                    <option value="yes">Yes</option>
                                </select>
                            )} 
                        />
                    </label>
                </div>

                <div>
                    <label>
                    Have you ever had liver disease or kidney disease?
                        <Controller
                            control={control}
                            name="liver_kidney_disease"
                            render={({...field}) => (
                                <select {...field}>
                                    <option value="no">No</option>
                                    <option value="yes">Yes</option>
                                </select>
                            )} 
                        />
                    </label>
                </div>

                <div>
                    <label>
                    Have you ever suffered from bronchitis, asthma or other chest condition?
                        <Controller
                            control={control}
                            name="chest_condition"
                            render={({...field}) => (
                                <select {...field}>
                                    <option value="no">No</option>
                                    <option value="yes">Yes</option>
                                </select>
                            )} 
                        />
                    </label>
                </div>

                <div>
                    <label>
                    Have you ever had any form of cancer?
                        <Controller
                            control={control}
                            name="cancer"
                            render={({...field}) => (
                                <select {...field}>
                                    <option value="no">No</option>
                                    <option value="yes">Yes</option>
                                </select>
                            )} 
                        />
                    </label>
                </div>

                <div>
                    <label>
                    Have you ever suffered from any infectious diseases (including HIV and hepatitis)?
                        <Controller
                            control={control}
                            name="infectious_disease"
                            render={({...field}) => (
                                <select {...field}>
                                    <option value="no">No</option>
                                    <option value="yes">Yes</option>
                                </select>
                            )} 
                        />
                    </label>
                </div>

                <div>
                    <label>
                    Have you ever suffered from fainting attacks, giddiness, blackouts or epilepsy?
                        <Controller
                            control={control}
                            name="epilepsy"
                            render={({...field}) => (
                                <select {...field}>
                                    <option value="no">No</option>
                                    <option value="yes">Yes</option>
                                </select>
                            )} 
                        />
                    </label>
                </div>

                <div>
                    <label>
                    Have you ever had a bad reaction to a local or general anaesthetic?
                        <Controller
                            control={control}
                            name="anaesthetic_reaction"
                            render={({...field}) => (
                                <select {...field}>
                                    <option value="no">No</option>
                                    <option value="yes">Yes</option>
                                </select>
                            )} 
                        />
                    </label>
                </div>

                <div>
                    <label>
                    Have you ever suffered from diabetes?
                        <Controller
                            control={control}
                            name="diabetes"
                            render={({...field}) => (
                                <select {...field}>
                                    <option value="no">No</option>
                                    <option value="yes">Yes</option>
                                </select>
                            )} 
                        />
                    </label>
                </div>

                <div>
                    <label>
                    Have you ever had a major operation or recently received hospital treatment? 
                        <Controller
                            control={control}
                            name="operation"
                            render={({...field}) => (
                                <select {...field}>
                                    <option value="no">No</option>
                                    <option value="yes">Yes</option>
                                </select>
                            )} 
                        />
                    </label>
                </div>

                <div>
                    <label>
                    Do you have Arthritis?
                        <Controller
                            control={control}
                            name="arthritis"
                            render={({...field}) => (
                                <select {...field}>
                                    <option value="no">No</option>
                                    <option value="yes">Yes</option>
                                </select>
                            )} 
                        />
                    </label>
                </div>

                <div>
                    <label>
                    Do you have a pacemaker?
                        <Controller
                            control={control}
                            name="pacemaker"
                            render={({...field}) => (
                                <select {...field}>
                                    <option value="no">No</option>
                                    <option value="yes">Yes</option>
                                </select>
                            )} 
                        />
                    </label>
                </div>

                <div>
                    <label>
                    Do you bruise easily or have you ever bled excessively?
                        <Controller
                            control={control}
                            name="exessive_bleeding"
                            render={({...field}) => (
                                <select {...field}>
                                    <option value="no">No</option>
                                    <option value="yes">Yes</option>
                                </select>
                            )} 
                        />
                    </label>
                </div>

                <div>
                    <label>
                    Have you had heart surgery?
                        <Controller
                            control={control}
                            name="heart_surgery"
                            render={({...field}) => (
                                <select {...field}>
                                    <option value="no">No</option>
                                    <option value="yes">Yes</option>
                                </select>
                            )} 
                        />
                    </label>
                </div>

                <div>
                    <label>
                    Have you had brain surgery?
                        <Controller
                            control={control}
                            name="brain_surgery"
                            render={({...field}) => (
                                <select {...field}>
                                    <option value="no">No</option>
                                    <option value="yes">Yes</option>
                                </select>
                            )} 
                        />
                    </label>
                </div>

                <div>
                    <label>
                    Is there anything we haven’t asked you about that you think we should know?
                        <Controller
                            control={control}
                            name="extra_details"
                            render={({...field}) => (
                                <select {...field}>
                                    <option value="no">No</option>
                                    <option value="yes">Yes</option>
                                </select>
                            )} 
                        />
                    </label>
                </div>

                <div>
                    <label>
                    Do you smoke, and if yes how many a day? 
                        <Controller
                            control={control}
                            name="smoke"
                            render={({...field}) => (
                                <select {...field}>
                                    <option value="no">No</option>
                                    <option value="yes">Yes</option>
                                </select>
                            )} 
                        />
                    </label>
                </div>

                <div>
                    <label>
                    Do you drink alcohol? If yes, how many units a week? 
                        <Controller
                            control={control}
                            name="alcohol"
                            render={({...field}) => (
                                <select {...field}>
                                    <option value="no">No</option>
                                    <option value="yes">Yes</option>
                                </select>
                            )} 
                        />
                    </label>
                </div>

                <button type="submit">Submit</button>


            </form>
        </div>
    )

    

}






