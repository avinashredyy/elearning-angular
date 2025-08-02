import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';
import { ConfirmDialogData, ConfirmDialogResult } from '../interfaces/confirm-dialog.interface';

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {
  constructor(private dialog: MatDialog) {}

  /**
   * Opens a confirmation dialog
   */
  confirm(data: ConfirmDialogData, config?: MatDialogConfig): Observable<ConfirmDialogResult | undefined> {
    const dialogConfig: MatDialogConfig = {
      width: '400px',
      maxWidth: '90vw',
      disableClose: true,
      autoFocus: true,
      restoreFocus: true,
      ...config,
      data
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    return dialogRef.afterClosed();
  }

  /**
   * Shortcut for delete confirmation
   */
  confirmDelete(
    itemName: string, 
    additionalInfo?: string,
    requireConfirmation = true
  ): Observable<ConfirmDialogResult | undefined> {
    const data: ConfirmDialogData = {
      title: 'Delete Confirmation',
      message: `Are you sure you want to delete "${itemName}"?`,
      additionalInfo: additionalInfo || 'This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      isDestructive: true,
      icon: 'delete_forever',
      showCheckbox: requireConfirmation,
      checkboxText: 'I understand this action cannot be undone'
    };

    return this.confirm(data);
  }

  /**
   * Shortcut for unsaved changes confirmation
   */
  confirmUnsavedChanges(): Observable<ConfirmDialogResult | undefined> {
    const data: ConfirmDialogData = {
      title: 'Unsaved Changes',
      message: 'You have unsaved changes that will be lost.',
      additionalInfo: 'Are you sure you want to continue without saving?',
      confirmText: 'Leave Without Saving',
      cancelText: 'Stay',
      isDestructive: true,
      icon: 'warning'
    };

    return this.confirm(data);
  }

  /**
   * Shortcut for general destructive action
   */
  confirmDestructiveAction(
    title: string,
    message: string,
    actionText: string = 'Continue'
  ): Observable<ConfirmDialogResult | undefined> {
    const data: ConfirmDialogData = {
      title,
      message,
      confirmText: actionText,
      cancelText: 'Cancel',
      isDestructive: true,
      icon: 'warning'
    };

    return this.confirm(data);
  }

  /**
   * Shortcut for informational confirmation
   */
  confirmAction(
    title: string,
    message: string,
    confirmText: string = 'Continue'
  ): Observable<ConfirmDialogResult | undefined> {
    const data: ConfirmDialogData = {
      title,
      message,
      confirmText,
      cancelText: 'Cancel',
      isDestructive: false,
      icon: 'info'
    };

    return this.confirm(data);
  }
} 