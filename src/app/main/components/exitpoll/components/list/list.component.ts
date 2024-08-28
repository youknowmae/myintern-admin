import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';

import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { DataService } from '../../../../../services/data.service';
import { UserService } from '../../../../../services/user.service';

import { Router } from '@angular/router';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  displayedColumns: string[] = ['name', 'student_number', 'course', 'year_level', 'status', 'actions'];

  currentFilter: string = 'all'
  unfilteredStudents: any
  dataSource: any = new MatTableDataSource<any>();
  
  @ViewChild(MatPaginator, {static:true}) paginator!: MatPaginator;

  constructor(
    private paginatorIntl: MatPaginatorIntl, 
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private ds: DataService,
    private us: UserService
  ) {
    this.paginator = new MatPaginator(this.paginatorIntl, this.changeDetectorRef);
  }

  ngOnInit() {
    this.getStudents()
  }

  view(id: number){
    this.ds.get('exit-poll/', id).subscribe(
      exitPollDetails=> {  
        this.us.setStudentExitPoll(exitPollDetails)
        this.router.navigate(['/main/exitpoll/view/' + id])
      },
      error => {
        console.error(error)
      }
    )
  }
  
  getStudents() {
    this.ds.get('exit-poll/students').subscribe(
      students => {
        let studentsList = students.map((student: any) => {
          let course = student.student_courses[0].course_code

          return {
            course,
            full_name: student.first_name + " " + student.last_name,
            ...student
          }
        })

        this.unfilteredStudents = studentsList
        this.dataSource.data = studentsList
        this.dataSource.paginator = this.paginator;
      },
      error => {
        console.error(error)
      }
    )
  }

  applyFilter(value: string) {
    this.currentFilter = value
    if(value == "all") {
      this.dataSource.data = this.unfilteredStudents
      return
    }

    this.dataSource.data = this.unfilteredStudents.filter((student: any) => {
      if(value == 'completed') {
        return student.ojt_exit_poll
      }

      if(value == 'pending') {
        return !student.ojt_exit_poll
      }

      return false
    })

    
  }
}
