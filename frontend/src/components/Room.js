import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const Room = ({ match }) => {
  const [userName, setUserName] = useState('');
  const [participants, setParticipants] = useState([]);
  const socket = io();

  useEffect(() => {
    // Fetch user name from server upon component mount
    axios.get('http://localhost:5000/api/auth/getUserName')
      .then(response => {
        setUserName(response.data.userName);
      })
      .catch(error => {
        console.error('Error fetching user name:', error);
        // Handle error (e.g., display error message)
      });

    // Join the room upon component mount
    socket.emit('joinRoom', { roomId: match.params.roomId, userName });

    // Listen for participants list from the server
    socket.on('participantsList', ({ participants }) => {
      setParticipants(participants);
    });

    return () => {
      // Leave the room upon component unmount
      socket.emit('leaveRoom', { roomId: match.params.roomId, userName });
    };
  }, [match.params.roomId, userName, socket]);

  return (
    <div>
      <h1>Hello, {userName}!</h1>
      <h2>Participants:</h2>
      <ul>
        {participants.map((participant, index) => (
          <li key={index}>{participant}</li>
        ))}
      </ul>
    </div>
  );
};

export default Room;
