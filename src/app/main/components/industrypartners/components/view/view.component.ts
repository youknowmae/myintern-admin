import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../../../../services/data.service';
import { MatDialog } from '@angular/material/dialog';
import { IndustryPartner } from '../../../../../model/industry-partner.model';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../../../../../services/user.service';
import { GeneralService } from '../../../../../services/general.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss'
})
export class ViewComponent {
  isLoading: boolean = true

  displayedColumns: string[] = ['name', 'student_number', 'course', 'year_level'];
  
  dataSource: any = new MatTableDataSource<any>();

  industryPartner: any
  
  constructor(
    private router: Router,
    private us: UserService,
    private ds: DataService,
    private gs: GeneralService
  ) {
   this.getIndustryPartner()
  }
  
  getIndustryPartner() {
    let id = this.us.getIndustryPartner()

    if(!id) {
      this.router.navigate(['main/industrypartners/list'])
    }

    
    this.ds.get('adviser/industryPartners/', id).subscribe(
      industryPartner => {
        let companyHead = industryPartner.company_head;
        let fullName = `${companyHead?.first_name || ''} ${companyHead?.last_name || ''} ${companyHead?.ext_name || ''}`.trim();
        industryPartner.company_head.full_name = fullName;

        let supervisor = industryPartner.immediate_supervisor;
        let supervisorFullName = `${supervisor?.first_name || ''} ${supervisor?.last_name || ''} ${supervisor?.ext_name || ''}`.trim();
        industryPartner.immediate_supervisor.full_name = supervisorFullName;

        let full_address = `${industryPartner?.street || ''} ${industryPartner?.barangay || ''}, ${industryPartner?.municipality || ''}`
        industryPartner.full_address = full_address

        if(industryPartner.internship_applications) {  
          industryPartner.internship_applications = industryPartner.internship_applications.map((student: any) => {
            return {
              full_name: student.user.first_name + " " + student.user.last_name,
              ...student
            }
          })
        }
        
        console.log(industryPartner)

        this.industryPartner = industryPartner

        this.dataSource.data = this.industryPartner.internship_applications
        this.isLoading = false
      },
      error => {
        this.isLoading = false
        console.error(error)
        if(error.status === 404) {
          this.router.navigate(['main/industrypartners/list'])
          this.gs.errorAlert('Not Found!', 'Industry Partner not found.')
        }
        else {
          this.gs.errorAlert('Oops!', 'Something went wrong. Please try again later.')
        }
      }
    )      
  }

}
