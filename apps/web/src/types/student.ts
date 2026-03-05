export interface Student {
  _id: string;
  email: string;
  isActive: boolean;
}

export interface LoginResponse {
  message: string;
  token: string;
}