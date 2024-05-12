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
    if(roomId==""){
      alert("Room ID input can't be empty");
      return;
    }
    if(userName==""){
      alert("Your Name input can't be empty");
      return;
    }
    axios
      .post("https://code-1v1-tournament-platform-backend.vercel.app/api/rooms/join", { roomId, userName, userID })
      .then((response) => {
        // console.log(response.data);
        // console.log("joining room");
        // Redirect to room page
        navigate(`/room/${roomId}`); // Use navigate function to redirect
      })
      .catch((error) => {
        console.error("Error joining room:", error);
        alert("Room not found");
        // Handle error (e.g., display error message)
      });
  };

  return (
    <div style={{ 
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "95.5vh", /* Changed height to minHeight for responsiveness */
      background: "linear-gradient(135deg, #2980b9, #2c3e50)",
      color: "#fff",
      fontFamily: "'Roboto', sans-serif",
      paddingBottom: "2rem" /* Added padding bottom for spacing */
    }}>
      <h1 style={{ 
        fontSize: "3rem",
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: "4rem",
        textShadow: "2px 2px 4px rgba(0, 0, 0, 0.4)"
      }}>Join Room</h1>
      <div style={{ marginBottom: "1rem" }}>
        <label htmlFor="roomId" style={{ color: "#fff", fontSize: "1.5rem", marginBottom: "0.5rem"}}>Room ID: &nbsp;</label>
        <input
          type="text"
          id="roomId"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          style={{
            padding: "0.5rem",
            borderRadius: "5px",
            border: "2px solid #fff", /* Added border */
            marginBottom: "1rem",
            width: "300px", /* Adjust width as needed */
            fontSize: "1.2rem",
            backgroundColor: "rgba(255, 255, 255, 0.1)", /* Added background color with transparency */
            color: "#fff", /* Added text color */
            outline: "none", /* Removed outline */
            transition: "border-color 0.3s ease, background-color 0.3s ease", /* Added transition */
          }}
        />
      </div>
      <div style={{ marginBottom: "1rem" }}>
        <label htmlFor="userName" style={{ color: "#fff", fontSize: "1.5rem", marginBottom: "0.5rem" }}>Your Name: &nbsp;</label>
        <input
          type="text"
          id="userName"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          style={{ 
            padding: "0.5rem",
            borderRadius: "5px",
            border: "2px solid #fff", /* Added border */
            marginBottom: "1rem",
            width: "300px", /* Adjust width as needed */
            fontSize: "1.2rem",
            backgroundColor: "rgba(255, 255, 255, 0.1)", /* Added background color with transparency */
            color: "#fff", /* Added text color */
            outline: "none", /* Removed outline */
            transition: "border-color 0.3s ease, background-color 0.3s ease", /* Added transition */
          }}
        />
      </div>
      <button onClick={handleJoinRoom} style={{ 
        padding: "1rem",
        backgroundColor: "#16a085",
        color: "#fff",
        border: "none",
        borderRadius: "10px",
        cursor: "pointer",
        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
        transition: "background-color 0.3s ease, transform 0.2s ease",
        fontSize: "1.2rem",
        fontWeight: "bold",
        textShadow: "1px 1px 2px rgba(0, 0, 0, 0.6)",
        marginTop:"2rem"
      }}
      onMouseEnter={(e) => {
        e.target.style.backgroundColor = "#1abc9c";
        e.target.style.transform = "scale(1.05)";
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = "#16a085";
        e.target.style.transform = "scale(1)";
      }}>Join Room</button>
    </div>
  );
};

export default JoinRoom;
