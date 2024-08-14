import { Component } from '@angular/core';

@Component({
  selector: 'app-studentprofile',
  templateUrl: './studentprofile.component.html',
  styleUrl: './studentprofile.component.scss'
})

export class StudentprofileComponent {
  student: any = {
    student_number: "202110187",
    email: "202110187@gordoncollege.edu.ph",
    birth_date: "11-20-2022",
    civil_status: "single",
    gender: "M",
    citizenship: "filipino",
    religion: "Catholic",
    student_profile: {
      contact_number: "09275049530",
      father_name: "Juan Delacruz",
      father_employment: "worker",
      mother_name: "Maria Delacruz",
      mother_employment: "Housewife",
      region: "III",
      province: "Zambales", 
      municipality: "Olongapo",
      barangay: "East Tapinac",
      address: "#22 Donor Street",
      zip_code: "2200"
    }
  }

}
