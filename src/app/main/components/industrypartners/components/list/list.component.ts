import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from '../../../../../services/data.service';
import { AddIndustryPartnerComponent } from '../add-industry-partner/add-industry-partner.component';
import { IndustryPartner } from '../../../../../model/industry-partner.model';
import { EditIndustryPartnerComponent } from '../edit-industry-partner/edit-industry-partner.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  industryPartners: IndustryPartner[] = []
  isLoading: boolean = false

  constructor(
    private dialogRef: MatDialog,
    private ds: DataService
  ) {

  }

  ngOnInit() {
    this.getIndustryPartners()
  }

  getIndustryPartners() {
    this.ds.get('industryPartners').subscribe(
      industryPartners => {
        this.industryPartners = industryPartners
        console.log(industryPartners)
      },
      error => {
        console.error(error)
      }
    )
  }

  addIndustryPartner() {
    var modal = this.dialogRef.open(AddIndustryPartnerComponent, {
      disableClose: true       
    })

    modal.afterClosed().subscribe((result) => {
      console.log(result)
      if (!result) {
        return
      }
      
      this.industryPartners.unshift(result)
    });
  }

  editIndustryPartner(id: number) {
    if(this.isLoading === true) {
      return
    }

    this.isLoading = true

    this.ds.get('industryPartners/', id).subscribe(
      (industryPartner: IndustryPartner) => {
        var modal = this.dialogRef.open(EditIndustryPartnerComponent, {
          data: industryPartner,
          disableClose: true
        })
        
        modal.afterClosed().subscribe((result) => {
          console.log(result)

          if (!result) {
            return
          }
          
          this.industryPartners = this.industryPartners.map((announcement: any) =>
            announcement.id === result.id ? result : announcement
          );
        });
      },
      error => {
        console.error(error);
        this.isLoading = false
      },
      () => {
        this.isLoading = false
      }
    )
  }

  deleteIndustryPartner(id: number) {
    this.ds.delete('industryPartners/', id).subscribe(
      result => {
        console.log(result)
        this.industryPartners = this.industryPartners.filter((announcement: any) => announcement.id !== id);
        Swal.fire({
          title: 'Success!',
          text: 'Announcement has been deleted.',
          icon: 'success',
          confirmButtonText: 'Close',
          confirmButtonColor: '#777777',
        });
      },
      error => {
        console.error(error)
        Swal.fire({
          title: 'Error!',
          text: 'Something went wrong. Please try again later.',
          icon: 'error',
          confirmButtonText: 'Close',
          confirmButtonColor: '#777777',
        });
      })
  }

  deleteConfirmation(id: number) {
    Swal.fire({
      title: 'Delete?',
      text: 'Are you sure you want to delete this industry partner?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#AB0E0E',
      cancelButtonColor: '#777777',
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteIndustryPartner(id);
      }
    });
  }
}
