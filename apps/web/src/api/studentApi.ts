import axios from "axios";
import type {
  Student,
  LoginResponse,
  UpdateResponse,
  DeleteResponse,
} from "../types/student";

const api = axios.create({
  baseURL: "http://localhost:5000/api/students",
});

// Register a new student
export const registerStudent = async (email: string, password: string) => {
  const { data } = await api.post<Student>("/create-student", {
    email,
    password,
  });
  return data;
};

// Login and receive a JWT token
export const loginStudent = async (email: string, password: string) => {
  const { data } = await api.post<LoginResponse>("/login", {
    email,
    password,
  });
  return data;
};

// Fetch every student
export const getAllStudents = async () => {
  const { data } = await api.get<Student[]>("/");
  return data;
};

// Toggle active status
export const toggleStudentStatus = async (id: string) => {
  const { data } = await api.patch(`/toggle/${id}`);
  return data;
};

// Update student email or password
export const updateStudent = async (
  id: string,
  email: string,
  password?: string
) => {
  const body: { email: string; password?: string } = { email };
  if (password) {
    body.password = password;
  }
  const { data } = await api.put<UpdateResponse>(`/update/${id}`, body);
  return data;
};

// Delete a student
export const deleteStudent = async (id: string) => {
  const { data } = await api.delete<DeleteResponse>(`/delete/${id}`);
  return data;
};