import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseListComponent } from './course-list/course-list.component';
import { CourseCreateComponent } from './course-create/course-create.component';
import { CourseEditComponent } from './course-edit/course-edit.component';
import { CanDeactivateGuard } from '../../core/guards/can-deactivate.guard';
import { CourseResolverService } from '../../core/resolvers/course-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: CourseListComponent,
    data: { 
      title: 'Courses',
      breadcrumb: 'Courses' 
    }
  },
  {
    path: 'create',
    component: CourseCreateComponent,
    canDeactivate: [CanDeactivateGuard],
    data: { 
      title: 'Create Course',
      breadcrumb: 'Create Course' 
    }
  },
  {
    path: 'edit/:id',
    component: CourseEditComponent,
    canDeactivate: [CanDeactivateGuard],
    resolve: {
      course: CourseResolverService
    },
    data: { 
      title: 'Edit Course',
      breadcrumb: 'Edit Course' 
    }
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoursesRoutingModule { } 