import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
  const [userName, setUserName] = useState('');

  // useEffect(() => {
  //   // Fetch user name from server upon component mount
  //   axios.get('http://localhost:5000/api/auth/getUserName')
  //     .then(response => {
  //       setUserName(response.data.userName);
  //     })
  //     .catch(error => {
  //       console.error('Error fetching user name:', error);
  //       // Handle error (e.g., display error message)
  //     });
  // }, []);

  return (
    <div>
      <h1>Welcome, {userName}!</h1>
      <div>
        <Link to="/create-room">Create Room</Link>
      </div>
      <div>
        <Link to="/join-room">Join Room</Link>
      </div>
    </div>
  );
};

export default Home;
