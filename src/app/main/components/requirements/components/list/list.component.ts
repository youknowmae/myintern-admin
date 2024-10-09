import { Component, ViewChild, ChangeDetectorRef  } from '@angular/core';


import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { DataService } from '../../../../../services/data.service';
import { Router } from '@angular/router';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  displayedColumns: string[] = ['name', 'student_number', 'category', 'year', 'program', 'company', 'status', 'actions'];
  selectedFilter: string = '0'

  
  currentFilter: string = 'all'
  unfilteredStudents: any
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
    this.getStudents() 
  }

  getStudents() {
    this.ds.get('adviser/applications').subscribe(
      students => {
        console.log(students)
        this.unfilteredStudents = students.map((element: any) => {
          if(element.status == 0) {
            element.status_text = 'Pending'
          }
          else if(element.status == 1) {
            element.status_text = 'Cancelled'
          }
          else if(element.status == 2) {
            element.status_text = 'Rejected'
          }
          else if(element.status == 3) {
            element.status_text = 'Approved'
          }
          else if(element.status == 4) {
            element.status_text = 'Accepted'
          }

          return element
          
        });

        this.dataSource.data = this.unfilteredStudents;
        this.dataSource.paginator = this.paginator;

        this.filterStudent()
      },
      error => {
        console.error(error)
      }
    )
  }

  viewApplication(id: number) {
    this.router.navigate(['main/requirements/view/' + id])
  }
  
  applyFilter(value: string) {
    this.currentFilter = value
    this.filterStudent()
    // if(value == "all") {
    //   this.dataSource.data = this.unfilteredStudents
    //   return
    // }

    // this.dataSource.data = this.unfilteredStudents.filter((student: any) => {
    //   return student.user.student_profile.program.includes(value)
    // })
  }

  onFilterChange(event: MatSelectChange) {
    console.log(event.value)
    this.selectedFilter = event.value
    this.filterStudent()
  }

  filterStudent() {
    let student 

    if(this.currentFilter == "all") {
      student = this.unfilteredStudents
    }
    else {
      student = this.unfilteredStudents.filter((student: any) => {
        return student.user.student_profile.program.includes(this.currentFilter)
      })
    }


    student = student.filter((student: any) => {
      return student.status.includes(this.selectedFilter)
    })

    this.dataSource.data = student
  }

}
