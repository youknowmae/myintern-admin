import { Component } from '@angular/core';
import { ViewComponent } from './components/view/view.component';
import { MatDialog } from '@angular/material/dialog';
import { AddAnnouncementComponent } from './components/add-announcement/add-announcement.component';

@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.component.html',
  styleUrl: './announcement.component.scss'
})
export class AnnouncementComponent {

  constructor(
    private dialogRef: MatDialog
  ) {

  }

  viewAnnouncement() {
    this.dialogRef.open(ViewComponent, {
      disableClose: true       
    })
  }

  addAnnouncement() {
    this.dialogRef.open(AddAnnouncementComponent, {
      disableClose: true 
    })
  }
}
