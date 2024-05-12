const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const authController = require("./controllers/authController");
const roomController = require("./controllers/roomController");
const tourController = require("./controllers/tourController");
const matchController = require("./controllers/matchController");
const cors = require("cors");
const { Mutex } = require('async-mutex');
import dotenv from 'dotenv';

dotenv.config();

// Initialize Express app
const app = express();
app.use(cors());

// Define Express middleware
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

// Connect to MongoDB
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

const mutex = new Mutex();

// Routes for user authentication
app.post("/api/auth/signup", async (req, res) => { const release = await mutex.acquire(); try { authController.signup(req, res); } finally { release(); } });
app.post("/api/auth/login", async (req, res) => { const release = await mutex.acquire(); try { authController.login(req, res); } finally { release(); } });
app.get("/api/auth/getUserName", async (req, res) => { const release = await mutex.acquire(); try { authController.getUserName(req, res); } finally { release(); } });

// Routes for room operations
app.post("/api/rooms/create", async (req, res) => { const release = await mutex.acquire(); try { roomController.createRoom(req, res); } finally { release(); } });
app.post("/api/rooms/join", async (req, res) => { const release = await mutex.acquire(); try { roomController.joinRoom(req, res); } finally { release(); } });
app.post("/api/rooms/leave", async (req, res) => { const release = await mutex.acquire(); try { roomController.leaveRoom(req, res); } finally { release(); } });
app.get("/api/rooms/getRoomDetails", async (req, res) => { const release = await mutex.acquire(); try { roomController.getRoomDetails(req, res); } finally { release(); } });
app.delete("/api/rooms/deleteRoom", async (req, res) => { const release = await mutex.acquire(); try { roomController.deleteRoom(req, res); } finally { release(); } });

//Routes for tournament
app.post("/api/tournament/startTournament", async (req, res) => { const release = await mutex.acquire(); try { tourController.startTournament(req, res); } finally { release(); } });
app.get("/api/tournament/getTournamentDetails", async (req, res) => { const release = await mutex.acquire(); try { tourController.getTournamentDetails(req, res); } finally { release(); } });
app.post("/api/tournament/startRound", async (req, res) => { const release = await mutex.acquire(); try { tourController.startRound(req, res); } finally { release(); } });
app.post("/api/tournament/leaveTournament", async (req, res) => { const release = await mutex.acquire(); try { tourController.leaveTournament(req, res); } finally { release(); } });
app.post("/api/tournament/endTournament", async (req, res) => { const release = await mutex.acquire(); try { tourController.endTournament(req, res); } finally { release(); } });
app.post("/api/tournament/declareResult", async (req, res) => { const release = await mutex.acquire(); try { tourController.declareResult(req, res); } finally { release(); } });
app.get("/api/tournament/getTime", async (req, res) => { const release = await mutex.acquire(); try { tourController.getTime(req, res); } finally { release(); } });

//Routes for match
app.get("/api/tournament/match/getProblemID", async (req, res) => { const release = await mutex.acquire(); try { matchController.getProblemID(req, res); } finally { release(); } });
app.post("/api/tournament/match/submitCode", async (req, res) => { const release = await mutex.acquire(); try { matchController.submitCode(req, res); } finally { release(); } });
app.post("/api/tournament/match/calculateResult", async (req, res) => { const release = await mutex.acquire(); try { matchController.calculateResult(req, res); } finally { release(); } });

// Define the default route
app.all('*', (req, res) => {
  res.status(404).send({ message: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
