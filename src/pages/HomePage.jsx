import React, { useState }from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import  { useUser } from '@clerk/clerk-react'; // for authentication
import { Link } from 'react-router-dom'; //for navigation
// import '../styles/homepage.css';
import { useTranslation } from 'react-i18next';

export default function HomePage() {
  
  const { isSignedIn } = useUser(); // get the login status from Clerk
  const { t } = useTranslation();
  

  return (
    <div className='homepage'>
      <Header />

      {/* need to show navigation button only when user is signed in */}
      {isSignedIn && (
        <div className='nav-bar'>
          <ul className='nav-links'>
            <li><Link to='/'>Home</Link></li>
            <li><Link to='/dashboard'>Dashboard</Link></li>
            <li><Link to='/patients'>Patients</Link></li>
            <li><Link to='/appointments'>Appointments</Link></li>
            
          </ul>
        </div>
      )}

      <main className='main-content'>

        <section className='welcome-section'>
          <h1>{t('homepage.welcome-title')} </h1>
          {/* <h1>{t('homepage.exampleDynamic',{v:"", name:"Anastasia"})} </h1> */}
          <p>
            At Saqellari Dental Clinic, we believe in creating healthy, 
            beautiful smiles that last a lifetime. Whether you are here for a routing check-up, cosmetic dentistry, 
            or specialised care, our experienced team is dedicated to providing exceptional
            dental services in a warm and friendly environment. Your comfort and oral health are our top priorities.
            Let us help you achieve the smile of your dreams!
          </p>
          {/* <p>{t('homepage.welcome-text')}</p> */}
          <p>Schedule your appointment today and experience the difference at Saqellari Dental Clinic!</p>
        </section>

        <section className='story-section'>
          <h2>{t('homepage.story-title')}</h2>
          <p>
          Founded in 2013, Saqellari Dental Clinic has been serving the community with a commitment to excellence in dental care. 
          What began as a small practice has grown into a trusted clinic known for personalized care and state-of-the-art technology.
          
          Over the years, we have built lasting relationships with our patients, offering a full spectrum of dental services that cater to all ages.
          Our team takes pride in staying at the forefront of dentistry, combining innovative techniques with compassionate care to deliver an exceptional patient experience.

          As we look to the future, we remain dedicated to our mission: to make every visit comfortable, stress-free, and focused on achieving optimal oral health for all our patients.
          </p>
        </section>

        <div className='services-location-times'>

          <section className='services-section'>
            <h2>{t('homepage.services-title')}</h2>
            <p>
              <ul>
                <li>{t('homepage.crown')}</li>
                <li>{t('homepage.filling')}</li>
                <li>{t('homepage.root-canal')}</li>
                <li>{t('homepage.whitening')}</li>
                <li>{t('homepage.denture')}</li>
                <li>{t('homepage.extraction')}</li>
                <li>{t('homepage.bonding')}</li>
              </ul>
            </p>
          </section>

          <section className='location-section'>
            <div className='map-address'>
              <h2>{t('homepage.location-title')}</h2>
              <p>{t('homepage.street')}</p>
              <p>{t('homepage.city-code')}</p>
              <p>{t('homepage.country')}</p>
            </div>
            <div className='map'>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2996.3173373081327!2d19.778362176219616!3d41.32371237130806!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x135030353c967a25%3A0xf682e4b8b57639!2sKlinika%20Dentare%20%22Saqellari%22!5e0!3m2!1sen!2suk!4v1731680673634!5m2!1sen!2suk"
                allowFullScreen=''
                loading="lazy"
                title="Google Maps Location"
              />
            </div>
          </section>

          <section className='opening-hours'>
            <h2>{t('homepage.work-hours')}</h2>
              <ul>
                <li>{t('homepage.monday')}: 9:00 - 18:00 </li>
                <li>{t('homepage.tuesday')}: 9:00 - 18:00</li>
                <li>{t('homepage.wednesday')}: 9:00 - 18:00</li>
                <li>{t('homepage.thursday')}: 9:00 - 18:00</li>
                <li>{t('homepage.friday')}: 9:00 - 18:00</li>
                <li>{t('homepage.saturday')}: 9:00 - 18:00</li>
                <li>{t('homepage.sunday')}: {t('homepage.closed')}</li>
              </ul>
        </section>
        </div>
      </main>
      <Footer/>
    </div>
  )
}
