import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

const Room = () => {
  const { roomId } = useParams(); // Get the roomId from the URL params
  const [gamer, setGamer] = useState("");
  const [roomName,setRoomName] = useState("");
  const [userID,setUserID] = useState("");
  const [participants, setParticipants] = useState([]);
  const [isAdmin,setIsAdmin] = useState(false);
  const [admi,setAdmi] = useState("");
  const [started,setStarted] = useState(false);
  let {user} = useAuth();
  const navigate = useNavigate();

  let errorShown = false;

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        user = JSON.parse(localStorage.getItem("user"));
        setUserID(user.id);
        // Check if user data exists in context
        if (!user) {
          // If user data does not exist, redirect to login page
          navigate("/login");
        }
        const response = await axios.get("https://code-1v1-tournament-platform-backend.vercel.app/api/rooms/getRoomDetails", { params: { roomId } });
        const { name, admin, participants, isStarted, players } = response.data.room;

        setAdmi(admin);
        setRoomName(name);
        setStarted(isStarted);
        setParticipants(participants);

        const gamr = participants.find(participant => participant.id === user.id);
        setGamer(gamr);
        if(admin === user.id){
          setIsAdmin(true);
        }
        const isThere = players.findIndex(player => player.id === user.id);
        if(started && !(isThere===-1 && players.length>0)){
          navigate(`/room/${roomId}/tournament`);
          return;
        }
      } catch (error) {
        if (!errorShown) { // Check if the error alert has been shown
          errorShown = true; // Set the flag to true to indicate that the alert has been shown
          alert("Room doesn't exist");
          navigate("/home");
        }
      }
    };

    fetchRoomDetails();

    const interval = setInterval(fetchRoomDetails, 5000);

    return () => clearInterval(interval); // Clean up the interval

  }, [userID,started]);

  const handleLeaveRoom = () => {
    axios
      .post("https://code-1v1-tournament-platform-backend.vercel.app/api/rooms/leave", { roomId, userID })
      .then((response) => {
        // console.log(response.data);
        // console.log("joining room");
        // Redirect to room page
        navigate(`/home`); // Use navigate function to redirect
      })
      .catch((error) => {
        console.error("Error leaving room:", error);
        // Handle error (e.g., display error message)
      });
  };

  const handleDeleteRoom = () => {
    axios
      .delete("https://code-1v1-tournament-platform-backend.vercel.app/api/rooms/deleteRoom", { data: { roomId } } )
      .then((response) => {
        navigate(`/home`); // Use navigate function to redirect
      })
      .catch((error) => {
        console.error("Error deleting room:", error);
        // Handle error (e.g., display error message)
      });
  };

  const startTournament = () => {
    if(participants.length==1){
      alert("You need atleast 2 players!");
      return;
    }
    axios
      .post("https://code-1v1-tournament-platform-backend.vercel.app/api/tournament/startTournament", {  roomId  } )
      .then((response) => {
        navigate(`/room/${roomId}/tournament`); // Use navigate function to redirect
      })
      .catch((error) => {
        console.error("Error starting tournament:", error);
      });
  };

  const copyRoomId = () => {
      var roomIdText = document.querySelector('#room-id-span');
      var tempInput = document.createElement("input");
      document.body.appendChild(tempInput);
      tempInput.value = roomIdText.innerText;
      tempInput.select();
      document.execCommand("copy");
      document.body.removeChild(tempInput);
      alert("Room ID copied to clipboard: " + roomIdText.innerText);
  }
  
  return (
    <div
      style={{ 
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "94.5vh",
        background: "linear-gradient(135deg, #2980b9, #2c3e50)",
        color: "#fff",
        fontFamily: "'Roboto', sans-serif",
        padding: "20px", // Add some padding for better spacing
        textAlign: "center", // Center text content
      }}
    >
      <h1 style={{ marginTop: "2rem" }}>Hello, {gamer?.name}</h1>
      <h1 style={{ marginTop: "1rem" }}>Welcome to {roomName}</h1>
      <h4 style={{ marginTop: "1rem", color: "#fffccc" }}>Share Room ID with others to join: <span id="room-id-span" style={{ marginLeft: "0.5rem",fontSize:"20px", fontFamily: "'Courier New', monospace", color: "#ffcccc" }}>{roomId}</span> <button onClick={copyRoomId} style={{ marginLeft: "0.1rem", background: "#fff", color: "#000", border: "none", padding: "0.5rem 0.5rem", borderRadius: "5px", cursor: "pointer" }}>Copy</button></h4>
      <h2>Participants:</h2>
      <div style={{ 
        maxHeight: "300px", // Set a maximum height for the participant list
        overflowY: "auto", // Make the list scrollable if needed
        width: "100%", // Ensure the list takes full width
      }}>
        <ul style={{ 
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", // Adjust column width
          gap: "10px",
          listStyle: "none",
          padding: 0,
          margin: 0,
          }}>
          {participants?.map((participant, index) => (
            <li key={index} style={{ marginBottom: "5px", padding: "10px", background: "#34495e", borderRadius: "4px" }}>{participant.name} {participant.id === userID && "(You)"} {participant.id === admi && "(Admin)"}</li> 
          ))}
        </ul>
      </div>
      
      {isAdmin ? (
        <div style={{position:"absloute",marginTop: "15rem"}}>
          <button style={{ 
          textDecoration: "none",
          color: "#fff", /* Change text color to white */
          fontSize: "1.5rem",
          fontWeight: "bold",
          textShadow: "1px 1px 2px rgba(0, 0, 0, 0.6)",
          padding: "1rem",
          backgroundColor: "#16a085",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
          transition: "background-color 0.3s ease, transform 0.2s ease",
          display: "inline-block",
        }} onMouseEnter={(e) => {
          e.target.style.backgroundColor = "#1abc9c";
          e.target.style.transform = "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = "#16a085";
          e.target.style.transform = "scale(1)";
        }} onClick={startTournament}>
              Start Tournament
          </button>
          <button 
        style={{
          marginLeft: "10rem",
          textDecoration: "none",
          color: "#fff", /* Change text color to white */
          fontSize: "1.5rem",
          fontWeight: "bold",
          textShadow: "1px 1px 2px rgba(0, 0, 0, 0.6)",
          padding: "1rem",
          backgroundColor: "#e74c3c", // Red color
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
          transition: "background-color 0.3s ease, transform 0.2s ease",
          display: "inline-block",
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = "#c0392b"; // Darker shade of red on hover
          e.target.style.transform = "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = "#e74c3c";
          e.target.style.transform = "scale(1)";
        }}  
        onClick={handleDeleteRoom}>Delete Room</button>
        </div>
      ) : (
        <div style={{position:"absloute",marginTop: "15rem"}}>
        <button
        style={{
          textDecoration: "none",
          color: "#fff", /* Change text color to white */
          fontSize: "1.5rem",
          fontWeight: "bold",
          textShadow: "1px 1px 2px rgba(0, 0, 0, 0.6)",
          padding: "1rem",
          backgroundColor: "#e74c3c", // Red color
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
          transition: "background-color 0.3s ease, transform 0.2s ease",
          display: "inline-block",
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = "#c0392b"; // Darker shade of red on hover
          e.target.style.transform = "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = "#e74c3c";
          e.target.style.transform = "scale(1)";
        }}
        onClick={handleLeaveRoom}>Leave Room</button>
        </div>
      )}

    </div>
  );
};

export default Room;
