import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndustrypartnersComponent } from './industrypartners.component';
import { Insideview1Component } from './components/insideview1/insideview1.component';
import { Addnew1Component } from './components/addnew1/addnew1.component';

const routes: Routes = [
  { path: '', redirectTo: 'industrypartners', pathMatch: 'full' },
  { path: 'insideview1', component: Insideview1Component },
  { path: 'addnew1', component: Addnew1Component }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndustrypartnersRoutingModule { }