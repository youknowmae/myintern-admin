import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AnnouncementComponent } from './components/announcement/announcement.component';
import { ExitpollComponent } from './components/exitpoll/exitpoll.component';
import { IndustrypartnersComponent } from './components/industrypartners/industrypartners.component';
import { RequirementsComponent } from './components/requirements/requirements.component';
import { StudentsComponent } from './components/students/students.component';
import { TemplatesComponent } from './components/templates/templates.component';
import { AnnouncementModule } from './components/announcement/announcement.module';
import { IndustrypartnersModule } from './components/industrypartners/industrypartners.module';
import { StudentsModule } from './components/students/students.module';
import { ExitpollModule } from './components/exitpoll/exitpoll.module';
import { RequirementsModule } from './components/requirements/requirements.module';
import { MaterialsModules } from '../modules/materials.module';
import { EvaluationComponent } from './components/evaluation/evaluation.component';
import { EvaluationModule } from './components/evaluation/evaluation.module';
import { EndorsementComponent } from './components/endorsement/endorsement.component';
import { EndorsementModule } from './components/endorsement/endorsement.module';
import { SharedModule } from '../modules/shared.module';
import { LoadingSpinnerComponent } from "../components/loading-spinner/loading-spinner.component";

@NgModule({
  declarations: [
    // MainComponent
    DashboardComponent,
    AnnouncementComponent,
    ExitpollComponent,
    IndustrypartnersComponent,
    RequirementsComponent,
    StudentsComponent,
    TemplatesComponent,
    EndorsementComponent,
    EvaluationComponent,
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    AnnouncementModule,
    IndustrypartnersModule,
    StudentsModule,
    EndorsementModule,
    ExitpollModule,
    RequirementsModule,
    MaterialsModules,
    EvaluationModule,
    SharedModule,
    LoadingSpinnerComponent
],
})
export class MainModule {}
