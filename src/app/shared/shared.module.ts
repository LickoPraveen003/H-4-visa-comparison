import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputConditionsDirective } from './directives/input-conditions.directive';
import { ConfirmationComponent } from './modelPopups/confirmation/confirmation.component';
import { RouterModule } from '@angular/router';
@NgModule({
  declarations: [
    HeaderComponent,
    InputConditionsDirective,
    ConfirmationComponent,
  ],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    MatDialogModule,
    MatInputModule,
    MatTableModule,
    MatButtonModule,
    RouterModule
  ],
  exports:[
    HeaderComponent,
    InputConditionsDirective
  ]
})
export class SharedModule { }
