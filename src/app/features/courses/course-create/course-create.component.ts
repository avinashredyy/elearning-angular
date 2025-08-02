import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
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
import { CreateCourseRequest } from '../../../shared/models/course.model';
import { CourseService } from '../../../core/services/course.service';
import { LoadingService } from '../../../core/services/loading.service';
import { CanComponentDeactivate } from '../../../core/guards/can-deactivate.guard';
import { MaterialModule } from '../../../shared/material.module';

// Custom Validators
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
  selector: 'app-course-create',
  templateUrl: './course-create.component.html',
  styleUrls: ['./course-create.component.scss'],
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
export class CourseCreateComponent implements OnInit, CanComponentDeactivate {
  // Angular Signals for reactive state
  loading = signal(false);
  saving = signal(false);
  categories = signal<string[]>([]);
  instructors = signal<string[]>([]);
  
  // Form instance
  courseForm!: FormGroup;
  
  // Static options
  difficulties = [
    { value: 'Beginner', label: 'Beginner', description: 'No prior knowledge required' },
    { value: 'Intermediate', label: 'Intermediate', description: 'Some experience recommended' },
    { value: 'Advanced', label: 'Advanced', description: 'Extensive knowledge required' }
  ];

  // Computed signals for form validation state
  isFormValid = computed(() => {
    // This will reactively update when form validity changes
    return this.courseForm?.valid ?? false;
  });

  isFormDirty = computed(() => {
    return this.courseForm?.dirty ?? false;
  });

  canSave = computed(() => {
    return this.isFormValid() && !this.saving();
  });

  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    private loadingService: LoadingService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.loadInitialData();
    this.setupFormSubscriptions();
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

  private setupFormSubscriptions(): void {
    // Watch for form changes to trigger computed signals
    this.courseForm.valueChanges.subscribe(() => {
      // This triggers the computed signals to recalculate
      // isFormValid, isFormDirty, canSave will all update
    });

    this.courseForm.statusChanges.subscribe(() => {
      // This also triggers computed signals for validation state
    });
  }

  private loadInitialData(): void {
    this.loading.set(true);
    this.loadingService.setLoading(true);

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
      this.loading.set(false);
      this.loadingService.setLoading(false);
    }, 1000);
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

  // Error message helpers
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
    if (this.courseForm.valid && !this.saving()) {
      this.createCourse();
    } else {
      this.markFormGroupTouched();
      this.snackBar.open(
        'Please fix the form errors before submitting', 
        'Close', 
        { duration: 3000, panelClass: ['error-snackbar'] }
      );
    }
  }

  private createCourse(): void {
    this.saving.set(true);
    this.loadingService.setLoading(true);

    const courseData: CreateCourseRequest = {
      title: this.courseForm.value.title.trim(),
      description: this.courseForm.value.description.trim(),
      category: this.courseForm.value.category,
      instructorId: this.courseForm.value.instructor.trim(),
      level: this.courseForm.value.difficulty,
      durationInHours: Number(this.courseForm.value.duration),
      price: Number(this.courseForm.value.price),
      isPublished: Boolean(this.courseForm.value.isPublished)
    };

    this.courseService.createCourse(courseData).subscribe({
      next: (createdCourse) => {
        this.saving.set(false);
        this.loadingService.setLoading(false);
        
        this.snackBar.open(
          `Course "${createdCourse.title}" created successfully!`, 
          'Close', 
          { duration: 3000, panelClass: ['success-snackbar'] }
        );
        
        // Navigate back to course list
        this.router.navigate(['/courses']);
      },
      error: (error) => {
        this.saving.set(false);
        this.loadingService.setLoading(false);
        
        this.snackBar.open(
          'Failed to create course: ' + error.message, 
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
    if (this.isFormDirty()) {
      const confirmLeave = confirm('You have unsaved changes. Are you sure you want to leave?');
      if (confirmLeave) {
        this.router.navigate(['/courses']);
      }
    } else {
      this.router.navigate(['/courses']);
    }
  }

  onReset(): void {
    const confirmReset = confirm('Are you sure you want to reset the form? All changes will be lost.');
    if (confirmReset) {
      this.courseForm.reset();
      this.courseForm.patchValue({
        difficulty: 'Beginner',
        duration: 1,
        price: 0,
        isPublished: false
      });
    }
  }

  // Preview methods
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

  // CanDeactivate implementation
  canDeactivate(): boolean {
    return !this.isFormDirty();
  }

  hasUnsavedChanges(): boolean {
    return this.isFormDirty();
  }
} 