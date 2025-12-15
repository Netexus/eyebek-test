import React from 'react';
import { 
  FaLinkedinIn, 
  FaFacebookF, 
  FaInstagram 
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6'; 
import { IoMailOutline, IoCallOutline, IoLocationOutline } from 'react-icons/io5';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        
        <div className={styles.topSection}>
          
          <div className={styles.column}>
            <h3 className={styles.brandName}>EyeBek</h3>
            <p className={styles.brandDescription}>
              Sistema de asistencias con reconocimiento facial para empresas modernas.
            </p>
          </div>

          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Producto</h4>
            <ul className={styles.linkList}>
              <li><a href="#planes" className={styles.link}>Planes y precios</a></li>
              <li><a href="#funcionalidades" className={styles.link}>Funcionalidades</a></li>
              <li><a href="#integraciones" className={styles.link}>Integraciones</a></li>
              <li><a href="#api" className={styles.link}>API</a></li>
            </ul>
          </div>

          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Empresa</h4>
            <ul className={styles.linkList}>
              <li><a href="#nosotros" className={styles.link}>Sobre nosotros</a></li>
              <li><a href="#testimonios" className={styles.link}>Testimonios</a></li>
              <li><a href="#blog" className={styles.link}>Blog</a></li>
              <li><a href="#carreras" className={styles.link}>Carreras</a></li>
            </ul>
          </div>

          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Contacto</h4>
            <ul className={styles.contactList}>
              <li className={styles.contactItem}>
                <IoMailOutline className={styles.contactIcon} />
                <a href="mailto:contacto@eyebek.com" className={styles.link}>contacto@eyebek.com</a>
              </li>
              <li className={styles.contactItem}>
                <IoCallOutline className={styles.contactIcon} />
                <a href="tel:+34900123456" className={styles.link}>+34 900 123 456</a>
              </li>
              <li className={styles.contactItem}>
                <IoLocationOutline className={styles.contactIcon} />
                <span>Riwi, Guayabal, Medellín, Colombia</span>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.bottomBar}>
          
          <div className={styles.copyright}>
            © 2025 EyeBek. Todos los derechos reservados.
          </div>

          <div className={styles.socialsAndLegal}>
            <div className={styles.socialIcons}>
              <a href="#" aria-label="LinkedIn" className={styles.socialLink}>
                <FaLinkedinIn />
              </a>
              <a href="#" aria-label="Twitter / X" className={styles.socialLink}>
                <FaXTwitter />
              </a>
              <a href="#" aria-label="Facebook" className={styles.socialLink}>
                <FaFacebookF />
              </a>
              <a href="#" aria-label="Instagram" className={styles.socialLink}>
                <FaInstagram />
              </a>
            </div>

            <div className={styles.legalLinks}>
              <a href="#privacidad" className={styles.legalLink}>Política de privacidad</a>
              <a href="#terminos" className={styles.legalLink}>Términos de servicio</a>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;