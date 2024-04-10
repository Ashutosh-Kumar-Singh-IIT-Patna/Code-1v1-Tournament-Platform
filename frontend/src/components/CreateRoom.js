import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import io from 'socket.io-client';

const CreateRoom = () => {
  const [roomName, setRoomName] = useState('');
  const [userName, setUserName] = useState('');
  const navigate = useNavigate(); // Replace useHistory with useNavigate

  const socket = io(); // Connect to the socket server

  const handleCreateRoom = () => {
    axios.post('http://localhost:5000/api/rooms/create', { roomName, userName })
      .then(response => {
        console.log(response.data);
        // Emit a socket event to notify the server about the new room
        socket.emit('createRoom', { roomId: response.data.roomId, roomName, userName });
        // Redirect to room page
        navigate(`/room/${response.data.roomId}`); // Use navigate function to redirect
      })
      .catch(error => {
        console.error('Error creating room:', error);
        // Handle error (e.g., display error message)
      });
  };

  return (
    <div>
      <h1>Create Room</h1>
      <div>
        <label htmlFor="roomName">Room Name:</label>
        <input type="text" id="roomName" value={roomName} onChange={e => setRoomName(e.target.value)} />
      </div>
      <div>
        <label htmlFor="userName">Your Name:</label>
        <input type="text" id="userName" value={userName} onChange={e => setUserName(e.target.value)} />
      </div>
      <button onClick={handleCreateRoom}>Create Room</button>
    </div>
  );
};

export default CreateRoom;
