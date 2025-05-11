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
  styleUrl: './list.component.scss',
})
export class ListComponent {
  industryPartners: IndustryPartner[] = [];
  filteredIndustryPartners: any = [];
  isLoading: boolean = true;

  statusFilter: string | number = 0;
  searchFilter: string = '';

  pagination: pagination = <pagination>{};

  isSubmitting: boolean = false;

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
    };
  }

  ngOnInit() {
    this.getIndustryPartnerRequests();
  }

  search(search: string) {
    this.searchFilter = search.trim().toLowerCase();
    this.filterRequest();
  }

  onStatusFilterChange(event: MatSelectChange) {
    console.log(event.value);
    this.statusFilter = event.value;
    this.filterRequest();
  }

  filterRequest() {
    let data = this.industryPartners;

    if (this.statusFilter != 'all') {
      data = data.filter((item: any) => {
        return item.request_status == this.statusFilter;
      });
    }

    if (this.searchFilter) {
      data = data.filter((item: any) => {
        return (
          item.company_name.toLowerCase().includes(this.searchFilter) ||
          item.full_location.toLowerCase().includes(this.searchFilter)
        );
      });
    }

    this.pagination = this.gs.getPaginationDetails(
      data,
      this.pagination.current_page,
      this.pagination.per_page
    );

    data = data.slice(this.pagination.from, this.pagination.to);
    this.pagination.from++;

    this.filteredIndustryPartners = data;
  }

  getIndustryPartnerRequests() {
    this.ds.get('adviser/request/industryPartners').subscribe(
      (industryPartners) => {
        this.industryPartners = industryPartners.map((item: any) => {
          if (item.request_status == 0) {
            item.status_text = 'For Recommendation';
          } else if (item.request_status == 1) {
            item.status_text = 'Not Recommended';
          } else if (item.request_status == 2) {
            item.status_text = 'For Approval';
          } else if (item.request_status == 3) {
            item.status_text = 'Declined';
          } else if (item.request_status == 4) {
            item.status_text = 'Approved';
          }

          item.full_location = item.municipality + ', ' + item.province;
          return item;
        });

        this.filterRequest();

        this.isLoading = false;

        console.log(industryPartners);
      },
      (error) => {
        console.error(error);
        this.isLoading = false;
      }
    );
  }

  viewIndustryPartnerRequest(id: number) {
    this.us.setCompanyEndorsement(id);
    this.router.navigate(['main/endorsement/view']);
  }

  changePage(page: number) {
    const destination_page = this.pagination.current_page + page;
    if (destination_page < 1 || destination_page > this.pagination.last_page) {
      return;
    }

    this.pagination.current_page += page;
    this.filterRequest();
  }

  jumpPage(page: number) {
    this.pagination.current_page = page;
    this.filterRequest();
  }
}
