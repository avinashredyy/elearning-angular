export interface Course {
  id?: number;
  title: string;
  description: string;
  duration: number; // in hours
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  instructor: string;
  price: number;
  isPublished: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateCourseRequest {
  title: string;
  description: string;
  durationInHours: number;
  level: string;
  category: string;
  instructorId: string;
  price: number;
  isPublished: boolean;
}

export interface UpdateCourseRequest extends CreateCourseRequest {
  id: number;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
} 