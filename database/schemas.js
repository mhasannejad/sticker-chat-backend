const mongoose = require('mongoose')

const stickerSchema = new mongoose.Schema({
    description: String,
    creator: String,
    path: String,
});


module.exports = stickerSchema
