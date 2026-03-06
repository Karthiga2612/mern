import express from "express";
import cors from "cors";
import dotenv from "dotenv"
import { connectDB } from "./configs/db";
import studentRoute from "./routes/student.routes"
import courseRoute from './routes/course.routes';

const app = express();

app.use(express.json())  //middleware-allows server to read JSON data from req
app.use(cors());  //allows req from different domains
dotenv.config();
connectDB();

app.use("/api/students", studentRoute);
app.use("/api/courses", courseRoute);

app.get("/", (req, res) => {
  res.send("Backend Working Fine");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

//WORKFLOW:
// Server starts → app.listen()

// Browser sends request → http://localhost:5000

// Express checks routes

// / route matches

// Code inside app.get() runs

// res.send() sends response

// Browser displays the message