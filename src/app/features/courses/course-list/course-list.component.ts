import { Component, OnInit, ViewChild, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Course, UpdateCourseRequest } from '../../../shared/models/course.model';
import { CourseService } from '../../../core/services/course.service';
import { LoadingService } from '../../../core/services/loading.service';
import { ConfirmDialogService } from '../../../shared/services/confirm-dialog.service';
import { MaterialModule } from '../../../shared/material.module';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatChipsModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ]
})
export class CourseListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Angular Signals for reactive state management
  courses = signal<Course[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  // Material Table Configuration
  displayedColumns: string[] = [
    'title', 
    'category', 
    'instructor', 
    'difficulty', 
    'duration', 
    'price', 
    'isPublished', 
    'actions'
  ];
  
  dataSource = new MatTableDataSource<Course>();

  // Search and Filter Controls
  searchControl = new FormControl('');
  categoryControl = new FormControl('');
  difficultyControl = new FormControl('');

  // Filter Options
  categories: string[] = [];
  difficulties: string[] = ['Beginner', 'Intermediate', 'Advanced'];

  // Computed values using Angular signals
  filteredCourses = computed(() => {
    return this.courses().filter(course => {
      const searchTerm = this.searchControl.value?.toLowerCase() || '';
      const selectedCategory = this.categoryControl.value;
      const selectedDifficulty = this.difficultyControl.value;

      const matchesSearch = !searchTerm || 
        course.title.toLowerCase().includes(searchTerm) ||
        course.description.toLowerCase().includes(searchTerm) ||
        course.instructor.toLowerCase().includes(searchTerm);

      const matchesCategory = !selectedCategory || course.category === selectedCategory;
      const matchesDifficulty = !selectedDifficulty || course.difficulty === selectedDifficulty;

      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  });

  constructor(
    private courseService: CourseService,
    private loadingService: LoadingService,
    private confirmDialogService: ConfirmDialogService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCourses();
    this.setupSearch();
    this.loadCategories();

    // Update data source when filtered courses change
    // Use effect to watch for changes in filteredCourses signal
    effect(() => {
      this.dataSource.data = this.filteredCourses();
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private setupSearch(): void {
    // Debounce search input for better performance
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.applyFilters();
    });

    // Listen to filter changes
    this.categoryControl.valueChanges.subscribe(() => this.applyFilters());
    this.difficultyControl.valueChanges.subscribe(() => this.applyFilters());
  }

  private applyFilters(): void {
    // Trigger computed signal recalculation
    // The filteredCourses computed signal will automatically update
    this.dataSource.data = this.filteredCourses();
  }

  loadCourses(): void {
    this.loading.set(true);
    this.error.set(null);
    this.loadingService.setLoading(true);

    this.courseService.getCourses().subscribe({
      next: (courses) => {
        this.courses.set(courses);
        this.dataSource.data = courses;
        this.loading.set(false);
        this.loadingService.setLoading(false);
      },
      error: (error) => {
        this.error.set(error.message);
        this.loading.set(false);
        this.loadingService.setLoading(false);
        this.snackBar.open(
          'Failed to load courses: ' + error.message, 
          'Close', 
          { duration: 5000, panelClass: ['error-snackbar'] }
        );
      }
    });
  }

  private loadCategories(): void {
    this.courseService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Failed to load categories:', error);
      }
    });
  }

  // Navigation Methods
  createCourse(): void {
    this.router.navigate(['/courses/create']);
  }

  editCourse(course: Course): void {
    this.router.navigate(['/courses', course.id, 'edit']);
  }

  viewCourse(course: Course): void {
    this.router.navigate(['/courses', course.id]);
  }

  // Delete Course with Confirmation
  deleteCourse(course: Course): void {
    this.confirmDialogService.confirmDelete(
      course.title,
      'This will permanently remove the course and all associated data.',
      true // Require checkbox confirmation
    ).subscribe(result => {
      if (result?.confirmed && course.id) {
        this.performDelete(course.id, course.title);
      }
    });
  }

  private performDelete(courseId: number, courseTitle: string): void {
    this.loadingService.setLoading(true);

    this.courseService.deleteCourse(courseId).subscribe({
      next: () => {
        // Update the courses signal by removing the deleted course
        const updatedCourses = this.courses().filter(c => c.id !== courseId);
        this.courses.set(updatedCourses);
        this.dataSource.data = this.filteredCourses();

        this.loadingService.setLoading(false);
        this.snackBar.open(
          `Course "${courseTitle}" deleted successfully`, 
          'Close', 
          { duration: 3000, panelClass: ['success-snackbar'] }
        );
      },
      error: (error) => {
        this.loadingService.setLoading(false);
        this.snackBar.open(
          'Failed to delete course: ' + error.message, 
          'Close', 
          { duration: 5000, panelClass: ['error-snackbar'] }
        );
      }
    });
  }

  // Toggle Course Publication Status
  togglePublishStatus(course: Course): void {
    if (!course.id) return;

    const updatedCourse: UpdateCourseRequest = { 
      id: course.id,
      title: course.title,
      description: course.description,
      durationInHours: course.duration,
      level: course.difficulty,
      category: course.category,
      instructorId: course.instructor,
      price: course.price,
      isPublished: !course.isPublished
    };
    
    this.courseService.updateCourse(course.id, updatedCourse).subscribe({
      next: (updated) => {
        // Update the course in the signal
        const updatedCourses = this.courses().map(c => 
          c.id === updated.id ? updated : c
        );
        this.courses.set(updatedCourses);
        this.dataSource.data = this.filteredCourses();

        const status = updated.isPublished ? 'published' : 'unpublished';
        this.snackBar.open(
          `Course "${updated.title}" ${status} successfully`, 
          'Close', 
          { duration: 3000 }
        );
      },
      error: (error) => {
        this.snackBar.open(
          'Failed to update course status: ' + error.message, 
          'Close', 
          { duration: 5000, panelClass: ['error-snackbar'] }
        );
      }
    });
  }

  // Clear all filters
  clearFilters(): void {
    this.searchControl.setValue('');
    this.categoryControl.setValue('');
    this.difficultyControl.setValue('');
  }

  // Refresh data
  refresh(): void {
    this.loadCourses();
  }

  // Helper methods for template
  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }

  formatDuration(hours: number): string {
    if (hours < 1) {
      return `${Math.round(hours * 60)} min`;
    } else if (hours === 1) {
      return '1 hour';
    } else {
      return `${hours} hours`;
    }
  }

  getDifficultyColor(difficulty: string): string {
    switch (difficulty) {
      case 'Beginner': return 'primary';
      case 'Intermediate': return 'accent';
      case 'Advanced': return 'warn';
      default: return 'primary';
    }
  }
} 