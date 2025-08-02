import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-register',
  template: `
    <div style="padding: 24px; text-align: center;">
      <mat-card>
        <mat-card-content>
          <h2>Register</h2>
          <p>Registration functionality will be implemented here.</p>
          <button mat-raised-button color="primary">Register</button>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule]
})
export class RegisterComponent {} 