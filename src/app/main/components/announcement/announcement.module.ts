import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddAnnouncementComponent } from './components/add-announcement/add-announcement.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialsModules } from '../../../modules/materials.module';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';
import { EditAnnouncementComponent } from './components/edit-announcement/edit-announcement.component';


@NgModule({
  declarations: [
    AddAnnouncementComponent,
    EditAnnouncementComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialsModules,
    LoadingSpinnerComponent
  ]
})

export class AnnouncementModule { }
