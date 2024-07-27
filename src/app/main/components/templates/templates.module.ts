import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialsModules } from '../../../modules/materials.module';
import { AddTemplateComponent } from './components/add-template/add-template.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EditTemplateComponent } from './components/edit-template/edit-template.component';
import { PreviewTemplateComponent } from './components/preview-template/preview-template.component';

@NgModule({
  declarations: [ 
    AddTemplateComponent, 
    EditTemplateComponent, PreviewTemplateComponent
  ],
  imports: [
    CommonModule,
    MaterialsModules,
    ReactiveFormsModule
  ]
})
export class TemplatesModule { }
