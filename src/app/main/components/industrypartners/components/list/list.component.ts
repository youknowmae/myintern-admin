import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from '../../../../../services/data.service';
import { AddIndustryPartnerComponent } from '../add-industry-partner/add-industry-partner.component';
import { IndustryPartner } from '../../../../../model/industry-partner.model';
import { EditIndustryPartnerComponent } from '../edit-industry-partner/edit-industry-partner.component';
import Swal from 'sweetalert2';
import { GeneralService } from '../../../../../services/general.service';
import { UserService } from '../../../../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  industryPartners: IndustryPartner[] = []
  filteredIndustryPartners: any = []
  isLoading: boolean = false

  constructor(
    private us: UserService,
    private router: Router,
    private ds: DataService,
    private gs: GeneralService
  ) {

  }

  ngOnInit() {
    this.getIndustryPartners()
  }

  search(value: string) {
    value = value.toLowerCase()
    this.filteredIndustryPartners = this.industryPartners.filter(
      (item: IndustryPartner) => {
        return item.company_name.toLowerCase().includes(value) ||
          item.municipality.toLowerCase().includes(value)
      }
    )
  }

  getIndustryPartners() {
    this.ds.get('adviser/industryPartners').subscribe(
      industryPartners => {
        this.industryPartners = industryPartners
        this.filteredIndustryPartners = this.industryPartners
        console.log(industryPartners)
      },
      error => {
        console.error(error)
      }
    )
  }

  getIndustryPartner(id: number) {
    this.ds.get('adviser/industryPartners/', id).subscribe(
      industryPartner => {
        let companyHead = industryPartner.company_head;
        let fullName = `${companyHead?.first_name || ''} ${companyHead?.last_name || ''} ${companyHead?.ext_name || ''}`.trim();
        industryPartner.company_head.full_name = fullName;

        let supervisor = industryPartner.immediate_supervisor;
        let supervisorFullName = `${supervisor?.first_name || ''} ${supervisor?.last_name || ''} ${supervisor?.ext_name || ''}`.trim();
        industryPartner.immediate_supervisor.full_name = supervisorFullName;

        industryPartner.internship_applications = industryPartner.internship_applications.map((student: any) => {
          return {
            full_name: student.user.first_name + " " + student.user.last_name,
            ...student
          }
        })
        console.log(industryPartner)

        this.us.setIndustryPartner(industryPartner)
        this.router.navigate(['main/industrypartners/view'])
      },
      error => {
        console.error(error)
        this.gs.errorAlert('Oops', 'Something went wrong. Please try again later.')
      }
    )
  }



























  // addIndustryPartner() {
  //   var modal = this.dialogRef.open(AddIndustryPartnerComponent, {
  //     disableClose: true       
  //   })

  //   modal.afterClosed().subscribe((result) => {
  //     console.log(result)
  //     if (!result) {
  //       return
  //     }
      
  //     this.industryPartners.unshift(result)
  //   });
  // }

  // editIndustryPartner(id: number) {
  //   if(this.isLoading === true) {
  //     return
  //   }

  //   this.isLoading = true

  //   this.ds.get('adviser/industryPartners/', id).subscribe(
  //     (industryPartner: IndustryPartner) => {
  //       var modal = this.dialogRef.open(EditIndustryPartnerComponent, {
  //         data: industryPartner,
  //         disableClose: true
  //       })
        
  //       modal.afterClosed().subscribe((result) => {
  //         console.log(result)

  //         if (!result) {
  //           return
  //         }
          
  //         this.industryPartners = this.industryPartners.map((announcement: any) =>
  //           announcement.id === result.id ? result : announcement
  //         );
  //       });
  //     },
  //     error => {
  //       console.error(error);
  //       this.isLoading = false
  //     },
  //     () => {
  //       this.isLoading = false
  //     }
  //   )
  // }

  // deleteIndustryPartner(id: number) {
  //   this.ds.delete('adviser/industryPartners/', id).subscribe(
  //     result => {
  //       console.log(result)
  //       this.industryPartners = this.industryPartners.filter((announcement: any) => announcement.id !== id);
  //       this.gs.successToastAlert('Successfully removed')
  //     },
  //     error => {
  //       console.error(error)
  //       Swal.fire({
  //         title: 'Error!',
  //         text: 'Something went wrong. Please try again later.',
  //         icon: 'error',
  //         confirmButtonText: 'Close',
  //         confirmButtonColor: '#777777',
  //       });
  //     })
  // }

  // deleteConfirmation(id: number) {
  //   Swal.fire({
  //     title: 'Remove?',
  //     text: 'Are you sure you want to remove this industry partner?',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonText: 'Yes',
  //     cancelButtonText: 'Cancel',
  //     confirmButtonColor: '#AB0E0E',
  //     cancelButtonColor: '#777777',
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       this.deleteIndustryPartner(id);
  //     }
  //   });
  // }
}
