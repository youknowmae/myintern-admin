import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnnouncementComponent } from './announcement.component';
import { ViewComponent } from './components/view/view.component';
import { AddnewComponent } from './components/addnew/addnew.component';


@NgModule({
  declarations: [
    ViewComponent,
    AddnewComponent
  ],
  imports: [
    CommonModule,
  ]
})
export class AnnouncementModule { }
