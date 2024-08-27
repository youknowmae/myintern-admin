import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../../../../services/data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-industry-partner',
  templateUrl: './edit-industry-partner.component.html',
  styleUrl: './edit-industry-partner.component.scss'
})
export class EditIndustryPartnerComponent {
  file: any = null

  formDetails: FormGroup = this.fb.group({
    company_name: [null, [Validators.required, Validators.maxLength(64)]],
    description: [null, [Validators.required, Validators.maxLength(1024)]],

    company_head: [null, [Validators.required, Validators.maxLength(128)]],
    head_position: [null, [Validators.required, Validators.maxLength(64)]],
    immediate_supervisor: [null, [Validators.required, Validators.maxLength(128)]],
    supervisor_position: [null, [Validators.required, Validators.maxLength(64)]],

    region: ["III", [Validators.required, Validators.maxLength(32)]],
    province: ["Zambales", [Validators.required, Validators.maxLength(32)]],
    municipality: [null, [Validators.required, Validators.maxLength(32)]],
    barangay: [null, [Validators.required, Validators.maxLength(32)]],
    street: [null, [Validators.required, Validators.maxLength(32)]],
    zip_code: [null, [Validators.required, Validators.pattern('[0-9]{4}')]],

    telephone_number: [null, [Validators.pattern('(09)[0-9]{9}')]],
    mobile_number: [null, [Validators.required, Validators.pattern('(09)[0-9]{9}')]],
    fax_number: [null, [Validators.pattern('(09)[0-9]{9}')]],
    email: [null, [Validators.required, Validators.email]],
    website: [null, [Validators.maxLength(128)]],
  })

  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ref: MatDialogRef<EditIndustryPartnerComponent>,
    private fb: FormBuilder,
    private dataService: DataService
  ) {
    const today = new Date();
    this.formDetails.patchValue({
      date: today.toISOString().split('T')[0]
    })
  }

  ngOnInit() {
    this.formDetails.patchValue({
      company_name: this.data.company_name,
      description: this.data.description,

      company_head: this.data.company_head,
      head_position: this.data.head_position,
      immediate_supervisor: this.data.immediate_supervisor,
      supervisor_position: this.data.supervisor_position,

      region: this.data.region,
      province: this.data.province,
      municipality: this.data.municipality,
      barangay: this.data.barangay,
      street: this.data.street,
      zip_code: this.data.zip_code,

      telephone_number: this.data.telephone_number,
      mobile_number: this.data.mobile_number,
      fax_number: this.data.fax_number,
      email: this.data.email,
      website: this.data.website
    })

    console.log(this.formDetails)
  }
  
  uploadFile(event: any) {
    this.file = event.target.files[0];
  }

  closepopup() {
    Swal.fire({
      title: "Cancel",
      text: "Are you sure you want to cancel editing industry partner??",
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
      text: "Are you sure you want to update this industry partner?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
      confirmButtonColor: "#4f6f52",
      cancelButtonColor: "#777777",
    }).then((result) => {
      if (result.isConfirmed) {
        this.update()
      }
    });
  }

  update() {
    var payload = new FormData();
    
    Object.entries(this.formDetails.value as { [key: string]: string | null})
          .forEach(([key, value]) =>{
            if(value)
              payload.append(key, value)
            else
              payload.append(key, '')

          })

    if(this.file)
      payload.append('image', this.file);
    
    this.dataService.post('industryPartners/', this.data.id, payload).subscribe(
      result => {
        Swal.fire({
          title: "Updated!",
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
