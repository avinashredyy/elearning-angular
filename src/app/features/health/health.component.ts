import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HealthService } from '../../core/services/health.service';

@Component({
  selector: 'app-health',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="health-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>API Health Check</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="status-section">
            <div *ngIf="loading" class="loading">
              <mat-spinner diameter="40"></mat-spinner>
              <p>Checking API connection...</p>
            </div>
            
            <div *ngIf="!loading && isHealthy" class="status success">
              <mat-icon>check_circle</mat-icon>
              <h3>API Connected</h3>
              <p>Backend is running successfully</p>
            </div>
            
            <div *ngIf="!loading && !isHealthy" class="status error">
              <mat-icon>error</mat-icon>
              <h3>API Connection Failed</h3>
              <p>{{ errorMessage }}</p>
            </div>
          </div>
        </mat-card-content>
        <mat-card-actions>
          <button mat-raised-button color="primary" (click)="checkHealth()">
            <mat-icon>refresh</mat-icon>
            Refresh
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .health-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 60vh;
      padding: 20px;
    }

    mat-card {
      max-width: 500px;
      width: 100%;
    }

    .status-section {
      text-align: center;
      padding: 20px 0;
    }

    .status {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
    }

    .success mat-icon {
      color: #4caf50;
      font-size: 48px;
      width: 48px;
      height: 48px;
    }

    .error mat-icon {
      color: #f44336;
      font-size: 48px;
      width: 48px;
      height: 48px;
    }

    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 15px;
    }

    mat-card-actions {
      display: flex;
      justify-content: center;
    }
  `]
})
export class HealthComponent implements OnInit {
  loading = false;
  isHealthy = false;
  errorMessage = '';

  constructor(private healthService: HealthService) {}

  ngOnInit() {
    this.checkHealth();
  }

  checkHealth() {
    this.loading = true;
    this.healthService.checkHealth().subscribe({
      next: (response) => {
        this.isHealthy = true;
        this.loading = false;
        this.errorMessage = '';
      },
      error: (error) => {
        this.isHealthy = false;
        this.loading = false;
        this.errorMessage = error.message || 'Unable to connect to API';
      }
    });
  }
}