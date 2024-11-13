import { Component } from '@angular/core';

import { UserService } from '../services/user.service';
import { GeneralService } from '../services/general.service';
import { AuthService } from '../services/auth.service';

import { Router } from '@angular/router';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  user: any 
  private dateTimeInterval: any;

  constructor(
    private us: UserService,
    private as: AuthService,
    private gs: GeneralService,
    private router: Router
  ) {

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
}
