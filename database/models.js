const mongoose = require('mongoose')
const {stickerSchema, roomSchema, userSchema, stickerSaveSchema} = require('./schemas')

const Sticker = mongoose.model('Sticker', stickerSchema);
const Room = mongoose.model('Room', roomSchema);
const User = mongoose.model("User", userSchema)
const StickerSave = mongoose.model("StickerSave", stickerSaveSchema)

module.exports = {Sticker, Room, User, StickerSave}
