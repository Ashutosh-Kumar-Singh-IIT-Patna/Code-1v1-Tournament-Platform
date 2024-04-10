import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';

import Signup from './components/Signup';
import Login from './components/Login';
import Home from './components/Home';
import CreateRoom from './components/CreateRoom';
import JoinRoom from './components/JoinRoom';
import Room from './components/Room';

function App() {
  const [userName, setUserName] = useState('');

  // useEffect(() => {
  //   // Fetch user name from server upon app load
  //   axios.get('http://localhost:5000/api/auth/getUserName')
  //     .then(response => {
  //       setUserName(response.data.userName);
  //     })
  //     .catch(error => {
  //       console.log(error);
  //     });
  // }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={userName ? '/home' : '/login'} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/create-room" element={<CreateRoom />} />
        <Route path="/join-room" element={<JoinRoom />} />
        <Route path="/room/:roomId" element={<Room />} />
      </Routes>
    </Router>
  );
}

export default App;
