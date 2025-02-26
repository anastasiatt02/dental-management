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

  const supabaseDateFormat = (inputDate) => {
    const dateParts = inputDate.split(".");
    if (dateParts.length === 3) {
      const [day, month, year] = dateParts;
      return `${year}-${month}-${day}`; // convert the date to supabse format yyyy-mm-dd
    }
    return inputDate;
  };

  //get patients
  const getPatients = async (query = '') => {
    setLoading(true);
    try {
      // let request = supabase.from('users').select('*');
      let request;

      if (query.trim()) {
        
        if (/^\d{2}\.\d{2}\.\d{4}$/.test(query.trim())){
          const formatedDate = supabaseDateFormat(query.trim()); // convert the date entered to the way supabase accepts it

          request= supabase
            .from('users')
            .select('id, full_name, date_of_birth')
            .eq('date_of_birth', formatedDate); // search by date
        } else {
          request = supabase
            .from('users')
            .select('id, full_name, date_of_birth')
            .ilike('full_name', `%${query}%`); //search by name
        }
      } else {
        request = supabase.from('users').select('id, full_name, date_of_birth');
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

      </div>

      {/* diplay patients or loading */}
      {loading ? (
        <p>Loading patients..</p>
      ) : patients.length > 0 ? (
        <ul className='patients-list'>
          {patients.map((patient) =>(
            <li key={patient.id} className='patient-item'>
              <span>{patient.full_name}</span>
              <span style={{float: 'right', color: '#555'}}>
                {patient.date_of_birth ? patient.date_of_birth.split("-").reverse().join(".") : ""}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No patients found.</p>
      )}
      
    </div>
  );

}