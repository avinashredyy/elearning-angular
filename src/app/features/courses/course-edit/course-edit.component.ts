import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
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
import { switchMap, of } from 'rxjs';
import { Course, UpdateCourseRequest } from '../../../shared/models/course.model';
import { CourseService } from '../../../core/services/course.service';
import { LoadingService } from '../../../core/services/loading.service';
import { ConfirmDialogService } from '../../../shared/services/confirm-dialog.service';
import { CanComponentDeactivate } from '../../../core/guards/can-deactivate.guard';
import { MaterialModule } from '../../../shared/material.module';

// Reuse validators from create component
export class CourseValidators {
  static positiveNumber(control: AbstractControl): {[key: string]: any} | null {
    const value = control.value;
    if (value !== null && (isNaN(value) || value <= 0)) {
      return { 'positiveNumber': { value: control.value } };
    }
    return null;
  }

  static validDuration(control: AbstractControl): {[key: string]: any} | null {
    const value = control.value;
    if (value !== null && (isNaN(value) || value < 0.5 || value > 1000)) {
      return { 'invalidDuration': { value: control.value } };
    }
    return null;
  }

  static maxPrice(control: AbstractControl): {[key: string]: any} | null {
    const value = control.value;
    if (value !== null && (isNaN(value) || value < 0 || value > 10000)) {
      return { 'invalidPrice': { value: control.value } };
    }
    return null;
  }
}

@Component({
  selector: 'app-course-edit',
  templateUrl: './course-edit.component.html',
  styleUrls: ['./course-edit.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatChipsModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule
  ]
})
export class CourseEditComponent implements OnInit, CanComponentDeactivate {
  // Angular Signals for reactive state
  loading = signal(false);
  saving = signal(false);
  courseNotFound = signal(false);
  categories = signal<string[]>([]);
  instructors = signal<string[]>([]);
  
  // Current course being edited
  currentCourse = signal<Course | null>(null);
  courseId = signal<number | null>(null);
  
  // Form instance
  courseForm!: FormGroup;
  
  // Store original values for comparison
  originalValues: any = {};
  
  // Static options
  difficulties = [
    { value: 'Beginner', label: 'Beginner', description: 'No prior knowledge required' },
    { value: 'Intermediate', label: 'Intermediate', description: 'Some experience recommended' },
    { value: 'Advanced', label: 'Advanced', description: 'Extensive knowledge required' }
  ];

  // Computed signals for form validation state
  isFormValid = computed(() => {
    return this.courseForm?.valid ?? false;
  });

  isFormDirty = computed(() => {
    return this.courseForm?.dirty ?? false;
  });

  hasChanges = computed(() => {
    if (!this.courseForm || !this.currentCourse()) {
      return false;
    }
    
    const currentValues = this.courseForm.value;
    const original = this.originalValues;
    
    return JSON.stringify(currentValues) !== JSON.stringify(original);
  });

  canSave = computed(() => {
    return this.isFormValid() && this.hasChanges() && !this.saving();
  });

