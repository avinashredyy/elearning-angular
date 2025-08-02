export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  icon?: string;
  additionalInfo?: string;
  showCheckbox?: boolean;
  checkboxText?: string;
}

export interface ConfirmDialogResult {
  confirmed: boolean;
  checkboxValue?: boolean;
} 