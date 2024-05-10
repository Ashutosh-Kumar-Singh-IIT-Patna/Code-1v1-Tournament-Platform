import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import IDE from "./IDE";
import Problem from "./Problem";

const Round = () => {
  let { user } = useAuth();
  const [userID,setUserID] = useState("");
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [gamer,setGamer] = useState("");
  const [opponentName,setOpponentName] = useState("");
  const [rnd, setRnd] = useState(null);
  const [pID,setPID] = useState("");
  const [isAdmin,setIsAdmin] = useState(false);
  const [minutes, setMinutes] = useState("05");
  const [seconds, setSeconds] = useState("00");
  const [resultCalculated,setResultCalculated] = useState(true);

  useEffect(() => {
    user = JSON.parse(localStorage.getItem("user"));
    setUserID(user.id);
    if (!user) {
      navigate("/login");
    } else {
      const fetchData = async () => {
        try {
          const response = await axios.get("http://localhost:5000/api/tournament/getTournamentDetails", { params: { roomId }});
          const { Players, roundNo, Admin,isResultCalculated } = response.data;
          setResultCalculated(isResultCalculated);
          if(Admin === user.id){
            setIsAdmin(true);
          }
          setRnd(roundNo);
          const userIndex = Players.findIndex(player => player.id === user.id);
          if (userIndex === -1) {
            console.log("Can't find user in players array");
            navigate(`/room/${roomId}/tournament`);
            return;
          }
          setGamer(Players[userIndex]);
          const oppoIndex = (userIndex%2==0? userIndex+1:userIndex-1);
          setOpponentName(Players[oppoIndex]?.name || 'Bot');

          const ID=user.id;
          const res = await axios.get("http://localhost:5000/api/tournament/match/getProblemID",  { params: { ID }});
          const {problemID} = res.data;
          setPID(problemID);

        } catch (error) {
          console.error('Error fetching match:', error);
        }
      };

      fetchData();
      
    }
  }, []);
  
  useEffect(() => {
    const fetchTime = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/tournament/getTime", { params: { roomId } });
        const { startTime } = response.data;
        const currentTime = new Date();
        const differenceInMilliseconds = Math.abs(currentTime - new Date(startTime));
        const fifteenMinutesInMilliseconds = 0.5 * 60 * 1000;
        const timeLeftInMilliseconds = fifteenMinutesInMilliseconds - differenceInMilliseconds;
        if (timeLeftInMilliseconds <= 0) {
          if (!resultCalculated) {
            try {
              await axios.post("http://localhost:5000/api/tournament/match/calculateResult", { roomId });
              setResultCalculated(true);
            } catch (error) {
              console.error('Error:', error);
            }
          }
          navigate(`/room/${roomId}/tournament`);
        } else {
          const minutesLeft = Math.floor(timeLeftInMilliseconds / (60 * 1000)).toString().padStart(2, '0');
          const secondsLeft = Math.floor((timeLeftInMilliseconds % (60 * 1000)) / 1000).toString().padStart(2, '0');
          setMinutes(minutesLeft);
          setSeconds(secondsLeft);
        }
      } catch (error) {
        console.error('Error fetching match:', error);
      }
    };
  
    fetchTime();
  
    const intervalId = setInterval(fetchTime, 1000);
    return () => clearInterval(intervalId);
  }, [roomId, resultCalculated]);

  return (
    <>
      <center>
        {rnd && <h1>Round No. - {rnd}</h1>}
        <p>Time Left- {minutes}:{seconds}</p>
      </center>
      <center>
        <span style={{ fontSize: '30px' }}>{gamer?.name}</span> vs <span style={{ fontSize: '18px' }}>{opponentName}</span>
      </center>
      {pID === "" ? (
          <></>
      ) : (
          <div style={{ display: "flex" }}>
            <div style={{ flex: 1 }}>
              <Problem problemId={pID} />
            </div>
            <div style={{ flex: 1 }}>
              {userID !== "" && <IDE userID={userID} problemID={pID} />}
            </div>
          </div>
      )}

    </>
  );
};

export default Round;
