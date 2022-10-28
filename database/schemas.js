const mongoose = require('mongoose')

const stickerSchema = new mongoose.Schema({
    description: String,
    creator: String,
    path: String,
});
const roomSchema = new mongoose.Schema({
    title: String,
    date: Number,
    description: String,
});

const userSchema = new mongoose.Schema({
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true}
})

const stickerSaveSchema = new mongoose.Schema({
    sticker: {
        type: stickerSchema
    },
    user: {type: String, index: false},

});

module.exports = {stickerSchema, roomSchema, userSchema, stickerSaveSchema}
