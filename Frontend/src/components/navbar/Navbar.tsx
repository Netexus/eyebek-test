"use client"
import React, { useState } from 'react';
import Image from 'next/image'; 
import { IoGlobeOutline, IoChevronDown, IoMenu } from 'react-icons/io5';
import GenericButton from '@/components/GenericButton/GenericButton';
import styles from './Navbar.module.css';
import logo from '@/assets/logo.png';

interface NavbarProps {
  onLogin?: () => void;
}

const Navbar = ({ onLogin }: NavbarProps) => {
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('ES');

  const navLinks = [
    { name: 'Inicio', href: '#inicio' },
    { name: 'Planes', href: '#planes' },
    { name: 'Testimonios', href: '#testimonios' },
    { name: 'Contacto', href: '#contacto' },
  ];

  const languages = ['ES', 'EN'];

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>

        <div className={styles.logoImage}>
        <Image 
            src={logo} 
            alt="EyeBek Logo" 
            width={60} 
            height={60} 
            className={styles.logoImage} 
        />
        </div>

        {/* Menú de navegación */}
        <ul className={styles.navMenu}>
          {navLinks.map((link) => (
            <li key={link.name}>
              <a href={link.href} className={styles.navLink}>
                {link.name}
              </a>
            </li>
          ))}
        </ul>

        {/* Zona derecha */}
        <div className={styles.rightSection}>
          
          {/* Selector de idioma */}
          <div className={styles.languageSelector}>
            <IoGlobeOutline className={styles.globeIcon} />
            
            <div className={styles.dropdownWrapper}>
              <button
                type="button"
                className={styles.dropdownButton}
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
              >
                <span>{selectedLanguage}</span>
                <IoChevronDown 
                  className={`${styles.arrowIcon} ${isLanguageOpen ? styles.arrowRotated : ''}`} 
                />
              </button>

              {isLanguageOpen && (
                <ul className={styles.dropdownMenu}>
                  {languages.map((lang) => (
                    <li
                      key={lang}
                      className={`${styles.dropdownItem} ${selectedLanguage === lang ? styles.dropdownItemActive : ''}`}
                      onClick={() => {
                        setSelectedLanguage(lang);
                        setIsLanguageOpen(false);
                      }}
                    >
                      {lang}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Botón de login */}
          <GenericButton
            textButton="Iniciar sesión"
            type="button"
            onClick={onLogin}
            size="none"
            variant="black"
            className={styles.loginButton}
          />
        </div>

        {/* Menú móvil */}
        <button type="button" className={styles.mobileMenuButton}>
          <IoMenu />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;