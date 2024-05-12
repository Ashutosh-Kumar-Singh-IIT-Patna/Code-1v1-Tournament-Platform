import React from 'react';
import "../css/Rules.css";

const Rules = () => {
  return (
    <div style={{minHeight: "94.5vh",
            background: "linear-gradient(135deg, #2980b9, #2c3e50)",
            color: "#fff",
            fontFamily: "'Roboto', sans-serif",
        padding: "20px"}}>
    <center><h1 style={{marginTop:"5rem", marginBottom:"3rem"}}>Know The Game</h1></center>
    <div className="rules-container">
      <p style={{fontSize:"20px", lineHeight:"30px"}}>Below is a comprehensive manual to help you understand our platform and the game in detail:</p>
      <ul>
        <li><strong>Room Creation and Joining:</strong>
          <ul>
            <li>To initiate a tournament, users can create a room by clicking on the "Create Room" button.</li>
            <li>Upon creation, a unique room ID will be generated, which can be shared with other users.</li>
            <li>Participants can join a room by entering the provided room ID in the designated field and clicking on "Join Room".</li>
          </ul>
        </li>
        <li><strong>Admin Privileges:</strong>
          <ul>
            <li>The user who creates the room will be designated as the admin.</li>
            <li>Admins have exclusive access to start the tournament and manage its progression.</li>
          </ul>
        </li>
        <li><strong>Tournament Structure:</strong>
          <ul>
            <li>The tournament is organized into rounds, each comprising multiple 1v1 matchups between active players.</li>
          </ul>
        </li>
        <li><strong>Starting Rounds:</strong>
          <ul>
            <li>Only the admin has the authority to start a new round.</li>
            <li>Admins can initiate a round when all participants are ready to compete.</li>
          </ul>
        </li>
        <li><strong>Player Pairing:</strong>
          <ul>
            <li>In each round, players are randomly paired for 1v1 matchups.</li>
            <li>If the number of players is odd, a bot is paired with one randomly chosen player to ensure fair competition.</li>
          </ul>
        </li>
        <li><strong>Problem Presentation:</strong>
          <ul>
            <li>Once paired, participants are presented with a coding problem to solve within a specified time limit.</li>
          </ul>
        </li>
        <li><strong>Determining Winners:</strong>
          <ul>
            <li>The winner of each 1v1 matchup is determined based on the correctness of their code or submission time (if number of testcases passed are equal).</li>
          </ul>
        </li>
        <li><strong>Advancing to Next Round:</strong>
          <ul>
            <li>Winners of each round proceed to the next round, provided the admin initiates another round.</li>
          </ul>
        </li>
        <li><strong>Inactive Players:</strong>
          <ul>
            <li>Players who lose a round become inactive and are unable to progress to subsequent rounds.</li>
          </ul>
        </li>
        <li><strong>Final Winner:</strong>
          <ul>
            <li>The tournament progresses as a binary tree structure, culminating in the declaration of a final winner when only one active player remains.</li>
          </ul>
        </li>
        <li><strong>Fairness and Transparency:</strong>
          <ul>
            <li>Our platform ensures fairness through random pairing, unbiased problem selection, and transparent determination of winners.</li>
          </ul>
        </li>
      </ul>
      <p style={{marginTop:"-2.5rem", fontSize:"20px", lineHeight:"30px"}}>We hope this manual provides you with a comprehensive understanding of our Code 1v1 Tournament. If you have any further questions or feedback, please don't hesitate to contact us.</p>
      <center style={{marginTop:"2rem",marginBottom:"3rem", fontSize:"25px", fontFamily:"cursive", color:"yellow"}}>Happy coding and may the best coder win !</center>
    </div>
    </div>
  );
};

export default Rules;
