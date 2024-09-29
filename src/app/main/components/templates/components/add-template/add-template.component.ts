import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../../../../services/data.service';
import Swal from 'sweetalert2';
import { GeneralService } from '../../../../../services/general.service';

@Component({
  selector: 'app-add-template',
  templateUrl: './add-template.component.html',
  styleUrl: './add-template.component.scss'
})
export class AddTemplateComponent {
  docxFile: any = null
  pdfFile: any = null

  formDetails: FormGroup = this.fb.group({
    name: [null, [Validators.required, Validators.maxLength(128)]]
  })

  
  constructor(
    private ref: MatDialogRef<AddTemplateComponent>,
    private fb: FormBuilder,
    private gs: GeneralService,
    private ds: DataService
  ) {
  }
  
  uploadDocxFile(event: any) {
    console.log(event.target.files[0])
    this.docxFile = event.target.files[0];
  }

  uploadPdfFile(event: any) {
    this.pdfFile = event.target.files[0];
  }

  closepopup() {
    Swal.fire({
      title: "Cancel",
      text: "Are you sure you want to cancel adding template?",
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
      title: "Create?",
      text: "Are you sure you want to create this template?",
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

    if(!this.docxFile) {
      this.gs.errorAlert('Error', 'Docx file is required.')
      return
    }

    if(!this.pdfFile) {
      this.gs.errorAlert('Error', 'Pdf file is required.')
      return
    }

    payload.append('docx', this.docxFile);
    payload.append('pdf', this.pdfFile);
    
    this.ds.post('adviser/templates', '', payload).subscribe(
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
          this.gs.errorAlert('Error!', 'Invalid input.')
        }
        else {
          this.gs.errorAlert('Error!', 'Something went wrong, please try again later.')
        }
      }
    )
  }

}
