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

  constructor(
    private us: UserService,
    private as: AuthService,
    private gs: GeneralService,
    private router: Router
  ) {

  }

  ngOnInit() {
    this.getUser()
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

}
