import { Component, ViewChild, ChangeDetectorRef  } from '@angular/core';


import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { DataService } from '../../../../../services/data.service';
import { Router } from '@angular/router';
import { MatSelectChange } from '@angular/material/select';
import { UserService } from '../../../../../services/user.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  displayedColumns: string[] = ['name', 'student_number', 'category', 'year', 'program', 'company', 'status', 'actions'];
  statusFilter: number = 0

  
  currentFilter: string = 'all'
  unfilteredStudents: any
  dataSource: any = new MatTableDataSource<any>();
  
  @ViewChild(MatPaginator, {static:true}) paginator!: MatPaginator;
  
  constructor(
    private paginatorIntl: MatPaginatorIntl, 
    private changeDetectorRef: ChangeDetectorRef,
    private ds: DataService,
    private router: Router,
    private us: UserService
  ) {
    this.paginator = new MatPaginator(this.paginatorIntl, this.changeDetectorRef);
    const nameFilterPredicate = (data: any, search: string): boolean => {
      return data.user.full_name.toLowerCase().includes(search);
    } 
    
    const studentNumberFilterPredicate = (data: any, search: string): boolean => {
      // return data.student_profile.student_number.toLowerCase().includes(search);
      return data.user.email.toLowerCase().includes(search);
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
            element.status_text = 'Rejected'
          }
          else if(element.status == 5) {
            element.status_text = 'Accepted'
          }

          let student = element.user

          let full_name = student.first_name + " " + student.last_name
          element.user.full_name = full_name

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
    this.ds.get('adviser/applications/', id).subscribe(
      applicationDetails=> {

        let industryPartner = applicationDetails.industry_partner
        let companyHead = industryPartner.company_head;
        let fullName = `${companyHead?.first_name || ''} ${companyHead?.last_name || ''} ${companyHead?.ext_name || ''}`.trim();
        applicationDetails.industry_partner.company_head.full_name = fullName;

        let supervisor = industryPartner.immediate_supervisor;
        let supervisorFullName = `${supervisor?.first_name || ''} ${supervisor?.last_name || ''} ${supervisor?.ext_name || ''}`.trim();
        applicationDetails.industry_partner.immediate_supervisor.full_name = supervisorFullName;

        if(applicationDetails.application_endorsement)
          applicationDetails.application_documents.unshift(applicationDetails.application_endorsement)
        
        console.log(applicationDetails)

        this.us.setStudentApplication(applicationDetails)
        this.router.navigate(['main/requirements/view/'])

      },
      error => {
        console.error(error)
      }
    )
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

  onStatusFilterChange(event: MatSelectChange) {
    console.log(event.value)
    this.statusFilter = event.value
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
      return student.status == this.statusFilter
    })

    this.dataSource.data = student
  }

  search(search: string) {
    this.dataSource.filter = search.trim().toLowerCase()
  }
}
