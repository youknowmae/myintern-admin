import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndustrypartnersComponent } from './industrypartners.component';

const routes: Routes = [
  // { path: '', component: IndustrypartnersComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndustrypartnersRoutingModule { }
