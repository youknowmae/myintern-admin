import { Component } from '@angular/core';
import { UserService } from '../../../../../../../services/user.service';
import { DataService } from '../../../../../../../services/data.service';
import { MatDialog } from '@angular/material/dialog';
import { ViewImageComponent } from '../../../../../../../components/view-image/view-image.component';

@Component({
  selector: 'app-studentprofile',
  templateUrl: './studentprofile.component.html',
  styleUrl: './studentprofile.component.scss'
})

export class StudentprofileComponent {
  student: any = {
    first_name: '',
    middle_name: '', 
    last_name: '', 
    ext_name: '', 
    student_number: "",
    email: "",
    birth_date: "",
    civil_status: "",
    gender: "",
    citizenship: "",
    religion: "",
    region: "",
    province: "", 
    municipality: "",
    barangay: "",
    address: "",
    zip_code: "",
    student_profile: {
      program: '',
      student_number: '',
      contact_number: "",
      father_name: "",
      father_employment: "",
      mother_name: "",
      mother_employment: "",
    }
  }

  
  ojtInfo = {
    company_name: '',
    start_date: '',
    department: '', 
    task: '',
    supervisor_full_name: '',
    supervisor_position: '',
    full_address: '',
  }

  seminars: any = []
  other_tasks: any = []
  seminar_total_hours: number = 0
  other_task_total_hours: number = 0

  skills: any = []
  personality_test: any = null

  constructor(
    private us: UserService,
    private ds: DataService,
    private dialog: MatDialog) {
  }

  ngOnInit() {
    this.student = this.us.getStudentProfile()
    this.getOjtInfo()
    this.student.gender = (this.student.gender == 0) ? 'Female' : 'Male'
    
    if(this.student.student_skills) {
      this.skills = this.student.student_skills.skills
    } else {
      this.skills.push({strong_skill: '', weak_skill: ''})
      this.skills.push({strong_skill: '', weak_skill: ''})
      this.skills.push({strong_skill: '', weak_skill: ''})
    }

    this.getSeminars();
    this.getOtherTask()
    // this.getSkills();
    this.getPersonalityTest();
  }

  getPersonalityTest() {
    this.ds.get('adviser/students/personality-test/', this.student.id).subscribe(
      response => {
        console.log(response)
        this.personality_test = response
      },
      error => {
        console.error(error)
      }
    )
  }

  getOtherTask() {
    this.ds.get('adviser/students/other-task/', this.student.id).subscribe(
      response => {
        this.other_tasks = response
        this.other_tasks.forEach((data: any) => {
          this.other_task_total_hours += data.total_hours
        });

      },
      error => { 
        console.error(error)
      }
    )

  }

  getSeminars() {
    this.ds.get('adviser/students/seminar/', this.student.id).subscribe(
      response => {
        this.seminars = response
        this.seminars.forEach((seminar: any) => {
          this.seminar_total_hours += seminar.total_hours
        });
      },
      error => { 
        console.error(error)
      }
    )
  }
  
  viewOtherTaskImage(seminar: any) {
    this.dialog.open(ViewImageComponent, {
      data: { title: seminar.task_name, image: seminar.image}
    })
  }

  viewSeminarImage(seminar: any) {
    this.dialog.open(ViewImageComponent, {
      data: { title: seminar.seminar_title, image: seminar.image}
    })
  }

  viewPersonalityTestImage(test: any) {
    this.dialog.open(ViewImageComponent, {
      data: { title: test.file_name, image: test.file_path}
    })
  }

  getOjtInfo() {
    this.ds.get('adviser/students/ojt-information/', this.student.id).subscribe(
      response => {
        let data = {
          ...response.industry_partner,
          ...response,
        }

        let supervisor = data.immediate_supervisor;
        let supervisorFullName = `${supervisor?.first_name || ''} ${supervisor?.last_name || ''} ${supervisor?.ext_name || ''}`.trim();
        data.supervisor_full_name = supervisorFullName;

        let full_address = `${data?.street || ''} ${data?.barangay || ''} ${data?.municipality || ''}, ${data?.province || ''}`
        data.full_address = full_address

        this.ojtInfo = data
        console.log(this.ojtInfo)
      },
      error => {
        console.error(error)
      }
    )
  }

  
}
