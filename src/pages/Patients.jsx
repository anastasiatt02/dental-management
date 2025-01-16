import React, {useEffect, useState} from 'react'
import supabase from '../supabaseClient'
import { useNavigate } from 'react-router-dom';
// import { useForm } from "react-hook-form";


export default function Patients() {
  // navigating button - New patient
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();

  const handleCreatePatient = () => {
    navigate("/create-patient");
  };

  //get patients
  const getPatients = async () => {
    try {
      const { data } = await supabase.from('users').select('*');
      setPatients(data);
    } catch (error) {
      console.error(error);
    };

    useEffect(() => {
      getPatients();
    }, []);
  }
  

  return (
    <div className='patients'>
      <h1>Patients' Page</h1>
      <div className='patients-actions'>
      <button className='action-button-p' onClick={handleCreatePatient}>Create patient</button>
      {/* <p>{JSON.stringify(patients)}</p> */}
      </div>
    </div>
  );

  // const [patiens, setPatients] = useState([])

  // const getPatients = async () => {
  //   try {
  //     const {data} = await supabase.from("users").select("*")
  //     setPatients(data)
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }

  // useEffect(() => {
  //   getPatients()
  // }, [])

  // useEffect(() => {
  //   console.log("I will print only the first time I will render/mounted or if the count changes")
  // }, [])

  // return (
  //   <div>
  //     <p>{JSON.stringify(patiens)}</p>
  //   </div>
  // )
}