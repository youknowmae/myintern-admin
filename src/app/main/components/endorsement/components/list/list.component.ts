import { Component } from '@angular/core';
import { IndustryPartner } from '../../../../../model/industry-partner.model';
import { GeneralService } from '../../../../../services/general.service';
import { Router } from '@angular/router';
import { DataService } from '../../../../../services/data.service';
import { UserService } from '../../../../../services/user.service';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  industryPartners: IndustryPartner[] = []
  filteredIndustryPartners: any = []
  
  statusFilter: string | number = 'all'
  searchFilter: string = ''

  constructor(
    private us: UserService,
    private router: Router,
    private ds: DataService,
    private gs: GeneralService
  ) {

  }

  ngOnInit() {
    this.getIndustryPartnerRequests()
  }
  
  search(search: string) {
    this.searchFilter = search.trim().toLowerCase()
    this.filterRequest()
  }
  
  onStatusFilterChange(event: MatSelectChange) {
    console.log(event.value)
    this.statusFilter = event.value
    this.filterRequest()
  }

  filterRequest() {
    let request = this.industryPartners

    if(this.statusFilter != 'all') {
      request = request.filter((element: any) => {
        return element.status == this.statusFilter
      })
    }

    if(this.searchFilter) {
      request = request.filter((element: any) => {
        return element.company_name.includes(this.searchFilter)
      })
    }

    this.filteredIndustryPartners = request

  }

  getIndustryPartnerRequests() {
    this.ds.get('adviser/request/industryPartners').subscribe(
      industryPartners => {
        this.industryPartners = industryPartners.map(
          (element: any) => {
            if(element.status == 0) {
              element.status_text = 'For Verification'
            }
            else if(element.status == 1) {
              element.status_text = 'Rejected'
            }
            else if(element.status == 2) {
              element.status_text = 'Verified'
            }
            else if(element.status == 3) {
              element.status_text = 'Approved'
            }
  
            return element
          }
        )
        this.filteredIndustryPartners = this.industryPartners
        console.log(industryPartners)
      },
      error => {
        console.error(error)
      }
    )
  }

  viewIndustryPartnerRequest(id: number) {
    this.ds.get('adviser/request/industryPartners/', id).subscribe(
      industryPartner => {
        let companyHead = industryPartner.company_head;
        let fullName = `${companyHead?.first_name || ''} ${companyHead?.last_name || ''} ${companyHead?.ext_name || ''}`.trim();
        industryPartner.company_head.full_name = fullName;

        let supervisor = industryPartner.immediate_supervisor;
        let supervisorFullName = `${supervisor?.first_name || ''} ${supervisor?.last_name || ''} ${supervisor?.ext_name || ''}`.trim();
        industryPartner.immediate_supervisor.full_name = supervisorFullName;
        
        console.log(industryPartner)

        this.us.setCompanyEndorsement(industryPartner)
        this.router.navigate(['main/endorsement/view'])
      },
      error => {
        console.error(error)
        this.gs.errorAlert('Oops', 'Something went wrong. Please try again later.')
      }
    )
  }
}
