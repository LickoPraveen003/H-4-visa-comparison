import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RulesListComponent } from './rules-list/rules-list.component';
import { CreateRulesComponent } from './create-rules/create-rules.component';
import { ComplainCheckerComponent } from './complain-checker/complain-checker.component';

const routes: Routes = [
  {
    path: 'list', component: RulesListComponent
  },
  {
    path: 'create', component: CreateRulesComponent
  },
  {
    path: 'check', component: ComplainCheckerComponent
  },
  { path: '', pathMatch: 'full', redirectTo: 'list' },
  { path: '**', redirectTo: 'list' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RulesRoutingModule { }
