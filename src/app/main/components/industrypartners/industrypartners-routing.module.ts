import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndustrypartnersComponent } from './industrypartners.component';
import { Insideview1Component } from './components/insideview1/insideview1.component';

const routes: Routes = [
  // { path: '', component: IndustrypartnersComponent }
  { path: 'insideview1', component: Insideview1Component }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndustrypartnersRoutingModule { }
