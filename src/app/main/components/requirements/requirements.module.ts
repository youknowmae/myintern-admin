import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RequirementsRoutingModule } from './requirements-routing.module';
import { ViewComponent } from './components/view/view.component';
import { ListComponent } from './components/list/list.component';


@NgModule({
  declarations: [
    // RequirementsComponent
  
    ViewComponent,
    ListComponent
  ],
  imports: [
    CommonModule,
    RequirementsRoutingModule
  ]
})
export class RequirementsModule { }
