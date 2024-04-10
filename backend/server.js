const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const User = require('./models/User');
const Room = require('./models/Room');
const authController = require('./controllers/authController');
const roomController = require('./controllers/roomController');
const cors = require('cors'); 

// Initialize Express app
const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketIO(server);

// Connect to MongoDB
mongoose.connect('mongodb+srv://ashutoshksingh2003:vgKLd3q4pyWAbryU@cluster0.9yvqiee.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Define Express middleware
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Routes for user authentication
app.post('/api/auth/signup', authController.signup);
app.post('/api/auth/login', authController.login);
app.get('/api/auth/getUserName',authController.getUserName);

// Routes for room operations
app.post('/api/rooms/create', roomController.createRoom);
app.post('/api/rooms/join', roomController.joinRoom);
app.post('/api/rooms/leave', roomController.leaveRoom);
app.get('/api/rooms/:roomId/participants', roomController.getParticipants);

// Socket.io logic
const rooms = {};

io.on('connection', (socket) => {
    console.log('New client connected');

    // Create room
    socket.on('createRoom', async ({ roomName, userName }) => {
        try {
            const roomId = Math.random().toString(36).substr(2, 9); // Generate random room ID
            const room = new Room({ roomId, name: roomName });
            await room.save();
            rooms[roomId] = { name: roomName, participants: [{ id: socket.id, name: userName }] };
            socket.join(roomId);
            io.to(socket.id).emit('roomCreated', { roomId, roomName });
        } catch (err) {
            console.log(err);
        }
    });

    // Join room
    socket.on('joinRoom', async ({ roomId, userName }) => {
        if (rooms[roomId]) {
            try {
                rooms[roomId].participants.push({ id: socket.id, name: userName });
                socket.join(roomId);
                io.to(socket.id).emit('roomJoined', { roomId, roomName: rooms[roomId].name });
            } catch (err) {
                console.log(err);
            }
        } else {
            io.to(socket.id).emit('roomNotFound');
        }
    });

    // Leave room
    socket.on('leaveRoom', async ({ roomId, userName }) => {
        if (rooms[roomId]) {
            try {
                const participantIndex = rooms[roomId].participants.findIndex(participant => participant.id === socket.id);
                if (participantIndex !== -1) {
                    rooms[roomId].participants.splice(participantIndex, 1);
                    socket.leave(roomId);
                    io.to(socket.id).emit('roomLeft', { roomId });

                    // Check if participants become zero
                    if (rooms[roomId].participants.length === 0) {
                        // Delete room from database
                        await Room.deleteOne({ roomId });
                        // Delete room from memory
                        delete rooms[roomId];
                        console.log(`Room ${roomId} deleted because no participants`);
                    }
                }
            } catch (err) {
                console.log(err);
            }
        }
    });

    // Participant list
    socket.on('getParticipants', ({ roomId }) => {
        if (rooms[roomId]) {
            const participants = rooms[roomId].participants.map(participant => participant.name);
            io.to(socket.id).emit('participantsList', { participants });
        }
    });

    // Disconnect
    socket.on('disconnect', () => {
        console.log('Client disconnected');
        // Remove participant from room
        for (const roomId in rooms) {
            const participantIndex = rooms[roomId].participants.findIndex(participant => participant.id === socket.id);
            if (participantIndex !== -1) {
                rooms[roomId].participants.splice(participantIndex, 1);
                if (rooms[roomId].participants.length === 0) {
                    // Delete room from database
                    Room.deleteOne({ roomId })
                        .then(() => console.log(`Room ${roomId} deleted because no participants`))
                        .catch(err => console.log(err));
                    // Delete room from memory
                    delete rooms[roomId];
                }
                break; // Exit loop after removing participant from the room
            }
        }
    });
});

// Start server
const PORT = 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
