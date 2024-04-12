const Room = require('../models/Room');

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

exports.startTournament = async (req, res) => {
    try {
        const { roomId } = req.body;
        const room = await Room.findOne({ roomId });
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        room.isStarted = true;
        const participants = room.participants;
        room.players = participants;
        await room.save();
        res.status(200).json({ message: 'Tournament started successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getTournamentDetails = async (req, res) => {
    try {
        const { roomId } = req.body;
        const room = await Room.findOne({ roomId });
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        room.roundNo++;
        const players=room.players;
        const shuffledPlayers = shuffleArray(players);
        room.players = shuffledPlayers;
        const roundNo = room.roundNo;
        room.save();
        res.status(200).json({ shuffledPlayers, roundNo });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};