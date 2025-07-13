import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [MatCardModule],
  template: `
    <div class="courses-container">
      <h1>Courses</h1>
      <mat-card>
        <mat-card-content>
          <p>Course management will be implemented in Milestone 2</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .courses-container {
      padding: 20px;
    }
  `]
})
export class CoursesComponent {}