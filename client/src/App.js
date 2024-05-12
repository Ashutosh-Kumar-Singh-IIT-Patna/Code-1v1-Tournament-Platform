import React, { Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./components/AuthContext"; // Import your AuthProvider
import Loading from "./components/Loading"; // Import your Loading component
import NavBar from "./components/NavBar";
const Signup = React.lazy(() => import("./components/Signup"));
const ContactUs = React.lazy(() => import("./components/ContactUs"));
const Rules = React.lazy(() => import("./components/Rules"));
const Login = React.lazy(() => import("./components/Login"));
const Home = React.lazy(() => import("./components/Home"));
const CreateRoom = React.lazy(() => import("./components/CreateRoom"));
const JoinRoom = React.lazy(() => import("./components/JoinRoom"));
const Room = React.lazy(() => import("./components/Room"));
const Tournament = React.lazy(() => import("./components/Tournament"));
const Match = React.lazy(() => import("./components/Match"));
const Round = React.lazy(() => import("./components/Round"));
const FinalResult = React.lazy(() => import("./components/FinalResult"));

function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<Loading />}>
          <NavBar />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/rules" element={<Rules />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/create-room" element={<CreateRoom />} />
            <Route path="/join-room" element={<JoinRoom />} />
            <Route path="/room/:roomId" element={<Room />} />
            <Route path="/room/:roomId/tournament" element={<Tournament />} />
            <Route path="/room/:roomId/tournament/round" element={<Round />} />
            <Route path="/room/:roomId/tournament/match" element={<Match />} />
            <Route path="/room/:roomId/tournament/finalresult" element={<FinalResult />} />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;
