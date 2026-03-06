import express from "express";
import {
  createStudent,
  login,
  getStudents,
  toggleLogic,
  updateStudent,
  deleteStudent,
} from "../controllers/student.controller";

const router = express.Router();

router.post("/create-student", createStudent);
router.post("/login", login);
router.get("/", getStudents);
router.patch("/toggle/:id", toggleLogic);
router.put("/update/:id", updateStudent);
router.delete("/delete/:id", deleteStudent);

export default router;