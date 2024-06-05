import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IndustrypartnersRoutingModule } from './industrypartners-routing.module';
import { IndustrypartnersComponent } from './industrypartners.component';
import { Insideview1Component } from './components/insideview1/insideview1.component';


@NgModule({
  declarations: [
    // IndustrypartnersComponent
  
    Insideview1Component
  ],
  imports: [
    CommonModule,
    IndustrypartnersRoutingModule
  ]
})
export class IndustrypartnersModule { }
