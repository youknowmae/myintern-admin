import { Component } from '@angular/core';
import { UserService } from '../../../../../services/user.service';
import Swal from 'sweetalert2';
import { GeneralService } from '../../../../../services/general.service';
import { DataService } from '../../../../../services/data.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss'
})
export class ViewComponent {
  industryPartner: any
  file: any
  filePreview: any
  isImage: boolean = false

  isSubmitting: boolean = false

  constructor(
    private us: UserService,
    private gs: GeneralService,
    private ds: DataService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {}

  ngOnInit() {
    this.getRequestDetails()
  }

  getRequestDetails() {
    this.industryPartner = this.us.getCompanyEndorsement()
  }

  uploadFile(event: any) {
    this.file = event.target.files[0];

    let file = this.file

    const fileType = file.type;

      if (fileType.startsWith('image/')) {
        this.isImage = true;
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.filePreview = e.target.result;
        };
        reader.readAsDataURL(file);
      } 

      else if (fileType === 'application/pdf') {
        this.isImage = false;
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.filePreview = this.sanitizer.bypassSecurityTrustResourceUrl(e.target.result +  '#toolbar=0&navpanes=0&scrollbar=0');
        };
        reader.readAsDataURL(file);
      } 

    
    
  }

  reject() {
    Swal.fire({
      // title: "Reject?",
      // text: "Are you sure you want to reject this company endorsement?",
      
      title: "Please state the reason for rejection?",
      input: "text",
      inputAttributes: {
        autocapitalize: "off"
      },
      showCancelButton: true,
      confirmButtonText: 'Reject',
      cancelButtonText: 'Cancel',
      confirmButtonColor: "#ff4141",
      cancelButtonColor: "#777777",
    }).then((result) => {
      if (result.isConfirmed) {
        const formData = new FormData
        formData.append('remarks', result.value)
        this.ds.post('adviser/request/industryPartners/reject/', this.industryPartner.id, formData).subscribe(
          response => {
            this.gs.successAlert(response.title, response.message)
            this.industryPartner.status = 1
          },
          error => {
            console.error(error)
            if(error.status === 409) {
              this.gs.errorAlert(error.error.title, error.error.message)
            }
            else if(error.status === 422) {
              this.gs.errorAlert(error.error.title, error.error.error)
            }
            else {
              this.gs.errorAlert("Oops!", "Something went wrong. Please try again later.")
            }
          }
        )
      }
    });
  }

  verify() {
    Swal.fire({
      title: "Verify?",
      text: "Are you sure you want to verify this company endorsement?",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
      confirmButtonColor: "#4f6f52",
      cancelButtonColor: "#777777",
    }).then((result) => {
      if (result.isConfirmed) {
        const payload = new FormData
        if(this.file) {
          console.log(this.file)
          payload.append('mou', this.file)
        }
        
        if(this.isSubmitting) {
          return
        }

        this.isSubmitting = true

        this.ds.post('adviser/request/industryPartners/verify/', this.industryPartner.id, payload).subscribe(
          response => {
            
            this.isSubmitting = false
            this.router.navigate(['main/endorsement/list'])
            this.gs.successAlert(response.title, response.message)
            this.industryPartner.status = 2
          },
          error => {
            this.isSubmitting = false
            console.error(error)
            if(error.status === 409) {
              this.gs.errorAlert(error.error.title, error.error.message)
            }
            else if(error.status === 422) {
              this.gs.errorAlert(error.error.title, error.error.error)
            }
            else {
              this.gs.errorAlert("Oops!", "Something went wrong. Please try again later.")
            }
          }
        )
      }
    });
  }

  sanitizeUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url)
  }
}
