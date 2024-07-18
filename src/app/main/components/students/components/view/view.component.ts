import { Component } from '@angular/core';
import { MaterialsModules } from '../../../../../modules/materials.module';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss',
})

export class ViewComponent {
  student: any = {
    birth_date: "11-20-2022",
    civil_status: "single",
    gender: "M",
    citizenship: "filipino",
    religion: "Catholic",
    student_profile: {
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
