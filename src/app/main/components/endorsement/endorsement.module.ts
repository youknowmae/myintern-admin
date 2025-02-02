import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EndorsementRoutingModule } from './endorsement-routing.module';
import { EndorsementComponent } from './endorsement.component';
import { ViewComponent } from './components/view/view.component';
import { ListComponent } from './components/list/list.component';
import { MaterialsModules } from '../../../modules/materials.module';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';


@NgModule({
  declarations: [
    // EndorsementComponent,
    ViewComponent,
    ListComponent
  ],
  imports: [
    CommonModule,
    EndorsementRoutingModule,
    MaterialsModules,
    LoadingSpinnerComponent
  ]
})
export class EndorsementModule { }
