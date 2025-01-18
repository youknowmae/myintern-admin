import { Injectable } from '@angular/core';
import { Inject,  PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { exit } from 'process';
import { GeneralService } from './general.service';

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
        private gs: GeneralService
    ) {}

    setUser(user: User) {
        let encryptedData = this.gs.encrypt(user)
        sessionStorage.setItem('user', encryptedData)
    }

    getUser() {
        let encryptedData = sessionStorage.getItem('user')

        if(!encryptedData) {
            return null
        }
        
        let plainTextData = this.gs.decrypt(encryptedData)

        return plainTextData
    }

    setIndustryPartner(industryPartner: any) {
        let encryptedData = this.gs.encrypt(industryPartner)
        sessionStorage.setItem(this.industryPartner, encryptedData)
    }

    getIndustryPartner() {
        let industryPartner = sessionStorage.getItem(this.industryPartner)

        if(!industryPartner) {
            return null
        }

        let plainTextData = this.gs.decrypt(industryPartner)

        return plainTextData
    }

    setCompanyEndorsement(industryPartner: any) {
        let encryptedData = this.gs.encrypt(industryPartner)
        sessionStorage.setItem(this.companyEndorsement, encryptedData)
    }

    getCompanyEndorsement() {
        let industryPartner = sessionStorage.getItem(this.companyEndorsement)

        if(!industryPartner) {
            return null
        }
        
        let plainTextData = this.gs.decrypt(industryPartner)

        return plainTextData
    }
    
    setStudentExitPoll(exitPoll: any) {
        let encryptedData = this.gs.encrypt(exitPoll)
        sessionStorage.setItem(this.exitPollDetails, encryptedData)
    }

    getStudentExitPoll() {
        let exitPoll = sessionStorage.getItem(this.exitPollDetails)

        if(!exitPoll) {
            return null
        }
        
        let plainTextData = this.gs.decrypt(exitPoll)

        return plainTextData
    }

    setStudentEvaluation(data: any) {
        let encryptedData = this.gs.encrypt(data)
        sessionStorage.setItem(this.studentEvaluation, encryptedData)
    }
    
    getStudentEvaluation() {
        if (!isPlatformBrowser(this.platformId)){
            return null
        }
        
        let studentEvaluation = sessionStorage.getItem(this.studentEvaluation)

        if(!studentEvaluation) {
            return null
        }
        
        let plainTextData = this.gs.decrypt(studentEvaluation)

        return plainTextData
    }

    setStudentProfile(data: any) {
        let encryptedData = this.gs.encrypt(data)
        sessionStorage.setItem(this.studentProfile, encryptedData)
    }

    getStudentProfile() {
        let studentProfile = sessionStorage.getItem(this.studentProfile)

        if(!studentProfile) {
            return null
        }
        
        let plainTextData = this.gs.decrypt(studentProfile)

        return plainTextData
    }

    setStudentApplication(data: any) {
        let encryptedData = this.gs.encrypt(data)
        sessionStorage.setItem(this.studentApplication, encryptedData)
    }

    getStudentApplication() {
        let studentApplication = sessionStorage.getItem(this.studentApplication)

        if(!studentApplication) {
            return null
        }
        
        let plainTextData = this.gs.decrypt(studentApplication)

        return plainTextData
    }
}
