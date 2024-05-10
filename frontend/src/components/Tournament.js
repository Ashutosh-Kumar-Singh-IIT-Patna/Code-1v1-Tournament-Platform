import React, { useState, useEffect } from "react";
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
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        user = JSON.parse(localStorage.getItem("user"));
        setUserID(user.id);
        if (!user) {
          navigate("/login");
        }
        const response = await axios.get("http://localhost:5000/api/tournament/getTournamentDetails", { params: { roomId }});
        const { Participants, Players, roundNo, RoomName, Admin, isStarted, isDeclared, isRunning } = response.data;
        
        if(!isRunning){
          navigate(`/room/${roomId}`);
          return;
        }

        const out = Participants.filter(participant => !Players.some(player => player.id === participant.id));

        setAdmin(Admin);
        setRoomName(RoomName);
        setOutPlayers(out);
        setPlayers(Players);
        setRnd(roundNo);
        
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
        console.error('Error fetching tournament details:', error);
      }
    };
  
    fetchData();
  
    const interval = setInterval(fetchData, 2000);
  
    return () => clearInterval(interval);
  }, [userID, navigate, roomId]);  

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

  const startRound = () => {
    axios
      .post("http://localhost:5000/api/tournament/startRound", {  roomId  } )
      .then((response) => {
        navigate(`/room/${roomId}/tournament/round`); // Use navigate function to redirect
      })
      .catch((error) => {
        console.error("Error starting tournament:", error);
      });
  };

  const declareResult = () => {
    axios
      .post("http://localhost:5000/api/tournament/declareResult", {  roomId  } )
      .then((response) => {
        navigate(`/room/${roomId}/tournament/finalresult`); // Use navigate function to redirect
      })
      .catch((error) => {
        console.error("Error declaring results:", error);
      });
  };

  return (
    <>
      <div>
        <h1>The Tournament of {roomName} !</h1>
      </div>

      {isPlaying? (<h2> Best of luck! {gamer?.name}!</h2>):(<h2>Better luck next time! {gamer?.name}!</h2>)}

      <div>
        <h2>Active players:</h2>
        <ul>
            {players?.map((player, index) => (
              <li key={index}>{player.name} {player.id===userID?(<>(You)</>):(<></>)} {player.id===admin?(<>(Admin)</>):(<></>)}</li> // Accessing the 'name' property
            ))}
        </ul>
      </div>

      <div>
        <h2>Out of the tournament players:</h2>
        <ul>
            {outPlayers?.map((player, index) => (
              <li key={index}>{player.name} {player.id===userID?(<>(You)</>):(<></>)} {player.id===admin?(<>(Admin)</>):(<></>)}</li> // Accessing the 'name' property
            ))}
        </ul>
      </div>

      {rnd && roomId && rnd>0?<Result roomId={roomId}/>:<></>}

      {isAdmin && isAdmin ? (
        <>
          <button onClick={startRound}>Start Round {rnd+1} !</button>
          <button onClick={endTournament}>End Tournament</button>
          <button onClick={declareResult}>Declare all active players as Winners</button>
        </>
      ) : (
        <button onClick={leaveTournament}>Leave Tournament</button>
      )}

    </>
  );
};

export default Tournament;
