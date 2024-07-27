import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../../../../services/data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-template',
  templateUrl: './edit-template.component.html',
  styleUrl: './edit-template.component.scss'
})
export class EditTemplateComponent {
  file: any = null

  formDetails: FormGroup = this.fb.group({
    name: [null, [Validators.required, Validators.maxLength(128)]]
  })

  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ref: MatDialogRef<EditTemplateComponent>,
    private fb: FormBuilder,
    private dataService: DataService
  ) {
  }
  
  ngOnInit() {
    this.formDetails.patchValue({
      name: this.data.name, 
    })
  }
  
  uploadFile(event: any) {
    this.file = event.target.files[0];
  }

  closepopup() {
    Swal.fire({
      title: "Cancel",
      text: "Are you sure you want to cancel editing template?",
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
      title: "Update?",
      text: "Are you sure you want to update this template?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
      confirmButtonColor: "#4f6f52",
      cancelButtonColor: "#777777",
    }).then((result) => {
      if (result.isConfirmed) {
        this.createTemplate()
      }
    });
  }

  createTemplate() {
    var formDetails = this.formDetails.value

    console.log(formDetails)

    var payload = new FormData();
    payload.append('name', formDetails.name);

    if(this.file)
      payload.append('docx', this.file);
    
    this.dataService.post('templates/', this.data.id, payload).subscribe(
      result => {
        Swal.fire({
          title: "Success!",
          text: result.message,
          icon: "success",
        });
        this.ref.close(result.data);
        
      },
      error => {
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
