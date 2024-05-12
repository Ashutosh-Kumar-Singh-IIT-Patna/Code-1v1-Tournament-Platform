import React, { useState, useEffect} from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import Result from "./Result";

const Tournament = () => {
  let { user } = useAuth(); // Access user data and logout function from context
  const [userID,setUserID] = useState("");
  const navigate = useNavigate(); // Get navigate function from react-router-dom
  const { roomId } = useParams(); // Get the roomId from the URL params
  const [players, setPlayers] = useState([]);
  const [gamer,setGamer] = useState("");
  const [rnd, setRnd] = useState(null);
  const [outPlayers,setOutPlayers] = useState([]);
  const [roomName,setRoomName] = useState("");
  const [admin,setAdmin] = useState("");
  const [isAdmin,setIsAdmin] = useState(false);
  const [isPlaying,setIsPlaying] = useState(true);
  const [started,setStarted] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        user = JSON.parse(localStorage.getItem("user"));
        setUserID(user.id);
        if (!user) {
          navigate("/login");
        }
        const response = await axios.get("https://code-1v1-tournament-platform-backend.vercel.app/api/tournament/getTournamentDetails", { params: { roomId }});
        const { Participants, Players, roundNo, RoomName, Admin, isStarted, isDeclared, isRunning } = response.data;

        setStarted(isStarted);
        
        if(!isRunning){
          navigate(`/room/${roomId}`);
          return;
        }

        if(Players.length==1){
          navigate(`/room/${roomId}/tournament/finalresult`);
          return;
        }

        const out = Participants.filter(participant => !Players.some(player => player.id === participant.id));

        setAdmin(Admin);
        setRoomName(RoomName);
        setOutPlayers(out);
        setPlayers(Players);
        if(!isStarted){
          setRnd(roundNo);
        }
        
        if (Admin === user.id) {
          setIsAdmin(true);
        }
  
        const userIndex = Participants.findIndex(player => player.id === user.id);
        if (userIndex === -1) {
          console.log("Can't find user in participants array");
          return;
        }
  
        const userParticipant = Participants[userIndex];
        setGamer(userParticipant);

        const Index = Players.findIndex(player => player.id === user.id);
        if(Index===-1){
          setIsPlaying(false);
        }
  
        if (isStarted && Index!==-1) {
          navigate(`/room/${roomId}/tournament/round`);
        }
  
        if (isDeclared) {
          navigate(`/room/${roomId}/tournament/finalresult`);
        }
      } catch (error) {
        navigate(`/room/${roomId}`);
        console.error('Error fetching tournament details:', error);
      }
    };
  
    fetchData();
  
    const interval = setInterval(fetchData, 2000);
  
    return () => clearInterval(interval);
    
  }, []);  

  const leaveTournament = async () => {
    await axios
      .post("https://code-1v1-tournament-platform-backend.vercel.app/api/tournament/leaveTournament", { roomId, userID })
      .then((response) => {
        navigate(`/room/${roomId}`);
      })
      .catch((error) => {
        console.error("Error leaving tournament:", error);
      });
  };

  const endTournament = async () => {
    if(started){
      alert("A Round is running. Wait for it to end!");
      return;
    }
    await axios
      .post("https://code-1v1-tournament-platform-backend.vercel.app/api/tournament/endTournament",  { roomId } )
      .then((response) => {
        navigate(`/room/${roomId}`);
      })
      .catch((error) => {
        console.error("Error ending tournament:", error);
      });
  };

  const startRound = async () => {
    if(started){
      alert("Already a Round is running. Wait for it to end!");
      return;
    }
    await axios
      .post("https://code-1v1-tournament-platform-backend.vercel.app/api/tournament/startRound", {  roomId  } )
      .then((response) => {
        if(isPlaying)
        navigate(`/room/${roomId}/tournament/round`); // Use navigate function to redirect
      })
      .catch((error) => {
        console.error("Error starting tournament:", error);
      });
  };

  const declareResult = async () => {
    if(rnd!==null){
      if(rnd===0){
        alert("You need to conduct atleast one round before declaring results!");
        return;
      }
    }
    if(started){
      alert("A Round is running. Wait for it to end!");
      return;
    }
    await axios
      .post("https://code-1v1-tournament-platform-backend.vercel.app/api/tournament/declareResult", {  roomId  } )
      .then((response) => {
        navigate(`/room/${roomId}/tournament/finalresult`); // Use navigate function to redirect
      })
      .catch((error) => {
        console.error("Error declaring results:", error);
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
      <div>
        <h1 style={{ marginTop: "1rem" , fontFamily: "cursive"}}>The Tournament of {roomName}</h1>
      </div>
    
      {isPlaying ? (
        <h2> Best of luck, {gamer?.name}!</h2>
      ) : (
        <h2>Better luck next time, {gamer?.name}!</h2>
      )}

      {rnd && roomId && rnd > 0 ?
      
      <div style={{ display: "flex", width: "100%"}}>
        <div style={{ flex: "1", paddingRight: "10px" }}>
          <div>
            <h2>Active players:</h2>
            <div
            style={{ 
              maxHeight: "300px", // Set a maximum height for the participant list
              overflowY: "auto", // Make the list scrollable if needed
              width: "100%", // Ensure the list takes full width
            }}
            >
              <ul style={{ 
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", // Adjust column width
                gap: "10px",
                listStyle: "none",
                padding: 0,
                margin: 0,
                }}>
                {players?.map((player, index) => (
                  <li key={index}  style={{ marginBottom: "5px", padding: "10px", background: "#34495e", borderRadius: "4px" }}>
                    {player.name} {player.id === userID ? "(You)" : ""}{" "}
                    {player.id === admin ? "(Admin)" : ""}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h2>Out of the tournament players:</h2>
            <div
            style={{ 
              maxHeight: "300px", // Set a maximum height for the participant list
              overflowY: "auto", // Make the list scrollable if needed
              width: "100%", // Ensure the list takes full width
            }}
            >
              <ul style={{ 
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", // Adjust column width
                gap: "10px",
                listStyle: "none",
                padding: 0,
                margin: 0,
                }}>
                {outPlayers?.map((player, index) => (
                  <li key={index}  style={{ marginBottom: "5px", padding: "10px", background: "#34495e", borderRadius: "4px" }}>
                    {player.name} {player.id === userID ? "(You)" : ""}{" "}
                    {player.id === admin ? "(Admin)" : ""}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div style={{ flex: "1", paddingLeft: "10px" }}>
          <Result roomId={roomId} rnd={rnd}/>
        </div>
      </div>

      
      :
      
      <div style={{ width: "100%"}}>
          <div>
            <h2>Active players:</h2>
            <div
            style={{ 
              maxHeight: "300px", // Set a maximum height for the participant list
              overflowY: "auto", // Make the list scrollable if needed
              width: "100%", // Ensure the list takes full width
            }}
            >
              <ul style={{ 
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", // Adjust column width
                gap: "10px",
                listStyle: "none",
                padding: 0,
                margin: 0,
                }}>
                {players?.map((player, index) => (
                  <li key={index}  style={{ marginBottom: "5px", padding: "10px", background: "#34495e", borderRadius: "4px" }}>
                    {player.name} {player.id === userID ? "(You)" : ""}{" "}
                    {player.id === admin ? "(Admin)" : ""}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h2>Out of the tournament players:</h2>
            <div
            style={{ 
              maxHeight: "300px", // Set a maximum height for the participant list
              overflowY: "auto", // Make the list scrollable if needed
              width: "100%", // Ensure the list takes full width
            }}
            >
              <ul style={{ 
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", // Adjust column width
                gap: "10px",
                listStyle: "none",
                padding: 0,
                margin: 0,
                }}>
                {outPlayers?.map((player, index) => (
                  <li key={index}  style={{ marginBottom: "5px", padding: "10px", background: "#34495e", borderRadius: "4px" }}>
                    {player.name} {player.id === userID ? "(You)" : ""}{" "}
                    {player.id === admin ? "(Admin)" : ""}
                  </li>
                ))}
              </ul>
            </div>
          </div>
      </div>
      
      }
    
      {isAdmin ? (
        <div style={{position:"absloute",marginTop: "15rem",
        display:"flex",
        justifyContent: "space-between"
        }}
        >
          <button style={{ 
            marginRight:"5rem",
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
        }} onClick={startRound}>Start Round {rnd + 1} !</button>
            <button style={{ 
              marginRight:"5rem",
            textDecoration: "none",
            color: "#fff", /* Change text color to white */
            fontSize: "1.5rem",
            fontWeight: "bold",
            textShadow: "1px 1px 2px rgba(0, 0, 0, 0.6)",
            padding: "1rem",
            backgroundColor: "#f39c12",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
            transition: "background-color 0.3s ease, transform 0.2s ease",
            display: "inline-block",
          }} onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#f4d03f";
            e.target.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#f39c12";
            e.target.style.transform = "scale(1)";
          }} onClick={declareResult}>Declare all active players as Winners</button>
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
    
  );
};

export default Tournament;
