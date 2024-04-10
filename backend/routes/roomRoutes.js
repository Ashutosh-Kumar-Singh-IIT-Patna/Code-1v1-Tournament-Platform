const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

// Route for creating a new room
router.post('/create', roomController.createRoom);

// Route for joining an existing room
router.post('/join', roomController.joinRoom);

// Route for getting participants of a room
router.get('/:roomId/participants', roomController.getParticipants);

module.exports = router;
