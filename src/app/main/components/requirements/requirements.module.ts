import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RequirementsRoutingModule } from './requirements-routing.module';
import { ViewComponent } from './components/view/view.component';
import { ListComponent } from './components/list/list.component';
import { MaterialsModules } from '../../../modules/materials.module';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';


@NgModule({
  declarations: [
    // RequirementsComponent
  
    ViewComponent,
    ListComponent
  ],
  imports: [
    CommonModule,
    RequirementsRoutingModule,
    MaterialsModules,
    LoadingSpinnerComponent
  ]
})
export class RequirementsModule { }
