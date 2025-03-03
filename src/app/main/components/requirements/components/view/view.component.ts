import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../../../../services/data.service';
import { PdfPreviewComponent } from '../../../../../components/pdf-preview/pdf-preview.component';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { GeneralService } from '../../../../../services/general.service';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver'
import { UserService } from '../../../../../services/user.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss'
})
export class ViewComponent {
  id: any 
  
  isLoading: boolean = true
  applicationDetails: any
  comments: any = []
  user: any

  commentValue: string = ''
  isSubmitting: boolean = false 

  constructor(
    private ds: DataService,
    private route: ActivatedRoute,
    private dialogRef: MatDialog,
    private gs: GeneralService,
    private us: UserService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.getApplicationDetails()

    this.user = this.us.getUser()
  }

  getApplicationDetails() {
        
    let id = this.us.getStudentApplication()

    this.ds.get('adviser/applications/', id).subscribe(
          applicationDetails=> {
            this.isSubmitting = false
            let industryPartner = applicationDetails.industry_partner
            let companyHead = industryPartner.company_head;
            let fullName = `${companyHead?.first_name || ''} ${companyHead?.last_name || ''} ${companyHead?.ext_name || ''}`.trim();
            applicationDetails.industry_partner.company_head.full_name = fullName;
    
            let supervisor = industryPartner.immediate_supervisor;
            let supervisorFullName = `${supervisor?.first_name || ''} ${supervisor?.last_name || ''} ${supervisor?.ext_name || ''}`.trim();
            applicationDetails.industry_partner.immediate_supervisor.full_name = supervisorFullName;
    
            let full_address = `${industryPartner?.street || ''} ${industryPartner?.barangay || ''}, ${industryPartner?.municipality || ''}`
            industryPartner.full_address = full_address

            if(applicationDetails.application_endorsement)
              applicationDetails.application_documents.unshift(applicationDetails.application_endorsement)

            if(applicationDetails.status == 1) {
              applicationDetails.status_text = 'Cancelled'
            }
            else if(applicationDetails.status == 2) {
              applicationDetails.status_text = 'Not Approved (Adviser)'
            }
            else if(applicationDetails.status == 3) {
              applicationDetails.status_text = 'Approved'
            }
            else if(applicationDetails.status == 4) {
              applicationDetails.status_text = 'Not Approved (Company)'
            }
            else if (
              applicationDetails.status == 5 ||
              applicationDetails.status == 6 ||
              applicationDetails.status == 7
            ) {
              // applicationDetails.status = 5
              applicationDetails.status_text = 'For Interview';
            }
            else if (applicationDetails.status == 8) {
              // applicationDetails.status = 6
              applicationDetails.status_text = 'Accepted';
            }
            
            console.log(applicationDetails)

            this.applicationDetails = applicationDetails
    
            this.comments = this.applicationDetails.application_comments 

            // .map((applicationDetails: any) => {
            //   if(applicationDetails.supervisor) {
            //     let name = JSON.parse(applicationDetails.supervisor.immediate_supervisor)
        
            //     applicationDetails = {...name, image: applicationDetails.supervisor.image, message: applicationDetails.message}
            //   }
        
            //   if(applicationDetails.user) {
            //     applicationDetails = {...applicationDetails.user, message: applicationDetails.message}
            //   }
        
            //   return applicationDetails
            // });            
        
            this.isLoading = false
            console.log(this.comments)
    
          },
          error => {
            this.isLoading = false
            console.error(error)
            if(error.status === 404) {
              this.router.navigate(['main/requirements/list'])
              this.gs.errorAlert('Not Found!', 'Application not found.')
            }
            else {
              this.gs.errorAlert('Oops!', 'Something went wrong. Please try again later.')
            }
          }
        )

        
  }

  previewDocument(file: any) {
    this.dialogRef.open(PdfPreviewComponent, {
      data: { name: file.file_name, pdf: file.file_location},
      disableClose: true
    })
  }

  approveApplication() {
    Swal.fire({
      title: "Approve?",
      text: "Are you sure you want to approve this application?",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
      confirmButtonColor: "#4f6f52",
      cancelButtonColor: "#777777",
    }).then((result) => {
      if (result.isConfirmed) {
        this.approve()
      }
    });
  }

  approve() {
    if(this.isSubmitting) {
      return
    }

    this.isSubmitting = true

    this.ds.post('adviser/applications/accept/', this.applicationDetails.id, null).subscribe(
      response => {
        this.isSubmitting = false
        this.gs.successAlert('Approved!', response.message)
        this.applicationDetails.status = 3
        this.applicationDetails.status_text = 'Approved'
        this.applicationDetails.application_documents.unshift(response.data)

        this.generateEndorsement()
      },
      error => {
        this.isSubmitting = false
        console.error(error)
      }
    )
    console.log(this.applicationDetails)
  }

  rejectApplication() {
    Swal.fire({
      title: "Not Approved?",
      text: "Are you sure you want to decline this application?",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
      confirmButtonColor: "#4f6f52",
      cancelButtonColor: "#777777",
    }).then((result) => {
      if (result.isConfirmed) {
       this.reject()
      }
    });
  }

  reject() {
    if(this.isSubmitting) {
      return
    }

    this.isSubmitting = true

    this.ds.post('adviser/applications/reject/', this.applicationDetails.id, null).subscribe(
      response => {
        this.isSubmitting = false
        this.gs.successAlert('Not Approved!', response.message)
        this.applicationDetails.status = 2
        this.applicationDetails.status_text = 'Not Approved (Adviser)'
      },
      error => {
        this.isSubmitting = false
        console.error(error)
      }
    )
    console.log(this.applicationDetails)
  }

  comment() {
    if(this.isSubmitting) {
      return
    }

    this.isSubmitting = true 

    let payload = new FormData

    payload.append('message', this.commentValue)

    
    this.ds.post('adviser/applications/comment/', this.applicationDetails.id, payload).subscribe(
      response => {
        console.log(response)
        this.commentValue = ''
        this.gs.successToastAlert(response.message)
        this.isSubmitting = false

        this.comments.unshift(response.data)
        // this.getApplicationDetails(this.applicationDetails.id)
      },
      error => {
        console.error(error)
        this.isSubmitting = false
      }
    )
  }

  isDownloading: boolean = false
  generateEndorsement() {
    this.ds.download('adviser/applications/download/endorsement/', this.applicationDetails.id).subscribe(
      (response: Blob) => {
        saveAs(response, 'GCCCS.ENDORSEMENT.LETTER.' + this.applicationDetails.user.first_name + '.' + this.applicationDetails.user.last_name + '.pdf');
        this.isDownloading = false

        console.log(response)
      },
      error => {
        this.gs.errorAlert('Error!', 'Something went wrong. Please try again later.')
        console.error(error)
        this.isDownloading = false

      }
    )
  }

  formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    return formatDate(date, 'MMM d, h:mm a', 'en-US');


    // const now = new Date();
    // // console.log(now)
    // const date = new Date(timestamp);
  
    // const isToday = now.toDateString() === date.toDateString();
  
    // if (isToday) {
    //   return formatDate(date, 'h:mm a', 'en-US');
    // } 
    //  else {
    //   return formatDate(date, 'MMM d, h:mm a', 'en-US');
    // }
  }
  

  
}
