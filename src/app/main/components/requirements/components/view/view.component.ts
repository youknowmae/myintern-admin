import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../../../../services/data.service';
import { PdfPreviewComponent } from '../../../../../components/pdf-preview/pdf-preview.component';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { GeneralService } from '../../../../../services/general.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss'
})
export class ViewComponent {
  applicationDetails: any

  constructor(
    private ds: DataService,
    private route: ActivatedRoute,
    private dialogRef: MatDialog,
    private gs: GeneralService
  ) {
    this.route.paramMap.subscribe(params => {
      let id = params.get('id')

      if(!id) {
        return
      }
      
      this.getApplicationDetails(parseInt(id))
    });
  }

  getApplicationDetails(id: number) {
    this.ds.get('applications/', id).subscribe(
      applicationDetails=> {
        this.applicationDetails = applicationDetails
        console.log(this.applicationDetails)
      },
      error => {
        console.error(error)
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
        // this.apply()
        this.ds.post('application/accept/', this.applicationDetails.id, null).subscribe(
          response => {
            this.gs.successAlert('Approved!', response.message)
            this.applicationDetails.status = 3
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
        this.ds.post('application/reject/', this.applicationDetails.id, null).subscribe(
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
}
