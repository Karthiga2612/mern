import axios from "axios";
import type { Course, CourseUpdateResponse } from "../types/course";

const api = axios.create({
  baseURL: "http://localhost:5000/api/courses",
});

// Create a new course
export const createCourse = async (
  title: string,
  description: string,
  instructor: string,
  duration: number
) => {
  const { data } = await api.post<Course>("/", {
    title,
    description,
    instructor,
    duration,
  });
  return data;
};

// Get all courses
export const getAllCourses = async () => {
  const { data } = await api.get<Course[]>("/");
  return data;
};

// Update a course
export const updateCourse = async (
  id: string,
  title: string,
  description: string,
  instructor: string,
  duration: number
) => {
  const { data } = await api.put<CourseUpdateResponse>(`/${id}`, {
    title,
    description,
    instructor,
    duration,
  });
  return data;
};

// Delete a course
export const deleteCourse = async (id: string) => {
  const { data } = await api.delete<{ message: string }>(`/${id}`);
  return data;
};

// Toggle publish status
export const toggleCoursePublish = async (id: string) => {
  const { data } = await api.patch<{ message: string; isPublished: boolean }>(
    `/toggle/${id}`
  );
  return data;
};