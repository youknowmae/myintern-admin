import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';

import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { DataService } from '../../../../../services/data.service';
import { Router } from '@angular/router';
import { GeneralService } from '../../../../../services/general.service';
import { MatSelectChange } from '@angular/material/select';
import { UserService } from '../../../../../services/user.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent {
  displayedColumns: string[] = [
    'name',
    'student_number',
    'category',
    'company',
    'average',
    'status',
    'actions',
  ];

  currentFilter: string = 'all';
  unfilteredStudents: any;
  dataSource: any = new MatTableDataSource<any>();

  classList: any = [];

  statusFilter: string = 'all';
  classFilter: string = 'all';

  isSubmitting: boolean = false;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  constructor(
    private paginatorIntl: MatPaginatorIntl,
    private changeDetectorRef: ChangeDetectorRef,
    private ds: DataService,
    private gs: GeneralService,
    private us: UserService,
    private router: Router
  ) {
    this.paginator = new MatPaginator(
      this.paginatorIntl,
      this.changeDetectorRef
    );

    const nameFilterPredicate = (data: any, search: string): boolean => {
      return data.full_name.toLowerCase().includes(search);
    };

    const studentNumberFilterPredicate = (
      data: any,
      search: string
    ): boolean => {
      // return data.student_profile.student_number.toLowerCase().includes(search);
      return data.email.toLowerCase().includes(search);
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

  search(search: string) {
    this.dataSource.filter = search.trim().toLowerCase();
  }

  getStudents() {
    this.ds.get('adviser/evaluation/students').subscribe(
      (students) => {
        console.log('test');
        let studentsList = students.map((student: any) => {
          if (!this.classList.includes(student.active_ojt_class.class_code))
            this.classList.push(student.active_ojt_class.class_code);

          let company_name = '';

          if (student.internship_applications.length > 0) {
            company_name =
              student.internship_applications[0].industry_partner.company_name;
          }

          let status = student.student_evaluation ? 'Completed' : 'Pending';

          if (student.student_evaluation)
            student.student_evaluation = {
              id: student.student_evaluation.id,
              average: student.student_evaluation.average,
            };

          return {
            full_name: student.first_name + ' ' + student.last_name,
            status,
            company_name,
            ...student,
          };
        });

        this.unfilteredStudents = studentsList.sort((a: any, b: any) =>
          a.last_name.localeCompare(b.last_name)
        );
        console.log(this.unfilteredStudents);

        this.dataSource.data = this.unfilteredStudents;
        this.dataSource.paginator = this.paginator;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  viewEvaluation(id: number) {
    if (this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;

    this.ds.get('adviser/evaluation/students/', id).subscribe(
      (response) => {
        this.isSubmitting = false;
        console.log(response);
        this.us.setStudentEvaluation(response);
        this.router.navigate(['main/evaluation/view']);
      },
      (error) => {
        this.gs.makeAlert(
          'Oops!',
          'Something went wrong. Please try again later.',
          'error'
        );
        this.isSubmitting = false;
        console.error(error);
      }
    );
  }

  onClassFilterChange(event: MatSelectChange) {
    this.classFilter = event.value;

    this.statusFilter = 'all';
    this.applyFilter();
  }

  onStatusFilterChange(value: string) {
    this.statusFilter = value;
    this.applyFilter();
  }

  applyFilter() {
    //class filter
    let students = this.unfilteredStudents;

    if (this.classFilter != 'all') {
      students = students.filter((student: any) => {
        return student.active_ojt_class.class_code === this.classFilter;
      });
    }

    if (this.statusFilter != 'all') {
      students = students.filter((student: any) => {
        return student.status.toLowerCase() === this.statusFilter;
      });
    }

    this.dataSource.data = students;
  }
}
