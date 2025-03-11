import React from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/footer.css';

/**
 * Footer component
 * THis component represents the website's footer apearing at the bottom of every page
 * 
 * It dispalys a copyright message for the clinic
 * 
 */

export default function Footer() {
    const {t} = useTranslation();
    return (
        // Footer container
        <footer className='footer'>
            <div>&copy; {t('footer.footer-text')} </div>
        </footer>
    );
}