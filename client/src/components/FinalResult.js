import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import "../css/Result.css";

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
        const response = await axios.get("https://code-1v1-tournament-platform-backend.vercel.app/api/tournament/getTournamentDetails", { params: { roomId }});
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
        const response = await axios.get("https://code-1v1-tournament-platform-backend.vercel.app/api/tournament/getTournamentDetails", { params: { roomId }});
        const { isRunning } = response.data;
        if(!isRunning){
          navigate(`/room/${roomId}`);
          return;
        }
      } catch (error) {
        navigate(`/room/${roomId}`);
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
      .post("https://code-1v1-tournament-platform-backend.vercel.app/api/tournament/leaveTournament", { roomId, userID })
      .then((response) => {
        navigate(`/room/${roomId}`);
      })
      .catch((error) => {
        console.error("Error leaving tournament:", error);
      });
  };

  const endTournament = () => {
    axios
      .post("https://code-1v1-tournament-platform-backend.vercel.app/api/tournament/endTournament",  { roomId } )
      .then((response) => {
        navigate(`/room/${roomId}`);
      })
      .catch((error) => {
        console.error("Error ending tournament:", error);
      });
  };

  return (
    <div style={{ 
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "94.5vh",
      background: "linear-gradient(135deg, #2980b9, #2c3e50)",
      color: "#fff",
      fontFamily: "'Roboto', sans-serif",
      padding: "20px",
      textAlign: "center"
    }}>
      {matchResults && (
        <h1 style={{ marginTop: "5rem", fontSize:"40px",fontFamily: "Arial, sans-serif", textAlign: "center", color: "white" }}>
        Congratulations to{" "}
        {matchResults
          .filter(match => match[2] !== 'Bot') // Filter out 'Bot' winners
          .map((match, index) => (
            <span key={index} style={{ fontSize:"40px", fontWeight: "bold", color: "#FFA500" }}>
              {match[2]}
              {index !== matchResults.length - 1 ? (
                index === matchResults.length - 2 ? " and " : ", "
              ) : "!"}
            </span>
          ))}
      </h1>
      
      
      )}

      <center style={{marginTop:"3rem"}}>
        <h2>Final Round Results: </h2>
      </center>
      <div className="match-results-table" style={{width:"50%"}}>
        <table className="match-results-table__table" style={{marginTop:"1rem"}}>
          <thead>
            <tr>
              <th className="match-results-table__header">Match</th>
              <th className="match-results-table__header">Winner</th>
            </tr>
          </thead>
          <tbody>
            {matchResults?.map((match, index) => (
              <tr key={index}>
                <td className="match-results-table__cell">{match[0]} vs {match[1]}</td>
                <td className="match-results-table__cell">{match[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isAdmin && isAdmin ? (
        <div style={{position:"absloute",marginTop: "15rem"
          }}
          >
          <button style={{
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
          }} onClick={endTournament}>End Tournament</button>
          </div>
      ) : (
        <div style={{position:"absloute",marginTop: "15rem"
        }}
        >
        <button style={{
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
        }} onClick={leaveTournament}>Leave Tournament</button>
        </div>
      )}
    </div>
  )
}

export default FinalResult;
