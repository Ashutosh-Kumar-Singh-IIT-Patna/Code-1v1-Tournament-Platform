import React, { useState, useEffect } from "react";
import axios from "axios";

const Result = ({roomId}) => {
  const [newPlayers, setNewPlayers] = useState([]);
  const [oldPlayers, setOldPlayers] = useState([]);
  const [matchResults, setMatchResults] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/tournament/getTournamentDetails", { params: { roomId }});
        const { OldPlayers, Players } = response.data;
        setOldPlayers(OldPlayers);
        setNewPlayers(Players);
      } catch (error) {
        console.error('Error fetching results:', error);
      }
    };
  
    fetchData();
  }, [roomId]);

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
    <div>
      <h2>Last Round Results:</h2>
      <ul>
        {matchResults?.map((match, index) => (
          <li key={index}>
            {match[0]} vs {match[1]}: Winner - {match[2]}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Result;
