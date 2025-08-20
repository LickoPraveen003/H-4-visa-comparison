import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rules-list',
  templateUrl: './rules-list.component.html',
  styleUrls: ['./rules-list.component.css']
})
export class RulesListComponent implements OnInit {
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  rules = [
    {
      ruleId: 'Rule_001',
      ruleName: 'I-140 should be valid for the spouse, H-4 should be valid',
      docType: 'H4_VISA',
      severity: 'H',
      priority: 'High'
    },
     {
      ruleId: 'Rule_002',
      ruleName: 'I-140 should be valid for the spouse, H-4 should be valid',
      docType: 'H4_VISA',
      severity: 'H',
      priority: 'High'
    }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void { }

  sortData(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.rules.sort((a, b) => {
      const key = column as keyof typeof a; // type-safe access
      const valA = a[key]?.toString().toLowerCase() ?? '';
      const valB = b[key]?.toString().toLowerCase() ?? '';
      if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  editRule(rule: any,name:string){
      this.router.navigate(['rules/create'], { state: { rule, isMode: name} });
  }
}
