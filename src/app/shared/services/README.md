# Confirm Dialog Service

A comprehensive, reusable confirmation dialog system for the Angular e-learning application.

## Features

- ✅ **Reactive Design**: Built with Angular Signals for optimal performance
- ✅ **Multiple Dialog Types**: Delete, unsaved changes, destructive actions, and general confirmations
- ✅ **Checkbox Confirmation**: Optional checkbox for extra safety on destructive actions
- ✅ **Keyboard Navigation**: Enter to confirm, Escape to cancel
- ✅ **Responsive Design**: Works on all screen sizes
- ✅ **Accessibility**: Proper ARIA labels and keyboard support
- ✅ **Dark Theme Support**: Automatic dark mode detection
- ✅ **Animations**: Smooth fade-in animations

## Quick Start

### 1. Import the Service

```typescript
import { ConfirmDialogService } from '../../../shared/services/confirm-dialog.service';

export class YourComponent {
  constructor(private confirmDialogService: ConfirmDialogService) {}
}
```

### 2. Use the Service Methods

#### Delete Confirmation
```typescript
deleteItem(item: any): void {
  this.confirmDialogService.confirmDelete(
    item.name,
    'This will permanently remove the item and all associated data.',
    true // Require checkbox confirmation
  ).subscribe(result => {
    if (result?.confirmed) {
      // Perform delete operation
      this.performDelete(item.id);
    }
  });
}
```

#### Unsaved Changes Protection
```typescript
onNavigateAway(): void {
  if (this.hasUnsavedChanges()) {
    this.confirmDialogService.confirmUnsavedChanges().subscribe(result => {
      if (result?.confirmed) {
        this.router.navigate(['/some-route']);
      }
    });
  } else {
    this.router.navigate(['/some-route']);
  }
}
```

#### General Destructive Action
```typescript
performDestructiveAction(): void {
  this.confirmDialogService.confirmDestructiveAction(
    'Reset All Data',
    'This will reset all user data and cannot be undone.',
    'Reset All'
  ).subscribe(result => {
    if (result?.confirmed) {
      // Perform the action
    }
  });
}
```

#### Informational Confirmation
```typescript
showInfo(): void {
  this.confirmDialogService.confirmAction(
    'Information',
    'This action will update your profile settings.',
    'Continue'
  ).subscribe(result => {
    if (result?.confirmed) {
      // Continue with action
    }
  });
}
```

## API Reference

### ConfirmDialogService Methods

#### `confirm(data: ConfirmDialogData, config?: MatDialogConfig)`
Opens a custom confirmation dialog with full control over the content.

#### `confirmDelete(itemName: string, additionalInfo?: string, requireConfirmation = true)`
Shortcut for delete confirmations with optional checkbox requirement.

#### `confirmUnsavedChanges()`
Shortcut for unsaved changes protection.

#### `confirmDestructiveAction(title: string, message: string, actionText = 'Continue')`
Shortcut for general destructive actions.

#### `confirmAction(title: string, message: string, confirmText = 'Continue')`
Shortcut for informational confirmations.

### ConfirmDialogData Interface

```typescript
interface ConfirmDialogData {
  title: string;                    // Dialog title
  message: string;                  // Main message
  confirmText?: string;             // Confirm button text
  cancelText?: string;              // Cancel button text
  isDestructive?: boolean;          // Whether this is a destructive action
  icon?: string;                    // Material icon name
  additionalInfo?: string;          // Additional information text
  showCheckbox?: boolean;           // Show confirmation checkbox
  checkboxText?: string;            // Checkbox label text
}
```

### ConfirmDialogResult Interface

```typescript
interface ConfirmDialogResult {
  confirmed: boolean;               // Whether user confirmed
  checkboxValue?: boolean;          // Checkbox value if shown
}
```

## Examples

### Course Management
```typescript
// Delete course with extra confirmation
deleteCourse(course: Course): void {
  this.confirmDialogService.confirmDelete(
    course.title,
    'This will permanently delete the course and all its content. Students will lose access immediately.',
    true
  ).subscribe(result => {
    if (result?.confirmed) {
      this.performDelete(course.id);
    }
  });
}

// Reset form changes
resetForm(): void {
  this.confirmDialogService.confirmDestructiveAction(
    'Reset Changes',
    'All unsaved changes will be lost and the form will revert to the last saved version.',
    'Reset'
  ).subscribe(result => {
    if (result?.confirmed) {
      this.populateForm(this.originalData);
    }
  });
}
```

### User Management
```typescript
// Delete user account
deleteAccount(): void {
  this.confirmDialogService.confirmDelete(
    'your account',
    'This will permanently delete your account and all associated data including courses, progress, and settings.',
    true
  ).subscribe(result => {
    if (result?.confirmed) {
      this.accountService.deleteAccount();
    }
  });
}
```

## Styling

The dialog automatically adapts to your application's theme and includes:

- **Responsive Design**: Mobile-first approach
- **Dark Theme Support**: Automatic detection and styling
- **Animations**: Smooth fade-in effects
- **Accessibility**: Proper contrast and focus management

## Best Practices

1. **Use Appropriate Methods**: Choose the right shortcut method for your use case
2. **Provide Clear Messages**: Be specific about what will happen
3. **Use Checkboxes for Destructive Actions**: Require explicit confirmation for dangerous operations
4. **Handle Results Properly**: Always check `result?.confirmed` before proceeding
5. **Consider User Experience**: Don't overuse confirmations for simple actions

## Migration from Basic Confirm

Replace basic browser confirms:

```typescript
// Before
if (confirm('Are you sure?')) {
  // action
}

// After
this.confirmDialogService.confirmAction(
  'Confirmation',
  'Are you sure?',
  'Yes'
).subscribe(result => {
  if (result?.confirmed) {
    // action
  }
});
``` 