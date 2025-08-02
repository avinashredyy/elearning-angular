import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-settings',
  template: `
    <div style="padding: 24px;">
      <mat-card>
        <mat-card-content>
          <h2>Settings</h2>
          <p>Settings functionality will be implemented here.</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  standalone: true,
  imports: [CommonModule, MatCardModule]
})
export class SettingsComponent {} 