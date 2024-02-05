import mongoose from "mongoose";
const Schema = mongoose.Schema;
const model = mongoose.model;

const gradeSchema = new Schema(
    {
        scores: [],
        class_id: Number,
        learner_id: Number
    }
)
const Grade = model("Grade", gradeSchema);

// make exportable to be accessed in index.mjs
export default Grade;