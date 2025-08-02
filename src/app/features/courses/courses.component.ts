import { Component } from '@angular/core';
import { CourseListComponent } from './course-list/course-list.component';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CourseListComponent],
  template: `
    <app-course-list></app-course-list>
  `
})
export class CoursesComponent {}