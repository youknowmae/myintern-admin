import { Component, ViewChild, ChangeDetectorRef  } from '@angular/core';

import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { DataService } from '../../../../../services/data.service';
import { Router } from '@angular/router';
import { GeneralService } from '../../../../../services/general.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  displayedColumns: string[] = ['name', 'student_number', 'category', 'year', 'program', 'company', 'status', 'actions', 'average'];

  
  currentFilter: string = 'all'
  unfilteredStudents: any
  dataSource: any = new MatTableDataSource<any>();
  
  @ViewChild(MatPaginator, {static:true}) paginator!: MatPaginator;
  
  constructor(
    private paginatorIntl: MatPaginatorIntl, 
    private changeDetectorRef: ChangeDetectorRef,
    private ds: DataService,
    private gs: GeneralService,
    private router: Router
  ) {
    this.paginator = new MatPaginator(this.paginatorIntl, this.changeDetectorRef);
  }

  ngOnInit() {
    this.getStudents() 
  }

  getStudents() {
    this.ds.get('adviser/evaluation/students').subscribe(
      students => {
        console.log('test')
        this.unfilteredStudents = students.map((student: any) => {

          let company_name = ''

          if(student.internship_applications.length > 0) {
            company_name = student.internship_applications[0].industry_partner.company_name
          }
          let course = student.student_courses[0].course_code

          let status 
          var eval_average = null

          if(student.student_evaluation == null) {
            status = 'Pending'
          } 
          else {
            if(student.student_evaluation.status === 1) {
              status = 'Completed'
              eval_average = student.student_evaluation.average
            }
            else {
              var evaluation_id = student.student_evaluation.id
              status = 'For Approval'
            }
          }
          

          return {
            full_name: student.first_name + " " + student.last_name,
            status,
            course,
            evaluation_id,
            company_name,
            eval_average,
            ...student
          } 
        })
        console.log(this.unfilteredStudents)

        this.dataSource.data = this.unfilteredStudents;
        this.dataSource.paginator = this.paginator;
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
    if(value == "all") {
      this.dataSource.data = this.unfilteredStudents
      return
    }

    this.dataSource.data = this.unfilteredStudents.filter((student: any) => {
      return student.student_profile.program.includes(value)
    })
  }

  // approve(id: number, average: number) {
  //   if(isNaN(average) || average === null) {
  //     this.gs.errorAlert('Not a number!', 'The number you\'ve input is not a number')
  //     return
  //   }

  //   const form = new FormData
  //   form.append('average', average.toString())
    
  //   this.ds.post('evaluation/approve/', id, form).subscribe(
  //     response => {
  //       console.log(response)
  //       this.gs.successAlert('Approved!', response.message)
  //       this.getStudents()
  //     },
  //     error => {
  //       console.error(error)
  //     }
  //   )
  // }
}
