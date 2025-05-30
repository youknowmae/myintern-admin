import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttendanceformComponent } from './components/attendanceform/attendanceform.component';
import { AccomplishmentreportComponent } from './components/accomplishmentreport/accomplishmentreport.component';
import { StudentprofileComponent } from './components/studentprofile/studentprofile.component';
import { EvaluationComponent } from './components/evaluation/evaluation.component';
import { ExitPollComponent } from './components/exit-poll/exit-poll.component';

const routes: Routes = [
  { path: '', redirectTo: 'studentprofile', pathMatch: 'full' },
  { path: 'attendanceform', component: AttendanceformComponent },
  { path: 'accomplishmentreport', component: AccomplishmentreportComponent },
  { path: 'studentprofile', component: StudentprofileComponent },
  { path: 'evaluation', component: EvaluationComponent },
  { path: 'exit-poll', component: ExitPollComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewRoutingModule { }
