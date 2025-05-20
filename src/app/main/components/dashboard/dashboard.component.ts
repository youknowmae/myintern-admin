import { Component, AfterViewInit } from '@angular/core';
import {
  Chart,
  ChartConfiguration,
  registerables,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import { channel } from 'diagnostics_channel';
import { DataService } from '../../../services/data.service';
import { ExitPollStatus, OjtStatus } from '../../../model/ojt-status.model';
import { AcademicYear } from '../../../model/academic-year.model';
import { MatSelectChange } from '@angular/material/select';
import { UserService } from '../../../services/user.service';

// Register all necessary components
Chart.register(...registerables);
Chart.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements AfterViewInit {
  academicYearOptions: any = [];
  academicYearFilter: any;

  enrolled_student: number = 0;
  ojtStatusCount: any = {
    completed: 0,
    ongoing: 0,
    pending: 0,
  };
  enrolledCourseCount: any = [];

  totalEnrolledCoursePie: any;
  barChart: any;
  ojtBarChart: any;
  evaluationBarChart: any;

  public config: ChartConfiguration<'pie'> = {
    type: 'pie',
    data: {
      // labels: ['BSIT', 'BSCS', 'BSEMC'],
      datasets: [
        {
          data: [0, 0, 0, 0],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: 'top',
        },
        tooltip: {
          enabled: true,
        },
      },
    },
  };

  public barConfig: ChartConfiguration<'bar'> = {
    type: 'bar',
    data: {
      labels: [],
      datasets: [
        {
          label: 'Pending',
          data: [0, 0, 0],
          backgroundColor: '#FABC3F',
        },
        {
          label: 'Ongoing',
          data: [0, 0, 0],
          backgroundColor: '#99B080',
        },
        {
          label: 'Completed',
          data: [0, 0, 0],
          backgroundColor: '#7C93C3',
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: 'top',
        },
        tooltip: {
          enabled: true,
        },
      },
      scales: {
        x: {
          stacked: false,
          ticks: {
            maxRotation: 0,
            minRotation: 0,
          },
        },
        y: {
          stacked: false,
        },
      },
    },
  };

  public ojtBarConfig: ChartConfiguration<'bar'> = {
    type: 'bar',
    data: {
      labels: ['BSIT', 'BSCS', 'BSEMC'],
      datasets: [
        {
          label: 'Pending',
          data: [0, 0, 0, 0],
          backgroundColor: '#FABC3F',
        },
        {
          label: 'Completed',
          data: [0, 0, 0, 0],
          backgroundColor: '#7C93C3',
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: 'top',
        },
        tooltip: {
          enabled: true,
        },
      },
      scales: {
        x: {
          stacked: false,
        },
        y: {
          stacked: false,
        },
      },
    },
  };

  public evaluationConfig: ChartConfiguration<'bar'> = {
    type: 'bar',
    data: {
      labels: ['BSIT', 'BSCS', 'BSEMC'],
      datasets: [
        {
          label: '100-96',
          data: [0, 0, 0, 0],
          backgroundColor: '#FABC3F',
        },
        {
          label: '95-91',
          data: [0, 0, 0, 0],
          backgroundColor: '#7C93C3',
        },
        {
          label: '90-86',
          data: [0, 0, 0, 0],
          backgroundColor: '#A1D6B2',
        },
        {
          label: '85-81',
          data: [0, 0, 0, 0],
          backgroundColor: '#FF9874',
        },
        {
          label: '80-75',
          data: [0, 0, 0, 0],
          backgroundColor: '#AD49E1',
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: 'top',
        },
        tooltip: {
          enabled: true,
        },
      },
      scales: {
        x: {
          stacked: false,
        },
        y: {
          stacked: false,
        },
      },
    },
  };

  constructor(private ds: DataService, private us: UserService) {}

  ngAfterViewInit(): void {
    this.totalEnrolledCoursePie = new Chart('pieChart', this.config);
    this.barChart = new Chart('barChart', this.barConfig);
    this.ojtBarChart = new Chart('ojtBarChart', this.ojtBarConfig);
    this.evaluationBarChart = new Chart(
      'evaluationBarChart',
      this.evaluationConfig
    );
  }

  ngOnInit() {
    let academicYears = this.us.getAcademicYears();
    this.academicYearOptions = academicYears;
    const activeAcadYear = academicYears.find(
      (item: any) => item.is_active === 1
    );

    this.academicYearFilter = activeAcadYear;

    this.getData(activeAcadYear);
  }

  onAcademicYearFilterChange(event: MatSelectChange) {
    const acadYear = event.value;
    this.academicYearFilter = acadYear;
    this.getData(acadYear);
  }

  getData(acadYear: AcademicYear) {
    this.ds
      .get(
        `adviser/dashboard?acad_year=${acadYear.acad_year}&semester=${acadYear.semester}`
      )
      .subscribe(
        (response) => {
          let totalEnrolledStudent: number = 0;
          let ojtStatusCount = {
            pending: 0,
            ongoing: 0,
            completed: 0,
          };

          let enrolledCoursesCount: { [courseCode: string]: number } = {};
          let statusByCourse: { [courseCode: string]: OjtStatus } = {};
          let exitPollStatusByCourse: { [courseCode: string]: ExitPollStatus } =
            {};

          console.log(response);
          response.forEach((student: any) => {
            const ojt_class = {
              ...student.ojt_class,
              ...student.ojt_class.adviser_class,
              ...student.ojt_class.adviser_class.active_ojt_hours,
            };
            const courseCode = ojt_class.course_code;

            totalEnrolledStudent += 1;
            const requiredHours = ojt_class.required_hours;
            const renderedHours =
              student.verified_attendance_total?.current_total_hours || 0;

            //ojt status
            if (!statusByCourse[courseCode]) {
              statusByCourse[courseCode] = {
                pending: 0,
                ongoing: 0,
                completed: 0,
              };
            }

            if (
              renderedHours >= requiredHours &&
              student.ojt_exit_poll &&
              student.student_evaluation
            ) {
              ojtStatusCount.completed += 1;
              statusByCourse[courseCode].completed += 1;
            } else if (student.has_accepted_application) {
              ojtStatusCount.ongoing += 1;
              statusByCourse[courseCode].ongoing += 1;
            } else {
              ojtStatusCount.pending += 1;
              statusByCourse[courseCode].pending += 1;
            }

            if (enrolledCoursesCount[courseCode]) {
              enrolledCoursesCount[courseCode] += 1;
            } else {
              enrolledCoursesCount[courseCode] = 1;
            }

            //exit poll status
            if (!exitPollStatusByCourse[courseCode]) {
              exitPollStatusByCourse[courseCode] = {
                pending: 0,
                completed: 0,
              };
            }

            if (student.ojt_exit_poll) {
              exitPollStatusByCourse[courseCode].completed += 1;
            } else {
              exitPollStatusByCourse[courseCode].pending += 1;
            }

            //  if ($average >= 96 && $average <= 100) {
            //             $performanceEvalulation->$program->excellent += 1;
            //         } elseif ($average >= 91 && $average < 96) {
            //             $performanceEvalulation->$program->very_good += 1;
            //         } elseif ($average >= 86 && $average < 91) {
            //             $performanceEvalulation->$program->good += 1;
            //         } elseif ($average >= 81 && $average < 86) {
            //             $performanceEvalulation->$program->fair += 1;
            //         } elseif ($average >= 75 && $average < 81) {
            //             $performanceEvalulation->$program->poor += 1;
            //         }
          });

          const courseCountArray = Object.entries(enrolledCoursesCount).map(
            ([courseCode, count]) => ({
              course_code: courseCode,
              count,
            })
          );

          this.enrolled_student = totalEnrolledStudent;
          this.ojtStatusCount = ojtStatusCount;
          this.enrolledCourseCount = courseCountArray;

          this.totalEnrolledCoursePie.data.labels = courseCountArray.map(
            (item: any) => item.course_code
          );
          this.totalEnrolledCoursePie.data.datasets[0].data =
            courseCountArray.map((item: any) => item.count);

          this.totalEnrolledCoursePie.update();
          console.log('1');

          const statusByCourseArray = Object.entries(statusByCourse).map(
            ([courseCode, data]) => ({
              course_code: courseCode,
              ...data,
            })
          );
          console.log(statusByCourseArray);

          this.barChart.data.labels = [];
          this.barChart.data.datasets[0].data = [];
          this.barChart.data.datasets[1].data = [];
          this.barChart.data.datasets[2].data = [];
          statusByCourseArray.forEach((item: any) => {
            this.barChart.data.labels.push(item.course_code);
            this.barChart.data.datasets[0].data.push(item.pending);
            this.barChart.data.datasets[1].data.push(item.ongoing);
            this.barChart.data.datasets[2].data.push(item.completed);
          });

          this.barChart.update();

          const ojtStatusByCourseArray = Object.entries(
            exitPollStatusByCourse
          ).map(([courseCode, data]) => ({
            course_code: courseCode,
            ...data,
          }));
          this.ojtBarChart.data.labels = [];
          this.ojtBarChart.data.datasets[0].data = [];
          this.ojtBarChart.data.datasets[1].data = [];
          ojtStatusByCourseArray.forEach((item: any) => {
            this.ojtBarChart.data.labels.push(item.course_code);
            this.ojtBarChart.data.datasets[0].data.push(item.pending);
            this.ojtBarChart.data.datasets[1].data.push(item.completed);
          });

          this.ojtBarChart.update();

          // this.barChart.data.datasets[0].data = [
          //   response.student_ojt_status.bsit.pending,
          //   response.student_ojt_status.bscs.pending,
          //   response.student_ojt_status.bsemc.pending,
          //   response.student_ojt_status.act.pending,
          // ];

          // this.barChart.data.datasets[1].data = [
          //   response.student_ojt_status.bsit.ongoing,
          //   response.student_ojt_status.bscs.ongoing,
          //   response.student_ojt_status.bsemc.ongoing,
          //   response.student_ojt_status.act.ongoing,
          // ];

          // this.barChart.data.datasets[2].data = [
          //   response.student_ojt_status.bsit.completed,
          //   response.student_ojt_status.bscs.completed,
          //   response.student_ojt_status.bsemc.completed,
          //   response.student_ojt_status.act.completed,
          // ];

          // this.barChart.update();

          // this.evaluationBarChart.data.datasets[0].data = [
          //   response.student_performance_evaluation.bsit.excellent,
          //   response.student_performance_evaluation.bscs.excellent,
          //   response.student_performance_evaluation.bsemc.excellent,
          //   response.student_performance_evaluation.act.excellent,
          // ];

          // this.evaluationBarChart.data.datasets[1].data = [
          //   response.student_performance_evaluation.bsit.very_good,
          //   response.student_performance_evaluation.bscs.very_good,
          //   response.student_performance_evaluation.bsemc.very_good,
          //   response.student_performance_evaluation.act.very_good,
          // ];

          // this.evaluationBarChart.data.datasets[2].data = [
          //   response.student_performance_evaluation.bsit.good,
          //   response.student_performance_evaluation.bscs.good,
          //   response.student_performance_evaluation.bsemc.good,
          //   response.student_performance_evaluation.act.good,
          // ];

          // this.evaluationBarChart.data.datasets[3].data = [
          //   response.student_performance_evaluation.bsit.fair,
          //   response.student_performance_evaluation.bscs.fair,
          //   response.student_performance_evaluation.bsemc.fair,
          //   response.student_performance_evaluation.act.fair,
          // ];

          // this.evaluationBarChart.data.datasets[4].data = [
          //   response.student_performance_evaluation.bsit.poor,
          //   response.student_performance_evaluation.bscs.poor,
          //   response.student_performance_evaluation.bsemc.poor,
          //   response.student_performance_evaluation.act.poor,
          // ];

          // this.evaluationBarChart.update();
        },
        (error) => {}
      );
  }
}
