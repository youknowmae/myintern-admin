import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../../../../services/data.service';
import Swal from 'sweetalert2';
import { UserService } from '../../../../../services/user.service';

@Component({
  selector: 'app-add-announcement',
  templateUrl: './add-announcement.component.html',
  styleUrl: './add-announcement.component.scss',
})
export class AddAnnouncementComponent {
  file: any = null;
  isSubmitting = false;

  formDetails: FormGroup;

  constructor(
    private ref: MatDialogRef<AddAnnouncementComponent>,
    private fb: FormBuilder,
    private ds: DataService,
    private us: UserService
  ) {
    const today = new Date();

    this.formDetails = this.fb.group({
      title: [null, [Validators.required, Validators.maxLength(128)]],
      description: [null, [Validators.required, Validators.maxLength(2048)]],
      date: [null],
    });

    this.formDetails.patchValue({
      date: today.toISOString().split('T')[0],
    });
  }

  uploadFile(event: any) {
    this.file = event.target.files[0];
  }

  closePopup() {
    Swal.fire({
      title: 'Cancel',
      text: 'Are you sure you want to cancel adding announcement?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      confirmButtonColor: '#AB0E0E',
      cancelButtonColor: '#777777',
    }).then((result) => {
      if (result.isConfirmed) {
        this.ref.close(null);

        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2500,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });
        Toast.fire({
          icon: 'error',
          title: 'Changes not saved.',
        });
      }
    });
  }

  submit() {
    Swal.fire({
      title: 'Post New Announcement',
      text: 'Are you sure you want to post this announcement?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#4f6f52',
      cancelButtonColor: '#777777',
    }).then((result) => {
      if (result.isConfirmed) {
        this.createAnnouncement();
      }
    });
  }

  createAnnouncement() {
    if (this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;

    var formDetails = this.formDetails.value;

    var payload = new FormData();
    const data = {
      title: formDetails.title,
      description: formDetails.description,
    };
    payload.append('payload', this.us.encryptPayload(data));

    if (this.file) payload.append('image', this.file);

    this.ds.post('adviser/announcements', '', payload).subscribe(
      (result) => {
        this.isSubmitting = false;
        Swal.fire({
          title: 'Success!',
          text: result.message,
          icon: 'success',
        });
        this.ref.close(result.data);
      },
      (error) => {
        this.isSubmitting = false;
        if (error.status == 422) {
          Swal.fire({
            title: 'error!',
            text: 'Invalid input.',
            icon: 'error',
          });
        } else {
          Swal.fire({
            title: 'error!',
            text: 'Something went wrong, please try again later.',
            icon: 'error',
          });
        }
      }
    );
  }
}
