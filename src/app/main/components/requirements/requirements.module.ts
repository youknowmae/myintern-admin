import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RequirementsRoutingModule } from './requirements-routing.module';
import { RequirementsComponent } from './requirements.component';


@NgModule({
  declarations: [
    // RequirementsComponent
  ],
  imports: [
    CommonModule,
    RequirementsRoutingModule
  ]
})
export class RequirementsModule { }
