const mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
const adminSchema = new mongoose.Schema({
    username: String,
    password: String
});
adminSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("Admin",adminSchema);