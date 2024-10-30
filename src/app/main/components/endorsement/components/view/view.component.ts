import { Component } from '@angular/core';
import { UserService } from '../../../../../services/user.service';
import Swal from 'sweetalert2';
import { GeneralService } from '../../../../../services/general.service';
import { DataService } from '../../../../../services/data.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss'
})
export class ViewComponent {
  industryPartner: any

  constructor(
    private us: UserService,
    private gs: GeneralService,
    private ds: DataService
  ) {}

  ngOnInit() {
    this.getRequestDetails()
  }

  getRequestDetails() {
    this.industryPartner = this.us.getCompanyEndorsement()
  }

  reject() {
    Swal.fire({
      title: "Reject?",
      text: "Are you sure you want to reject this company endorsement?",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
      confirmButtonColor: "#4f6f52",
      cancelButtonColor: "#777777",
    }).then((result) => {
      if (result.isConfirmed) {
        // this.apply()
        this.ds.post('adviser/request/industryPartners/reject/', this.industryPartner.id, null).subscribe(
          response => {
            this.gs.successAlert(response.title, response.message)
            this.industryPartner.status = 1
          },
          error => {
            console.error(error)
            if(error.status === 409) {
              this.gs.errorAlert(error.error.title, error.error.message)
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
        // this.apply()
        this.ds.get('adviser/request/industryPartners/verify/', this.industryPartner.id).subscribe(
          response => {
            this.gs.successAlert(response.title, response.message)
            this.industryPartner.status = 2
          },
          error => {
            console.error(error)
            if(error.status === 409) {
              this.gs.errorAlert(error.error.title, error.error.message)
            }
            else {
              this.gs.errorAlert("Oops!", "Something went wrong. Please try again later.")
            }
          }
        )
      }
    });
  }
}
