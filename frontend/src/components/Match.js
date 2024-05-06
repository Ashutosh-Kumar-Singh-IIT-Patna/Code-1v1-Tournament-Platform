import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

const Match = () => {
  let { user } = useAuth(); // Access user data and logout function from context
  const navigate = useNavigate(); // Get navigate function from react-router-dom
  const { roomId } = useParams(); // Get the roomId from the URL params
  const [players, setPlayers] = useState([]);
  const [opponent, setOpponent] = useState("");
  const [gamer,setGamer] = useState("");
  const [rnd, setRnd] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if user data exists in context
        user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
          // If user data does not exist, redirect to login page
          navigate("/login");
          return;
        }

        // Fetch players array from server
        const response = await axios.post("http://localhost:5000/api/tournament/getTournamentDetails", { roomId });
        const {shuffledPlayers,roundNo} = response.data;
        setPlayers(shuffledPlayers);
        setRnd(roundNo);
        // Find opponent
        const userIndex = shuffledPlayers.findIndex(player => player.id === user.id);
        if (userIndex === -1) {
          console.log("Can't find user in players array");
          return;
        }
        const opponentIndex = userIndex % 2 === 0 ? userIndex + 1 : userIndex - 1;
        setOpponent(shuffledPlayers[opponentIndex]);
        setGamer(shuffledPlayers[userIndex]);
      } catch (error) {
        console.error('Error fetching match:', error);
      }
    };

    fetchData();
  }, [user, navigate, roomId]);

  return (
    <>
      <div>
        {rnd && <h1>Round No.- {rnd}</h1>}
      </div>
      <div>
        {gamer && opponent && <h1>{gamer?.name} vs {opponent?.name}</h1>}{" "}
      </div>
      <div>
        <div>
          <h2>Active Players:</h2>
          <ul>
            {players?.map((player, index) => (
              <li key={index}>{player.name}</li> // Accessing the 'name' property
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Match;
