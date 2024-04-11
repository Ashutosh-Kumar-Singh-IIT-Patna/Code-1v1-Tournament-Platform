import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook

const JoinRoom = () => {
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate(); // Replace useHistory with useNavigate

  const handleJoinRoom = () => {
    axios
      .post("http://localhost:5000/api/rooms/join", { roomId, userName })
      .then((response) => {
        console.log(response.data);
        // Redirect to room page
        navigate(`/room/${roomId}`); // Use navigate function to redirect
      })
      .catch((error) => {
        console.error("Error joining room:", error);
        // Handle error (e.g., display error message)
      });
  };

  return (
    <div>
      <h1>Join Room</h1>
      <div>
        <label htmlFor="roomId">Room ID:</label>
        <input
          type="text"
          id="roomId"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="userName">Your Name:</label>
        <input
          type="text"
          id="userName"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
      </div>
      <button onClick={handleJoinRoom}>Join Room</button>
    </div>
  );
};

export default JoinRoom;
