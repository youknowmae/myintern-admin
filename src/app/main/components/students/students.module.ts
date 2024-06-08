import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentsRoutingModule } from './students-routing.module';
import { ListComponent } from './components/list/list.component';
import { ViewComponent } from './components/view/view.component';


@NgModule({
  declarations: [  
    ListComponent, 
    ViewComponent
  ],
  imports: [
    CommonModule,
    StudentsRoutingModule
  ]
})
export class StudentsModule { }
