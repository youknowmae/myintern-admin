import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from '../../../../../services/data.service';
import { AddIndustryPartnerComponent } from '../add-industry-partner/add-industry-partner.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  industryPartners: any = []
  constructor(
    private dialogRef: MatDialog,
    private ds: DataService
  ) {

  }

  ngOnInit() {
    this.getIndustryPartners()
  }

  getIndustryPartners() {
    this.ds.get('industryPartners').subscribe(
      industryPartners => {
        this.industryPartners = industryPartners
        console.log(industryPartners)
      },
      error => {

      }
    )
  }

  addIndustryPartner() {
    var modal = this.dialogRef.open(AddIndustryPartnerComponent, {
      disableClose: true       
    })

    modal.afterClosed().subscribe((result) => {
      console.log(result)
      if (!result) {
        return
      }
      
      this.industryPartners.unshift(result)
    });
  }

}
