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

  searchValue: string = ''
  
  pagination: pagination = <pagination>{};

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
    this.getIndustryPartners()
  }

  search(value: string) {
    value = value.toLowerCase()
    this.searchValue = value
    this.pagination.current_page = 1

    this.filterIndustryPartners()
  }

  getIndustryPartners() {
    this.ds.get('adviser/industryPartners').subscribe(
      industryPartners => {
        this.industryPartners = industryPartners.map(
          (element: any) => {
            element.full_location = element.municipality + ", " + element.province

            return element
          }
        )
        
        this.filterIndustryPartners()

        console.log(this.filteredIndustryPartners)
        this.isLoading = false
      },
      error => {
        this.gs.errorAlert('Oops!', 'Something went wrong, please try again later.')
        this.isLoading = false
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

        if(industryPartner.internship_applications) {  
          industryPartner.internship_applications = industryPartner.internship_applications.map((student: any) => {
          return {
            full_name: student.user.first_name + " " + student.user.last_name,
            ...student
          }
        })
      }
        
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

  filterIndustryPartners() {
    let search = this.searchValue.toLowerCase()

    var data = this.industryPartners
    if(search) {
      data = data.filter(
        (item: IndustryPartner) => {
          return item.company_name.toLowerCase().includes(search) ||
            item.full_location.toLowerCase().includes(search) 
        }
      )
    }

    this.pagination = this.gs.getPaginationDetails(data, this.pagination.current_page, this.pagination.per_page)

    data = data.slice(this.pagination.from, this.pagination.to);
    this.pagination.from++
    

    this.filteredIndustryPartners = data
  }

  changePage(page: number) {
    const destination_page = this.pagination.current_page + page
    if(destination_page < 1 || destination_page > this.pagination.last_page) {
      return
    }
    
    this.pagination.current_page += page
    this.filterIndustryPartners()
  }

  jumpPage(page: number){
    this.pagination.current_page = page
    this.filterIndustryPartners()
  }
}
