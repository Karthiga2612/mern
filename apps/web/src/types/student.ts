export interface Student {
  _id: string;
  email: string;
  isActive: boolean;
}

export interface LoginResponse {
  message: string;
  token: string;
}

export interface UpdateResponse {
  message: string;
  student: Student;
}

export interface DeleteResponse {
  message: string;
}