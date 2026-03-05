import express from "express"
import { createStudent, login, getStudents, toggleLogic } from "../controllers/student.controller"

const router = express.Router();

router.post("/create-student", createStudent);
router.post("/login", login);
router.get("/", getStudents);
router.patch("/toggle/:id", toggleLogic);

export default router;