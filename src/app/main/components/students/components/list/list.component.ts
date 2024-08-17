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
  displayedColumns: string[] = ['name', 'student_number', 'mobile', 'course', 'program', 'year_level', 'time_completion', 'status', 'actions'];

  currentFilter: string = 'all'
  unfilteredStudents: any
  dataSource: any = new MatTableDataSource<any>();

  isLoading: boolean = false
  
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

  getStudents() {
    this.ds.get('monitoring/students').subscribe(
      students => {
        let studentsList = students.map((student: any) => {
          return {
            full_name: student.first_name + " " + student.last_name,
            course: student.student_courses[0].course_code,
            status: (student.internship_applications.length === 0) ? 'Pending' : 'Ongoing',
            ...student
          } 
        })
        console.log(studentsList)
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
      var status = student.status.toLowerCase()
      if(value == 'completed') {
        return status.includes('completed') 
      }

      if(value == 'pending') {
        return status.includes('pending') 
      }
      
      if(value == 'ongoing') {
        return status.includes('ongoing') 
      }

      return false
    })    
  }

  viewStudent(id: number) {
    if(this.isLoading) {
      return
    }

    this.isLoading = true
    this.ds.get('monitoring/students/', id).subscribe(
      student => {
        this.us.setStudentProfile(student)
        this.router.navigate(['main/students/view'])
        this.isLoading = false
      },
      error => {
        console.error(error)
        this.isLoading = false
      }
    )
  }
}
