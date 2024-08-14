import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExitpollRoutingModule } from './exitpoll-routing.module';
import { ExitpollComponent } from './exitpoll.component';
import { ListComponent } from './components/list/list.component';
import { ViewComponent } from './components/view/view.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    // ExitpollComponent
  
    ListComponent,
    ViewComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ExitpollRoutingModule
  ]
})
export class ExitpollModule { }
