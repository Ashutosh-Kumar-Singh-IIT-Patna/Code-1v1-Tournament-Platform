const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  admin: {
    type: String,
    required: true
  },
  isStarted: {
    type: Boolean,
    default: false
  },
  players: {
    type: [{ name: String, id: String }],
    default: []
  },
  participants: { type: [{ name: String, id: String }], default: [] },
  createdAt: { type: Date, default: Date.now, expires: 7200 }
});

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
