import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EndorsementComponent } from './endorsement.component';
import { ListComponent } from './components/list/list.component';
import { ViewComponent } from './components/view/view.component';

const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: ListComponent },
  { path: 'view', component: ViewComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EndorsementRoutingModule { }
