import { Component } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../../services/auth.service';
import { GeneralService } from '../../services/general.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  visible: boolean = true;

  isLoggingIn: boolean = false;

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.maxLength(30)]],
    password: ['', [Validators.required, Validators.maxLength(30)]],
  });

  constructor(
    private gs: GeneralService,
    private as: AuthService,
    private fb: FormBuilder
  ) {}
  togglePassVisibility() {
    this.visible = !this.visible;
  }

  login() {
    if (this.isLoggingIn) {
      return;
    }

    this.isLoggingIn = true;

    this.as.login(this.loginForm.value).subscribe(
      (response) => {
        this.isLoggingIn = false;
        this.gs.makeToast('Login Successful!');
      },
      (error) => {
        console.error(error);
        if (error.status === 0) {
          this.gs.makeAlert(
            'Oops!',
            'Something went wrong. Please try again later.',
            'error'
          );
        } else if (error.status === 401) {
          this.gs.makeAlert(error.error.title, error.error.message, 'error');
        } else if (error.status === 403) {
          this.gs.makeAlert(error.error.title, error.error.message, 'error');
        }

        this.isLoggingIn = false;
      }
    );
  }
}
