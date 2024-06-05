import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DashboardModule } from './components/dashboard/dashboard.module';
import { AnnouncementComponent } from './components/announcement/announcement.component';
import { ExitpollComponent } from './components/exitpoll/exitpoll.component';
import { IndustrypartnersComponent } from './components/industrypartners/industrypartners.component';
import { RequirementsComponent } from './components/requirements/requirements.component';
import { StudentsComponent } from './components/students/students.component';
import { TemplatesComponent } from './components/templates/templates.component';
import { AnnouncementModule } from './components/announcement/announcement.module';
import { IndustrypartnersModule } from './components/industrypartners/industrypartners.module';
import { StudentsModule } from './components/students/students.module';
import { TemplatesModule } from './components/templates/templates.module';
import { ExitpollModule } from './components/exitpoll/exitpoll.module';
import { RequirementsModule } from './components/requirements/requirements.module';
import { Insideview1Component } from './components/industrypartners/components/insideview1/insideview1.component';


@NgModule({
  declarations: [
    // MainComponent
    DashboardComponent,
    AnnouncementComponent,
    ExitpollComponent,
    IndustrypartnersComponent,
    RequirementsComponent,
    StudentsComponent,
    TemplatesComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    DashboardModule,
    AnnouncementModule,
    IndustrypartnersModule,
    StudentsModule,
    TemplatesModule,
    ExitpollModule,
    RequirementsModule
  ]
})
export class MainModule { }
