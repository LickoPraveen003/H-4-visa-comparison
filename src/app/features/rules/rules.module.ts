import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RulesRoutingModule } from './rules-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { RulesListComponent } from './rules-list/rules-list.component';
import { CreateRulesComponent } from './create-rules/create-rules.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { ComplainCheckerComponent } from './complain-checker/complain-checker.component';
import { RulesTableComponent } from '../complaince/rules-table/rules-table.component';

@NgModule({
  declarations: [
    RulesListComponent,
    CreateRulesComponent,
    RulesTableComponent,
    ComplainCheckerComponent
  ],
  imports: [
    CommonModule,
    RulesRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MatDialogModule
  ]
})
export class RulesModule { }
