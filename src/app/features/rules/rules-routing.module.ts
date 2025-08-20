import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RulesListComponent } from './rules-list/rules-list.component';
import { CreateRulesComponent } from './create-rules/create-rules.component';

const routes: Routes = [
  {
    path: 'list', component: RulesListComponent
  },
  {
    path: 'create', component: CreateRulesComponent
  },
  { path: '', pathMatch: 'full', redirectTo: 'check' },
  { path: '**', redirectTo: 'check' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RulesRoutingModule { }
