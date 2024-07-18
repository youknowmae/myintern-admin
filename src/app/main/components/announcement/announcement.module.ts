import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewComponent } from './components/view/view.component';
import { AddAnnouncementComponent } from './components/add-announcement/add-announcement.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialsModules } from '../../../modules/materials.module';


@NgModule({
  declarations: [
    ViewComponent,
    AddAnnouncementComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialsModules
  ]
})

export class AnnouncementModule { }