  // Course display info
  courseDisplayInfo = computed(() => {
    const course = this.currentCourse();
    if (!course) return null;
    
    return {
      title: course.title,
      status: course.isPublished ? 'Published' : 'Draft',
      lastUpdated: course.updatedAt ? new Date(course.updatedAt).toLocaleDateString() : 'Unknown'
    };
  });

  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    private loadingService: LoadingService,
    private confirmDialogService: ConfirmDialogService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.loadCourseFromRoute();
    this.setupFormSubscriptions();
    this.loadInitialData();
  }

  private loadCourseFromRoute(): void {
    this.loading.set(true);
    this.loadingService.setLoading(true);

    this.route.params.pipe(
      switchMap(params => {
        const id = Number(params['id']);
        this.courseId.set(id);
        
        if (isNaN(id) || id <= 0) {
          this.courseNotFound.set(true);
          return of(null);
        }
        
        return this.courseService.getCourse(id);
      })
    ).subscribe({
      next: (course) => {
        if (course) {
          this.currentCourse.set(course);
          this.populateForm(course);
          this.courseNotFound.set(false);
        } else {
          this.courseNotFound.set(true);
        }
        this.loading.set(false);
        this.loadingService.setLoading(false);
      },
      error: (error) => {
        console.error('Failed to load course:', error);
        this.courseNotFound.set(true);
        this.loading.set(false);
        this.loadingService.setLoading(false);
        this.snackBar.open(
          'Failed to load course: ' + error.message,
          'Close',
          { duration: 5000, panelClass: ['error-snackbar'] }
        );
      }
    });
  }

  private initializeForm(): void {
    this.courseForm = this.fb.group({
      title: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(200)
      ]],
      description: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(2000)
      ]],
      category: ['', [Validators.required]],
      instructor: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100)
      ]],
      difficulty: ['Beginner', [Validators.required]],
      duration: [1, [
        Validators.required,
        CourseValidators.validDuration
      ]],
      price: [0, [
        Validators.required,
        CourseValidators.maxPrice
      ]],
      isPublished: [false]
    });
  }

  private populateForm(course: Course): void {
    const formValues = {
      title: course.title,
      description: course.description,
      category: course.category,
      instructor: course.instructor,
      difficulty: course.difficulty,
      duration: course.duration,
      price: course.price,
      isPublished: course.isPublished
    };

    this.courseForm.patchValue(formValues);
    
    // Store original values for comparison
    this.originalValues = { ...formValues };
    
    // Mark form as pristine after population
    this.courseForm.markAsPristine();
  }

  private setupFormSubscriptions(): void {
    // Watch for form changes to trigger computed signals
    this.courseForm.valueChanges.subscribe(() => {
      // This triggers the computed signals to recalculate
    });

    this.courseForm.statusChanges.subscribe(() => {
      // This also triggers computed signals for validation state
    });
  }

  private loadInitialData(): void {
    // Load categories
    this.courseService.getCategories().subscribe({
      next: (categories) => {
        this.categories.set(categories);
      },
      error: (error) => {
        console.error('Failed to load categories:', error);
      }
    });

    // Simulate loading instructors (replace with actual API call)
    setTimeout(() => {
      this.instructors.set([
        'Dr. Sarah Johnson',
        'Prof. Michael Chen',
        'Jane Smith',
        'Robert Davis',
        'Dr. Emily Wilson'
      ]);
    }, 500);
  }

  // Form field getter methods for easier template access
  get title() { return this.courseForm.get('title'); }
  get description() { return this.courseForm.get('description'); }
  get category() { return this.courseForm.get('category'); }
  get instructor() { return this.courseForm.get('instructor'); }
  get difficulty() { return this.courseForm.get('difficulty'); }
  get duration() { return this.courseForm.get('duration'); }
  get price() { return this.courseForm.get('price'); }
  get isPublished() { return this.courseForm.get('isPublished'); }

  // Error message helpers (same as create component)
  getTitleErrorMessage(): string {
    if (this.title?.hasError('required')) {
      return 'Course title is required';
    }
    if (this.title?.hasError('minlength')) {
      return 'Title must be at least 3 characters long';
    }
    if (this.title?.hasError('maxlength')) {
      return 'Title cannot exceed 200 characters';
    }
    return '';
  }

  getDescriptionErrorMessage(): string {
    if (this.description?.hasError('required')) {
      return 'Course description is required';
    }
    if (this.description?.hasError('minlength')) {
      return 'Description must be at least 10 characters long';
    }
    if (this.description?.hasError('maxlength')) {
      return 'Description cannot exceed 2000 characters';
    }
    return '';
  }

  getDurationErrorMessage(): string {
    if (this.duration?.hasError('required')) {
      return 'Duration is required';
    }
    if (this.duration?.hasError('invalidDuration')) {
      return 'Duration must be between 0.5 and 1000 hours';
    }
    return '';
  }

  getPriceErrorMessage(): string {
    if (this.price?.hasError('required')) {
      return 'Price is required';
    }
    if (this.price?.hasError('invalidPrice')) {
      return 'Price must be between $0 and $10,000';
    }
    return '';
  }

  // Form submission
  onSubmit(): void {
    if (this.courseForm.valid && this.hasChanges() && !this.saving()) {
      this.updateCourse();
    } else if (!this.hasChanges()) {
      this.snackBar.open(
        'No changes to save', 
        'Close', 
        { duration: 3000 }
      );
    } else {
      this.markFormGroupTouched();
      this.snackBar.open(
        'Please fix the form errors before submitting', 
        'Close', 
        { duration: 3000, panelClass: ['error-snackbar'] }
      );
    }
  }

  private updateCourse(): void {
    const courseId = this.courseId();
    if (!courseId) return;

    this.saving.set(true);
    this.loadingService.setLoading(true);

    const courseData: UpdateCourseRequest = {
      id: courseId,
      title: this.courseForm.value.title.trim(),
      description: this.courseForm.value.description.trim(),
      category: this.courseForm.value.category,
      instructorId: this.courseForm.value.instructor.trim(),
      level: this.courseForm.value.difficulty,
      durationInHours: Number(this.courseForm.value.duration),
      price: Number(this.courseForm.value.price),
      isPublished: Boolean(this.courseForm.value.isPublished)
    };

    this.courseService.updateCourse(courseId, courseData).subscribe({
      next: (updatedCourse) => {
        this.saving.set(false);
        this.loadingService.setLoading(false);
        
        // Update current course and original values
        this.currentCourse.set(updatedCourse);
        this.originalValues = { ...this.courseForm.value };
        this.courseForm.markAsPristine();
        
        this.snackBar.open(
          `Course "${updatedCourse.title}" updated successfully!`, 
          'Close', 
          { duration: 3000, panelClass: ['success-snackbar'] }
        );
      },
      error: (error) => {
        this.saving.set(false);
        this.loadingService.setLoading(false);
        
        this.snackBar.open(
          'Failed to update course: ' + error.message, 
          'Close', 
          { duration: 5000, panelClass: ['error-snackbar'] }
        );
      }
    });
  }

  // Helper methods
  private markFormGroupTouched(): void {
    Object.keys(this.courseForm.controls).forEach(key => {
      const control = this.courseForm.get(key);
      control?.markAsTouched();
    });
  }

  onCancel(): void {
    if (this.hasChanges()) {
      this.confirmDialogService.confirmUnsavedChanges().subscribe(result => {
        if (result?.confirmed) {
          this.router.navigate(['/courses']);
        }
      });
    } else {
      this.router.navigate(['/courses']);
    }
  }

  onReset(): void {
    this.confirmDialogService.confirmDestructiveAction(
      'Reset Changes',
      'All unsaved changes will be lost and the form will revert to the last saved version.',
      'Reset'
    ).subscribe(result => {
      if (result?.confirmed) {
        const course = this.currentCourse();
        if (course) {
          this.populateForm(course);
        }
      }
    });
  }

  onDelete(): void {
    const course = this.currentCourse();
    const courseId = this.courseId();
    
    if (!course || !courseId) return;

    this.confirmDialogService.confirmDelete(
      course.title,
      'This will permanently delete the course and all its content. Students will lose access immediately.',
      true
    ).subscribe(result => {
      if (result?.confirmed) {
        this.deleteCourse(courseId, course.title);
      }
    });
  }

  private deleteCourse(courseId: number, courseTitle: string): void {
    this.loadingService.setLoading(true);

    this.courseService.deleteCourse(courseId).subscribe({
      next: () => {
        this.loadingService.setLoading(false);
        this.snackBar.open(
          `Course "${courseTitle}" deleted successfully`, 
          'Close', 
          { duration: 3000, panelClass: ['success-snackbar'] }
        );
        this.router.navigate(['/courses']);
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

  // Preview methods (same as create component)
  getEstimatedReadTime(): string {
    const duration = this.duration?.value || 0;
    if (duration < 1) {
      return `${Math.round(duration * 60)} minutes`;
    } else if (duration === 1) {
      return '1 hour';
    } else {
      return `${duration} hours`;
    }
  }

  getFormattedPrice(): string {
    const price = this.price?.value || 0;
    if (price === 0) {
      return 'Free';
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }

  // Character count helpers
  getTitleCharacterCount(): string {
    const length = this.title?.value?.length || 0;
    return `${length}/200`;
  }

  getDescriptionCharacterCount(): string {
    const length = this.description?.value?.length || 0;
    return `${length}/2000`;
  }

  // Real-time preview data
  getPreviewData() {
    return {
      title: this.title?.value || 'Course Title',
      description: this.description?.value || 'Course description...',
      category: this.category?.value || 'Select Category',
      instructor: this.instructor?.value || 'Instructor Name',
      difficulty: this.difficulty?.value || 'Beginner',
      duration: this.getEstimatedReadTime(),
      price: this.getFormattedPrice(),
      isPublished: this.isPublished?.value || false
    };
  }

  // Navigation methods
  viewCourse(): void {
    const courseId = this.courseId();
    if (courseId) {
      this.router.navigate(['/courses', courseId]);
    }
  }

  // CanDeactivate implementation
  canDeactivate(): boolean {
    return !this.hasChanges();
  }

  hasUnsavedChanges(): boolean {
    return this.hasChanges();
  }
} 