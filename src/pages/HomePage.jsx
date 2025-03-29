import React, { useState }from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import  { useUser } from '@clerk/clerk-react'; // for authentication
import { Link } from 'react-router-dom'; //for navigation
import '../styles/homepage.css';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/NavBar';

export default function HomePage() {
  
  const { isSignedIn } = useUser(); // get the login status from Clerk
  const { t } = useTranslation();
  

  return (
    <div className='homepage'>
      <Header />

      {/* need to show navigation button only when user is signed in */}
      <Navbar /> 

      <main className='main-content'>

        <section className='welcome-section'>
          <h1>{t('homepage.welcome-title')} </h1>
          <p>{t("homepage.welcome-description")}</p>
          <p>{t("homepage.welcome-schedule")}</p>
        </section>

        <section className='story-section'>
          <h2>{t('homepage.story-title')}</h2>
          <p>
          {t("homepage.start-year")}
          {t("homepage.over-years")}
          {t("homepage.future")}
          </p>
        </section>

        <div className='services-location-times'>

          <section className='services-section'>
            <h2>{t('homepage.services-title')}</h2>
            <p>
              <ul className='services-list'>
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
