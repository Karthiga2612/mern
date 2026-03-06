import { Request, Response } from "express";
import students from "../models/studentData";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Create a new student
export const createStudent = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const studentDetail = await students.create({
      email,
      password: hashedPassword,
    });

    const studentResponse = studentDetail.toObject();
    const { password: _, ...safeStudent } = studentResponse;

    res.status(201).json(safeStudent);
  } catch (error) {
    res.status(500).json({ message: "Creation Failed" });
  }
};

// Login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const studentData = await students.findOne({ email });

    if (!studentData) {
      return res.status(400).json({ message: "Student Not Found" });
    }

    const checkPassword = await bcrypt.compare(password, studentData.password);


    if (!checkPassword) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    if (!studentData.isActive) {
      return res.status(403).json({ message: "User DeActivated" });
    }

    const token = jwt.sign(
      { id: studentData._id },
      process.env.JWT_SECRETE as string,
      { expiresIn: "7d" }
    );

    res.status(200).json({ message: "Login Successful", token });
  } catch (error) {
    res.status(500).json({ message: "Login Failed" });
  }
};

// Get all students
export const getStudents = async (req: Request, res: Response) => {
  try {
    const fetchStudent = await students.find().select("-password");
    res.json(fetchStudent);
  } catch (error) {
    res.status(500).json({ message: "Cannot fetch students" });
  }
};

// Toggle active status
export const toggleLogic = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const studentToggle = await students.findById(id);

    if (!studentToggle) {
      return res.status(404).json({ message: "Student Not found" });
    }

    studentToggle.isActive = !studentToggle.isActive;
    await studentToggle.save();

    res.json({
      message: "Student status updated",
      isActive: studentToggle.isActive,
    });
  } catch (error) {
    res.status(500).json({ message: "Toggle Failed" });
  }
};

// Update student email
export const updateStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { email, password } = req.body;

    const student = await students.findById(id);

    if (!student) {
      return res.status(404).json({ message: "Student Not Found" });
    }

    if (email) {
      student.email = email;
    }

    if (password) {
      student.password = await bcrypt.hash(password, 10);
    }

    await student.save();

    const updated = await students.findById(id).select("-password");
    res.json({ message: "Student Updated", student: updated });
  } catch (error) {
    res.status(500).json({ message: "Update Failed" });
  }
};

// Delete student
export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const student = await students.findByIdAndDelete(id);

    if (!student) {
      return res.status(404).json({ message: "Student Not Found" });
    }

    res.json({ message: "Student Deleted" });
  } catch (error) {
    res.status(500).json({ message: "Delete Failed" });
  }
};