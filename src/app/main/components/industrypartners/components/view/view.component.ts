import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../../../../services/data.service';
import { MatDialog } from '@angular/material/dialog';
import { IndustryPartner } from '../../../../../model/industry-partner.model';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss'
})
export class ViewComponent {
  displayedColumns: string[] = ['name', 'student_number', 'course', 'year_level'];
  
  dataSource: any = new MatTableDataSource<any>();

  industryPartner: any
  id: number | null = null
  
  constructor(
    private ds: DataService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.route.paramMap.subscribe(params => {
      let id: any = params.get('id')

      if(!id) {
        return
      }
      
      id = parseInt(id)
      this.id = id

      if(!Number.isInteger(id)) {
        this.router.navigate(['/main/industrypartners/list'])
        return
      }

      this.getIndustryPartner(parseInt(id))
    });
  }
  
  getIndustryPartner(id: number) {
    this.ds.get('adviser/industry-partners-with-students/', id).subscribe(
      industryPartner => {
        this.industryPartner = industryPartner
        let companyHead = industryPartner.company_head;
        let fullName = `${companyHead?.first_name || ''} ${companyHead?.last_name || ''} ${companyHead?.ext_name || ''}`.trim();
        industryPartner.company_head.full_name = fullName;

        let supervisor = industryPartner.immediate_supervisor;
        let supervisorFullName = `${supervisor?.first_name || ''} ${supervisor?.last_name || ''} ${supervisor?.ext_name || ''}`.trim();
        industryPartner.immediate_supervisor.full_name = supervisorFullName;

        this.dataSource.data = industryPartner.internship_applications.map((student: any) => {
          return {
            full_name: student.user.first_name + " " + student.user.last_name,
            ...student
          }
        })
        console.log(industryPartner.internship_applications)
      },
      error => {
        console.error(error)
        if(error.status === 404) {
          this.router.navigate(['/main/industrypartners/list'])
        }
      }
    )
  }

}
