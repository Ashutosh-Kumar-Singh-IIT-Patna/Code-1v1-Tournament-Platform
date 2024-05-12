// NavBar.js

import React from 'react';
import { Link } from 'react-router-dom';
import '../css/NavBar.css'; // Import CSS file for styling

const NavBar = () => {
  return (
    <div className="navbar">
      <div className="navbar-items">
        <Link to="/rules" className="navbar-item">Know The Game</Link>
        <Link to="/contact" className="navbar-item">Contact Us</Link>
      </div>
    </div>
  );
}

export default NavBar;
