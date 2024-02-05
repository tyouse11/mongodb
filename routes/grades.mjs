import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb"; // comes from MongoDB library
import Grade from '../models/grade.mjs';

const router = express.Router();


// Index - Find all grades
router.get('/', async (req, res) => {
  let foundGrades = await Grade.find().limit(50)
  res.status(200).json({
    foundGrades: foundGrades
  })
})

// Create a single grade entry
router.post("/", async (req, res) => {
    let collection = await db.collection("grades");
    let newDocument = req.body;
  
    // rename fields for backwards compatibility
    if (newDocument.student_id) {
      newDocument.learner_id = newDocument.student_id;
      delete newDocument.student_id;
    }
  
    let result = await collection.insertOne(newDocument);
    res.send(result).status(204);
  });

// Get a single grade entry
router.get("/:id", async (req, res) => {
    // for MongoDB
    // let collection = await db.collection("grades");
    // let query = { _id: new ObjectId(req.params.id) };
    // let result = await collection.findOne(query);

    // if (!result) res.send("Not found").status(404);
    // else res.send(result).status(200);

    // for Mongoose
    let foundGrade = await Grade.findById(req.params.id)
    res.status(200).json({
      data: foundGrade
    })
  });

// Add a score to a grade entry
router.patch("/:id/add", async (req, res) => {
    let collection = await db.collection("grades");
    let query = { _id: ObjectId(req.params.id) };
  
    let result = await collection.updateOne(query, {
      $push: { scores: req.body }
    });
  
    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200);
  });
  
  // Remove a score from a grade entry
  router.patch("/:id/remove", async (req, res) => {
    let collection = await db.collection("grades");
    let query = { _id: ObjectId(req.params.id) };
  
    let result = await collection.updateOne(query, {
      $pull: { scores: req.body }
    });
  
    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200);
  });
  
  // Delete a single grade entry
  router.delete("/:id", async (req, res) => {
    // let collection = await db.collection("grades");
    // let query = { _id: ObjectId(req.params.id) };
    // let result = await collection.deleteOne(query);
  
    // if (!result) res.send("Not found").status(404);
    // else res.send(result).status(200);
    await Grade.findByIdAndDelete(req.params.id) 
    res.status(204).json({
      data: "Item has been deleted"
    })
  });

  router.patch("/:id", async (req, res) => {
    const updatedGrade = await Grade.findByIdAndUpdate(req.params.id, req.body, { new: true});
    if (!updatedGrade) {
      return res.status(404).json({ error: 'Grade not found'});
    }
    res.status(200).json(updatedGrade);
  })

// Student route for backwards compatibility
router.get("/student/:id", async (req, res) => {
    res.redirect(`../learner/${req.params.id}`);
  });

// Get a learner's grade data
router.get("/learner/:id", async (req, res) => {
    // let collection = await db.collection("grades");
    // let query = { learner_id: Number(req.params.id) };
    // let result = await collection.find(query).toArray();
  
    // // Check for class_id parameter 
    // if (req.query.class) query.class_id = Number(req.query.class)

    
    // if (!result) res.send("Not found").status(404);
    // else res.send(result).status(200);
    // let learner_id = await Grade.findOne(req.params.id)
    // if (!learnerGrade) {
    //   return res.status(404).json({ error: 'Learner not found' });
    // }
    // res.status(200).json({
    //   data: learner_id 
    // })
    let result = await Grade.find({learner_id: req.params.id})

    if (!result) res.status(404).json({ data: "Not found"})
    else res.status(200).json({
      foundLearner: result});
  });

  // Delete a learner by learner_id
  router.delete("/learner/:id", async (req, res) => {
    let query = { learner_id: req.params.id};

    let result = await Grade.find(query);
    result.forEach( async ( grade, i) => {
      await Grade.findByIdAndDelete(grade._id)
    })
  });

  // Get a class's grade data
router.get("/class/:id", async (req, res) => {
    let collection = await db.collection("grades");
    let query = { class_id: Number(req.params.id) };
    let result = await collection.find(query).toArray();
  
    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200);
  });

export default router;