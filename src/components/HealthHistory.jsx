import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm, Controller } from 'react-hook-form';

export default function HealthHistory() {
    const { register, control, handleSubmit, watch } = useForm();
    const location = useLocation();
    const patientDetails = location.state;

    // watch fields
    const watchReceivingTreatment = watch('receiving_treatment');
    const watchIsPregnant = watch('is_pregnant');
    const watchIllness = watch('has_illness');
    const watchAlcohol = watch('consume_alcohol');
    const watchSmoke = watch('smoke');


    const onSubmit = async (data) => {
        // combine data from both forms
        const combineData = {
            ...patientDetails, 
            health_history: Object.entries(data).filter(([key, value]) => value && value.answer === 'yes') // only yes answers are recorded
            .map(([key, value]) => ({
                type: key,
                details: value.details || null,
            })),
        }

        console.log('Combined data: ', combineData);
        // submit to database instead once it works
        alert('health history submitted!');

    };

    return (
        <div className="form-container">
            <h1>Health history</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
            {/* health history form */}
            {/* are you */}
            <h3>Are you..</h3>

            {/* receiving tretment */}
            <div>
                <label>Receiving any treatment at the moment?
                    <Controller 
                    control={control} 
                    name="receiving_treatment" 
                    render={({field}) => (
                        <>
                        <select {...field}> 
                            <option value="no">No</option>
                            <option value="yes">Yes</option>
                        </select>
                        {watchReceivingTreatment === 'yes' && (
                            <input 
                            type="text" 
                            placeholder="Details" 
                            {...register('receiving_treatment_details')}
                            />
                        )}
                        </>
                    )}/>
                </label>
            </div>

            {/* pregnant */}
            <div>
                <label>Pregnant?
                    <Controller 
                    control={control} 
                    name="is_pregnant" 
                    render={({field}) => (
                        <>
                        <select {...field}> 
                            <option value="no">No</option>
                            <option value="yes">Yes</option>
                        </select>
                        {watchIsPregnant === 'yes' && (
                            <input 
                            type="text" 
                            placeholder="How many weeks pregnant?" 
                            {...register('pregnancy_details')}
                            />
                        )}
                        </>
                    )}/>
                </label>
            </div>

            {/* do you */}
            <h3>Do you..</h3>

            {/* illness */}
            <div>
                <label>Suffer from any illnesses?
                    <Controller 
                    control={control} 
                    name="has_illness" 
                    render={({field}) => (
                        <>
                        <select {...field}> 
                            <option value="no">No</option>
                            <option value="yes">Yes</option>
                        </select>
                        {watchIllness === 'yes' && (
                            <input 
                            type="text" 
                            placeholder="Which one?" 
                            {...register('illnesses')}
                            />
                        )}
                        </>
                    )}/>
                </label>
            </div>

            {/* alcohol consumption */}
            <div>
                <label>Consume alcohol?
                    <Controller 
                    control={control} 
                    name="consume_alcohol" 
                    render={({field}) => (
                        <>
                        <select {...field}> 
                            <option value="no">No</option>
                            <option value="yes">Yes</option>
                        </select>
                        {watchAlcohol === 'yes' && (
                            <input 
                            type="text" 
                            placeholder="How often?" 
                            {...register('alcohol')}
                            />
                        )}
                        </>
                    )}/>
                </label>
            </div>

            {/* smoke */}
            <div>
                <label>Smoke?
                    <Controller 
                    control={control} 
                    name="smoke" 
                    render={({field}) => (
                        <>
                        <select {...field}> 
                            <option value="no">No</option>
                            <option value="yes">Yes</option>
                        </select>
                        {watchSmoke === 'yes' && (
                            <input 
                            type="text" 
                            placeholder="How often?" 
                            {...register('smokeer')}
                            />
                        )}
                        </>
                    )}/>
                </label>
            </div>

            {/* allergies */}
            <h3>Do you have allergy from..</h3>
            <div>
                <label>Latex gloves?
                    <Controller 
                    control={control} 
                    name="smoke" /////////////////
                    render={({field}) => (
                        <>
                        <select {...field}> 
                            <option value="no">No</option>
                            <option value="yes">Yes</option>
                        </select>
                        </>
                    )}/>
                </label>
            </div>

            <div>
                <label>Local anesthetics?
                    <Controller 
                    control={control} 
                    name="smoke" 
                    render={({field}) => (
                        <>
                        <select {...field}> 
                            <option value="no">No</option>
                            <option value="yes">Yes</option>
                        </select>
                        </>
                    )}/>
                </label>
            </div>

            <div>
                <label>Antibiotics?
                    <Controller 
                    control={control} 
                    name="smoke" ////////////
                    render={({field}) => (
                        <>
                        <select {...field}> 
                            <option value="no">No</option>
                            <option value="yes">Yes</option>
                        </select>
                        </>
                    )}/>
                </label>
            </div>

            <div>
                <label>Metals?
                    <Controller 
                    control={control} 
                    name="smoke" /////////////////
                    render={({field}) => (
                        <>
                        <select {...field}> 
                            <option value="no">No</option>
                            <option value="yes">Yes</option>
                        </select>
                        </>
                    )}/>
                </label>
            </div>

            {/* others */}
            <div>
                <label>Other: 
                    <textarea
                    placeholder="Add any additional information here.."
                    {...register('others')}
                    />
                </label>
            </div>


            </form>

        </div>
    )

    

}






