import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <h1>Welcome to E-Learning Platform</h1>
      
      <div class="cards-grid">
        <mat-card class="feature-card">
          <mat-card-header>
            <mat-card-title>API Status</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Check the connection to the backend API</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary" routerLink="/health">
              <mat-icon>health_and_safety</mat-icon>
              Health Check
            </button>
          </mat-card-actions>
        </mat-card>

        <mat-card class="feature-card">
          <mat-card-header>
            <mat-card-title>Courses</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Manage and browse available courses</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary" routerLink="/courses">
              <mat-icon>school</mat-icon>
              View Courses
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 20px;
    }

    h1 {
      text-align: center;
      margin-bottom: 30px;
    }

    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .feature-card {
      height: 200px;
      display: flex;
      flex-direction: column;
    }

    mat-card-content {
      flex: 1;
    }

    mat-card-actions {
      display: flex;
      justify-content: center;
    }

    button {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  `]
})
export class DashboardComponent {}