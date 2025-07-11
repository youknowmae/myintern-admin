import { Component } from '@angular/core';
import { EditAnnouncementComponent } from './components/edit-announcement/edit-announcement.component';
import { MatDialog } from '@angular/material/dialog';
import { AddAnnouncementComponent } from './components/add-announcement/add-announcement.component';


import { DataService } from '../../../services/data.service';
import { announcement } from '../../../model/announcement.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.component.html',
  styleUrl: './announcement.component.scss'
})
export class AnnouncementComponent {
  announcements: announcement[] = []
  isLoading: boolean = true

  isSubmitting: boolean = false

  constructor(
    private dialogRef: MatDialog,
    private ds: DataService
  ) {
  }

  ngOnInit() {
    this.getAnnouncements()
  }

  getAnnouncements() {
    this.ds.get('adviser/announcements').subscribe(
      announcements => {
        this.announcements = announcements
        this.isLoading = false
      },
      error => {
        this.isLoading = false
      }
    )
  }

  editAnnouncement(announcement: announcement) {
    var modal = this.dialogRef.open(EditAnnouncementComponent, {
      data: announcement,
      disableClose: true       
    })

    modal.afterClosed().subscribe((result) => {
      if (!result) {
        return
      }
      
      this.announcements = this.announcements.map((announcement: any) =>
        announcement.id === result.id ? result : announcement
      );
    });
  }

  addAnnouncement() {
    var modal = this.dialogRef.open(AddAnnouncementComponent, {
      disableClose: true 
    })
    
    modal.afterClosed().subscribe((result) => {
      if (!result) {
        return
      }
      
      this.announcements.unshift(result)
    });
  }

  deleteAnnouncement(id: number) {
    if(this.isSubmitting) {
      return
    }

    this.isSubmitting = true

    this.ds.get(`adviser/announcements/${id}/delete`).subscribe(
      result => {
        this.isSubmitting = false
        this.announcements = this.announcements.filter((announcement: any) => announcement.id !== id);
        Swal.fire({
          title: 'Success!',
          text: 'Announcement has been deleted.',
          icon: 'success',
          confirmButtonText: 'Close',
          confirmButtonColor: '#777777',
        });
      },
      error => {
        this.isSubmitting = false
        Swal.fire({
          title: 'Error!',
          text: 'Something went wrong. Please try again later.',
          icon: 'error',
          confirmButtonText: 'Close',
          confirmButtonColor: '#777777',
        });
      })
  }

  deleteConfirmation(id: number) {
    Swal.fire({
      title: 'Delete?',
      text: 'Are you sure you want to delete this announcement?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#AB0E0E',
      cancelButtonColor: '#777777',
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteAnnouncement(id);
      }
    });
  }
}
