import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EvaluationRoutingModule } from './evaluation-routing.module';
import { EvaluationComponent } from './evaluation.component';
import { ListComponent } from './components/list/list.component';
import { MaterialsModules } from '../../../modules/materials.module';
import { EvaluationViewComponent } from './components/evaluation-view/evaluation-view.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    // EvaluationComponent,
    ListComponent,
    EvaluationViewComponent
  ],
  imports: [
    CommonModule,
    EvaluationRoutingModule,
    MaterialsModules,
    ReactiveFormsModule
  ]
})
export class EvaluationModule { }
