import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';

import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { DataService } from '../../../../../services/data.service';
import { Router } from '@angular/router';
import { MatSelectChange } from '@angular/material/select';
import { UserService } from '../../../../../services/user.service';
import { GeneralService } from '../../../../../services/general.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent {
  // displayedColumns: string[] = ['name', 'student_number', 'category', 'year', 'program', 'company', 'status', 'actions'];
  displayedColumns: string[] = [
    'name',
    'course_code',
    'class_code',
    'company',
    'application_date',
    'status',
    'actions',
  ];
  statusFilter: number = 0;

  currentFilter: string = 'all';
  unfilteredStudents: any;
  dataSource: any = new MatTableDataSource<any>();

  isSubmitting: boolean = false;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  constructor(
    private paginatorIntl: MatPaginatorIntl,
    private changeDetectorRef: ChangeDetectorRef,
    private ds: DataService,
    private router: Router,
    private us: UserService,
    private gs: GeneralService
  ) {
    this.paginator = new MatPaginator(
      this.paginatorIntl,
      this.changeDetectorRef
    );
    const nameFilterPredicate = (data: any, search: string): boolean => {
      return data.user.full_name.toLowerCase().includes(search);
    };

    const studentNumberFilterPredicate = (
      data: any,
      search: string
    ): boolean => {
      // return data.student_profile.student_number.toLowerCase().includes(search);
      return data.user.email.toLowerCase().includes(search);
    };

    const filterPredicate = (data: any, search: string): boolean => {
      return (
        nameFilterPredicate(data, search) ||
        studentNumberFilterPredicate(data, search)
      );
    };

    this.dataSource.filterPredicate = filterPredicate;
  }

  ngOnInit() {
    this.getStudents();
  }

  getStudents() {
    this.ds.get('adviser/applications').subscribe(
      (students) => {
        this.unfilteredStudents = students.map((element: any) => {
          const ojtClass = element.user.ojt_class.adviser_class;

          if (
            element.status == 5 ||
            element.status == 6 ||
            element.status == 7
          ) {
            element.status = 5;
          } else if (element.status == 8) {
            element.status = 6;
          }

          let student = element.user;

          let full_name = student.first_name + ' ' + student.last_name;
          element.user.full_name = full_name;

          return { ...element, ...ojtClass };
        });

        console.log(this.unfilteredStudents);

        this.dataSource.data = this.unfilteredStudents;
        this.dataSource.paginator = this.paginator;

        this.filterStudent();
      },
      (error) => {
        console.error(error);
      }
    );
  }

  viewApplication(id: number) {
    this.us.setStudentApplication(id);
    this.router.navigate(['main/requirements/view']);
  }

  applyFilter(value: string) {
    this.currentFilter = value;
    this.filterStudent();
    // if(value == "all") {
    //   this.dataSource.data = this.unfilteredStudents
    //   return
    // }

    // this.dataSource.data = this.unfilteredStudents.filter((student: any) => {
    //   return student.user.student_profile.program.includes(value)
    // })
  }

  onStatusFilterChange(event: MatSelectChange) {
    console.log(event.value);
    this.statusFilter = event.value;
    this.filterStudent();
  }

  filterStudent() {
    let student;

    if (this.currentFilter == 'all') {
      student = this.unfilteredStudents;
    } else {
      student = this.unfilteredStudents.filter((student: any) => {
        return student.user.student_profile.program.includes(
          this.currentFilter
        );
      });
    }

    student = student.filter((student: any) => {
      return student.status == this.statusFilter;
    });

    this.dataSource.data = student;
  }

  search(search: string) {
    this.dataSource.filter = search.trim().toLowerCase();
  }
}
