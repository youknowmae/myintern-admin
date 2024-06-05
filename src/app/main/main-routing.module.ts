import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AnnouncementComponent } from './components/announcement/announcement.component';
import { ExitpollComponent } from './components/exitpoll/exitpoll.component';
import { RequirementsComponent } from './components/requirements/requirements.component';
import { StudentsComponent } from './components/students/students.component';
import { TemplatesComponent } from './components/templates/templates.component';
import { IndustrypartnersComponent } from './components/industrypartners/industrypartners.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    children: [{
      path: '',
      loadChildren: ()=>import('./components/dashboard/dashboard.module').then((m)=>m.DashboardModule)
    }]
  },
  { 
    path: 'announcement', 
    component: AnnouncementComponent,
    children: [{
      path: '',
      loadChildren: ()=>import('./components/announcement/announcement.module').then((m)=>m.AnnouncementModule)
    }]
  },
  { 
    path: 'exitpoll', 
    component: ExitpollComponent,
    children: [{
      path: '',
      loadChildren: ()=>import('./components/exitpoll/exitpoll.module').then((m)=>m.ExitpollModule)
    }]
  },
  { 
    path: 'requirements', 
    component: RequirementsComponent,
    children: [{
      path: '',
      loadChildren: ()=>import('./components/requirements/requirements.module').then((m)=>m.RequirementsModule)
    }]
  },
  { 
    path: 'students', 
    component: StudentsComponent,
    children: [{
      path: '',
      loadChildren: ()=>import('./components/students/students.module').then((m)=>m.StudentsModule)
    }]
  },
  { 
    path: 'templates', 
    component: TemplatesComponent,
    children: [{
      path: '',
      loadChildren: ()=>import('./components/templates/templates.module').then((m)=>m.TemplatesModule)
    }]
  },
  { 
    path: 'industrypartners', 
    component: IndustrypartnersComponent,
    children: [{
      path: '',
      loadChildren: ()=>import('./components/industrypartners/industrypartners.module').then((m)=>m.IndustrypartnersModule)
    }]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
