import { Injectable } from '@angular/core';
import { Inject,  PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { exit } from 'process';

interface User {
    name: string, 
    program: string, 
    picture: string
} 

@Injectable({
  providedIn: 'root'
})

export class UserService {
    constructor(
        @Inject(PLATFORM_ID) private platformId: any,
    ) {}

    setUser(user: User) {
        sessionStorage.setItem('user', JSON.stringify(user))
    }

    getUser() {
        if (!isPlatformBrowser(this.platformId)){
            return null
        }
        
        let user = sessionStorage.getItem('user')

        if(!user) {
            return null
        }

        return JSON.parse(user)
    }

    setStudentExitPoll(exitPoll: any) {
        sessionStorage.setItem('studentExitPoll', JSON.stringify(exitPoll))
    }

    
    getStudentExitPoll() {
        if (!isPlatformBrowser(this.platformId)){
            return null
        }
        
        let exitPoll = sessionStorage.getItem('studentExitPoll')

        if(!exitPoll) {
            return null
        }

        return JSON.parse(exitPoll)
    }
}
