import { Component, ViewChild, ChangeDetectorRef, inject } from '@angular/core';

import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { DataService } from '../../../../../services/data.service';
import { UserService } from '../../../../../services/user.service';

import { Router } from '@angular/router';
import { MatSelectChange } from '@angular/material/select';
import { MatSort, Sort } from '@angular/material/sort';

import * as ExcelJS from 'exceljs';

import { saveAs } from 'file-saver';
import { AcademicYear } from '../../../../../model/academic-year.model';
import { GeneralService } from '../../../../../services/general.service';
import { SemesterTextPipe } from '../../../../../pipes/semester-text.pipe';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  providers: [SemesterTextPipe],
})
export class ListComponent {
  displayedColumns: string[] = [
    'full_name',
    'company',
    'progress',
    'student_evaluation',
    'ojt_exit_poll',
    'status',
    'grade',
    'actions',
  ];

  academicYearOptions: any = [];
  academicYearFilter: any;

  unfilteredStudents: any;
  dataSource: any = new MatTableDataSource<any>();

  classList: any = [];
  statusFilter: string = 'all';
  classFilter: string = 'all';

  isSubmitting: boolean = false;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    console.log(this.sort);
    this.dataSource.sort = this.sort;
  }

  constructor(
    private paginatorIntl: MatPaginatorIntl,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private ds: DataService,
    private us: UserService,
    private gs: GeneralService,
    private semesterTextPipe: SemesterTextPipe
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
    let academicYears = this.us.getAcademicYears();
    this.academicYearOptions = academicYears;
    const activeAcadYear = academicYears.find(
      (item: any) => item.is_active === 1
    );

    this.academicYearFilter = activeAcadYear;

    this.getStudents(activeAcadYear);
  }

  onAcademicYearFilterChange(event: MatSelectChange) {
    this.classList = [];
    const acadYear = event.value;
    this.academicYearFilter = acadYear;
    this.getStudents(acadYear);
  }

  getStudents(acadYear: AcademicYear) {
    this.ds
      .get(
        `adviser/students`,
        `?acad_year=${acadYear.acad_year}&semester=${acadYear.semester}`
      )
      .subscribe(
        (students) => {
          console.log(students);
          let studentsList = students.map((student: any) => {
            const active_ojt_class = {
              ...student.ojt_class,
              ...student.ojt_class.adviser_class,
              ...student.ojt_class.adviser_class.active_ojt_hours,
            };

            if (
              !this.classList.some((data: any) =>
                data.label.includes(
                  active_ojt_class.class_code +
                    ' - ' +
                    active_ojt_class.course_code
                )
              )
            )
              this.classList.push({
                label:
                  active_ojt_class.class_code +
                  ' - ' +
                  active_ojt_class.course_code,
                value: active_ojt_class.class_code,
              });

            if (student.student_evaluation) {
              student.student_evaluation = student.student_evaluation.average;
            }

            let progress: number = 0;
            let status = '';
            const currentApplication = student.active_application;
            const exitPoll = student.ojt_exit_poll;
            const studentEvaluation = student.student_evaluation;
            const required_hours: number = active_ojt_class.required_hours;
            const courseCode = active_ojt_class.course_code;

            //if has accomplishment report
            if (student.verified_attendance_total) {
              progress += parseInt(
                student.verified_attendance_total.current_total_hours
              );
              if (progress > required_hours) progress = required_hours;
            }

            if (student.seminar_hours_total) {
              student.seminar_hours_total =
                student.seminar_hours_total.current_total_hours;
            } else {
              student.seminar_hours_total = 0;
            }

            if (student.community_service_total) {
              student.community_service_total =
                student.community_service_total.current_total_hours;
            } else {
              student.community_service_total = 0;
            }

            if (student.other_task_total_hours) {
              student.other_task_total_hours =
                student.other_task_total_hours.current_total_hours;
            } else {
              student.other_task_total_hours = 0;
            }

            const level_2 = ['ITP422', 'CS422', 'DAP421'];
            const level_1 = ['ITP131', 'CS131', 'EMC131'];
            let practicum_level;

            if (level_2.includes(courseCode)) {
              practicum_level = 2;
            } else {
              practicum_level = 1;
            }

            if (progress >= required_hours && exitPoll && studentEvaluation) {
              status = 'Completed';
            } else if (
              student.active_application &&
              student.active_application.status == 8
            ) {
              status = 'Ongoing';
            } else if (currentApplication && currentApplication == 0)
              status = "Pending - Adviser's Approval";
            else if (
              currentApplication == 3 ||
              currentApplication == 5 ||
              currentApplication == 6 ||
              currentApplication == 7
            ) {
              status = 'Pending - Company Approval';
            } else {
              status = 'Pending - without application';
            }

            const student_evaluation = studentEvaluation
              ? studentEvaluation
              : 'N/A';
            const exit_poll = exitPoll ? 'Answered' : 'Not Completed';

            const company = currentApplication
              ? currentApplication.industry_partner.company_name
              : 'N/A';
            return {
              full_name: student.first_name + ' ' + student.last_name,
              progress,
              status,
              company,
              exit_poll,
              ...student,
              student_evaluation,
              practicum_level,
              active_ojt_class,
              grades: active_ojt_class.grades,
            };
          });

          studentsList = studentsList.sort((a: any, b: any) =>
            a.last_name.localeCompare(b.last_name)
          );
          console.log(studentsList);

          this.unfilteredStudents = studentsList;
          this.dataSource.data = studentsList;
          this.dataSource.paginator = this.paginator;
        },
        (error) => {
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
        return student.status.toLowerCase().includes(this.statusFilter);
      });
    }

    this.dataSource.data = students;
  }

  editGrade(element: any) {
    if (element.status !== 'Completed') {
      this.gs.makeToast(
        'Cannot edit grade: Student is not yet marked as completed.',
        'warning'
      );
      return;
    }
    element.isEditing = true;
  }

  // When input loses focus or Enter is pressed
  saveGrade(element: any, grades: string) {
    const numericGrade = Number(grades);

    if (
      grades === null ||
      grades === '' ||
      isNaN(numericGrade) ||
      numericGrade < 65 ||
      numericGrade > 100
    ) {
      this.gs.makeToast('Grade not saved: Invalid input.', 'error');
      element.isEditing = false;
      element.grades = null;
      return;
    }

    const data = {
      id: element.id,
      grades: numericGrade,
    };

    const acadYear = this.academicYearFilter;
    this.ds
      .post(
        `adviser/students/submit-grade`,
        `?acad_year=${acadYear.acad_year}&semester=${acadYear.semester}`,
        {payload: this.us.encryptPayload(data)}
      )
      .subscribe({
        next: (response: any) => {
          element.grades = numericGrade;
          element.isEditing = false;

          this.gs.makeToast('Grades saved!', 'success');

          console.log('Saved grade:', element.grade);
        },
        error: (error: any) => {
          console.error(error);
          element.isEditing = false;
          if (error.status == 422) {
            this.gs.makeAlert(
              error.error.title || 'Invalid Input!',
              error.error.message || 'Invalid grades value!.',
              'error'
            );
          } else {
            this.gs.makeAlert(
              'Error!',
              'Something went wrong, please try again later.',
              'error'
            );
          }
        },
      });
  }

  search(search: string) {
    this.dataSource.filter = search.trim().toLowerCase();
  }

  viewStudent(id: number) {
    if (this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;

    let studentDetails = this.unfilteredStudents.find(
      (student: any) => student.id == id
    );

    const acadYear = this.academicYearFilter;

    console.log(studentDetails);
    this.ds
      .get(
        `adviser/students/${id}`,
        `?acad_year=${acadYear.acad_year}&semester=${acadYear.semester}`
      )
      .subscribe(
        (student) => {
          student.ojt_class = {
            ...student.ojt_class.adviser_class,
            ...student.ojt_class.adviser_class.active_ojt_hours,
          };
          this.us.setStudentProfile({
            ...student,
            required_hours: student.ojt_class?.required_hours || 0,
          });
          this.us.setSelectedAcademicYears(this.academicYearFilter); //store current acad year
          this.router.navigate(['main/students/view']);
          this.isSubmitting = false;
        },
        (error) => {
          console.error(error);
          this.isSubmitting = false;
        }
      );
  }

  async downloadExcel() {
    let students = this.unfilteredStudents;

    if (this.classFilter != 'all') {
      students = students.filter((student: any) => {
        return student.active_ojt_class.class_code === this.classFilter;
      });
    }
    //group by class code and course code
    students = students.map((data: any) => {
      //class and course code
      data.class_course_code =
        'Class ' +
        data.active_ojt_class.class_code +
        ' - ' +
        data.active_ojt_class.course_code;
      return data;
    });

    students = this.groupBy(
      students,
      (student: any) => student.class_course_code
    );

    if (this.classFilter === 'all') {
      students['All Classes'] = this.unfilteredStudents.sort(
        (a: any, b: any) =>
          a.active_ojt_class.class_code - b.active_ojt_class.class_code
      );
    }

    console.log(students);

    const excel = await this.generateExcelContent(students);

    if (excel instanceof ExcelJS.Workbook) {
      const buffer = await excel.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      saveAs(blob, 'OJT-Report.xlsx');
    } else {
      console.error('Error generating Excel file data.');
    }
  }

  async generateExcelContent(data: any) {
    const header = [
      'No.',
      'Last Name',
      'First Name',
      'Student Number',
      'Course Code',
      'Class Code',
      'Seminar Hours',
      'Other Works',
      'Community Service',
      'Required OJT Hours',
      'Rendered OJT Hours',
      'Student Evaluation',
      'Exit Poll',
      'Grades',
    ];

    const excel = new ExcelJS.Workbook();

    try {
      const gcImageResponse = await fetch('assets/images/GC.png');
      const gcImageBlob = await gcImageResponse.blob();
      const gcImageBase64 = await this.blobToBase64(gcImageBlob);

      const gcLogo = excel.addImage({
        base64: gcImageBase64,
        extension: 'png',
      });

      const ccsImageResponse = await fetch('assets/images/ccs.png');
      const ccsImageBlob = await ccsImageResponse.blob();
      const ccsImageBase64 = await this.blobToBase64(ccsImageBlob);

      const ccsLogo = excel.addImage({
        base64: ccsImageBase64,
        extension: 'png',
      });

      var currentPageLine = 0;

      var worksheet: any;

      const pageSetup: Partial<ExcelJS.PageSetup> = {
        orientation: 'landscape',
        paperSize: 9, // A4 paper size
        fitToPage: true,
        fitToWidth: 1, // Fit to one page width
        fitToHeight: 0, // Fit to unlimited page height
      };

      // if (this.classFilter == 'all') {
      //   worksheet = excel.addWorksheet('All Classes', {
      //     pageSetup,
      //   });
      // }

      // var items: any = [];

      Object.entries(data)
        .sort(([keyA], [keyB]) => {
          return keyA.localeCompare(keyB);
        })
        .map(([class_course_code, students]: [string, any]) => {
          console.log(students);
          worksheet = excel.addWorksheet(class_course_code, {
            pageSetup,
          });

          worksheet.addImage(gcLogo, {
            tl: { col: 0, row: currentPageLine },
            ext: { width: 120, height: 120 },
            editAs: 'absolute',
          });

          worksheet.addImage(ccsLogo, {
            tl: { col: 12, row: currentPageLine },
            ext: { width: 120, height: 120 },
            editAs: 'absolute',
          });

          currentPageLine += 1;
          worksheet.mergeCells(
            `A${currentPageLine + 1}:N${currentPageLine + 1}`
          );
          worksheet.getCell(`A${currentPageLine + 1}`).value = 'Gordon College';
          worksheet.getCell(`A${currentPageLine + 1}`).alignment = {
            vertical: 'middle',
            horizontal: 'center',
          };
          worksheet.getCell(`A${currentPageLine + 1}`).font = {
            size: 16,
            bold: true,
          };

          currentPageLine += 1;

          worksheet.mergeCells(
            `A${currentPageLine + 1}:N${currentPageLine + 1}`
          );
          worksheet.getCell(`A${currentPageLine + 1}`).value =
            'College of Computer Studies';
          worksheet.getCell(`A${currentPageLine + 1}`).alignment = {
            vertical: 'middle',
            horizontal: 'center',
          };
          worksheet.getCell(`A${currentPageLine + 1}`).font = { size: 12 };

          currentPageLine += 1;

          worksheet.mergeCells(
            `A${currentPageLine + 1}:N${currentPageLine + 1}`
          );
          worksheet.getCell(`A${currentPageLine + 1}`).value = `A.Y. ${
            this.academicYearFilter.acad_year
          }, ${this.semesterTextPipe.transform(
            this.academicYearFilter.semester
          )}`;
          worksheet.getCell(`A${currentPageLine + 1}`).alignment = {
            vertical: 'middle',
            horizontal: 'center',
          };
          worksheet.getCell(`A${currentPageLine + 1}`).font = { size: 12 };
          currentPageLine += 1;

          worksheet.mergeCells(
            `A${currentPageLine + 1}:N${currentPageLine + 1}`
          );
          worksheet.getCell(`A${currentPageLine + 1}`).value =
            class_course_code;
          worksheet.getCell(`A${currentPageLine + 1}`).alignment = {
            vertical: 'middle',
            horizontal: 'center',
          };
          worksheet.getCell(`A${currentPageLine + 1}`).font = { size: 12 };
          currentPageLine += 1;

          worksheet.addRow([]);

          currentPageLine += 1;

          worksheet.addRow(header);
          currentPageLine += 1;

          // let itemStartingLine = currentPageLine;
          let counter = 1;
          students.forEach((student: any) => {
            worksheet.addRow([
              counter,
              student.last_name,
              student.first_name,
              student.student_profile.student_number,
              student.active_ojt_class.course_code,
              student.active_ojt_class.class_code,
              student.practicum_level == 2
                ? '---'
                : student.seminar_hours_total,
              student.practicum_level == 2
                ? '---'
                : student.other_task_total_hours,
              student.practicum_level == 2
                ? student.community_service_total
                : '---',
              student.active_ojt_class.required_hours,
              student.progress,
              student.student_evaluation
                ? student.student_evaluation
                : 'Not Evaluated',
              student.ojt_exit_poll ? 'Answered' : 'Not Completed',
              student.grades ? student.grades : 'INC',
            ]);
            counter++;
            currentPageLine++;
          });

          // items.push({ start: itemStartingLine, end: currentPageLine });
          worksheet.columns.forEach((column: any) => {
            let maxLength = 0;
            column.eachCell({ includeEmpty: true }, (cell: any) => {
              if (cell.row >= 7) {
                const cellValue = cell.value ? cell.value.toString() : '';
                maxLength = Math.max(maxLength, cellValue.length);
              }
            });
            column.width = maxLength < 6 ? 6 : maxLength + 1;
          });
          currentPageLine = 0;
        });

      return excel; // Return the excel workbook
    } catch (error) {
      console.error('Error in convertExcel:', error);
      return false;
    }
  }

  blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1]; // Get base64 part
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob); // Convert blob to base64
    });
  }

  groupBy = <T, K extends keyof any>(arr: T[], key: (i: T) => K) =>
    arr.reduce((groups, item) => {
      (groups[key(item)] ||= []).push(item);
      return groups;
    }, {} as Record<K, T[]>);

  getProgressPercentage(progress: number, required_hours: number) {
    let percentage = (progress / required_hours) * 100;

    return Math.round(percentage * 100) / 100; //return 2 decimal
  }
}
