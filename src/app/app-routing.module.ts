import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { 
    path: 'rules',
    loadChildren: () => import('./features/rules/rules.module').then(m => m.RulesModule) 
  },
  { path: '', redirectTo: 'rules', pathMatch: 'full' },
  { path: '**', redirectTo: 'rules' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
