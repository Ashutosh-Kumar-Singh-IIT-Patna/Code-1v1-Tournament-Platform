import React from 'react';
import { FaPhone, FaEnvelope, FaGithub, FaLinkedin } from 'react-icons/fa';
import "../css/ContactUs.css";

const ContactUs = () => {
  return (
    <div style={{ 
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "94.5vh",
      background: "linear-gradient(135deg, #2980b9, #2c3e50)",
      color: "#fff",
      fontFamily: "'Roboto', sans-serif",
      padding: "20px",
      textAlign: "center",
    }}>
      <h1 style={{ fontSize: '36px', marginBottom: '24px' }}>Contact Us</h1>
      <div style={{ margin: '20px 0', fontSize: '20px' }}>
        <FaPhone style={{ marginRight: '20px', fontSize: '24px', transition: 'all 0.3s' }} />
        <span>+91 7004482646</span>
      </div>
      <div style={{ margin: '20px 0', fontSize: '20px' }}>
        <FaEnvelope style={{ marginRight: '20px', fontSize: '24px', transition: 'all 0.3s' }} />
        <a href="mailto:ashutoshksingh2003@gmail.com" style={{ color: '#fff', textDecoration: 'none' }}>ashutoshksingh2003@gmail.com</a>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <a href="https://github.com/Ashutosh-Kumar-Singh-IIT-Patna" target="_blank" rel="noopener noreferrer" className="social-link" style={{ color: '#fff', marginRight: '80px', fontSize: '30px', transition: 'all 0.3s', fontWeight: 'bold' }}>
          <FaGithub className="social-icon" style={{ transition: 'all 0.3s' }} />
        </a>
        <a href="https://www.linkedin.com/in/ashutosh-singh-iitp/" target="_blank" rel="noopener noreferrer" className="social-link" style={{ color: '#fff', fontSize: '30px', transition: 'all 0.3s', fontWeight: 'bold' }}>
          <FaLinkedin className="social-icon" style={{ transition: 'all 0.3s' }} />
        </a>
      </div>
    </div>
  );
};

export default ContactUs;
