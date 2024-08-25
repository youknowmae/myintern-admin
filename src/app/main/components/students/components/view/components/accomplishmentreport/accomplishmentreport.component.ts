import { Component } from '@angular/core';
import { UserService } from '../../../../../../../services/user.service';
import { DataService } from '../../../../../../../services/data.service';

@Component({
  selector: 'app-accomplishmentreport',
  templateUrl: './accomplishmentreport.component.html',
  styleUrl: './accomplishmentreport.component.scss'
})
export class AccomplishmentreportComponent {
  accomplishmentReports: any

  constructor(
    private us: UserService,
    private ds: DataService
  ) {
  }

  ngOnInit() {
    var student = this.us.getStudentProfile()

    this.getAccomplishmentReport(student.id)

  }

  getAccomplishmentReport(id: number) {
    this.ds.get('monitoring/students/accomplishment-report/', id).subscribe(
      response => {
        this.accomplishmentReports = Object.entries(response)
                                        .map(([week, accomplishment_report]: [string, any]) => { 
                                          var accumulated_hours: number = 0

                                          accomplishment_report.forEach((report: any) => {
                                            accumulated_hours += report.total_hours
                                          });

                                          return { week, accomplishment_report, accumulated_hours }
                                        })
        console.log(this.accomplishmentReports)
      },
      error => {
        console.error(error)
      }
    )
  }

}
