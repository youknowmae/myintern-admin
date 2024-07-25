import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttendanceformComponent } from './components/attendanceform/attendanceform.component';
import { AccomplishmentreportComponent } from './components/accomplishmentreport/accomplishmentreport.component';
import { ButtonsComponent } from './components/buttons/buttons.component';

const routes: Routes = [
  { path: '', redirectTo: 'buttons', pathMatch: 'full' },
  { path: 'attendanceform', component: AttendanceformComponent },
  { path: 'accomplishmentreport', component: AccomplishmentreportComponent },
  { path: 'buttons', component: ButtonsComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewRoutingModule { }
