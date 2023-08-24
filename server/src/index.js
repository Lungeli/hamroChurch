const express = require('express')
require('dotenv').config()
const userRoute=require('./routes/user')
const memberRoute=require('./routes/member')
const donationRoute=require('./routes/donation')
const connection = require('./db/connection')
const Users = require('./models/user')
const Member = require('./models/member')
const Donations = require('./models/donation')
connection()
const app = express()


const cors = require('cors')
const port = 4000
app.use(express.json())
app.use(cors())
app.use("/",userRoute)
app.use("/",memberRoute)
app.use("/",donationRoute)
 

 
 app.listen(port, () => {
 console.log(`Example app listening on port ${port}`)
 })