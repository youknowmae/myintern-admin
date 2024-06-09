import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnnouncementComponent } from './announcement.component';
import { ViewComponent } from './components/view/view.component';


@NgModule({
  declarations: [
    ViewComponent
  ],
  imports: [
    CommonModule,
  ]
})
export class AnnouncementModule { }
