import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationComponent } from 'src/app/shared/modelPopups/confirmation/confirmation.component';

@Component({
  selector: 'app-create-rules',
  templateUrl: './create-rules.component.html',
  styleUrls: ['./create-rules.component.css']
})
export class CreateRulesComponent {
  ruleForm!: FormGroup;
  isMode: string = '';

  constructor(private fb: FormBuilder,
    private router: Router, private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.ruleForm = this.fb.group({
      ruleId: ['', [Validators.required]],
      ruleName: ['', [Validators.required]],
      docType: ['', [Validators.required]],
      severity: ['', [Validators.required]],
      priority: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.maxLength(250)]]
    });
    this.isMode = history.state.isMode;
    console.log("history.state.rule", history.state.rule);
    if (history.state.rule) {
      this.ruleForm.patchValue({
        ruleId: history.state.rule.vendor || '',
        ruleName: history.state.rule.ruleName || '',
        docType: history.state.rule.process || '',
        severity: history.state.rule.code || '',
        priority: history.state.rule.priority || '',
        description: history.state.rule.description || ''
      });
    }
    if (this.isMode === 'View') {
      this.ruleForm.disable();
    }
  }

  onSubmit(): void {
    if (this.ruleForm.invalid) {
      this.ruleForm.markAllAsTouched();
      return;
    }
    console.log('Form Data:', this.ruleForm.value);
  }

  onCancel(): void {
    if (this.ruleForm.dirty) {
      const dialogRefs = this.dialog.open(ConfirmationComponent, {
        width: '500px',
        data: {
          title: 'Confirmation',
          message: 'Are you sure you want to cancel?'
        }
      });

      dialogRefs.afterClosed().subscribe((res: any) => {
        if (res) {
          this.router.navigate(['rules/list']);
        }
      });
    }
    else {
      this.router.navigate(['rules/list']);
    }
  }
}
