import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import { useAuth } from "./AuthContext"; // Import useAuth hook from AuthContext
import { useEffect } from "react";

const JoinRoom = () => {
  const [roomId, setRoomId] = useState("");
  const [userName,setUserName] = useState("");
  const [userID,setUserID] = useState("");
  let {user} = useAuth();
  const navigate = useNavigate(); // Replace useHistory with useNavigate

  useEffect(() => {
    user = JSON.parse(localStorage.getItem("user"));
    setUserID(user.id);
    // Check if user data exists in context
    if (!user) {
      // If user data does not exist, redirect to login page
      navigate("/login");
    }
  }, [user, navigate]);

  const handleJoinRoom = () => {
    axios
      .post("http://localhost:5000/api/rooms/join", { roomId, userName, userID })
      .then((response) => {
        // console.log(response.data);
        // console.log("joining room");
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
