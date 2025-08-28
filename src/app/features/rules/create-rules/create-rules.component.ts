import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { APIService } from 'src/app/services/apiservice.service';
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
    private router: Router, private dialog: MatDialog, private toastr: ToastrService,
    private spinner: NgxSpinnerService, private apiService: APIService,
  ) { }

  ngOnInit(): void {
    this.ruleForm = this.fb.group({
      ruleId: ['', [Validators.required]],
      ruleName: ['', [Validators.required]],
      docType: ['', [Validators.required]],
      severity: ['', [Validators.required]],
      priority: ['', [Validators.required]],
      prompt: ['', [Validators.required, Validators.maxLength(250)]],
      description: ['', [Validators.required, Validators.maxLength(100)]]
    });
    this.ruleForm.enable();
    this.isMode = history.state.isMode;
    console.log("history.state.rule", history.state.rule);
    if (history.state.rule) {
      this.ruleForm.get('ruleId')?.disable();
      this.ruleForm.patchValue({
        ruleId: history.state.rule.rule_id || '',
        ruleName: history.state.rule.rule_name || '',
        docType: history.state.rule.document_type || '',
        severity: history.state.rule.severity || '',
        priority: history.state.rule.priority || '',
        description: history.state.rule.rule_description || '',
        prompt: history.state.rule.rule_prompt || ''
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


  createRule() {
    this.spinner.show();
    let reqObj = {
      rule_id: this.ruleForm.get('ruleId')?.value || "",
      rule_name: this.ruleForm.get('ruleName')?.value || "",
      rule_description: this.ruleForm.get('description')?.value || "",
      rule_prompt: this.ruleForm.get('prompt')?.value || "",
      document_type: this.ruleForm.get('docType')?.value || "",
      priority: this.ruleForm.get('priority')?.value || "",
      severity: this.ruleForm.get('severity')?.value || ""
    }
    if (this.isMode === 'New') {
      this.apiService.post('/rule/create', reqObj).subscribe(
        (res: any) => {
          this.spinner.hide();
          if (res.body.status_code === 200 || res.body.status_code === 201) {
            this.toastr.success(res.body.message);
            this.router.navigate(['rules/list']);
          }
          else {
            this.toastr.error(res.body.message);
            setTimeout(() => {
              this.toastr.clear();
            }, 3000);
          }
        },
        (error: any) => {
          this.spinner.hide()
          this.toastr.error(error?.statusText || 'An error occurred while processing your request. Please try again later.');
          setTimeout(() => {
            this.toastr.clear();
          }, 3000);
        }
      );
    }
    if (this.isMode === 'Edit') {
      this.apiService.put('/rule/update', reqObj).subscribe(
        (res: any) => {
          this.spinner.hide();
          if (res.body.status_code === 200 || res.body.status_code === 201) {
            this.toastr.success(res.body.message);
            this.router.navigate(['rules/list']);
          }
          else {
            this.toastr.error(res.body.message);
            setTimeout(() => {
              this.toastr.clear();
            }, 3000);
          }
        },
        (error: any) => {
          this.spinner.hide()
          this.toastr.error(error?.statusText || 'An error occurred while processing your request. Please try again later.');
          setTimeout(() => {
            this.toastr.clear();
          }, 3000);
        }
      );
    }

  }

}
