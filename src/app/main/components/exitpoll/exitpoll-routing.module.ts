import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExitpollComponent } from './exitpoll.component';

const routes: Routes = [
  // { path: '', component: ExitpollComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExitpollRoutingModule { }
