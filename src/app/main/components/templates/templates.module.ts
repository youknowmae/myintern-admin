import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialsModules } from '../../../modules/materials.module';
import { AddTemplateComponent } from './components/add-template/add-template.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ 
    AddTemplateComponent
  ],
  imports: [
    CommonModule,
    MaterialsModules,
    ReactiveFormsModule
  ]
})
export class TemplatesModule { }
