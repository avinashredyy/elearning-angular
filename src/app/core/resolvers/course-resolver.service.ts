import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Course } from '../../shared/models/course.model';
import { CourseService } from '../services/course.service';

@Injectable({
  providedIn: 'root'
})
export class CourseResolverService implements Resolve<Course | null> {
  
  constructor(
    private courseService: CourseService,
    private router: Router
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Course | null> {
    const courseId = Number(route.paramMap.get('id'));
    
    if (isNaN(courseId) || courseId <= 0) {
      this.router.navigate(['/courses']);
      return of(null);
    }

    return this.courseService.getCourse(courseId).pipe(
      catchError(() => {
        this.router.navigate(['/courses']);
        return of(null);
      })
    );
  }
} 