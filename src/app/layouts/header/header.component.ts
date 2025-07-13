import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, RouterModule],
  template: `
    <mat-toolbar color="primary">
      <span>{{ appName }}</span>
      <span class="spacer"></span>
      <button mat-button routerLink="/dashboard">Dashboard</button>
      <button mat-button routerLink="/courses">Courses</button>
      <button mat-button routerLink="/health">Health Check</button>
    </mat-toolbar>
  `,
  styles: [`
    .spacer {
      flex: 1 1 auto;
    }
  `]
})
export class HeaderComponent {
  appName = environment.appName;
}