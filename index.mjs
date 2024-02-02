import express from "express";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 5050;
const app = express();

import grades from "./routes/grades.mjs"

app.use(express.json());

// root route
app.get("/", (req, res) => {
    res.send("Welcome to the API");
});

app.use("/grades", grades);

// Global error handling
app.use((err, _req, res, next) => {
    res.status(500).send("Seems like we messed up somewhere...");
  });

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });