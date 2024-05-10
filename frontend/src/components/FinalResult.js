import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

const FinalResult = () => {
  let { user } = useAuth();
  const navigate = useNavigate();
  const [newPlayers, setNewPlayers] = useState([]);
  const [userID,setUserID] = useState("");
  const [oldPlayers, setOldPlayers] = useState([]);
  const [matchResults, setMatchResults] = useState([]);
  const { roomId } = useParams();
  const [isAdmin,setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        user = JSON.parse(localStorage.getItem("user"));
        setUserID(user.id);
        if (!user) {
          navigate("/login");
        }
        const response = await axios.get("http://localhost:5000/api/tournament/getTournamentDetails", { params: { roomId }});
        const { OldPlayers, Players, Admin } = response.data;
        if (Admin === user.id) {
          setIsAdmin(true);
        }
        setOldPlayers(OldPlayers);
        setNewPlayers(Players);
      } catch (error) {
        console.error('Error fetching results:', error);
      }
    };
  
    fetchData();
  }, [userID, navigate, roomId]);

  useEffect(() => {
    const checkEnd = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/tournament/getTournamentDetails", { params: { roomId }});
        const { isRunning } = response.data;
        if(!isRunning){
          navigate(`/room/${roomId}`);
          return;
        }
      } catch (error) {
        console.error('Error checking end:', error);
      }
    };
  
    checkEnd();
  
    const interval = setInterval(checkEnd, 2000);
  
    return () => clearInterval(interval);

  }, [userID, navigate, roomId]);

  useEffect(() => {
    const calculateMatchResults = () => {
      const results = [];
      const newPlayersSet = new Set(newPlayers.map(player => player.name));
      const numPlayers = oldPlayers.length;
    
      for (let i = 0; i < numPlayers; i += 2) {
        const player1 = oldPlayers[i];
        const player2 = i + 1 < numPlayers ? oldPlayers[i + 1] : null;
        const winner = newPlayersSet.has(player1.name) ? player1.name :
                       player2 && newPlayersSet.has(player2.name) ? player2.name : 'Bot';
        results.push([player1.name, player2 ? player2.name : 'Bot', winner]);
      }
    
      setMatchResults(results);
    };

    calculateMatchResults();
  }, [oldPlayers, newPlayers]);

  const leaveTournament = () => {
    axios
      .post("http://localhost:5000/api/tournament/leaveTournament", { roomId, userID })
      .then((response) => {
        navigate(`/room/${roomId}`);
      })
      .catch((error) => {
        console.error("Error leaving tournament:", error);
      });
  };

  const endTournament = () => {
    axios
      .post("http://localhost:5000/api/tournament/endTournament",  { roomId } )
      .then((response) => {
        navigate(`/room/${roomId}`);
      })
      .catch((error) => {
        console.error("Error ending tournament:", error);
      });
  };

  return (
    <div>
      {matchResults && (
        <h1>
          Congratulations to{" "}
          {matchResults
            .filter(match => match[2] !== 'Bot') // Filter out 'Bot' winners
            .map((match, index) => (
              <span key={index}>
                {match[2]}
                {index !== matchResults.length - 1 ? (
                  index === matchResults.length - 2 ? " and " : ", "
                ) : ""}
              </span>
            ))}
        </h1>
      )}

      <h2>Final Round Results:</h2>
      <ul>
        {matchResults?.map((match, index) => (
          <li key={index}>
            {match[0]} vs {match[1]}: Winner - {match[2]}
          </li>
        ))}
      </ul>
      {isAdmin && isAdmin ? (
        <>
          <button onClick={endTournament}>End Tournament</button>
        </>
      ) : (
        <button onClick={leaveTournament}>Leave Tournament</button>
      )}
    </div>
  )
}

export default FinalResult;
