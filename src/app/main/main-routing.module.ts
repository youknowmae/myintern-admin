import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AnnouncementComponent } from './components/announcement/announcement.component';
import { RequirementsComponent } from './components/requirements/requirements.component';
import { StudentsComponent } from './components/students/students.component';
import { TemplatesComponent } from './components/templates/templates.component';
import { IndustrypartnersComponent } from './components/industrypartners/industrypartners.component';
import { EndorsementComponent } from './components/endorsement/endorsement.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'endorsement',
    component: EndorsementComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./components/endorsement/endorsement.module').then(
            (m) => m.EndorsementModule
          ),
      },
    ],
  },
  {
    path: 'announcement',
    component: AnnouncementComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./components/announcement/announcement.module').then(
            (m) => m.AnnouncementModule
          ),
      },
    ],
  },
  {
    path: 'requirements',
    component: RequirementsComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./components/requirements/requirements.module').then(
            (m) => m.RequirementsModule
          ),
      },
    ],
  },
  {
    path: 'students',
    component: StudentsComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./components/students/students.module').then(
            (m) => m.StudentsModule
          ),
      },
    ],
  },
  {
    path: 'templates',
    component: TemplatesComponent,
  },
  {
    path: 'industrypartners',
    component: IndustrypartnersComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./components/industrypartners/industrypartners.module').then(
            (m) => m.IndustrypartnersModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {}
