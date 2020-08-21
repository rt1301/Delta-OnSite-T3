const mongoose = require('mongoose');
const studentScehma = new mongoose.Schema({
    name: String,
    roll: String
});
module.exports = mongoose.model("Student",studentScehma);