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

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/rooms/getRoomDetails", { params: { roomId } });
        const { name, participants } = response.data.room;
        
        setRoomName(name);
        setParticipants(participants);
  
        const gamer = participants.find(participant => participant.id === userID);
        if(gamer) setGamerName(gamer.name);
        
      } catch (error) {
        console.error("Error fetching room details:", error);
      }
    };
  
    fetchRoomDetails();
  }, [roomId, userID]);
  
  return (
    <div>
      <h1>Hello, {gamerName}! Welcome to "{roomName}" !!</h1>
      <h4>Share Room ID with others to join: {roomId} </h4>
      <h2>Participants:</h2>
      <ul>
        {participants && participants.map((participant, index) => (
          <li key={index}>{participant.name}</li> // Accessing the 'name' property
        ))}
      </ul>

    </div>
  );
};

export default Room;
