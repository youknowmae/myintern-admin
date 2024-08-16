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
        this.dataSource.data = student
        this.dataSource.paginator = this.paginator;
      },
      error => {
        console.error(error)
      }
    )
    // this.dataSource.data = [
    //   {
    //     id: 1,
    //     name: 'raven',
    //     student_number: '202110187',
    //     year: '3',
    //     status: 'di pa tapos ano ka'
    //   }
    // ]
    
  }
}
