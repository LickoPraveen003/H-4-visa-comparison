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
  rules = ['Rule A', 'Rule B', 'Rule C'];

  isDocUploaded: boolean = false;
  uploadedFile: File | null = null;
  documentName: string = '';
  fileError: string = '';
  isDocEntered: boolean = false;
  ischeckCompliance: boolean = false;
  @ViewChild('fileInputDoc') fileInputDoc!: ElementRef;
compareData = [
  {
    rule_number: 'Rule 1',
    rule_name:'I-140 should be valid for the spouse',
    rule_description: 'The “H4 EAD Application” has no mention of the I-140 approval details ',
    severity:'Low'
  },
  {
    rule_number: 'Rule 2',
    rule_name:'I-140 should be valid for the spouse',
    rule_description: 'The “H4 EAD Application” has no mention of the I-140 approval details ',
    severity:'High'
  }
]

  constructor(private fb: FormBuilder, private toastr: ToastrService,
    private spinner: NgxSpinnerService, private apiService: APIService,
  ) {}

  ngOnInit(): void {
    this.uploadForm = this.fb.group({
      docType: ['', Validators.required],
      rule: ['', Validators.required]
    });
  }

    onFileSelectedDoc(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.handleFileDoc(input.files[0]);
    }
  }

  checkCompliance(){
    this.ischeckCompliance = true;
  }

  uploadDoc(file: File) {
    this.isDocEntered = true;
    // this.spinner.show();
    // const formData = new FormData();
    // formData.append('file', file, file.name);
    // formData.append('vendor', 'newtest310725');
    // formData.append('product', 'newtest310725');
    // formData.append('category', 'newtest310725');
    // formData.append('collection_name', 'newtest310725doc');
    // this.apiService.post('/redline/ai/v1/document', formData).subscribe(
    //   (res: any) => {
    //     this.spinner.hide();
    //     if (res.status === 200 || res.status === 201) {
    //       this.isDocEntered = true;
    //       this.toastr.success(res.body.status_message);
    //       this.documentName = res.body.file_name;
    //       setTimeout(() => {
    //         this.toastr.clear();
    //       }, 3000);
    //     }
    //     else {
    //       this.isDocEntered = false;
    //       this.toastr.error(res.body.status_message);
    //       setTimeout(() => {
    //         this.documentName = '';
    //         this.toastr.clear();
    //       }, 3000);
    //     }
    //   },
    //   (error: any) => {
    //     this.spinner.hide();
    //     this.isDocEntered = false;
    //     this.toastr.error(error?.statusText || 'An error occurred while processing your request. Please try again later.');
    //     setTimeout(() => {
    //       this.toastr.clear();
    //       this.documentName = '';
    //     }, 3000);
    //   }
    // );
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
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];

    if (!allowedTypes.includes(file.type)) {
      this.fileInputDoc.nativeElement.value = '';
      this.toastr.error('Only PDF, DOC, DOCX, or TXT files are allowed');
      return;
    }
    if (file.size > 200 * 1024 * 1024) {
      this.fileInputDoc.nativeElement.value = '';
      this.toastr.error('File exceeds 200MB limit');
      return;
    }
    this.isDocEntered = true;
    this.documentName = file.name;
    this.uploadDoc(file);
    console.log('Uploading file:', file);
    // TODO: Upload logic here
  }

  onCancel(): void {
    this.isDocEntered = false;
    this.ischeckCompliance = false;
    this.uploadForm.reset();
  }

  resetDoc() {
    this.isDocEntered = false;
    this.ischeckCompliance = false;
  }

  // Final submission logic
  onSubmit(): void {
    if (this.uploadForm.invalid || !this.uploadedFile) {
      this.toastr.warning('Please fill all fields and upload a valid file');
      return;
    }

    // Submission payload
    const formData = new FormData();
    formData.append('documentType', this.uploadForm.get('documentType')?.value);
    formData.append('rule', this.uploadForm.get('rule')?.value);
    formData.append('file', this.uploadedFile);

    console.log('Submitting form:', this.uploadForm.value);
    console.log('Uploaded file:', this.uploadedFile.name);

    this.toastr.success('Form submitted successfully!');

    // TODO: You can send `formData` to your backend using HttpClient
    // this.http.post('/api/upload', formData).subscribe(...)
  }
}