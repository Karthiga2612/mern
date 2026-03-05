import axios from "axios";
import type { Student, LoginResponse } from "../types/student";

const api = axios.create({
  baseURL: "http://localhost:5000/api/students",
});

/* Register a new student */
export const registerStudent = async (email: string, password: string) => {
  const { data } = await api.post("/create-student", { email, password });
  return data;
};

/* Login and receive a JWT token */
export const loginStudent = async (email: string, password: string) => {
  const { data } = await api.post<LoginResponse>("/login", { email, password });
  return data;
};

/* Fetch every student (password excluded by backend) */
export const getAllStudents = async () => {
  const { data } = await api.get<Student[]>("/");
  return data;
};

/* Flip a student's isActive flag */
export const toggleStudentStatus = async (id: string) => {
  const { data } = await api.patch(`/toggle/${id}`);
  return data;
};