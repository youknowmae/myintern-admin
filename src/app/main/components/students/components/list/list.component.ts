import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';

import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { DataService } from '../../../../../services/data.service';
import { UserService } from '../../../../../services/user.service';

import { Router } from '@angular/router';
import { MatSelectChange } from '@angular/material/select';

import * as ExcelJS from 'exceljs';

import { saveAs } from 'file-saver';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  // displayedColumns: string[] = ['name', 'student_number', 'course', 'program', 'progress', 'student_evaluation', 'exit_poll', 'status', 'actions'];
  displayedColumns: string[] = ['name', 'company', 'class_code', 'progress', 'student_evaluation', 'exit_poll', 'status', 'actions'];

  unfilteredStudents: any
  dataSource: any = new MatTableDataSource<any>();
  
  classList: any = []
  statusFilter: string = 'all'
  classFilter: string = 'all'

  isSubmitting: boolean = false
  
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

  getStudents() {
    this.ds.get('adviser/students').subscribe(
      students => {
        console.log(students)
        let studentsList = students.map((student: any) => {
          //get all classes
          if (!this.classList.some((data: any) => data.label.includes(student.active_ojt_class.class_code + ' - ' + student.active_ojt_class.course_code  ))) 
            this.classList.push({
              label: student.active_ojt_class.class_code + ' - ' + student.active_ojt_class.course_code,
              value: student.active_ojt_class.class_code
          }) 

          if(student.student_evaluation) {
            student.student_evaluation = student.student_evaluation.average
          }

          let required_hours: number = student.active_ojt_class.required_hours
          let progress: number = 0

          if(student.verified_attendance_total) {
            progress += parseInt(student.verified_attendance_total.current_total_hours)
            if(progress > required_hours)
              progress = required_hours
          }

          let status = null

          if(progress >= required_hours && student.ojt_exit_poll && student.student_evaluation) {
            status = "Completed"
          }
          else if (student.accepted_application) {
            status = 'Ongoing'
          }  
          else if (student.pending_application && student.pending_application.status == 0)
            status = 'Pending - Adviser\'s Approval'
          else if(student.pending_application) {
            status = 'Pending - Company Approval'
          }
          else {
            status = 'Pending - w/o application'
          }

          return {
            full_name: student.first_name + " " + student.last_name,
            progress,
            status,
            ...student
          } 
        })

        
        studentsList = studentsList.sort((a: any, b: any) => a.last_name.localeCompare(b.last_name))
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
        return student.status.toLowerCase().includes(this.statusFilter)
      })    
    }

    this.dataSource.data = students
  }

  search(search: string) {
    this.dataSource.filter = search.trim().toLowerCase()
  }

  viewStudent(id: number) {
    if(this.isSubmitting) {
      return
    }

    this.isSubmitting = true

    let studentDetails = this.unfilteredStudents.find((student: any) => student.id == id)

    console.log(studentDetails)
    this.ds.get('adviser/students/', id).subscribe(
      student => {
        this.us.setStudentProfile({ ...student, required_hours: studentDetails.active_ojt_class.required_hours })
        this.router.navigate(['main/students/view'])
        this.isSubmitting = false
      },
      error => {
        console.error(error)
        this.isSubmitting = false
      }
    )
  }

  async downloadExcel() {
    let students = this.unfilteredStudents

    if(this.classFilter != 'all') {
      students = students.filter((student: any) => {
        return student.active_ojt_class.class_code === this.classFilter
      });
    }

    //group by class code and course
    students = students.map(
      (data: any) => {
        //class and course code
        data.class_course_code = data.active_ojt_class.class_code + ' - ' + data.active_ojt_class.course_code
        return data
      }
    )
    students = this.groupBy(students, (student: any) => student.class_course_code)
    console.log(students)
    
    const excel = await this.generateExcelContent(students);

    if (excel instanceof ExcelJS.Workbook) {
      const buffer = await excel.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
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
      'Seminar Hours', 
      'Other Works', 
      'Required OJT Hours', 
      'Rendered OJT Hours',
      'Student Evaluation', 
      'Exit Poll',
      'Remarks'
    ]

    const excel = new ExcelJS.Workbook();

    try {
      const gcImageResponse = await fetch("assets/images/GC.png");
      const gcImageBlob = await gcImageResponse.blob();
      const gcImageBase64 = await this.blobToBase64(gcImageBlob);
      
      const gcLogo = excel.addImage({
        base64: gcImageBase64,
        extension: "png",
      });
      
      const ccsImageResponse = await fetch("assets/images/ccs.png");
      const ccsImageBlob = await ccsImageResponse.blob();
      const ccsImageBase64 = await this.blobToBase64(ccsImageBlob);
      
      const ccsLogo = excel.addImage({
        base64: ccsImageBase64,
        extension: "png",
      });

      var currentPageLine = 0;
      
      var worksheet: any

      const pageSetup: Partial<ExcelJS.PageSetup>  = {
        orientation: 'landscape', 
        paperSize: 9, // A4 paper size
        fitToPage: true,
        fitToWidth: 1, // Fit to one page width
        fitToHeight: 0, // Fit to unlimited page height
      };

      if(this.classFilter == 'all') {
        worksheet = excel.addWorksheet('All Classes', {
          pageSetup,
        });
      }


      var items: any = [];
      


      Object.entries(data)
      .map(([class_course_code, students]: [string, any]) => {
        if(this.classFilter != 'all') {
          worksheet = excel.addWorksheet('Class ' + class_course_code, {
            pageSetup,
          });
        }
  
        worksheet.addImage(gcLogo, {
          tl: { col: 0, row: currentPageLine },
          ext: { width: 120, height: 120 },
          editAs: "absolute",
        });
  
        worksheet.addImage(ccsLogo, {
          tl: { col: 9, row: currentPageLine },
          ext: { width: 120, height: 120 },
          editAs: "absolute",
        });
  
        currentPageLine += 1
        worksheet.mergeCells(`A${currentPageLine+1}:K${currentPageLine+1}`);
        worksheet.getCell(`A${currentPageLine+1}`).value = "Gordon College";
        worksheet.getCell(`A${currentPageLine+1}`).alignment = {
          vertical: "middle",
          horizontal: "center",
        };
        worksheet.getCell(`A${currentPageLine+1}`).font = { size: 16, bold: true };
  
        currentPageLine += 1

        worksheet.mergeCells(`A${currentPageLine+1}:K${currentPageLine+1}`);
        worksheet.getCell(`A${currentPageLine+1}`).value = "College of Computer Studies";
        worksheet.getCell(`A${currentPageLine+1}`).alignment = {
          vertical: "middle",
          horizontal: "center",
        };
        worksheet.getCell(`A${currentPageLine+1}`).font = { size: 12 };

        currentPageLine += 1
  
        worksheet.mergeCells(`A${currentPageLine + 1}:K${currentPageLine + 1}`);
        worksheet.getCell(`A${currentPageLine + 1}`).value = "A.Y. 2024-2025";
        worksheet.getCell(`A${currentPageLine + 1}`).alignment = {
          vertical: "middle",
          horizontal: "center",
        };
        worksheet.getCell(`A${currentPageLine + 1}`).font = { size: 12 };
        currentPageLine += 1;

        worksheet.mergeCells(`A${currentPageLine + 1}:K${currentPageLine + 1}`);
        worksheet.getCell(`A${currentPageLine + 1}`).value = "Class " + class_course_code;
        worksheet.getCell(`A${currentPageLine + 1}`).alignment = {
          vertical: "middle",
          horizontal: "center",
        };
        worksheet.getCell(`A${currentPageLine + 1}`).font = { size: 12 };
        currentPageLine += 1;
  
        worksheet.addRow([]); 

        currentPageLine += 1
  
        worksheet.addRow(header)
        currentPageLine += 1
  
        let itemStartingLine =  currentPageLine
        let counter = 1
        students.forEach((student: any) => {
          worksheet.addRow([
            counter,
            student.last_name,
            student.first_name,
            student.student_profile.student_number,
            'to be done',
            'to be done',
            student.active_ojt_class.required_hours,
            student.progress,
            (student.student_evaluation) ? student.student_evaluation : 'Not Evaluated',
            (student.ojt_exit_poll) ? 'Answered' : 'Not Completed',
            (student.status === 'Completed') ? 'Completed': 'Incomplete',
          ]);
          counter++
          currentPageLine++
        });

        items.push({start: itemStartingLine, end: currentPageLine})
        console.log(items)

        if(this.classFilter != 'all') {
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
          currentPageLine = 0
        } 
        else {
          worksheet.getRow(currentPageLine).addPageBreak()
          currentPageLine += 1
        }
      })
      
      worksheet.columns.forEach((column: any) => {
          let maxLength = 0;
          column.eachCell({ includeEmpty: true }, (cell: any) => {
            items.forEach((item: any) => {
              if (cell.row >= item.start && cell.row <= item.end) { 
                const cellValue = cell.value ? cell.value.toString() : '';
                maxLength = Math.max(maxLength, cellValue.length);
              }
            });
            
          });
          column.width = maxLength < 6 ? 6 : maxLength + 1;
        });
      return excel; // Return the excel workbook


    } catch (error) {
      console.error("Error in convertExcel:", error);
      return false
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
}
