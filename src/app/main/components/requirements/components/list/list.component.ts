import { Component, ViewChild, ChangeDetectorRef  } from '@angular/core';


import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { DataService } from '../../../../../services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  displayedColumns: string[] = ['name', 'student_number', 'category', 'year', 'program', 'company', 'status', 'actions'];

  dataSource: any = new MatTableDataSource<any>();
  
  @ViewChild(MatPaginator, {static:true}) paginator!: MatPaginator;
  
  constructor(
    private paginatorIntl: MatPaginatorIntl, 
    private changeDetectorRef: ChangeDetectorRef,
    private ds: DataService,
    private router: Router
  ) {
    this.paginator = new MatPaginator(this.paginatorIntl, this.changeDetectorRef);
  }

  ngOnInit() {
    this.getTemplates() 
  }

  getTemplates() {
    this.ds.get('applications').subscribe(
      templates => {
        console.log(templates)
        this.dataSource.data = templates;
        this.dataSource.paginator = this.paginator;
        console.log(this.dataSource)
      },
      error => {
        console.error(error)
      }
    )
  }

  viewApplication(id: number) {
    this.router.navigate(['main/requirements/view/' + id])
  }
}
