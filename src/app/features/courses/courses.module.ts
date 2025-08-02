import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// Routing
import { CoursesRoutingModule } from './courses-routing.module';

// Material Modules
import { MaterialModule } from '../../shared/material.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CoursesRoutingModule,
    MaterialModule
  ]
})
export class CoursesModule { } 