import { Request, Response } from "express";
import courses from "../models/courseData";

// Create a new course
export const createCourse = async (req: Request, res: Response) => {
  try {
    const { title, description, instructor, duration } = req.body;

    const course = await courses.create({
      title,
      description,
      instructor,
      duration,
    });

    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: "Failed to create course" });
  }
};

// Get all courses
export const getCourses = async (req: Request, res: Response) => {
  try {
    const allCourses = await courses.find().sort({ createdAt: -1 });
    res.json(allCourses);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch courses" });
  }
};

// Get single course
export const getCourseById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const course = await courses.findById(id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch course" });
  }
};

// Update a course
export const updateCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, instructor, duration } = req.body;

    const course = await courses.findByIdAndUpdate(
      id,
      { title, description, instructor, duration },
      { new: true }
    );

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json({ message: "Course updated", course });
  } catch (error) {
    res.status(500).json({ message: "Failed to update course" });
  }
};

// Delete a course
export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const course = await courses.findByIdAndDelete(id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json({ message: "Course deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete course" });
  }
};

// Toggle publish status
export const togglePublish = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const course = await courses.findById(id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    course.isPublished = !course.isPublished;
    await course.save();

    res.json({
      message: "Course status updated",
      isPublished: course.isPublished,
    });
  } catch (error) {
    res.status(500).json({ message: "Toggle failed" });
  }
};