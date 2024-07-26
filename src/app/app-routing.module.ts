import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './main/main.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent},
  { 
    path: 'main', 
    component: MainComponent, 
    children: [{ 
      path: '', 
      loadChildren: ()=> import('./main/main.module'). then((m)=>m.MainModule)
    }]
  },
  { path: 'dashboard', loadChildren: () => import('./main/components/dashboard/dashboard.module').then(m => m.DashboardModule) },
  { path: 'industrypartners', loadChildren: () => import('./main/components/industrypartners/industrypartners.module').then(m => m.IndustrypartnersModule) },
  { path: 'requirements', loadChildren: () => import('./main/components/requirements/requirements.module').then(m => m.RequirementsModule) },
  { path: 'students', loadChildren: () => import('./main/components/students/students.module').then(m => m.StudentsModule) },
  // { path: 'templates', loadChildren: () => import('./main/components/templates/templates.module').then(m => m.TemplatesModule) },
  { path: 'announcement', loadChildren: () => import('./main/components/announcement/announcement.module').then(m => m.AnnouncementModule) },
  { path: 'exitpoll', loadChildren: () => import('./main/components/exitpoll/exitpoll.module').then(m => m.ExitpollModule) },
  { path: 'view', loadChildren: () => import('./main/components/students/components/view/view.module').then(m => m.ViewModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
