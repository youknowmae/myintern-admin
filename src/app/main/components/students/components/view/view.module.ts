import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewRoutingModule } from './view-routing.module';
import { StudentprofileComponent } from './components/studentprofile/studentprofile.component';
import { AttendanceformComponent } from './components/attendanceform/attendanceform.component';
import { AccomplishmentreportComponent } from './components/accomplishmentreport/accomplishmentreport.component';
import { MaterialsModules } from '../../../../../modules/materials.module';
import { ExitPollComponent } from './components/exit-poll/exit-poll.component';
import { EvaluationComponent } from './components/evaluation/evaluation.component';
import { LoadingSpinnerComponent } from '../../../../../components/loading-spinner/loading-spinner.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    StudentprofileComponent,
    AttendanceformComponent,
    AccomplishmentreportComponent,
    ExitPollComponent,
    EvaluationComponent

  ],
  imports: [
    CommonModule,
    MaterialsModules,
    ViewRoutingModule,
    LoadingSpinnerComponent,
    ReactiveFormsModule
  ]
})
export class ViewModule { }
