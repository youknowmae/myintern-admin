import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from '../../../../../services/data.service';
import { IndustryPartner } from '../../../../../model/industry-partner.model';
import { GeneralService } from '../../../../../services/general.service';
import { UserService } from '../../../../../services/user.service';
import { Router } from '@angular/router';
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

  searchValue: string = '';

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
    };
  }

  ngOnInit() {
    this.getIndustryPartners();
  }

  search(value: string) {
    value = value.toLowerCase();
    this.searchValue = value;
    this.pagination.current_page = 1;

    this.filterIndustryPartners();
  }

  getIndustryPartners() {
    this.ds.get('adviser/industryPartners').subscribe(
      (industryPartners) => {
        this.industryPartners = industryPartners
          .map((element: any) => {
            element.full_location =
              element.municipality + ', ' + element.province;

            return element;
          })
          .filter((item: any) => item.is_archived === 0);

        this.filterIndustryPartners();

        console.log(this.filteredIndustryPartners);
        this.isLoading = false;
      },
      (error) => {
        this.gs.makeAlert(
          'Oops!',
          'Something went wrong, please try again later.',
          'error'
        );
        this.isLoading = false;
        console.error(error);
      }
    );
  }

  getIndustryPartner(id: number) {
    this.us.setIndustryPartner(id);
    this.router.navigate(['main/industrypartners/view']);
  }

  filterIndustryPartners() {
    let search = this.searchValue.toLowerCase();

    var data = this.industryPartners;
    if (search) {
      data = data.filter((item: IndustryPartner) => {
        return (
          item.company_name.toLowerCase().includes(search) ||
          item.full_location.toLowerCase().includes(search)
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

  changePage(page: number) {
    const destination_page = this.pagination.current_page + page;
    if (destination_page < 1 || destination_page > this.pagination.last_page) {
      return;
    }

    this.pagination.current_page += page;
    this.filterIndustryPartners();
  }

  jumpPage(page: number) {
    this.pagination.current_page = page;
    this.filterIndustryPartners();
  }
}
