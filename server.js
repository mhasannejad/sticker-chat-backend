const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const fileUpload = require('express-fileupload');
const mongoose = require("mongoose");
const axios = require("axios");
const upload = require('multer')
const fs = require('fs')

require("dotenv").config();
console.log(process.env.MONGODB_URL)

const app = express();
const server = http.createServer(app);
const io = socketio(server,{
    cors: {
        origin: process.env.FRONT_URL,
        methods: ["GET", "POST"]
    }
});

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
const Sticker = mongoose.model('Sticker', stickerSchema);
const Room = mongoose.model('Room', roomSchema);


/// DB
mongoose.connect(process.env.MONGODB_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
)

// enable files upload
app.use(fileUpload({
    createParentPath: true
}));

//add other middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));

io.on("connection", (socket) => {
    console.log('new connection')
    socket.on("disconnect", () => {
        console.log('user left ')
        socket.emit('message', {
            message: 'user left chat'
        })
    });
    socket.on('chat_message', (text) => {
        console.log(text)
        io.emit('message', {
            name: text.name,
            message: text.message
        })
    })
})


const PORT = process.env.PORT || 3000;

app.use('/stickers', express.static('uploads/stickers'))

//const stickerRouter = require("./routes/stickers")
//app.use('/sticker', stickerRouter)
app.post('/sticker/new', (req, res) => {
    try {
        console.log(req.body)
        if (!req.body.sticker) {
            res.send({
                status: false,
                message: 'No file uploaded'
            }).status(500);
        } else {
            //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
            console.log('hereee')
            let sticker = req.body.sticker;
            let sticker_pure = sticker.replace(/^data:image\/png;base64,/, "");
            //Use the mv() method to place the file in the upload directory (i.e. "uploads")
            let sticker_name = Date.now() + '.' + sticker.split(',')[0].split('/')[1].split(';')[0]
            //sticker.mv('./uploads/stickers/' + sticker_name);
            fs.writeFile('./uploads/stickers/' + sticker_name, sticker.split(',')[1], 'base64', (err) => {
                console.log(err)
            })
            let sticker_obj = new Sticker({
                description: req.body.description,
                creator: req.body.creator,
                path: `stickers/${sticker_name}`,
            })
            sticker_obj.save().then(r => console.log('saved'))

            //send response
            res.send({
                status: true,
                message: 'File is uploaded',
                data: {
                    name: sticker.name,
                    mimetype: sticker.mimetype,
                    size: sticker.size
                }
            });
        }
    } catch (err) {
        console.log(err)
        res.status(500).send(err);
    }
})

app.get('/sticker/all', (req, res) => {
    Sticker.find({}, (error, result) => {
        res.json(result)
    })
})
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));



