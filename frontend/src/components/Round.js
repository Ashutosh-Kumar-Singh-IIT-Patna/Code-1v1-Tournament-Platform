import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

async function combinePairsAsync(arr) {
    let combinedPairs = [];
    for (let i = 0; i < arr.length; i += 2) {
        let pair = [arr[i], arr[i + 1] || null];
        combinedPairs.push(pair);
    }
    return combinedPairs;
}

const Round = () => {
  let { user } = useAuth(); // Access user data and logout function from context
  const [userID,setUserID] = useState("");
  const navigate = useNavigate(); // Get navigate function from react-router-dom
  const { roomId } = useParams(); // Get the roomId from the URL params
  const [match, setMatches] = useState([]);
  const [gamer,setGamer] = useState("");
  const [rnd, setRnd] = useState(null);
  const [timeLeft, setTimeLeft] = useState(15);

  const updateTime = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/tournament/getTime", { params: { roomId }});

      const { startTime } = response.data;

      const currentTime = new Date();

      const differenceInMilliseconds = Math.abs(currentTime - new Date(startTime));

      const differenceInSeconds = differenceInMilliseconds / 1000;

      const timeLeftInSeconds = Math.floor(15 - differenceInSeconds);

      setTimeLeft(timeLeftInSeconds >= 0 ? timeLeftInSeconds : 0);
  
      if (timeLeftInSeconds <= 0) {
        navigate(`/room/${roomId}/tournament/match`);
      }

    } catch (error) {

      console.error('Error fetching match:', error);

    }
  }; 

  useEffect(() => {
    user = JSON.parse(localStorage.getItem("user"));
    setUserID(user.id);
    if (!user) {
      navigate("/login");
    } else {
      const fetchData = async () => {
        try {
          const response = await axios.get("http://localhost:5000/api/tournament/getTournamentDetails", { params: { roomId }});
          const { Players, roundNo } = response.data;
          setRnd(roundNo);
          const userIndex = Players.findIndex(player => player.id === user.id);
          if (userIndex === -1) {
            console.log("Can't find user in players array");
            navigate(`/room/${roomId}/tournament`);
            return;
          }
          setGamer(Players[userIndex]);
          const combined = await combinePairsAsync(Players);
          setMatches(combined);
          
        } catch (error) {
          console.error('Error fetching round:', error);
        }
      };
      
      fetchData();

      const intervalId = setInterval(updateTime, 1000);
      return () => clearInterval(intervalId);
      
    }
  }, []);


  return (
    <>
      <div>
        {rnd && <h1>Round No. - {rnd}</h1>}
      </div>
      <div>
        {gamer && <h1>All the best! {gamer?.name}</h1>}
      </div>
      <div>
        <p>Match will start in : {timeLeft} seconds</p>
      </div>
      <div>
        <h2>Matches are :-</h2>
        <ul>
            {match && match.map((pair, index) => (
                <li key={index}>
                    {(pair[0]?.id === userID || pair[1]?.id === userID) ? 
                        <h3>{pair[0]?.name || 'Bot'} vs {pair[1]?.name || 'Bot'}</h3> :
                        <h4>{pair[0]?.name || 'Bot'} vs {pair[1]?.name || 'Bot'}</h4>}
                </li>
            ))}
        </ul>
    </div>

    </>
  );
};

export default Round;