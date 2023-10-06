const express = require("express");
const app = express();
const todoHandler = require("./routeHandler/todoHandler");
const mongoose = require("mongoose");


app.use(express.json());

//connecting with mongoose
mongoose.connect("mongodb://localhost/todo")
    .then(() => {
        console.log("Connection to MongoDB successful");

        // Additional error handling for MongoDB connection
        mongoose.connection.on("error", (err) => {
            console.error("MongoDB connection error:", err);
        });
    })
    .catch((err) => console.error(err));

//creating routes
app.use("/todo",todoHandler);




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