import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';

import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { DataService } from '../../../../../services/data.service';
import { UserService } from '../../../../../services/user.service';

import { Router } from '@angular/router';
import { MatSelectChange } from '@angular/material/select';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  displayedColumns: string[] = ['name', 'year_level', 'student_number', 'course', 'class_code', 'status', 'actions'];

  unfilteredStudents: any
  dataSource: any = new MatTableDataSource<any>();

  classList: any = []

  statusFilter: string = 'all'
  classFilter: string = 'all'
  
  @ViewChild(MatPaginator, {static:true}) paginator!: MatPaginator;

  constructor(
    private paginatorIntl: MatPaginatorIntl, 
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private ds: DataService,
    private us: UserService
  ) {
    this.paginator = new MatPaginator(this.paginatorIntl, this.changeDetectorRef);
    
    const nameFilterPredicate = (data: any, search: string): boolean => {
      return data.full_name.toLowerCase().includes(search);
    } 
    
    const studentNumberFilterPredicate = (data: any, search: string): boolean => {
      // return data.student_profile.student_number.toLowerCase().includes(search);
      return data.email.toLowerCase().includes(search);
    } 

    const filterPredicate = (data: any, search: string): boolean => {
      return (
        nameFilterPredicate(data, search) ||
        studentNumberFilterPredicate(data, search)
      );
    };

    this.dataSource.filterPredicate = filterPredicate
  }

  ngOnInit() {
    this.getStudents()
  }

  search(search: string) {
    this.dataSource.filter = search.trim().toLowerCase()
  }

  view(id: number){
    this.ds.get('adviser/exit-poll/', id).subscribe(
      exitPollDetails=> {  

        let supervisor = exitPollDetails.industry_partner.immediate_supervisor;
        let supervisorFullName = `${supervisor?.first_name || ''} ${supervisor?.last_name || ''} ${supervisor?.ext_name || ''}`.trim();
        exitPollDetails.industry_partner.immediate_supervisor.full_name = supervisorFullName;
        
        console.log(exitPollDetails)
        
        this.us.setStudentExitPoll(exitPollDetails)
        this.router.navigate(['/main/exitpoll/view'])
      },
      error => {
        console.error(error)
      }
    )
  }
  
  getStudents() {
    this.ds.get('adviser/exit-poll').subscribe(
      students => {
        let studentsList = students.map((student: any) => {
          if (!this.classList.includes(student.active_ojt_class.class_code)) 
            this.classList.push(student.active_ojt_class.class_code) 

          let status = (student.ojt_exit_poll) ? 'Completed' : 'Pending'

          return {
            full_name: student.first_name + " " + student.last_name,
            status,
            ...student
          }
        })

        console.log(studentsList)
        
        studentsList = studentsList.sort((a: any, b: any) => a.last_name.localeCompare(b.last_name))
        
        this.unfilteredStudents = studentsList
        this.dataSource.data = studentsList
        this.dataSource.paginator = this.paginator;
      },
      error => {
        console.error(error)
      }
    )
  }

  onClassFilterChange(event: MatSelectChange) {
    this.classFilter = event.value

    this.statusFilter = 'all'
    this.applyFilter()
  }

  onStatusFilterChange(value: string) {
    this.statusFilter = value
    this.applyFilter()
  }

  applyFilter() {
    //class filter
    let students = this.unfilteredStudents
    
    if(this.classFilter != 'all') {
      students = students.filter((student: any) => {
        return student.active_ojt_class.class_code === this.classFilter
      })
    }

    if(this.statusFilter != "all") {
      students = students.filter((student: any) => {
        return student.status.toLowerCase() === this.statusFilter
      })    
    }

    this.dataSource.data = students
  }
}
