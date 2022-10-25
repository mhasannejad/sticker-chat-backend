const express = require('express')

const router = express.Router()

router.get('/', (req, res) => {
    res.send('fuck')
})

router.get('/holy',(req,res)=>{
    res.send('hole fuck')
})


module.exports = router
