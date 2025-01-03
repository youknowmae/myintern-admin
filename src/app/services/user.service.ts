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
    industryPartner: string = 'industryPartner'
    studentEvaluation: string = 'studentEvaluation'
    studentProfile: string = 'studentProfile'
    studentApplication: string = 'studentApplication'
    companyEndorsement: string = 'companyEndorsement'

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

    setIndustryPartner(industryPartner: any) {
        sessionStorage.setItem(this.industryPartner, JSON.stringify(industryPartner))
    }

    getIndustryPartner() {
        if (!isPlatformBrowser(this.platformId)){
            return null
        }
        
        let industryPartner = sessionStorage.getItem(this.industryPartner)

        if(!industryPartner) {
            return null
        }

        return JSON.parse(industryPartner)
    }

    setCompanyEndorsement(industryPartner: any) {
        sessionStorage.setItem(this.companyEndorsement, JSON.stringify(industryPartner))
    }

    getCompanyEndorsement() {
        if (!isPlatformBrowser(this.platformId)){
            return null
        }
        
        let industryPartner = sessionStorage.getItem(this.companyEndorsement)

        if(!industryPartner) {
            return null
        }

        return JSON.parse(industryPartner)
    }
    
    setStudentExitPoll(exitPoll: any) {
        sessionStorage.setItem(this.exitPollDetails, JSON.stringify(exitPoll))
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

    setStudentEvaluation(exitPoll: any) {
        sessionStorage.setItem(this.studentEvaluation, JSON.stringify(exitPoll))
    }
    
    getStudentEvaluation() {
        if (!isPlatformBrowser(this.platformId)){
            return null
        }
        
        let studentEvaluation = sessionStorage.getItem(this.studentEvaluation)

        if(!studentEvaluation) {
            return null
        }

        return JSON.parse(studentEvaluation)
    }

    setStudentProfile(studentProfile: any) {
        sessionStorage.setItem(this.studentProfile, JSON.stringify(studentProfile))
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

    setStudentApplication(studentApplication: any) {
        sessionStorage.setItem(this.studentApplication, JSON.stringify(studentApplication))
    }

    getStudentApplication() {
        if (!isPlatformBrowser(this.platformId)){
            return null
        }
        
        let studentApplication = sessionStorage.getItem(this.studentApplication)

        if(!studentApplication) {
            return null
        }

        return JSON.parse(studentApplication)
    }

    encryptData(data: any) {
        return data
    }

    decryptData(data: any) {
        return data
    }
}
