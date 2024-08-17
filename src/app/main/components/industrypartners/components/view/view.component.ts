import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../../../../services/data.service';
import { MatDialog } from '@angular/material/dialog';
import { IndustryPartner } from '../../../../../model/industry-partner.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss'
})
export class ViewComponent {
  industryPartner: IndustryPartner = <IndustryPartner>{}
  id: number | null = null
  
  constructor(
    private ds: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private dialogRef: MatDialog,
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
    this.ds.get('industryPartners/', id).subscribe(
      industryPartner => {
        this.industryPartner = industryPartner
        console.log(this.industryPartner)
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
