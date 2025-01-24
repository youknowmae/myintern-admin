import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, Subject, catchError, tap } from 'rxjs';
import { UserService } from './user.service';
import { GeneralService } from './general.service';
import { appSettings } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    apiUrl: string = appSettings.apiUrl

    constructor(
        private router: Router, 
        private http: HttpClient,
        private userService: UserService,
        private gs: GeneralService
    ) { }

    login(credentials: {email: string, password: string}) {

        return this.http.post<any>(`${this.apiUrl}login/adviser`, credentials).pipe(
            tap((response => {
                if(response.token){
                    sessionStorage.setItem('userLogState', 'true')

                    let ecryptedToken = this.gs.encrypt(response.token)
                    sessionStorage.setItem(btoa('token'), ecryptedToken)

                    this.userService.setUser(response.user)

                    this.router.navigate(['/main'])
                }
            }))
        )
    }

    logout() {
        return this.http.get<any>(this.apiUrl + 'logout').pipe(
            tap((response => {
                sessionStorage.clear()
            }))
        )
    }

}