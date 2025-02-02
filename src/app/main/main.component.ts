import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';

import { UserService } from '../services/user.service';
import { GeneralService } from '../services/general.service';
import { AuthService } from '../services/auth.service';
import { MediaMatcher } from '@angular/cdk/layout';

import { Router } from '@angular/router';

import Swal from 'sweetalert2';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  mobileQuery: MediaQueryList;

  user: any 
  private dateTimeInterval: any;

  
  @ViewChild('sidenav') sidenav!: MatSidenav; 
  @ViewChild('bodyContent', { static: true }) bodyContent!: ElementRef;
  private _mobileQueryListener: () => void;
  
  currentScrollLevel: number = 0
  hideHeader: boolean = false
  
  constructor(
    private us: UserService,
    private as: AuthService,
    private gs: GeneralService,
    private changeDetectorRef: ChangeDetectorRef,  
    private media: MediaMatcher,
    private router: Router
  ) {
    this.mobileQuery = this.media.matchMedia('(max-width: 680px)');
    this._mobileQueryListener = () => this.changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

  }

  ngOnInit(): void {
    this.getUser()
    this.updateDateTime();
    
    this.dateTimeInterval = setInterval(() => this.updateDateTime(), 30000);
  }

  ngOnDestroy(): void {
    clearInterval(this.dateTimeInterval);
  }
  
  getUser() {
    this.user = this.us.getUser()
  }

  logout() {
    Swal.fire({
      icon: 'warning',
      title: "Logout?",
      text: 'You will be exiting the application',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: "Logout",
    }).then((result) => {
      if (result.isConfirmed) {
        this.as.logout().subscribe(
          response => {
            this.gs.successToastAlert('You have been logged out.')
            this.router.navigate(['/login'])
          },
          error => {
            sessionStorage.clear()
            this.router.navigate(['/login'])
          }
        )
      } 
    });
  }

  updateDateTime(): void {
    const dateTimeElement = document.getElementById("dateTime");
    if (dateTimeElement) { // Check if dateTimeElement is not null
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'long' as const, 
        month: 'short' as const, 
        day: 'numeric' as const, 
        year: 'numeric' as const, 
        hour: '2-digit' as const, 
        minute: '2-digit' as const 
      };
      dateTimeElement.textContent = now.toLocaleDateString('en-US', options);
    }
  }
  
  onScroll(event: any) {
    const scrollTop = event.target.scrollTop;

    if(scrollTop <= 50) {
      this.currentScrollLevel = scrollTop
      this.hideHeader = false
      return
    }

    if (Math.abs(this.currentScrollLevel - scrollTop) >= 70) {
      this.hideHeader = this.currentScrollLevel < scrollTop;
      this.currentScrollLevel = scrollTop;
    }
  }
}
