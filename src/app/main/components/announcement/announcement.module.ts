import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnnouncementRoutingModule } from './announcement-routing.module';
import { AnnouncementComponent } from './announcement.component';
import { ListComponent } from './components/list/list.component';
import { ViewComponent } from './components/view/view.component';


@NgModule({
  declarations: [
    // AnnouncementComponent
  
    ListComponent,
    ViewComponent
  ],
  imports: [
    CommonModule,
    AnnouncementRoutingModule
  ]
})
export class AnnouncementModule { }
