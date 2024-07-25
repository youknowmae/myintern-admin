import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IndustrypartnersRoutingModule } from './industrypartners-routing.module';
import { ListComponent } from './components/list/list.component';
import { ViewComponent } from './components/view/view.component';
import { AddnewComponent } from './components/addnew/addnew.component';
import { AddIndustryPartnerComponent } from './components/add-industry-partner/add-industry-partner.component';
import { MaterialsModules } from '../../../modules/materials.module';
import { ReactiveFormsModule } from '@angular/forms';
import { EditIndustryPartnerComponent } from './components/edit-industry-partner/edit-industry-partner.component';


@NgModule({
  declarations: [
    // IndustrypartnersComponent
    ListComponent,
    ViewComponent,
    AddnewComponent,
    AddIndustryPartnerComponent,
    EditIndustryPartnerComponent
  ],
  imports: [
    CommonModule,
    IndustrypartnersRoutingModule,
    MaterialsModules,
    ReactiveFormsModule
  ]
})
export class IndustrypartnersModule { }
