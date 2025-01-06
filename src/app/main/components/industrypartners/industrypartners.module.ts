import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IndustrypartnersRoutingModule } from './industrypartners-routing.module';
import { ListComponent } from './components/list/list.component';
import { ViewComponent } from './components/view/view.component';
import { ReactiveFormsModule } from '@angular/forms';

import { MaterialsModules } from '../../../modules/materials.module';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner.component';


@NgModule({
  declarations: [
    ListComponent,
    ViewComponent,
  ],
  imports: [
    CommonModule,
    IndustrypartnersRoutingModule,
    MaterialsModules,
    ReactiveFormsModule,
    LoadingSpinnerComponent
  ]
})
export class IndustrypartnersModule { }
