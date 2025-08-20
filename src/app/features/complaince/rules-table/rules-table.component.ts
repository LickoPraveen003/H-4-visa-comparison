import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { APIService } from "src/app/services/apiservice.service";

@Component({
  selector: 'app-rules-table',
  templateUrl: './rules-table.component.html',
  styleUrls: ['./rules-table.component.css']
})
export class RulesTableComponent {
  @ViewChild('fileInputDoc') fileInputDoc!: ElementRef;
  form!: FormGroup;
  isDocUploaded: boolean = false;
  documentName: any;
  isShowPastDoc: boolean = false;
  pastDocs: any = [];
rules: any = [];
documents: any = [];
compareData = [
  {
    rule_number: '1',
    rule_name:'I-140 should be valid for the spouse',
    rule_description: 'The “H4 EAD Application” has no mention of the I-140 approval details ',
    severity:'Low'
  },
  {
    rule_number: '1',
    rule_name:'I-140 should be valid for the spouse',
    rule_description: 'The “H4 EAD Application” has no mention of the I-140 approval details ',
    severity:'High'
  }
]
  ischeckCompliance: boolean = false;
isRulesEntered: boolean = true;
  constructor(private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private apiService: APIService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      documentType: ['', Validators.required],
      rule: ['', Validators.required],
    });
  }

    onFileSelectedDoc(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.handleFileDoc(input.files[0]);
    }
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
    this.isDocUploaded = true;
    this.documentName = file.name;
    console.log('Uploading file:', file);
    // this.uploadDoc(file);
    // TODO: Upload logic here
  }

  uploadDoc(file: File) {
    if (this.form.get('rules')?.value === '') {
      return;
    }
    this.spinner.show();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('rule', this.form.get('rules')?.value || '');
    this.apiService.post('/rule/solix/document/rule', formData).subscribe(
      (res: any) => {
        this.spinner.hide();
        if (res.status === 200 || res.status === 201) {
          this.isDocUploaded = true;
          this.toastr.success("Document Uploaded Successfully.");
          setTimeout(() => {
            this.toastr.clear();
          }, 3000);
        }
        else {
          this.isDocUploaded = false;
          this.toastr.error(res.statusText);
          setTimeout(() => {
            this.documentName = '';
            this.toastr.clear();
          }, 3000);
        }
      },
      (error: any) => {
        this.spinner.hide();
        this.isDocUploaded = false;
        this.toastr.error(error?.statusText || 'An error occurred while processing your request. Please try again later.');
        setTimeout(() => {
          this.toastr.clear();
          this.documentName = '';
        }, 3000);
      }
    );
  }

  showPastDocs() {
    this.spinner.show();
    this.apiService.get('/redline/ai/v1/document?product=test08082025test&vendor=test08082025test&category=test08082025test&collection_name=test08082025testdoc').subscribe(
      (res: any) => {
        this.spinner.hide();
        if (res.body.status_code === 200 || res.body.status_code === 201) {
          // this.toastr.success(res.body.status_message);
          this.isShowPastDoc = true;
          this.pastDocs = res.body.documents;
        }
        else {
          this.isShowPastDoc = false;
          this.toastr.error(res.body.status_message);
          setTimeout(() => {
            this.toastr.clear();
          }, 3000);
        }
      },
      (error: any) => {
        this.isShowPastDoc = false;
        this.spinner.hide()
        this.toastr.error(error?.statusText || 'An error occurred while processing your request. Please try again later.');
        setTimeout(() => {
          this.toastr.clear();
        }, 3000);
      }
    );
  }

  resetAll() {
    this.isRulesEntered = false;
    this.isDocUploaded = false;
    this.ischeckCompliance = false;
  }

  checkCompliance(){
    this.ischeckCompliance = true;
  }

  closePastDocs() {
    this.isShowPastDoc = false;
  }

  resetDoc() {
    this.isDocUploaded = false;
    this.documentName = '';
    this.fileInputDoc.nativeElement.value = '';
  }

  editRules() {
      // const dialogRef = this.dialog.open(AddRulesTableComponent, {
      //   width: '80%',
      //   height: 'auto',
      //   maxHeight: '95vh',
      //   data: { value: [], type: 'Edit' }
      // });
      // dialogRef.afterClosed().subscribe((result:any) => {
      //   if (result.success) {
      //   }
      // });
    }
}
