import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IndustrypartnersRoutingModule } from './industrypartners-routing.module';
import { IndustrypartnersComponent } from './industrypartners.component';
import { Insideview1Component } from './components/insideview1/insideview1.component';
import { Addnew1Component } from './components/addnew1/addnew1.component';


@NgModule({
  declarations: [
    // IndustrypartnersComponent
  
    Insideview1Component,
    Addnew1Component
  ],
  imports: [
    CommonModule,
    IndustrypartnersRoutingModule
  ]
})
export class IndustrypartnersModule { }
