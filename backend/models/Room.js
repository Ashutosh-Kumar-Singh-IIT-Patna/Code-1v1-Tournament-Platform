const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  participants: { type: [{ name: String, id: String }], default: [] },
});

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
