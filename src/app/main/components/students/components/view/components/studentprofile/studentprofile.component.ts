import { Component } from '@angular/core';
import { UserService } from '../../../../../../../services/user.service';
import { DataService } from '../../../../../../../services/data.service';
import { MatDialog } from '@angular/material/dialog';
import { ViewImageComponent } from '../../../../../../../components/view-image/view-image.component';
import { GeneralService } from '../../../../../../../services/general.service';

@Component({
  selector: 'app-studentprofile',
  templateUrl: './studentprofile.component.html',
  styleUrl: './studentprofile.component.scss',
})
export class StudentprofileComponent {
  student: any = {
    first_name: '',
    middle_name: '',
    last_name: '',
    ext_name: '',
    student_number: '',
    email: '',
    birth_date: '',
    civil_status: '',
    gender: '',
    citizenship: '',
    religion: '',
    region: '',
    province: '',
    municipality: '',
    barangay: '',
    address: '',
    zip_code: '',
    student_profile: {
      program: '',
      student_number: '',
      contact_number: '',
      father_name: '',
      father_employment: '',
      mother_name: '',
      mother_employment: '',
    },
  };

  ojtInfo = {
    company_name: '',
    start_date: '',
    department: '',
    task: '',
    supervisor_full_name: '',
    supervisor_position: '',
    full_address: '',
  };

  seminars: any = [];
  other_tasks: any = [];
  community_service: any = []

  community_service_total_hours: any = 0
  seminar_total_hours: number = 0;
  other_task_total_hours: number = 0;

  unverified_community_service = 0

  skills: any = [];
  personality_test: any = null;

  isSubmitting: boolean = false

  constructor(
    private us: UserService,
    private ds: DataService,
    private gs: GeneralService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.student = this.us.getStudentProfile();
    this.getOjtInfo()

    let courseCode = this.student?.active_ojt_class?.course_code;

    const level_2 = ['ITP422', 'CS422', 'DAP421'];
    const level_1 = ['ITP131', 'CS131', 'EMC131'];
    let practicum_level;

    if (level_2.includes(courseCode)) {
      practicum_level = 2;
    } else {
      practicum_level = 1;
    }

    this.student.practicum_level = practicum_level;

    this.student.gender = this.student.gender == 0 ? 'Female' : 'Male';

    if (this.student.student_skills) {
      this.skills = this.student.student_skills.skills;
    } else {
      this.skills.push({ strong_skill: '', weak_skill: '' });
      this.skills.push({ strong_skill: '', weak_skill: '' });
      this.skills.push({ strong_skill: '', weak_skill: '' });
    }
    console.log(this.student)

    if(this.student.practicum_level === 2) {
      this.getCommunityService();
    }
    else {
      this.getOtherTask();
      this.getSeminars();
    }

    this.getPersonalityTest();
  }

  getPersonalityTest() {
    this.ds
      .get('adviser/students/personality-test/', this.student.id)
      .subscribe(
        (response) => {
          this.personality_test = response;
        },
        (error) => {
          if(error.status === 404) {

          }
          else {
            console.error(error);
          }
        }
      );
  }

  getOtherTask() {
    this.ds.get('adviser/students/other-task/', this.student.id).subscribe(
      (response) => {
        this.other_tasks = response;
        this.other_tasks.forEach((data: any) => {
          this.other_task_total_hours += data.total_hours;
        });
      },
      (error) => {
        console.error(error);
      }
    );
  }

  getCommunityService() {
    this.ds.get('adviser/students/community-service/', this.student.id).subscribe(
      response => {
        this.community_service = response
        this.unverified_community_service = 0
        this.community_service.forEach((data: any) => {
          this.community_service_total_hours += data.total_hours
          if(!data.is_verified) {
            this.unverified_community_service += 1
          }
        });
        console.log(this.unverified_community_service)
      },
      error => { 
        // console.error(error)
      }
    )
  }

  getSeminars() {
    this.ds.get('adviser/students/seminar/', this.student.id).subscribe(
      (response) => {
        this.seminars = response;
        this.seminars.forEach((seminar: any) => {
          this.seminar_total_hours += seminar.total_hours;
        });
      },
      (error) => {
        console.error(error);
      }
    );
  }

  viewOtherTaskImage(seminar: any) {
    this.dialog.open(ViewImageComponent, {
      data: { title: seminar.task_name, image: seminar.image },
    });
  }

  viewSeminarImage(seminar: any) {
    this.dialog.open(ViewImageComponent, {
      data: { title: seminar.seminar_title, image: seminar.image },
    });
  }

  viewPersonalityTestImage(test: any) {
    this.dialog.open(ViewImageComponent, {
      data: { title: test.file_name, image: test.file_path },
    });
  }

  verifyCommunityServices() {
    if(this.isSubmitting) {
      return
    }

    this.isSubmitting = true

    this.ds.get('adviser/students/community-service/verify-all/', this.student.id).subscribe(
      response => {
        this.community_service = this.community_service.map((data: any) => {
          data.is_verified = 1
  
          return data
        })

        this.unverified_community_service = 0

        this.gs.successToastAlert(response.message)
        this.isSubmitting = false
      },
      error => {
        console.error(error)
        this.isSubmitting = false
      }
    )
  }
  getOjtInfo() {
    this.ds.get('adviser/students/ojt-information/', this.student.id).subscribe(
      (response) => {
        let data = {
          ...response.industry_partner,
          ...response,
        };

        let supervisor = data.immediate_supervisor;
        let supervisorFullName = `${supervisor?.first_name || ''} ${
          supervisor?.last_name || ''
        } ${supervisor?.ext_name || ''}`.trim();
        data.supervisor_full_name = supervisorFullName;

        let full_address = `${data?.street || ''} ${data?.barangay || ''} ${
          data?.municipality || ''
        }, ${data?.province || ''}`;
        data.full_address = full_address;

        this.ojtInfo = data;
        console.log(this.ojtInfo);
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
