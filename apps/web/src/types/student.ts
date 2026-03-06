export interface Student {
  _id: string;
  password: String;
  email: string;
  isActive: boolean;
}

export interface LoginResponse {
  message: string;
  token: string;
}