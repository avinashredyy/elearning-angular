import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

export const HttpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);
  
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Show user-friendly error message
      snackBar.open(
        error.error?.message || 'An error occurred', 
        'Close', 
        { duration: 5000, panelClass: ['error-snackbar'] }
      );
      
      return throwError(() => error);
    })
  );
}; 