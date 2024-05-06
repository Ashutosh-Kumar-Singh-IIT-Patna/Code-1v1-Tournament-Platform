import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { AuthProvider } from "./components/AuthContext"; // Import your AuthProvider
import Signup from "./components/Signup";
import Login from "./components/Login";
import Home from "./components/Home";
import CreateRoom from "./components/CreateRoom";
import JoinRoom from "./components/JoinRoom";
import Room from "./components/Room";
import Tournament from "./components/Tournament";
import Match from "./components/Match";
import Round from "./components/Round";
import FinalResult from "./components/FinalResult";

function App() {
  return (
    <AuthProvider>
      {" "}
      {/* Wrap your entire application with the AuthProvider */}
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/create-room" element={<CreateRoom />} />
          <Route path="/join-room" element={<JoinRoom />} />
          <Route path="/room/:roomId" element={<Room />} />
          <Route path="/room/:roomId/tournament" element={<Tournament />} />
          <Route path="/room/:roomId/tournament/round" element={<Round />} />
          <Route path="/room/:roomId/tournament/match" element={<Match />} />
          <Route path="/room/:roomId/tournament/finalresult" element={<FinalResult />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
