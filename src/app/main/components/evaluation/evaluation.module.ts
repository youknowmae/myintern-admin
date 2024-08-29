import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EvaluationRoutingModule } from './evaluation-routing.module';
import { EvaluationComponent } from './evaluation.component';
import { ListComponent } from './components/list/list.component';
import { MaterialsModules } from '../../../modules/materials.module';



@NgModule({
  declarations: [
    // EvaluationComponent,
    ListComponent
  ],
  imports: [
    CommonModule,
    EvaluationRoutingModule,
    MaterialsModules
  ]
})
export class EvaluationModule { }
