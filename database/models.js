const mongoose = require('mongoose')
const {stickerSchema} = require('./schemas')

const Sticker = mongoose.model('Sticker', stickerSchema);


module.exports = Sticker
