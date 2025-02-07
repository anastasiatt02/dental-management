import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';



export default function Appointments() {

    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const togglePopup = () => {
        setIsPopupOpen(!isPopupOpen);
    }

    // const handleCreateAppointment = () => {
    //     navigate("/create-appointment");
    // };

  return (
    <div className='appointments'>
      <h1>Appointments page</h1>
      <button className='appointments-actions' onClick={togglePopup}>
        Create appointment
      </button>
      {isPopupOpen && <PopupWindow onClose={togglePopup} />}
    </div>
  );
}

function PopupWindow({ onClose }) {
    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     console.log("Window closed");
    //     onClose();
    // };
    const [searchQuery, setSearchQuery] = useState(""); // patient search input by doctor
    const [searchResults, setSearchResults] = useState([]); // fetch patient results from database
    const [isSearching, setIsSearching] = useState(false); // loading indicator when searching for patient name

    const SUPABASE_URL = import.meta.env.VITE_SUPABASE_PROJECT_URL;
    const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

    const handleSearchChange = (e) => {
      setSearchQuery(e.target.value);
    };

    useEffect(() =>{
      const fetchPatients = async () => {
        if(searchQuery.length <2) {
          setSearchResults([]);
          return;
        }

        setIsSearching(true); // loading indicator
        
        try {
          const response = await fetch(
            `${SUPABASE_URL}/rest/v1/users?full_name=ilike.${encodeURIComponent(
              `%${searchQuery}%`
            )}`,
            {
              headers: {
                apiKey: SUPABASE_ANON_KEY,
                Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch patient data");
          }

          const patients = await response.json();
          setSearchResults(patients);
        } catch (error) {
          console.error("Error fetching patients: ", error);
        } finally {
          setIsSearching(false); //stop loading indicator
        }
      };

      fetchPatients();
    }, [searchQuery]); //runs whenever searchQuery changes

    const selectPatient = (patient) => {
      setSearchQuery(patient.full_name);
      setSearchResults([]);
    }


    return (
        <div className='popup'>
            <div className='popup-content'>
                <h2>Popup window</h2>
                {/* <form onSubmit={handleSubmit}>
                    <p>Create an appointment window</p>
                    <button type='submit'>Submit</button>
                </form>
                <button onClick={onClose}>Cancel</button> */}
                <form>
                  <label>
                    Search patient:
                    <input type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder='Enter patient name' />
                  </label>
                  {isSearching && <p>Searching...</p>}
                  <ul className='search-results'>
                    {searchResults.map((patient) => (
                      <li key={patient.id}
                      onClick={() => selectPatient(patient)}
                      style={{cursor: 'pointer', color: 'blue'}}>
                        {patient.full_name}
                      </li>
                    ))}
                  </ul>
                  <button type='submit'>Submit</button>
                </form>
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
}