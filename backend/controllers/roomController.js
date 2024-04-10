const Room = require('../models/Room');

// Controller for creating a new room
exports.createRoom = async (req, res) => {
    try {
        const { roomName, userName } = req.body;
        const roomId = generateRoomId(); // Generate a random room ID
        const newRoom = new Room({ roomId, name: roomName, participants: [{ name: userName }] });
        await newRoom.save();
        res.status(201).json({ roomId, message: 'Room created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Controller for joining an existing room
exports.joinRoom = async (req, res) => {
    try {
        const { roomId, userName } = req.body;
        const room = await Room.findOne({ roomId });
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        room.participants.push({ name: userName });
        await room.save();
        res.status(200).json({ roomId, message: 'Joined room successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Controller for leaving a room
exports.leaveRoom = async (req, res) => {
    try {
        const { roomId, userName } = req.body;
        const room = await Room.findOne({ roomId });
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        room.participants = room.participants.filter(participant => participant.name !== userName);
        await room.save();
        res.status(200).json({ roomId, message: 'Left room successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Controller for getting participants of a room
exports.getParticipants = async (req, res) => {
    try {
        const roomId = req.params.roomId;
        const room = await Room.findOne({ roomId });
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        const participants = room.participants.map(participant => participant.name);
        res.status(200).json({ participants });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Helper function to generate a random room ID
const generateRoomId = () => {
    return Math.random().toString(36).substr(2, 9);
};
