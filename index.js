const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

//Import Routes
const authRoutes = require('./routes/auth');
const postRoute = require('./routes/posts');

//connect to db
mongoose.connect(
    process.env.MONGO_URI,
    { useNewUrlParser: true, useUnifiedTopology: true },
    ()=>console.log('Database connected!')
    )

//Middleware
app.use(express.json());

//Route middleware
app.use('/api/user',authRoutes);
app.use('/api/posts',postRoute);


app.listen(3000,()=>console.log("server is up and running"));
