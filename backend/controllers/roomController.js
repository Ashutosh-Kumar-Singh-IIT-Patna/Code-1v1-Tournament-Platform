const Room = require('../models/Room');

// Controller for creating a new room
exports.createRoom = async (req, res) => {
    try {
        const { roomName, userName, userID } = req.body;
        const roomId = generateRoomId(); // Generate a random room ID
        const newRoom = new Room({ roomId, name: roomName, admin: userID, participants: [{ name: userName, id: userID }] });
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
        const { roomId, userName, userID } = req.body;
        const room = await Room.findOne({ roomId });
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        const isUserInParticipants = room.participants.some(participant => participant.id === userID);
        
        if(!isUserInParticipants){
            room.participants.push({ name: userName, id: userID });
        }
        
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
        const { roomId, userID } = req.body;
        const room = await Room.findOne({ roomId });
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        const parti = room.participants.filter(participant => participant.id !== userID);
        room.participants = parti;
        await room.save();
        res.status(200).json({ roomId, message: 'Left room successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Controller for getting room details
exports.getRoomDetails = async (req, res) => {
    try {
        const {roomId} = req.query;
        const room = await Room.findOne({ roomId });
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        res.status(200).json({ room });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Helper function to generate a random room ID
const generateRoomId = () => {
    return Math.random().toString(36).substr(2, 9);
};

exports.deleteRoom = async (req,res) => {

    try {
        const { roomId } = req.body;
        const deletedRoom = await Room.deleteOne({roomId});

        if (!deletedRoom) {
            return res.status(404).json({ message: 'Room not found' });
        }
        res.status(200).json({ message: 'Room deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}
