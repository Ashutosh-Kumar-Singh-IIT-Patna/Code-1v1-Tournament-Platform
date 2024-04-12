import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

const Room = () => {
  const { roomId } = useParams(); // Get the roomId from the URL params
  const [gamerName, setGamerName] = useState("");
  const [roomName,setRoomName] = useState("");
  const [userID,setUserID] = useState("");
  const [participants, setParticipants] = useState([]);
  const [isAdmin,setIsAdmin] = useState(false);
  const [admi,setAdmi] = useState("");
  const [started,setStarted] = useState(false);
  let {user} = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    user = JSON.parse(localStorage.getItem("user"));
    setUserID(user.id);
    // Check if user data exists in context
    if (!user) {
      // If user data does not exist, redirect to login page
      navigate("/login");
    }
  }, [user, navigate]);

  let errorShown = false;

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/rooms/getRoomDetails", { params: { roomId } });
        const { name, admin, participants, isStarted } = response.data.room;

        if(admi === ""){
          setAdmi(admin);
        }
        
        if(roomName === ""){
          setRoomName(name);
        }

        setStarted(isStarted);
        setParticipants(participants);

        if(gamerName === ""){
          const gamer = participants.find(participant => participant.id === userID);
          setGamerName(gamer?.name);
          if(admin === userID){
            setIsAdmin(true);
          }
        }
        if(started){
          console.log("tournament started");
          navigate(`/room/${roomId}/tournament`);
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

    const interval = setInterval(fetchRoomDetails, 10000); // 10000 milliseconds = 10 seconds

    return () => clearInterval(interval); // Clean up the interval

  }, [userID,started]);

  const handleLeaveRoom = () => {
    axios
      .post("http://localhost:5000/api/rooms/leave", { roomId, userID })
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
      .delete("http://localhost:5000/api/rooms/deleteRoom", { data: { roomId } } )
      .then((response) => {
        navigate(`/home`); // Use navigate function to redirect
      })
      .catch((error) => {
        console.error("Error deleting room:", error);
        // Handle error (e.g., display error message)
      });
  };

  const startTournament = () => {
    axios
      .post("http://localhost:5000/api/tournament/startTournament", {  roomId  } )
      .then((response) => {
        navigate(`/room/${roomId}/tournament`); // Use navigate function to redirect
      })
      .catch((error) => {
        console.error("Error starting tournament:", error);
      });
  };
  
  return (
    <div>
      <h1>Hello, {gamerName}</h1>
      <h1>Welcome to "{roomName}"</h1> 
      <h4>Share Room ID with others to join: {roomId} </h4>
      <h2>Participants:</h2>
      <ul>
        {participants?.map((participant, index) => (
          <li key={index}>{participant.name} {participant.id===admi?(<>(Admin)</>):(<></>)}</li> // Accessing the 'name' property
        ))}
      </ul>
      
      {isAdmin ? (
        <>
          <button onClick={startTournament}>Start Tournament</button>
          <button onClick={handleDeleteRoom}>Delete Room</button>
        </>
      ) : (
        <button onClick={handleLeaveRoom}>Leave Room</button>
      )}

    </div>
  );
};

export default Room;
