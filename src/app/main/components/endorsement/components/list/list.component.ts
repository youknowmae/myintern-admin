import { Component } from '@angular/core';
import { IndustryPartner } from '../../../../../model/industry-partner.model';
import { GeneralService } from '../../../../../services/general.service';
import { Router } from '@angular/router';
import { DataService } from '../../../../../services/data.service';
import { UserService } from '../../../../../services/user.service';
import { MatSelectChange } from '@angular/material/select';
import { pagination } from '../../../../../model/pagination.model';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  industryPartners: IndustryPartner[] = []
  filteredIndustryPartners: any = []
  isLoading: boolean = true

  statusFilter: string | number = 0
  searchFilter: string = ''
  
  pagination: pagination = <pagination>{};

  isSubmitting: boolean = false
  
  constructor(
    private us: UserService,
    private router: Router,
    private ds: DataService,
    private gs: GeneralService
  ) {
    this.pagination = {
      current_page: 1,
      from: 0,
      to: 0,
      total: 0,
      per_page: 15,
      last_page: 0,
    }
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
    let data = this.industryPartners

    if(this.statusFilter != 'all') {
      data = data.filter((element: any) => {
        return element.status == this.statusFilter
      })
    }

    if(this.searchFilter) {
      data = data.filter((element: any) => {
        return element.company_name.toLowerCase().includes(this.searchFilter) ||
          element.full_location.toLowerCase().includes(this.searchFilter)
          
      })
    }

    this.pagination = this.gs.getPaginationDetails(data, this.pagination.current_page, this.pagination.per_page)

    data = data.slice(this.pagination.from, this.pagination.to);
    this.pagination.from++

    this.filteredIndustryPartners = data

  }

  getIndustryPartnerRequests() {
    this.ds.get('adviser/request/industryPartners').subscribe(
      industryPartners => {
        this.industryPartners = industryPartners.map(
          (element: any) => {
            if(element.status == 0) {
              element.status_text = 'For Recommendation'
            }
            else if(element.status == 1) {
              element.status_text = 'Not Recommended'
            }
            else if(element.status == 2) {
              element.status_text = 'For Approval'
            }
            else if(element.status == 3) {
              element.status_text = 'Not Approved'
            } 
            else if(element.status == 4) {
              element.status_text = 'Approved'
            }
  
            element.full_location = element.municipality + ", " + element.province
            return element
        })

        this.filterRequest()
        
        this.isLoading = false

        console.log(industryPartners)
      },
      error => {
        console.error(error)
        this.isLoading = false
      }
    )
  }

  viewIndustryPartnerRequest(id: number) {
    if(this.isSubmitting) {
      return
    }

    this.isSubmitting = true
    
    this.ds.get('adviser/request/industryPartners/', id).subscribe(
      industryPartner => {
        this.isSubmitting = false
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
        this.isSubmitting = false
        console.error(error)
        this.gs.errorAlert('Oops', 'Something went wrong. Please try again later.')
      }
    )
  }

  changePage(page: number) {
    const destination_page = this.pagination.current_page + page
    if(destination_page < 1 || destination_page > this.pagination.last_page) {
      return
    }
    
    this.pagination.current_page += page
    this.filterRequest()
  }

  jumpPage(page: number){
    this.pagination.current_page = page
    this.filterRequest()
  }
}
