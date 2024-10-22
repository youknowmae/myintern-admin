import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../../../../services/data.service';
import { MatDialog } from '@angular/material/dialog';
import { IndustryPartner } from '../../../../../model/industry-partner.model';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../../../../../services/user.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss'
})
export class ViewComponent {
  displayedColumns: string[] = ['name', 'student_number', 'course', 'year_level'];
  
  dataSource: any = new MatTableDataSource<any>();

  industryPartner: any
  
  constructor(
    private router: Router,
    private us: UserService
  ) {
   this.getIndustryPartner()
  }
  
  getIndustryPartner() {
    let industryPartner = this.us.getIndustryPartner()

    if(!industryPartner) {
      this.router.navigate(['main/industrypartners/list'])
    }

    this.industryPartner = industryPartner

    this.dataSource.data = this.industryPartner.internship_applications

    console.log(this.dataSource.data)
      
  }

}
