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

  useEffect(() => {
    user = JSON.parse(localStorage.getItem("user"));
    setUserID(user.id);
    if (!user) {
      navigate("/login");
    } else {
      const fetchData = async () => {
        try {
          const response = await axios.post("http://localhost:5000/api/tournament/getTournamentDetails", { roomId });
          const { Players, roundNo } = response.data;
          setRnd(roundNo);
          const userIndex = Players.findIndex(player => player.id === user.id);
          if (userIndex === -1) {
            console.log("Can't find user in players array");
            return;
          }
          setGamer(Players[userIndex]);
          const oppoIndex = (userIndex%2==0? userIndex+1:userIndex-1);
          setOpponentName(Players[oppoIndex]?.name || 'Bot');

          const ID=user.id;
          const res = await axios.get("http://localhost:5000/api/tournament/match/getProblemID", { ID });
          const {problemID} = res.data;
          setPID(problemID);

        } catch (error) {
          console.error('Error fetching match:', error);
        }
      };

      fetchData();
    }
  }, [user, navigate, roomId]);


  return (
    <>
      <center>
        {rnd && <h1>Round No. - {rnd}</h1>}
      </center>
      <center>
        <span style={{ fontSize: '30px' }}>{gamer?.name}</span> vs <span style={{ fontSize: '18px' }}>{opponentName}</span>
      </center>
      {/* {pID===""?(<></>):(<Problem problemId={pID} />)}
      {(pID!=="" && userID!=="")?(<IDE userID={userID} problemID={pID}/>):(<></>)} */}
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
