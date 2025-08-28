import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { APIService } from 'src/app/services/apiservice.service';
import { ConfirmationComponent } from 'src/app/shared/modelPopups/confirmation/confirmation.component';

@Component({
  selector: 'app-rules-list',
  templateUrl: './rules-list.component.html',
  styleUrls: ['./rules-list.component.css']
})
export class RulesListComponent implements OnInit {
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  ruleList: any = [];


  constructor(private router: Router, private toastr: ToastrService,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService, private apiService: APIService) { }

  ngOnInit(): void {
    this.getRuleList();
  }

  getRuleList() {
    this.spinner.show();
    this.apiService.get('/rule/list').subscribe(
      (res: any) => {
        this.spinner.hide();
        if (res.body.status_code === 200 || res.body.status_code === 201) {
          // this.toastr.success(res.body.message);
          this.ruleList = res.body.data.rules
            .sort((a: any, b: any) => b.rule_id - a.rule_id);
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

  sortData(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.ruleList.sort((a: any, b: any) => {
      const key = column as keyof typeof a; // type-safe access
      const valA = a[key]?.toString().toLowerCase() ?? '';
      const valB = b[key]?.toString().toLowerCase() ?? '';
      if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  editRule(rule: any, name: string) {
    this.router.navigate(['rules/create'], { state: { rule, isMode: name } });
  }

  deleteRule(rule: any) {
    const dialogRefs = this.dialog.open(ConfirmationComponent, {
      width: '500px',
      data: {
        title: 'Confirmation',
        message: 'Are you sure you want to delete?'
      }
    });

    dialogRefs.afterClosed().subscribe((res: any) => {
      if (res) {
        this.spinner.show();
        this.apiService.delete(`/rule/${rule.rule_id}`).subscribe(
          (res: any) => {
            this.spinner.hide();
            if (res.body.status_code === 200 || res.body.status_code === 201) {
              this.getRuleList();
              this.toastr.success(res.body.message);
              setTimeout(() => {
                this.toastr.clear();
              }, 3000);
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
    });
  }
}
