const Room = require('../models/Room');
const User = require("../models/User");

async function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

async function assignProblem(array) {
    for( let i=0;i<array.length;i++){
        const randomNumber=Math.floor(Math.random() * 2);
        const paddedNumber = String(randomNumber).padStart(4, '0');
        const ID = array[i].id;
        const user = await User.findOne({ _id:ID });
        user.problemID = paddedNumber;
        user.numberOfTestsPassed = 0;
        user.submissionTime = null;
        await user.save();
        i++;
        if(i<array.length){
            const ID1 = array[i].id;
            const user1 = await User.findOne({ _id:ID1 });
            user1.problemID = paddedNumber;
            user1.numberOfTestsPassed = 0;
            user1.submissionTime = null;
            await user1.save();
        }
    }
}

exports.startTournament = async (req, res) => {
    try {
        const { roomId } = req.body;
        const room = await Room.findOne({ roomId });
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        room.resultCalculated=false;
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
        const { roomId } = req.query;
        const room = await Room.findOne({ roomId });
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        const Players=room.players;
        const OldPlayers=room.oldPlayers;
        const roundNo = room.roundNo;
        const RoomName=room.name;
        const Participants=room.participants;
        const Admin=room.admin;
        const isRunning=room.isStarted;
        const isStarted=room.roundStarted;
        const isDeclared=room.resultDeclared;
        const isResultCalculated=room.resultCalculated;
        res.status(200).json({ Participants,Players,OldPlayers,roundNo,RoomName,Admin,isStarted,isDeclared,isRunning,isResultCalculated });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getTime = async (req, res) => {
    try {
        const { roomId } = req.query;
        const room = await Room.findOne({ roomId });
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        const startTime = room.roundStartTime;
        res.status(200).json({ startTime });
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
        room.resultCalculated=false;
        room.roundStarted=true;
        room.roundNo++;
        const players=room.players;
        const shuffledPlayers = await shuffleArray(players);
        await assignProblem(shuffledPlayers);
        room.players = shuffledPlayers;
        room.roundStartTime = new Date();
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