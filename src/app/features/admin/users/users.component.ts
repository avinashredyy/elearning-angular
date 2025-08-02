import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-users',
  template: `
    <div style="padding: 24px;">
      <mat-card>
        <mat-card-content>
          <h2>User Management</h2>
          <p>User management functionality will be implemented here.</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  standalone: true,
  imports: [CommonModule, MatCardModule]
})
export class UsersComponent {} 