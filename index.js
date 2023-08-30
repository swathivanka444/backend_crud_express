const express = require('express');
const mongoose = require('mongoose')
const dotenv = require("dotenv")
const cors = require('cors');
const app = express();
const router = require("./routes/router")
dotenv.config();
app.use(cors());
app.use(express.json());
app.use(router);
const PORT=4200
mongoose.connect(process.env.Database).then(()=>{
    console.log('Database connection Done')
}).catch((err)=>{
    console.log(err)
})
app.listen(PORT);