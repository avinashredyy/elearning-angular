import { Component, Inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ConfirmDialogData, ConfirmDialogResult } from '../../interfaces/confirm-dialog.interface';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    MatDialogModule, 
    MatButtonModule, 
    MatIconModule, 
    MatCheckboxModule
  ]
})
export class ConfirmDialogComponent {
  // Signals for reactive state
  checkboxValue = signal(false);
  
  // Computed properties for better UX
  confirmButtonText = computed(() => {
    return this.data.confirmText || (this.data.isDestructive ? 'Delete' : 'Confirm');
  });

  cancelButtonText = computed(() => {
    return this.data.cancelText || 'Cancel';
  });

  dialogIcon = computed(() => {
    if (this.data.icon) {
      return this.data.icon;
    }
    return this.data.isDestructive ? 'warning' : 'help';
  });

  iconColor = computed(() => {
    return this.data.isDestructive ? 'warn' : 'primary';
  });

  confirmButtonColor = computed(() => {
    return this.data.isDestructive ? 'warn' : 'primary';
  });

  // Computed validation for confirm button
  canConfirm = computed(() => {
    // If checkbox is shown, it must be checked to proceed with destructive actions
    if (this.data.showCheckbox && this.data.isDestructive) {
      return this.checkboxValue();
    }
    return true;
  });

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent, ConfirmDialogResult>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {
    // Set default values
    this.data = {
      confirmText: 'Confirm',
      cancelText: 'Cancel',
      isDestructive: false,
      showCheckbox: false,
      ...data
    };
  }

  onConfirm(): void {
    const result: ConfirmDialogResult = {
      confirmed: true,
      checkboxValue: this.data.showCheckbox ? this.checkboxValue() : undefined
    };
    this.dialogRef.close(result);
  }

  onCancel(): void {
    const result: ConfirmDialogResult = {
      confirmed: false,
      checkboxValue: false
    };
    this.dialogRef.close(result);
  }

  onCheckboxChange(checked: boolean): void {
    this.checkboxValue.set(checked);
  }

  // Keyboard event handlers
  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && this.canConfirm()) {
      this.onConfirm();
    } else if (event.key === 'Escape') {
      this.onCancel();
    }
  }
} 