import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import { useAuth } from "./AuthContext"; // Import useAuth hook from AuthContext
import { useEffect } from "react";

const CreateRoom = () => {
  const [roomName, setRoomName] = useState("");
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

  const handleCreateRoom = () => {
    axios
      .post("http://localhost:5000/api/rooms/create", { roomName, userName, userID })
      .then((response) => {
        console.log(response.data);
        // Redirect to room page
        navigate(`/room/${response.data.roomId}`); // Use navigate function to redirect
      })
      .catch((error) => {
        console.error("Error creating room:", error);
        // Handle error (e.g., display error message)
      });
  };

  return (
    <div>
      <h1>Create Room</h1>
      <div>
        <label htmlFor="roomName">Room Name:</label>
        <input
          type="text"
          id="roomName"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
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
      <button onClick={handleCreateRoom}>Create Room</button>
    </div>
  );
};

export default CreateRoom;
