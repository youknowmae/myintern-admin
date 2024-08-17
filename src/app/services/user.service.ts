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
    exitPollDetails: string = 'studentExitPoll'
    studentProfile: string = 'studentProfile'

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
        sessionStorage.setItem(this.exitPollDetails, JSON.stringify(exitPoll))
    }

    setStudentProfile(studentProfile: any) {
        sessionStorage.setItem(this.studentProfile, JSON.stringify(studentProfile))
    }

    
    getStudentExitPoll() {
        if (!isPlatformBrowser(this.platformId)){
            return null
        }
        
        let exitPoll = sessionStorage.getItem(this.exitPollDetails)

        if(!exitPoll) {
            return null
        }

        return JSON.parse(exitPoll)
    }

    getStudentProfile() {
        if (!isPlatformBrowser(this.platformId)){
            return null
        }
        
        let studentProfile = sessionStorage.getItem(this.studentProfile)

        if(!studentProfile) {
            return null
        }

        return JSON.parse(studentProfile)
    }
}
