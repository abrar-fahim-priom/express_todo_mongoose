const express = require("express");
const app = express();
const todoHandler = require("./routeHandler/todoHandler");
const userHandler = require("./routeHandler/userHandler");
const mongoose = require("mongoose");
const cors = require('cors');
const dotenv = require("dotenv");

app.use(express.json());
app.use(cors());
dotenv.config();

//connecting with mongoose  //
mongoose.connect("mongodb://localhost/todo")
    .then(() => {
        console.log("Connection to MongoDB successful");

        // Additional error handling for MongoDB connection
        mongoose.connection.on("error", (err) => {
            console.error("MongoDB connection error:", err);
        });
    })
    .catch((err) => console.error(err));

//hitting /todo will take to todoHandler route
app.use("/todo",todoHandler);
app.use("/user",userHandler);



function errorHandler(err, req, res, next) {
    if (res.headersSent) {
      return next(err);
    }
  
    res.status(500).json({ error: err.message });
  }

  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Application specific logging, rethrowing, or other logic here
});

  
app.listen(3000,()=>{
    console.log("Running at 3000 port");
})