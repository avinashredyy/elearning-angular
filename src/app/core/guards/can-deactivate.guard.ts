import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ConfirmDialogService } from '../../shared/services/confirm-dialog.service';
import { map } from 'rxjs/operators';

// Interface for components that can have unsaved changes
export interface CanComponentDeactivate {
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean;
  hasUnsavedChanges?(): boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {
  
  constructor(private confirmDialogService: ConfirmDialogService) {}

  canDeactivate(
    component: CanComponentDeactivate
  ): Observable<boolean> | Promise<boolean> | boolean {
    
    // If component doesn't have unsaved changes, allow navigation
    if (component.hasUnsavedChanges && !component.hasUnsavedChanges()) {
      return true;
    }

    // If component has custom deactivation logic, use it
    if (component.canDeactivate) {
      return component.canDeactivate();
    }

    // Show confirmation dialog for unsaved changes
    return this.confirmDialogService.confirmUnsavedChanges().pipe(
      map(result => result?.confirmed || false)
    );
  }
} 