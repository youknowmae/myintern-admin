import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../../../../services/data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss'
})
export class ViewComponent {
  file: any = null
  formDetails: FormGroup 

  isSubmitting: boolean = false
    
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ds: DataService,
    private ref: MatDialogRef<ViewComponent>,
    private fb: FormBuilder
  ) { 
    this.formDetails = this.fb.group({
      title: [null, Validators.required],
      description: [null, Validators.required],
      date: [null]
    })
  }

  ngOnInit() {
    this.formDetails.patchValue({
      title: this.data.title, 
      description: this.data.description,
      date: this.data.created_at
    })
  }
  
  uploadFile(event: any) {
    this.file = event.target.files[0];
  }

  closepopup() {
    Swal.fire({
      title: "Cancel",
      text: "Are you sure you want to cancel editing announcement?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      confirmButtonColor: "#AB0E0E",
      cancelButtonColor: "#777777",
    }).then((result) => {
      if (result.isConfirmed) {
        this.ref.close(null);

        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2500,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "error",
          title: "Changes not saved."
        });
      }
    });
  }

  submit() {
    Swal.fire({
      title: "Update Announcement?",
      text: "Are you sure you want to update this announcement.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
      confirmButtonColor: "#4f6f52",
      cancelButtonColor: "#777777",
    }).then((result) => {
      if (result.isConfirmed) {
        this.updateAnnouncement()
      }
    });
  }

  updateAnnouncement() {
    if(this.isSubmitting) {
      return
    }

    this.isSubmitting = true

    var formDetails = this.formDetails.value

    var payload = new FormData();
    payload.append('title', formDetails.title);
    payload.append('description', formDetails.description);

    if(this.file)
      payload.append('image', this.file);
    

    this.ds.post('adviser/announcements/', this.data.id, payload).subscribe(
      result => {
        this.isSubmitting = false
        Swal.fire({
          title: "Success!",
          text: result.message,
          icon: "success",
        });
        this.ref.close(result.data)
      },
      error => {
        this.isSubmitting = false
        console.error(error)
        if (error.status == 422) {
          Swal.fire({
            title: "error!",
            text: "Invalid input.",
            icon: "error",
          });
        }
        else {
          Swal.fire({
            title: "error!",
            text: "Something went wrong, please try again later.",
            icon: "error",
          });
        }
      }
    )

  }
}
