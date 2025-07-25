import { Component } from '@angular/core';
import { UserService } from '../../../../../services/user.service';
import Swal from 'sweetalert2';
import { GeneralService } from '../../../../../services/general.service';
import { DataService } from '../../../../../services/data.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { GlobalMethods } from '../../../../../shared/global.shared';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss',
})
export class ViewComponent {
  industryPartner: any;
  file: any;
  filePreview: any;
  isImage: boolean = false;

  isLoading: boolean = true;
  isSubmitting: boolean = false;

  constructor(
    private us: UserService,
    private gs: GeneralService,
    private gb: GlobalMethods,
    private ds: DataService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {}

  ngOnInit() {
    this.getRequestDetails();
  }

  getRequestDetails() {
    let id = this.us.getCompanyEndorsement();

    this.ds.get('adviser/request/industryPartners/', id).subscribe(
      (industryPartner) => {
        this.isSubmitting = false;
        let companyHead = industryPartner.company_head;
        let fullName = `${companyHead?.first_name || ''} ${
          companyHead?.last_name || ''
        } ${companyHead?.ext_name || ''}`.trim();
        industryPartner.company_head.full_name = fullName;

        let supervisor = industryPartner.immediate_supervisor;
        let supervisorFullName = `${supervisor?.first_name || ''} ${
          supervisor?.last_name || ''
        } ${supervisor?.ext_name || ''}`.trim();
        industryPartner.immediate_supervisor.full_name = supervisorFullName;

        console.log(industryPartner);

        this.industryPartner = industryPartner;
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        console.error(error);

        if (error.status === 404) {
          this.router.navigate(['main/endorsement/list']);
          this.gs.makeAlert(
            'Not Found!',
            'The industry partner approval not found.',
            'error'
          );
        } else {
          this.gs.makeAlert(
            'Oops',
            'Something went wrong. Please try again later.',
            'error'
          );
        }
      }
    );
  }

  uploadFile(event: any) {
    this.file = event.target.files[0];

    let file = this.file;

    const fileType = file.type;

    if (fileType.startsWith('image/')) {
      this.isImage = true;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.filePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    } else if (fileType === 'application/pdf') {
      this.isImage = false;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.filePreview = this.sanitizer.bypassSecurityTrustResourceUrl(
          e.target.result + '#toolbar=0&navpanes=0&scrollbar=0'
        );
      };
      reader.readAsDataURL(file);
    }
  }

  reject() {
    Swal.fire({
      title: 'Please state the reason for not recommending',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off',
      },
      showCancelButton: true,
      confirmButtonText: 'Reject',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#ff4141',
      cancelButtonColor: '#777777',
    }).then((result) => {
      if (result.isConfirmed) {
        const formData = new FormData();

        const data = {
          remarks: result.value
        }

        formData.append('payload', this.us.encryptPayload(data));
        this.ds
          .post(
            'adviser/request/industryPartners/reject/',
            this.industryPartner.id,
            formData
          )
          .subscribe(
            (response) => {
              this.gs.makeAlert(response.title, response.message, 'success');
              this.router.navigate(['main/endorsement/list']);
              this.industryPartner.status = 1;
            },
            (error) => {
              console.error(error);
              if (error.status === 409) {
                this.gs.makeAlert(
                  error.error.title,
                  error.error.message,
                  'error'
                );
              } else if (error.status === 422) {
                this.gs.makeAlert(
                  error.error.title,
                  error.error.error,
                  'error'
                );
              } else {
                this.gs.makeAlert(
                  'Oops!',
                  'Something went wrong. Please try again later.',
                  'error'
                );
              }
            }
          );
      }
    });
  }

  async verify() {
    const isConfirmed = await this.gb.confirmAlert(
      'Recommend?',
      '"Are you sure you want to recommend this company?',
      'info'
    );

    if (isConfirmed) {
      if (this.isSubmitting) return;

      this.isSubmitting = true;

      this.ds
        .post(
          'adviser/request/industryPartners/verify/',
          this.industryPartner.id,
          null
        )
        .subscribe(
          (response) => {
            this.isSubmitting = false;
            this.router.navigate(['main/endorsement/list']);
            this.gs.makeAlert(response.title, response.message);
            this.industryPartner.status = 2;
          },
          (error) => {
            this.isSubmitting = false;
            console.error(error);
            if (error.status === 409) {
              this.gs.makeAlert(error.error.title, error.error.message);
            } else if (error.status === 422) {
              this.gs.makeAlert(error.error.title, error.error.error);
            } else {
              this.gs.makeAlert(
                'Oops!',
                'Something went wrong. Please try again later.'
              );
            }
          }
        );
    }
  }

  sanitizeUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
