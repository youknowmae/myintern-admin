import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../../../../services/data.service';
import { PdfPreviewComponent } from '../../../../../components/pdf-preview/pdf-preview.component';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { GeneralService } from '../../../../../services/general.service';
import { response } from 'express';

import { saveAs } from 'file-saver'
import { UserService } from '../../../../../services/user.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss'
})
export class ViewComponent {
  id: any 
  applicationDetails: any
  comments: any = []

  commentValue: string = ''
  isCommenting: boolean = false 

  constructor(
    private ds: DataService,
    private route: ActivatedRoute,
    private dialogRef: MatDialog,
    private gs: GeneralService,
    private us: UserService
  ) {
  }

  ngOnInit() {
    this.getApplicationDetails()
  }

  getApplicationDetails() {
    this.applicationDetails = this.us.getStudentApplication()

    this.comments = this.applicationDetails.application_comments

    console.log(this.comments)
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
        this.ds.post('adviser/application/accept/', this.applicationDetails.id, null).subscribe(
          response => {
            this.gs.successAlert('Approved!', response.message)
            this.applicationDetails.status = 3

            this.generateEndorsement()
          },
          error => {
            console.error(error)
          }
        )
        console.log(this.applicationDetails)
      }
    });
  }

  rejectApplication() {
    Swal.fire({
      title: "Reject?",
      text: "Are you sure you want to reject this application?",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
      confirmButtonColor: "#4f6f52",
      cancelButtonColor: "#777777",
    }).then((result) => {
      if (result.isConfirmed) {
        // this.apply()
        this.ds.post('adviser/application/reject/', this.applicationDetails.id, null).subscribe(
          response => {
            this.gs.successAlert('Rejected!', response.message)
            this.applicationDetails.status = 2
          },
          error => {
            console.error(error)
          }
        )
        console.log(this.applicationDetails)
      }
    });
  }

  comment() {
    if(this.isCommenting) {
      return
    }

    this.isCommenting = true 

    let payload = new FormData

    payload.append('message', this.commentValue)

    
    this.ds.post('adviser/application/comment/', this.applicationDetails.id, payload).subscribe(
      response => {
        console.log(response)
        this.commentValue = ''
        this.gs.successToastAlert(response.message)
        this.isCommenting = false

        this.comments.unshift(response.data)
        // this.getApplicationDetails(this.applicationDetails.id)
      },
      error => {
        console.error(error)
        this.isCommenting = false
      }
    )
  }

  isDownloading: boolean = false
  generateEndorsement() {
    this.ds.download('adviser/generate/endorsement/', this.applicationDetails.id).subscribe(
      (response: Blob) => {
        saveAs(response, 'GCCCS.ENDORSEMENT.LETTER.' + this.applicationDetails.user.first_name + '.' + this.applicationDetails.user.last_name + '.pdf');
        this.isDownloading = false

        console.log(response)
        
        this.ds.get('adviser/application/endorsement/', this.applicationDetails.id).subscribe(
          response => {
            console.log(response)
            if(response)
              this.applicationDetails.application_documents.unshift(response)
          },
          error => {
            console.error(error)
          }
        )
        
      },
      error => {
        this.gs.errorAlert('Error!', 'Something went wrong. Please try again later.')
        console.error(error)
        this.isDownloading = false

      }
    )
  }

  
}
