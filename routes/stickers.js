const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const _ = require('lodash');
const mongoose = require('mongoose')

const router = express.Router()
const stickerSchema = new mongoose.Schema({
    description: String,
    creator: String,
    path: String,
});
const Sticker = mongoose.model('Sticker', stickerSchema);


/// DB
mongoose.connect(
    'mongodb://localhost:27017/sticker_chat',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
)
// enable files upload
router.use(fileUpload({
    createParentPath: true,
}));

//add other middleware
router.use(cors());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));
router.use(morgan('dev'));

router.post("/new", (req, res) => {
    try {
        if (!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
            console.log('hereee')
            let sticker = req.files.sticker;

            //Use the mv() method to place the file in the upload directory (i.e. "uploads")
            let sticker_name = Date.now() + '.' + sticker.mimetype.split('/')[1]
            sticker.mv('./uploads/stickers/' + sticker_name);

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
        res.status(500).send(err);
    }
})


module.exports = router
