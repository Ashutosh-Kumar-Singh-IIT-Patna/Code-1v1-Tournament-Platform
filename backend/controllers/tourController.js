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
        const Players=room.players;
        const roundNo = room.roundNo;
        const RoomName=room.name;
        const Participants=room.participants;
        const Admin=room.admin;
        const isRunning=room.isStarted;
        const isStarted=room.roundStarted;
        const isDeclared=room.resultDeclared;
        res.status(200).json({ Participants,Players,roundNo,RoomName,Admin,isStarted,isDeclared,isRunning });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.startRound = async (req, res) => {
    try {
        const { roomId } = req.body;
        const room = await Room.findOne({ roomId });
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        room.roundStarted=true;
        room.roundNo++;
        const players=room.players;
        const shuffledPlayers = shuffleArray(players);
        room.players = shuffledPlayers;
        await room.save();
        res.status(200).json({ message: 'Round started successfully'});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.leaveTournament = async (req, res) => {
    try {
        const { roomId, userID } = req.body;
        const room = await Room.findOne({ roomId });
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        const plays = room.players.filter(player => player.id !== userID);
        room.players = plays;
        await room.save();
        res.status(200).json({ roomId, message: 'Left tournament successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.endTournament = async (req,res) => {
    try {
        const { roomId } = req.body;
        const room = await Room.findOne({ roomId });
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        room.isStarted=false;
        room.roundStarted=false;
        room.resultDeclared=false;
        room.roundNo=0;
        room.players=[];
        room.oldPlayers=[];
        await room.save();
        res.status(200).json({ message: 'Tournament ended successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

exports.declareResult = async (req,res) => {
    try {
        const { roomId } = req.body;
        const room = await Room.findOne({ roomId });
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        room.roundStarted=false;
        room.resultDeclared=true;
        await room.save();
        res.status(200).json({ message: 'Result declared successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}