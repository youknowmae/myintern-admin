import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, Subject, catchError, tap } from 'rxjs';
import { UserService } from './user.service';
import { GeneralService } from './general.service';
import { appSettings } from '../../environments/environment';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrl: string = appSettings.apiUrl;

  constructor(
    private router: Router,
    private http: HttpClient,
    private us: UserService,
    private ds: DataService
  ) {}

  login(credentials: { email: string; password: string }) {
    const payload = {
      payload: this.us.encryptPayload(credentials)
    }
    return this.http.post<any>(`${this.apiUrl}login/adviser`,  payload).pipe(
      tap((response) => {
        if (response.token) {
          this.us.setUserLogState();
          this.us.setToken(response.token);
          this.us.setUser(response.user);

          this.getAcademicYears();
        }
      })
    );
  }

  getAcademicYears() {
    this.ds.get('adviser/acad-year').subscribe((response) => {
      const practicumSemesters = response.filter(
        (item: any) => item.semester != 1
      );
      this.us.setAcademicYears(practicumSemesters);
      this.router.navigate(['/main']);
    });
  }

  logout() {
    return this.http.get<any>(this.apiUrl + 'logout').pipe(
      tap((response) => {
        sessionStorage.clear();
      })
    );
  }
}
