import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';

import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { DataService } from '../../../../../services/data.service';
import { UserService } from '../../../../../services/user.service';

import { Router } from '@angular/router';
import { BlockList } from 'net';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  displayedColumns: string[] = ['name', 'student_number', 'course', 'year_level', 'status', 'actions'];

  currentFilter: number = 0
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
      student => {
        console.log(student)
        this.unfilteredStudents = student
        this.dataSource.data = student
        this.dataSource.paginator = this.paginator;
      },
      error => {
        console.error(error)
      }
    )
  }

  applyFilter(value: string) {
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
