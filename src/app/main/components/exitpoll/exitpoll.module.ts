import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExitpollRoutingModule } from './exitpoll-routing.module';
import { ExitpollComponent } from './exitpoll.component';


@NgModule({
  declarations: [
    // ExitpollComponent
  ],
  imports: [
    CommonModule,
    ExitpollRoutingModule
  ]
})
export class ExitpollModule { }
