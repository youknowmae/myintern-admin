import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExitpollRoutingModule } from './exitpoll-routing.module';
import { ExitpollComponent } from './exitpoll.component';
import { ListComponent } from './components/list/list.component';
import { ViewComponent } from './components/view/view.component';


@NgModule({
  declarations: [
    // ExitpollComponent
  
    ListComponent,
    ViewComponent
  ],
  imports: [
    CommonModule,
    ExitpollRoutingModule
  ]
})
export class ExitpollModule { }
