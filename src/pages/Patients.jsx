import React, {useEffect, useState} from 'react';
import supabase from '../supabaseClient'; // Supabase client to interact with the database
import { useNavigate } from 'react-router-dom'; // for page navigation
import { useTranslation } from 'react-i18next'; // multi-language support
import '../styles//patients.css'; // css styling for the patients page

/**
 * Patients page displays a list of patients that have been recorded in the Supabase database. The user (doctor)
 * - can search for a patient by name or date of birth
 * - can view patient details by clicking on the name
 * - can navigate to Create New Patient page 
 * 
 */


export default function Patients() {
  const [patients, setPatients] = useState([]); // store fetched patient data
  const navigate = useNavigate(); // routing to other pages
  const [searchQuery,setSearchQuery] = useState(''); //  track text entered in search bar 
  const [loading, setLoading] = useState(false); // to show a loading message while data is being fetched from database
  const {t} = useTranslation(); // translations from i18n

  // it redirects user to Create New Patient page when clicked
  const handleCreatePatient = () => {
    navigate("/create-patient");
  };

  // convert date from  dd.mm.yyyy format to yyyy.mm.dd format which is accepted by Supabase 
  const supabaseDateFormat = (inputDate) => {
    const dateParts = inputDate.split("."); // split the input date string with '.' into [day, month, year]
    if (dateParts.length === 3) { 
      const [day, month, year] = dateParts; // if the input has the 3 parts day, month, year, save date as an array of these 3 parts
      return `${year}-${month}-${day}`; // convert the date to supabse format yyyy-mm-dd
    }
    return inputDate; // if the input doesn't match the expected format, return it as it is
  };

  /* 
  * this function gets patients from Supabase and supports these modes:
  *    - by default it fetches all users with role patient in the database
  *    - if a name is types, it searches by full name using case insensitive search
  *    - if a date of birth is entered (in format dd.mm.yyyy) searches for matching patients
  * 
  */
  const getPatients = async (query = '') => { // the query parameter will hold whatever the user types into the search bar
    setLoading(true);
    try {
      let request; // will hold Supabase request 

      if (query.trim()) { // check if search input is not empty and removes any spaces
        
        if (/^\d{2}\.\d{2}\.\d{4}$/.test(query.trim())){ // check if the date imput matches the pattern dd.mm.yyyy
          const formatedDate = supabaseDateFormat(query.trim()); // convert the date entered to the way supabase accepts it

          // Supabase query that selects only the user id, full name, date of birth, users with role patient
          request= supabase
            .from('users')
            .select('id, full_name, date_of_birth')
            .eq('role', 'patient')
            .eq('date_of_birth', formatedDate); // search by date
        } else {
          request = supabase
            .from('users')
            .select('id, full_name, date_of_birth')
            .eq('role', 'patient')
            .ilike('full_name', `%${query}%`) //search by name
            .order('full_name', {ascending: true});
        }
      } else { // if nothing typed in the search bar, fetch all users with role patient
        request = supabase.from('users').select('id, full_name, date_of_birth').eq('role', 'patient').order('full_name', {ascending: true});
      }

      // now send the query request to Supabase and wait for a response
      const { data, error } = await request;

      if (error) throw error; // inform of any errors
      setPatients(data); // if no error occured update the patients state with the fetched data to display on the page
    } catch (error) {
      console.error(t("create-patient.fetch-error-patient"), error) // infrom about what went wrong
    } finally {
      setLoading(false); // stop showing the loading indicator
    }
  }; 

  /**
   * useEffect runs when the searchQuery value changes
   * Tt waits for 500ms after the user stops typing before calling getPatients 
   * This avoids calling Supabase on every letter typed
   */
  
  useEffect(() => {
    // start a 500ms timer before fetching patients based on the search input
    const delaySearch = setTimeout(() => {
      getPatients(searchQuery); // fetch patients using current search query
    }, 500);

    return () => clearTimeout(delaySearch); // if the user types again before 500ms, cancel the previous timer

  }, [searchQuery]); // the effect runs every time the searchQuery value changes
  
  // fetch all patients when the page first loads
  useEffect(() => {
    getPatients(); // and load the default patient list
  }, []);

  return (
    <div className='patients'>
      {/* page title */}
      <h1>{t("patients.title")}</h1>

      {/* search bar and create new patient button*/}
      <div className='patients-actions'>

        {/* search input - update searchQuery state on typin */}
        <input type="text"
        className='search-bar'
        placeholder={t("patients.search")}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)} />

        {/* create patient button */}
        <button className='action-button-p' onClick={handleCreatePatient}>{t("button.new-patient")}</button>
      </div>

      {/* main content- diplay patients or loading */}
      {loading ? (
        // show loading text while data is being fetched
        <p>{t("patients.loading")}</p>
      ) : patients.length > 0 ? (
        // if patients were found, display them in a list
        <ul className='patients-list'>
          {patients.map((patient) =>(
            // navigate to the clicked patient's profile
            <li key={patient.id} className='patient-item' onClick={()=> navigate(`/patient-profile/${patient.id}`)}>  
              <span>{patient.full_name}</span>
              {/* patient's date of birth (formatted from yyyy.mm.dd to dd.mm.yyyy) */}
              <span style={{float: 'right', color: '#555'}}>
                {patient.date_of_birth ? patient.date_of_birth.split("-").reverse().join(".") : ""}</span>
            </li>
          ))}
        </ul>
      ) : (
        // if no patients were found, show a message
        <p>{t("patients.no-patient")}</p>
      )}
      
    </div>
  );

}