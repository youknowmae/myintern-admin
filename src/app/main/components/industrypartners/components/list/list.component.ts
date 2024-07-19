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
  // announcements: announcement[] = []
  constructor(
    private dialogRef: MatDialog,
    private ds: DataService
  ) {

  }

  addIndustryPartner() {
    var modal = this.dialogRef.open(AddIndustryPartnerComponent, {
      // data: announcement,
      disableClose: true       
    })
  }

}
