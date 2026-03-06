export interface Course {
  _id: string;
  title: string;
  description: string;
  instructor: string;
  duration: number;
  isPublished: boolean;
  createdAt: string;
}

export interface CourseUpdateResponse {
  message: string;
  course: Course;
}