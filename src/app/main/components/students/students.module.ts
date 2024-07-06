import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentsRoutingModule } from './students-routing.module';
import { ListComponent } from './components/list/list.component';
import { ViewComponent } from './components/view/view.component';
import { MatLabel } from '@angular/material/form-field';
import { MaterialsModules } from '../../../modules/materials.module';


@NgModule({
  declarations: [  
    ListComponent, 
    ViewComponent
  ],
  imports: [
    CommonModule,
    StudentsRoutingModule,
    MaterialsModules
  ]
})
export class StudentsModule { }
