import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { APIService } from 'src/app/services/apiservice.service';

@Component({
  selector: 'app-complain-checker',
  templateUrl: './complain-checker.component.html',
  styleUrls: ['./complain-checker.component.css']
})
export class ComplainCheckerComponent {

  uploadForm!: FormGroup;

  documentTypes = ['Passport', 'Visa', 'I-94'];
  ruleOptions: string[] = ['rule1', 'rule2', 'rule3'];
  uploadedFile: File | null = null;
  fileError: string = '';
  isDocEntered: boolean = false;
  ischeckCompliance: boolean = false;
  @ViewChild('fileInputDoc') fileInputDoc!: ElementRef;
  compareData:any = []

rulesList = [
    { id: 1, name: 'Rule A', rule_number: 'r001', rule_name: 'Rule A', gender: 'Male' },
    { id: 2, name: 'Rule B', rule_number: 'r002', rule_name: 'Rule B', gender: 'Female' },
    { id: 3, name: 'Rule C', rule_number: 'r003', rule_name: 'Rule C', gender: 'Male' },
  ]
  compareDocId: any = '';

  constructor(private fb: FormBuilder, private toastr: ToastrService,
    private spinner: NgxSpinnerService, private apiService: APIService,
  ) {}

  ngOnInit(): void {
    this.uploadForm = this.fb.group({
      docType: ['', Validators.required],
      docName: ['', Validators.required],
      // selectedRules: [[], Validators.required]
    });
    const defaultSelectedIds = this.rulesList.map((rule:any) => rule.id);
    this.uploadForm.get('selectedRules')?.setValue(defaultSelectedIds);
  }

    onFileSelectedDoc(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.handleFileDoc(input.files[0]);
    }
  }

  uploadDoc(file: File) {
    if (this.uploadForm.invalid){
      this.uploadForm.markAllAsTouched();
      this.isDocEntered = false;
      this.uploadForm.get('docName')?.reset();
      return;
    }
    this.spinner.show();
    const formData = new FormData();
    formData.append('file', file || '');
    formData.append('name_of_document', file.name || '');
    formData.append('document_type', this.uploadForm.get('docType')?.value || '');
    this.apiService.post('/document/create/document', formData).subscribe(
      (res: any) => {
        this.spinner.hide();
        if (res.body.status_code === 200 || res.body.status_code === 201) {
          this.isDocEntered = true;
          this.compareDocId = res.body.data.document_id;
          this.toastr.success(res.body.message);
          setTimeout(() => {
            this.toastr.clear();
          }, 3000);
        }
        else {
          this.isDocEntered = false;
          this.toastr.error(res.body.message);
          setTimeout(() => {
            this.toastr.clear();
          }, 3000);
        }
      },
      (error: any) => {
        this.spinner.hide();
        this.isDocEntered = false;
        this.toastr.error(error?.statusText || 'An error occurred while processing your request. Please try again later.');
        setTimeout(() => {
          this.toastr.clear();
        }, 3000);
      }
    );
  }


  checkCompliance(){
    if (this.uploadForm.invalid){
      this.uploadForm.markAllAsTouched();
      return;
    }
    this.spinner.show();
    // this.compareDocId = 'doc_de2df7e4'
    this.apiService.post(`/validate/validate?document_id=${this.compareDocId || ''}`,{}).subscribe(
      (res: any) => {
        this.spinner.hide();
        if (res.body.status_code === 200 || res.body.status_code === 201) {
          this.ischeckCompliance = true;
          this.compareData = res.body.data;
          this.toastr.success(res.body.message);
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

  onDragOverDoc(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    (event.currentTarget as HTMLElement).classList.add('drag-over');
  }

  onDragLeaveDoc(event: DragEvent): void {
    event.preventDefault();
    (event.currentTarget as HTMLElement).classList.remove('drag-over');
  }

  onDropDoc(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files?.[0];
    if (file) this.handleFileDoc(file);
    (event.currentTarget as HTMLElement).classList.remove('drag-over');
  }

  handleFileDoc(file: File): void {
    // const allowedTypes = [
    //   'application/pdf',
    //   'application/msword',
    //   'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    //   'text/plain'
    // ];

    const allowedTypes = ['application/pdf'];

    if (!allowedTypes.includes(file.type)) {
      this.fileInputDoc.nativeElement.value = '';
      // this.toastr.error('Only PDF, DOC, DOCX, or TXT files are allowed');
      this.toastr.error('Only PDF files are allowed');
      return;
    }
    if (file.size > 200 * 1024 * 1024) {
      this.fileInputDoc.nativeElement.value = '';
      this.toastr.error('File exceeds 200MB limit');
      return;
    }
    this.isDocEntered = true;
    this.uploadForm.get('docName')?.setValue(file.name);
    this.uploadDoc(file);
    console.log('Uploading file:', file);
    // TODO: Upload logic here
  }

  onCancel(): void {
    this.isDocEntered = false;
    this.ischeckCompliance = false;
    this.uploadForm.reset();
    this.uploadForm.get('docType')?.setValue('');
    const defaultSelectedIds = this.rulesList.map((rule:any) => rule.id);
    this.uploadForm.get('selectedRules')?.setValue(defaultSelectedIds);
  }

  resetDoc() {
    this.isDocEntered = false;
    this.ischeckCompliance = false;
    this.uploadForm.get('docName')?.reset();
  }
}