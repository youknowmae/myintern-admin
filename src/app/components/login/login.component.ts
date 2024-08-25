import { Component } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../../services/auth.service';
import { GeneralService } from '../../services/general.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  visible: boolean = true;
  changetype: boolean = true;

  isLoggingIn: boolean = false;
  
  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.maxLength(30)]],
    password: ['', [Validators.required, Validators.maxLength(30)]]
  })

  constructor(
    private gs: GeneralService,
    private as: AuthService,
    private fb: FormBuilder,
  ) {

  }
  viewpass() {
    this.visible = !this.visible;
    this.changetype = !this.changetype;
  }

  login() {
    if(this.isLoggingIn) {
      return
    }

    this.isLoggingIn = true
    
    // this.router.navigate(['/main'])
    // return

    this.as.login(this.loginForm.value).subscribe(
      response => {
        this.isLoggingIn = false
        this.gs.successToastAlert('Login Successful!')
      },
      error => {
        console.error(error)
        if(error.status === 401) {
          this.gs.errorAlert('Error!', error.error.message)
        }

        this.isLoggingIn = false
      }
    )
  }
}
