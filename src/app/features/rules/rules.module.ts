import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RulesRoutingModule } from './rules-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { RulesListComponent } from './rules-list/rules-list.component';
import { CreateRulesComponent } from './create-rules/create-rules.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { ComplainCheckerComponent } from './complain-checker/complain-checker.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    RulesListComponent,
    CreateRulesComponent,
    ComplainCheckerComponent
  ],
  imports: [
    CommonModule,
    RulesRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MatDialogModule,
    MatSelectModule,
    MatFormFieldModule,
    MatOptionModule,
    NgSelectModule,
  ]
})
export class RulesModule { }
