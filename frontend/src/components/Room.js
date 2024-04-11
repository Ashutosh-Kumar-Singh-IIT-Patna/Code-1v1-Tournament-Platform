import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useAuth } from "./AuthContext";

const Room = () => {
  const { roomId } = useParams(); // Get the roomId from the URL params
  const [userName, setUserName] = useState("");
  const [participants, setParticipants] = useState([]);
  let user = useAuth();

  useEffect(() => {
    // Fetch user name from server upon component mount
    axios
      .get("http://localhost:5000/api/auth/getUserName")
      .then((response) => {
        setUserName(response.data.userName);
      })
      .catch((error) => {
        console.error("Error fetching user name:", error);
        // Handle error (e.g., display error message)
      });
  }, [roomId, userName]);

  return (
    <div>
      <h1>Hello, {user.name}!</h1>
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
