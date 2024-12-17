import React, {useEffect, useState} from 'react'
import supabase from '../supabaseClient'

export default function Patients() {
  const [patiens, setPatients] = useState([])

  const getPatients = async () => {
    try {
      const {data} = await supabase.from("users").select("*")
      setPatients(data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getPatients()
  }, [])

  useEffect(() => {
    console.log("I will print only the first time I will render/mounted or if the count changes")
  }, [])

  return (
    <div>
      <p>{JSON.stringify(patiens)}</p>
    </div>
  )
}