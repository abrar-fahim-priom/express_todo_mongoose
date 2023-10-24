const express = require("express");
const router = express.Router(); //Creating the sub app //passing as todoHandler
const todoSchema = require("../Schemas/todoSchema"); //for model
const mongoose = require("mongoose");
router.use(express.json());

const TODO = new mongoose.model("TODO", todoSchema);

//GET ALL THE TODOS
router.get("/", async (req, res) => {
  try {
    const result = await TODO.find(); 
    res.status(201).json({ message: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//GET A TO DO THROUGH ID
router.get("/:id", async (req, res) => {
    try {
        const result = await TODO.find({_id: req.params.id}); 
        res.status(201).json({ message: result });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
});

//POST A TODO
router.post("/", async (req, res) => {
  try {
    const newTodo = new TODO(req.body); //instance needed to call .save() for single post
    await newTodo.save();
    res.status(200).json({ message: "Todo was inserted successfully" });
  } catch (error) {
    console.error("Error saving todo:", error);
    res.status(500).json({ error: "There was a server-side error" });
  }
});

//POST multiple TODO
router.post("/all", async (req, res) => {
  try {
    await TODO.insertMany(req.body); //dont need to create instances
    res.status(201).json({ message: "Data saved successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//put todo for updating
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    console.log(req.body);
   

    // Update your TODO document using the data from the request body
    await TODO.updateOne(
      { _id: id },
      {
        $set: {
          title: req.body.title,
          status: req.body.status,
          description: req.body.description,
        },
      }
    );

    res.status(201).json({ message: "Data Updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//delete todo
router.delete("/:id", async (req, res) => {});

module.exports = router;
