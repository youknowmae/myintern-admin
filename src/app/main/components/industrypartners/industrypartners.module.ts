import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IndustrypartnersRoutingModule } from './industrypartners-routing.module';
import { ListComponent } from './components/list/list.component';
import { ViewComponent } from './components/view/view.component';
import { AddnewComponent } from './components/addnew/addnew.component';


@NgModule({
  declarations: [
    // IndustrypartnersComponent
    ListComponent,
    ViewComponent,
    AddnewComponent
  ],
  imports: [
    CommonModule,
    IndustrypartnersRoutingModule
  ]
})
export class IndustrypartnersModule { }
