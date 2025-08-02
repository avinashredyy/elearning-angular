import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { 
  Course, 
  CreateCourseRequest, 
  UpdateCourseRequest, 
  ApiResponse,
  PagedResult 
} from '../../shared/models/course.model';

export interface CourseQueryParams {
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
  category?: string;
  difficulty?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private readonly apiUrl = `${environment.apiUrl}/courses`;

  constructor(private http: HttpClient) {}

  // Get all courses with optional filtering and pagination
  getCourses(params?: CourseQueryParams): Observable<Course[]> {
    let httpParams = new HttpParams();
    
    if (params) {
      if (params.pageNumber) httpParams = httpParams.set('pageNumber', params.pageNumber.toString());
      if (params.pageSize) httpParams = httpParams.set('pageSize', params.pageSize.toString());
      if (params.searchTerm) httpParams = httpParams.set('searchTerm', params.searchTerm);
      if (params.category) httpParams = httpParams.set('category', params.category);
      if (params.difficulty) httpParams = httpParams.set('difficulty', params.difficulty);
      if (params.sortBy) httpParams = httpParams.set('sortBy', params.sortBy);
      if (params.sortDirection) httpParams = httpParams.set('sortDirection', params.sortDirection);
    }

    return this.http.get<Course[]>(this.apiUrl, { params: httpParams })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Get single course by ID
  getCourse(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Create new course
  createCourse(course: CreateCourseRequest): Observable<Course> {
    return this.http.post<Course>(this.apiUrl, course)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Update existing course
  updateCourse(id: number, course: UpdateCourseRequest): Observable<Course> {
    return this.http.put<Course>(`${this.apiUrl}/${id}`, course)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Delete course
  deleteCourse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Get course categories (for dropdown)
  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/categories`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Search courses
  searchCourses(searchTerm: string): Observable<Course[]> {
    const params = new HttpParams().set('searchTerm', searchTerm);
    return this.http.get<Course[]>(`${this.apiUrl}/search`, { params })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Private error handling method
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Server-side error
      switch (error.status) {
        case 400:
          errorMessage = 'Bad Request: Please check your input';
          break;
        case 401:
          errorMessage = 'Unauthorized: Please login again';
          break;
        case 403:
          errorMessage = 'Forbidden: You do not have permission';
          break;
        case 404:
          errorMessage = 'Course not found';
          break;
        case 500:
          errorMessage = 'Internal Server Error: Please try again later';
          break;
        default:
          errorMessage = `Server Error: ${error.status} - ${error.message}`;
      }
    }
    
    console.error('Course Service Error:', error);
    return throwError(() => new Error(errorMessage));
  }
} 