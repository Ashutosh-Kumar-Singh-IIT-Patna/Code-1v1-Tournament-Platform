import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/Result.css";

const Result = ({roomId,rnd}) => {
  const [newPlayers, setNewPlayers] = useState([]);
  const [oldPlayers, setOldPlayers] = useState([]);
  const [matchResults, setMatchResults] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://code-1v1-tournament-platform-backend.vercel.app/api/tournament/getTournamentDetails", { params: { roomId }});
        const { OldPlayers, Players } = response.data;
        setOldPlayers(OldPlayers);
        setNewPlayers(Players);
      } catch (error) {
        console.error('Error fetching results:', error);
      }
    };
  
    fetchData();
  }, [roomId,rnd]);

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

  return (
    <>
    <center style={{marginTop:"2rem"}}>
      <h2>Round - {rnd} Results: </h2>
    </center>
    <div className="match-results-table">
      <table className="match-results-table__table">
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
    </>
  )
}

export default Result;
