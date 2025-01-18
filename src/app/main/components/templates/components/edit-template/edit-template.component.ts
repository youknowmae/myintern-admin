import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../../../../services/data.service';
import Swal from 'sweetalert2';
import { GeneralService } from '../../../../../services/general.service';

@Component({
  selector: 'app-edit-template',
  templateUrl: './edit-template.component.html',
  styleUrl: './edit-template.component.scss'
})
export class EditTemplateComponent {
  docxFile: any = null
  pdfFile: any = null

  formDetails: FormGroup = this.fb.group({
    name: [null, [Validators.required, Validators.maxLength(128)]]
  })

  isSubmitting: boolean = false
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ref: MatDialogRef<EditTemplateComponent>,
    private fb: FormBuilder,
    private gs: GeneralService,
    private ds: DataService
  ) {
  }
  
  ngOnInit() {
    this.formDetails.patchValue({
      name: this.data.name, 
    })
  }
  
  uploadDocxFile(event: any) {
    this.docxFile = event.target.files[0];
  }

  uploadPdfFile(event: any) {
    this.pdfFile = event.target.files[0];
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
        this.gs.errorToastAlert('Changes not saved.')
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

    var payload = new FormData();
    payload.append('name', formDetails.name);

    if(this.docxFile) {
      payload.append('docx', this.docxFile);
    }

    if(this.pdfFile) {
      payload.append('pdf', this.pdfFile);
    }

    
    if(this.isSubmitting) {
      return
    }

    this.isSubmitting = true
    
    this.ds.post('adviser/templates/', this.data.id, payload).subscribe(
      result => {
        this.isSubmitting = false
        this.gs.successAlert("Success!", result.message)
        this.ref.close(result.data);
        
      },
      error => {
        this.isSubmitting = false
        // console.error(error)
        if (error.status == 422) {
          this.gs.errorAlert("Error!", "Invalid input.")
        }
        else {
          this.gs.errorAlert("Oops!", "Something went wrong, please try again later.")
        }
      }
    )
  }

}
