import React, {useEffect, useState} from 'react'
import supabase from '../supabaseClient'
import { useNavigate } from 'react-router-dom';
// import { useForm } from "react-hook-form";


export default function Patients() {
  // navigating button - New patient
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();
  const [searchQuery,setSearchQuery] = useState(''); //  search bar state
  const [loading, setLoading] = useState(false);

  const handleCreatePatient = () => {
    navigate("/create-patient");
  };

  //get patients
  const getPatients = async (query = '') => {
    setLoading(true);
    try {
      let request = supabase.from('users').select('*');

      if (query.trim()) {
        request = request.ilike('full_name', `%${query}%`); //case insensitive search

      }

      const { data, error } = await request;

      if (error) throw error;
      setPatients(data);
    } catch (error) {
      console.error('Error fetching patient: ', error)
    } finally {
      setLoading(false);
    }
  }; 

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      getPatients(searchQuery);
    }, 500);

    return () => clearTimeout(delaySearch);

  }, [searchQuery]);
  
  useEffect(() => {
    getPatients();
  }, []);

  return (
    <div className='patients'>
      <h1>Patients' Page</h1>
      <div className='patients-actions'>

        {/* search bar */}
        <input type="text"
        className='search-bar'
        placeholder='Search for a patient..'
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)} />

        {/* create patient button */}
      <button className='action-button-p' onClick={handleCreatePatient}>Create patient</button>
      {/* <p>{JSON.stringify(patients)}</p> */}
      </div>

      {/* diplay patients or loading */}
      {loading ? (
        <p>Loading patients..</p>
      ) : patients.length > 0 ? (
        <ul className='patients-list'>
          {patients.map((patient) =>(
            <li key={patient.id} className='patient-item'>
              {patient.full_name}
            </li>
          ))}
        </ul>
      ) : (
        <p>No patients found.</p>
      )}
      
    </div>
  );

}